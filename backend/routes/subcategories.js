const express = require("express");
const router = express.Router();
const db = require("../firebase");

// 🔹 Function to format strings for Firestore document IDs
function formatString(str) {
  if (!str || typeof str !== "string") {
    console.error("Invalid input to formatString:", str);
    throw new Error("Invalid input: Input must be a non-empty string.");
  }

  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\//g, "@")
    .replace(/\+/g, "+")
    .replace(/[^a-z0-9-@]/g, "");
}

// ✅ Add new subcategory
router.post("/:categoryId/subcategories", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, products } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Subcategory name is required" });
    }

    const subCategoryId = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/&/g, "");

    const categoryRef = db.collection("Categories").doc(categoryId);
    const categoryDoc = await categoryRef.get();

    if (!categoryDoc.exists) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subcategoryRef = categoryRef
      .collection("SubCategories")
      .doc(subCategoryId);

    const subcategoryData = {
      id: subCategoryId,
      name: name,
      createdAt: new Date().toISOString(),
    };

    if (products && products.length > 0) {
      const productsRef = subcategoryRef.collection("Products");
      const batch = db.batch();

      products.forEach((product) => {
        const productId = product.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/&/g, "");

        const productRef = productsRef.doc(productId);

        batch.set(productRef, {
          id: productId,
          name: product.name,
          allProducts: product.allProducts.map((p) => ({
            title: p.title || product.name,
            description: p.description || "",
            price: Number(p.price) || 0,
            orderCount: Number(p.orderCount) || 0,
            totalOrderCount: Number(p.totalOrderCount) || 0,
            availableColors: Array.isArray(p.availableColors)
              ? p.availableColors
              : [],
            availableSizes: Array.isArray(p.availableSizes)
              ? p.availableSizes
              : [],
            productImageUrl: p.productImageUrl || "",
            productImages: Array.isArray(p.productImages)
              ? p.productImages
              : [],
          })),
          createdAt: new Date().toISOString(),
        });
      });

      await batch.commit();
    }

    await subcategoryRef.set(subcategoryData);

    res.status(201).json({
      message: "Subcategory added successfully",
      subcategoryId: subCategoryId,
    });
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({
      message: "Failed to add subcategory",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// ✅ Edit a Subcategory
router.put("/:categoryId/subcategories/:subcategoryId", async (req, res) => {
  // Debugging: Log incoming request
  console.log("--- SUB CATEGORY UPDATE REQUEST ---");
  console.log("Headers:", req.headers);
  console.log("Params:", req.params);
  console.log("Body:", req.body);
  console.log("Query:", req.query);

  try {
    const { categoryId, subcategoryId } = req.params;
    const { name } = req.body;

    // Debugging: Validate inputs
    console.log(
      `Validating inputs - CategoryID: ${categoryId}, SubcategoryID: ${subcategoryId}, New Name: ${name}`
    );

    if (!name) {
      console.error("Validation failed: Subcategory name is required");
      return res.status(400).json({
        success: false,
        message: "Subcategory name is required.",
        errorCode: "MISSING_NAME",
      });
    }

    // Debugging: Database operations
    console.log(`Fetching category document: ${categoryId}`);
    const categoryRef = db.collection("Categories").doc(categoryId);
    const categoryDoc = await categoryRef.get();

    if (!categoryDoc.exists) {
      console.error(`Category not found: ${categoryId}`);
      return res.status(404).json({
        success: false,
        message: "Category not found.",
        errorCode: "CATEGORY_NOT_FOUND",
        requestedId: categoryId,
      });
    }

    // Debugging: Subcategory operations
    console.log(`Fetching subcategory document: ${subcategoryId}`);
    const subcategoryRef = categoryRef
      .collection("SubCategories")
      .doc(subcategoryId);
    const subcategoryDoc = await subcategoryRef.get();

    if (!subcategoryDoc.exists) {
      console.error(
        `Subcategory not found: ${subcategoryId} in category ${categoryId}`
      );
      return res.status(404).json({
        success: false,
        message: "Subcategory not found.",
        errorCode: "SUBCATEGORY_NOT_FOUND",
        categoryId,
        subcategoryId,
      });
    }

    // Format the new subcategory ID
    const newSubcategoryId = formatString(name);
    console.log(
      `Formatted new subcategory ID: ${newSubcategoryId} (from name: ${name})`
    );

    // If the ID is changing, we need to migrate all products
    if (subcategoryId !== newSubcategoryId) {
      console.log(
        `Subcategory ID change detected (${subcategoryId} → ${newSubcategoryId}), starting migration...`
      );

      const newSubcategoryRef = categoryRef
        .collection("SubCategories")
        .doc(newSubcategoryId);

      // Check if new subcategory already exists
      console.log(`Checking if new subcategory exists: ${newSubcategoryId}`);
      const newDoc = await newSubcategoryRef.get();
      if (newDoc.exists) {
        console.error(`Subcategory already exists: ${newSubcategoryId}`);
        return res.status(400).json({
          success: false,
          message: "Subcategory with this name already exists.",
          errorCode: "SUBCATEGORY_EXISTS",
          newSubcategoryId,
        });
      }

      // Debugging: Batch operations
      console.log("Starting batch operations for migration...");
      const batch = db.batch();

      // 1. Create new subcategory document
      console.log("Creating new subcategory document...");
      batch.set(newSubcategoryRef, {
        ...subcategoryDoc.data(),
        id: newSubcategoryId,
        name: name,
      });

      // 2. Copy all products
      console.log("Fetching products to migrate...");
      const products = await subcategoryRef.collection("Products").get();
      console.log(`Found ${products.size} products to migrate`);

      for (const [index, productDoc] of products.docs.entries()) {
        console.log(
          `Migrating product ${index + 1}/${products.size}: ${productDoc.id}`
        );
        batch.set(
          newSubcategoryRef.collection("Products").doc(productDoc.id),
          productDoc.data()
        );
      }

      // Commit the migration first
      console.log("Committing migration batch...");
      await batch.commit();
      console.log("Migration batch committed successfully");

      // 3. Now delete the old subcategory and its products
      console.log("Preparing delete batch for old subcategory...");
      const deleteBatch = db.batch();

      // Delete all products
      for (const [index, productDoc] of products.docs.entries()) {
        console.log(
          `Deleting product ${index + 1}/${products.size}: ${productDoc.id}`
        );
        deleteBatch.delete(productDoc.ref);
      }

      // Delete the subcategory
      console.log(`Deleting old subcategory: ${subcategoryId}`);
      deleteBatch.delete(subcategoryRef);

      console.log("Committing delete batch...");
      await deleteBatch.commit();
      console.log("Delete batch committed successfully");
    } else {
      // Just update the existing subcategory
      console.log("No ID change detected, performing simple update...");
      await subcategoryRef.update({
        name: name,
      });
      console.log("Subcategory updated successfully");
    }

    // Debugging: Success response
    console.log("Subcategory update completed successfully");
    res.status(200).json({
      success: true,
      message: "Subcategory updated successfully.",
      data: {
        oldSubcategoryId: subcategoryId,
        newSubcategoryId:
          subcategoryId !== newSubcategoryId ? newSubcategoryId : undefined,
        name,
      },
    });
  } catch (error) {
    // Enhanced error logging
    console.error("--- SUB CATEGORY UPDATE ERROR ---");
    console.error("Error:", error);
    console.error("Stack:", error.stack);
    console.error("Full error object:", JSON.stringify(error, null, 2));

    res.status(500).json({
      success: false,
      message: "Server error while updating subcategory.",
      errorCode: "SERVER_ERROR",
      errorDetails:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    console.log("--- SUB CATEGORY UPDATE COMPLETED ---");
  }
});

// ✅ Delete a Subcategory
router.delete("/:category/subcategory/:subcategory", async (req, res) => {
  try {
    const { category, subcategory } = req.params;
    const formattedCategoryId = formatString(category);
    const formattedSubcategoryId = formatString(subcategory);
    const subcategoryRef = db
      .collection("Categories")
      .doc(formattedCategoryId)
      .collection("SubCategories")
      .doc(formattedSubcategoryId);

    // First delete all products in this subcategory
    const productsSnapshot = await subcategoryRef.collection("Products").get();
    const productDeletions = productsSnapshot.docs.map((doc) =>
      doc.ref.delete()
    );
    await Promise.all(productDeletions);

    // Then delete the subcategory itself
    await subcategoryRef.delete();

    res
      .status(200)
      .send("Subcategory and all its products deleted successfully.");
  } catch (err) {
    console.error("❌ Error deleting subcategory:", err);
    res.status(500).send("Server error.");
  }
});

module.exports = router;
