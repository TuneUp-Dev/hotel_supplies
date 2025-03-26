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

// ✅ Add new category
router.post("/", async (req, res) => {
  try {
    const { categoryTitle, categoryImage, subCategories } = req.body;

    if (!categoryTitle || !categoryImage || !subCategories) {
      return res.status(400).send("Missing required fields.");
    }

    const categoryId = categoryTitle
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/&/g, "");
    const categoryRef = db.collection("Categories").doc(categoryId);
    await categoryRef.set({
      id: categoryId,
      categoryTitle: categoryTitle,
      categoryImage: categoryImage || "",
    });

    for (const subCategory of subCategories) {
      if (!subCategory.name) {
        console.error("Subcategory name is missing:", subCategory);
        continue;
      }

      const subCategoryId = subCategory.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/&/g, "");
      const subCategoryRef = categoryRef
        .collection("SubCategories")
        .doc(subCategoryId);
      await subCategoryRef.set({
        id: subCategoryId,
        name: subCategory.name || "",
      });

      for (const product of subCategory.products) {
        if (!product.name) {
          console.error("Product name is missing:", product);
          continue;
        }

        const productId = product.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/&/g, "");
        const productRef = subCategoryRef.collection("Products").doc(productId);

        const allProducts = Array.isArray(product.allProducts)
          ? product.allProducts.map((nestedProduct) => ({
              title: nestedProduct.title || "",
              productImageUrl: nestedProduct.productImageUrl || "",
              productImages: nestedProduct.productImages || [],
              description: nestedProduct.description || "",
              price: nestedProduct.price || 0,
              availableColors: nestedProduct.availableColors || [],
              availableSizes: nestedProduct.availableSizes || [],
              orderCount: nestedProduct.orderCount || 0,
              totalOrderCount: nestedProduct.totalOrderCount || 0,
            }))
          : [];

        await productRef.set({
          id: productId,
          name: product.name || "",
          allProducts: allProducts,
        });
      }
    }

    res.status(201).send("Category added successfully.");
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).send("Server error.");
  }
});

// ✅ Fetch All Categories data
router.get("/", async (req, res) => {
  try {
    console.log("🔍 Fetching products from Firestore...");
    const categoriesSnapshot = await db.collection("Categories").get();

    if (categoriesSnapshot.empty) {
      console.log("❌ No categories found.");
      return res.json([]);
    }

    const productList = [];

    for (const categoryDoc of categoriesSnapshot.docs) {
      const categoryData = categoryDoc.data();
      const subcategoriesSnapshot = await categoryDoc.ref
        .collection("SubCategories")
        .get();

      for (const subcategoryDoc of subcategoriesSnapshot.docs) {
        const subcategoryData = subcategoryDoc.data();
        const productsSnapshot = await subcategoryDoc.ref
          .collection("Products")
          .get();

        for (const productDoc of productsSnapshot.docs) {
          const productData = productDoc.data();

          const allProducts = Array.isArray(productData.allProducts)
            ? productData.allProducts.map((product) => ({
                id: product.id || "",
                title: product.title || "",
                productImageUrl: product.productImageUrl || "",
              }))
            : [];

          productList.push({
            id: productDoc.id,
            category: categoryData.categoryTitle,
            categoryImage: categoryData.categoryImage || "",
            subcategory: subcategoryData.name,
            name: productData.name || "",
            products: allProducts,
          });
        }
      }
    }
    console.log("✅ Products fetched successfully.");
    res.json(productList);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).send("Server error.");
  }
});

