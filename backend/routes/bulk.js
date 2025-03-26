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

// ✅ Bulk Delete Categories, Subcategories, or Products
router.delete("/", async (req, res) => {
  try {
    const { ids, type, category } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send("Invalid IDs provided.");
    }

    if (!type || !["category", "subcategory", "product"].includes(type)) {
      return res.status(400).send("Invalid type provided.");
    }

    // Validate each ID in the array
    for (const id of ids) {
      if (!id || typeof id !== "string") {
        return res.status(400).send(`Invalid ID: ${id}`);
      }
    }

    // Delete categories
    if (type === "category") {
      for (const categoryId of ids) {
        const formattedCategoryId = formatString(categoryId);
        const categoryRef = db
          .collection("Categories")
          .doc(formattedCategoryId);
        const categoryDoc = await categoryRef.get();

        if (!categoryDoc.exists) {
          console.warn(`Category ${formattedCategoryId} not found, skipping`);
          continue;
        }

        // Get all subcategories
        const subcategoriesSnapshot = await categoryRef
          .collection("SubCategories")
          .get();

        // Delete all products in each subcategory
        const subcategoryDeletions = [];
        subcategoriesSnapshot.forEach((subcategoryDoc) => {
          subcategoryDeletions.push(
            subcategoryDoc.ref
              .collection("Products")
              .get()
              .then((productsSnapshot) => {
                const productDeletions = [];
                productsSnapshot.forEach((productDoc) => {
                  productDeletions.push(productDoc.ref.delete());
                });
                return Promise.all(productDeletions);
              })
          );
        });

        // Wait for all products to be deleted
        await Promise.all(subcategoryDeletions);

        // Delete all subcategories
        const subcategoryDeleteBatch = db.batch();
        subcategoriesSnapshot.forEach((subcategoryDoc) => {
          subcategoryDeleteBatch.delete(subcategoryDoc.ref);
        });
        await subcategoryDeleteBatch.commit();

        // Finally delete the category itself
        await categoryRef.delete();
      }

      return res
        .status(200)
        .send(
          "Categories and all associated subcategories/products deleted successfully"
        );
    }

    // Delete subcategories
    if (type === "subcategory") {
      if (!category) {
        return res
          .status(400)
          .send("Category is required for subcategory deletion");
      }

      const formattedCategoryId = formatString(category);

      // Delete all subcategories in parallel
      await Promise.all(
        ids.map(async (subcategory) => {
          const formattedSubcategoryId = formatString(subcategory);
          await db
            .collection("Categories")
            .doc(formattedCategoryId)
            .collection("SubCategories")
            .doc(formattedSubcategoryId)
            .delete();
        })
      );

      return res.status(200).send("Subcategories deleted successfully");
    }

    // Delete products
    if (type === "product") {
      for (const productId of ids) {
        const [categoryId, subcategoryId, productIdOnly] =
          productId.split("::");
        if (!categoryId || !subcategoryId || !productIdOnly) {
          return res.status(400).send(`Invalid product ID: ${productId}`);
        }

        const formattedCategoryId = formatString(categoryId);
        const formattedSubcategoryId = formatString(subcategoryId);
        const formattedProductId = formatString(productIdOnly);

        await db
          .collection("Categories")
          .doc(formattedCategoryId)
          .collection("SubCategories")
          .doc(formattedSubcategoryId)
          .collection("Products")
          .doc(formattedProductId)
          .delete();
      }
    }

    res.status(200).send("Bulk deletion successful.");
  } catch (err) {
    console.error("❌ Error during bulk deletion:", err);
    res.status(500).send("Server error.");
  }
});

module.exports = router;