// ✅ Edit a Category
router.put("/:id", async (req, res) => {
  try {
    console.log("--- START CATEGORY UPDATE ---");
    console.log("Request received:", {
      params: req.params,
      body: req.body,
      method: req.method,
      url: req.originalUrl,
    });

    const { id } = req.params;
    const { categoryTitle, categoryImage } = req.body;

    console.log("Received parameters:", { id, categoryTitle, categoryImage });

    // Validate required fields
    if (!categoryTitle || !categoryImage) {
      console.error("Validation failed - missing required fields");
      return res.status(400).send("Missing required fields.");
    }

    const categoryRef = db.collection("Categories").doc(id);
    console.log("Category reference created:", categoryRef.path);

    const doc = await categoryRef.get();
    console.log("Document exists check:", doc.exists);

    if (!doc.exists) {
      console.error("Category not found in database");
      return res.status(404).send("Category not found.");
    }

    // Format the new ID based on categoryTitle
    const newId = formatString(categoryTitle);
    console.log("Formatted new ID:", newId, "Original ID:", id);

    // If the ID is changing, we need to migrate all data
    if (id !== newId) {
      console.log("ID change detected - starting migration process");

      const newCategoryRef = db.collection("Categories").doc(newId);
      console.log("New category reference:", newCategoryRef.path);

      // Check if new ID already exists
      const newDoc = await newCategoryRef.get();
      console.log("New ID existence check:", newDoc.exists);

      if (newDoc.exists) {
        console.error("Category with new ID already exists");
        return res.status(400).send("Category with this name already exists.");
      }

      // Start a batch for the migration
      const batch = db.batch();
      console.log("Batch operation created");

      // 1. Create new category document
      batch.set(newCategoryRef, {
        id: newId,
        categoryTitle,
        categoryImage,
      });
      console.log("New category document queued for creation");

      // 2. Copy all subcategories and their products
      const subcategories = await categoryRef.collection("SubCategories").get();
      console.log(`Found ${subcategories.size} subcategories to migrate`);

      for (const subcategoryDoc of subcategories.docs) {
        const subcategoryData = subcategoryDoc.data();
        const newSubcategoryRef = newCategoryRef
          .collection("SubCategories")
          .doc(subcategoryDoc.id);

        console.log(`Migrating subcategory: ${subcategoryDoc.id}`);
        batch.set(newSubcategoryRef, subcategoryData);

        // Copy all products for this subcategory
        const products = await subcategoryDoc.ref.collection("Products").get();
        console.log(
          `Found ${products.size} products in subcategory ${subcategoryDoc.id}`
        );

        for (const productDoc of products.docs) {
          batch.set(
            newSubcategoryRef.collection("Products").doc(productDoc.id),
            productDoc.data()
          );
        }
      }

      // Commit the migration first
      console.log("Committing migration batch...");
      await batch.commit();
      console.log("Migration batch committed successfully");

      // 3. Now delete the old category and its subcollections in a separate operation
      const deleteBatch = db.batch();
      console.log("Created delete batch operation");

      // Delete all products in each subcategory
      for (const subcategoryDoc of subcategories.docs) {
        const products = await subcategoryDoc.ref.collection("Products").get();
        console.log(
          `Deleting ${products.size} products from old subcategory ${subcategoryDoc.id}`
        );

        for (const productDoc of products.docs) {
          deleteBatch.delete(productDoc.ref);
        }
        // Delete the subcategory
        deleteBatch.delete(subcategoryDoc.ref);
      }

      // Finally delete the category itself
      deleteBatch.delete(categoryRef);
      console.log("Queued deletion of old category document");

      console.log("Committing delete batch...");
      await deleteBatch.commit();
      console.log("Delete batch committed successfully");
    } else {
      // Just update the existing document if ID isn't changing
      console.log("No ID change - performing simple update");
      await categoryRef.update({
        categoryTitle: categoryTitle,
        categoryImage: categoryImage,
      });
      console.log("Category updated successfully");
    }

    console.log("--- CATEGORY UPDATE COMPLETED SUCCESSFULLY ---");
    res.status(200).send("Category updated successfully.");
  } catch (error) {
    console.error("--- CATEGORY UPDATE FAILED ---");
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });

    // More specific error handling
    if (error.code === 5) {
      console.error("Firebase: Document not found");
      res.status(404).send("Document not found in database.");
    } else if (error.code === 3) {
      console.error("Firebase: Invalid argument");
      res.status(400).send("Invalid data format.");
    } else {
      console.error("Unexpected server error");
      res.status(500).send("Server error.");
    }
  }
});

// ✅ Delete a Category
router.delete("/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const formattedCategoryId = formatString(category);
    const categoryRef = db.collection("Categories").doc(formattedCategoryId);

    // First check if the category exists
    const categoryDoc = await categoryRef.get();
    if (!categoryDoc.exists) {
      return res.status(404).send("Category not found");
    }

    // Recursive delete function
    const deleteCollection = async (collectionRef) => {
      const snapshot = await collectionRef.get();
      const batch = db.batch();

      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      // Delete any remaining documents (if batch was too large)
      if (snapshot.size > 0) {
        return deleteCollection(collectionRef);
      }
    };

    // Delete all subcategories and their products
    const subcategoriesRef = categoryRef.collection("SubCategories");
    const subcategoriesSnapshot = await subcategoriesRef.get();

    // Delete all products in each subcategory first
    for (const subcategoryDoc of subcategoriesSnapshot.docs) {
      const productsRef = subcategoryDoc.ref.collection("Products");
      await deleteCollection(productsRef);
    }

    // Then delete all subcategories
    await deleteCollection(subcategoriesRef);

    // Finally delete the category itself
    await categoryRef.delete();

    res
      .status(200)
      .send(
        "Category and all its subcategories/products deleted successfully."
      );
  } catch (err) {
    console.error("❌ Error deleting category:", err);
    res.status(500).send("Server error.");
  }
});

module.exports = router;
