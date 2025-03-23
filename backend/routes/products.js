const express = require("express");
const db = require("../firebase");

const router = express.Router();

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
    .replace(/[^a-z0-9-@]/g, "");
}

// ✅ Fetch All Products from Firestore
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
                name: product.name || "",
                imageUrl: product.imageUrl || "",
              }))
            : [];

          productList.push({
            id: productDoc.id,
            category: categoryData.categoryTitle,
            categoryImage: categoryData.categoryImage || "",
            subcategory: subcategoryData.name,
            name: productData.name || productData.title,
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

// ✅ Fetch a Specific Product by ID
router.get("/:category/:subcategory/:product", async (req, res) => {
  try {
    const { category, subcategory, product } = req.params;

    console.log("🔍 Fetching product from Firestore...");
    console.log("Category:", category);
    console.log("Subcategory:", subcategory);
    console.log("Product:", product);

    // Format the IDs to match Firestore document IDs
    const formattedCategoryId = formatString(category);
    const formattedSubcategoryId = formatString(subcategory);
    const formattedProductId = formatString(product);

    // Fetch the product document from Firestore
    const productDoc = await db
      .collection("Categories")
      .doc(formattedCategoryId)
      .collection("SubCategories")
      .doc(formattedSubcategoryId)
      .collection("Products")
      .doc(formattedProductId)
      .get();

    if (!productDoc.exists) {
      console.log("❌ Product not found.");
      return res.status(404).send("Product not found.");
    }

    const productData = productDoc.data();

    console.log("✅ Product fetched successfully.");
    res.json({
      id: productDoc.id,
      category,
      subcategory,
      name: productData.name,
      allProducts: productData.allProducts || [],
    });
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).send("Server error.");
  }
});

// ✅ Edit a Category
router.put("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const { categoryTitle, categoryImage } = req.body;

    // Format the category title to match the Firestore document ID
    const formattedCategoryId = formatString(categoryTitle);

    console.log("Formatted Category ID:", formattedCategoryId); // Debugging

    // Check if the category document exists
    const categoryDoc = await db
      .collection("Categories")
      .doc(category) // Use the original category ID from the URL
      .get();

    if (!categoryDoc.exists) {
      console.error("❌ Category not found:", category);
      return res.status(404).send("Category not found.");
    }

    // If the category title has changed, update the document ID
    if (category !== formattedCategoryId) {
      // Create a new document with the updated ID
      await db
        .collection("Categories")
        .doc(formattedCategoryId)
        .set({ categoryTitle, categoryImage });

      // Delete the old document
      await db.collection("Categories").doc(category).delete();
    } else {
      // Update the existing document
      await db
        .collection("Categories")
        .doc(category)
        .update({ categoryTitle, categoryImage });
    }

    console.log("✅ Category updated successfully:", formattedCategoryId);
    res.status(200).send("Category updated successfully.");
  } catch (err) {
    console.error("❌ Error updating category:", err);
    res.status(500).send("Server error.");
  }
});

// ✅ Update a Product
router.put(
  "/category/:category/subcategory/:subcategory/product/:product",
  async (req, res) => {
    try {
      const { category, subcategory, product } = req.params;
      const updatedProductData = req.body;

      // Format the IDs to match Firestore document IDs
      const formattedCategoryId = formatString(category);
      const formattedSubcategoryId = formatString(subcategory);
      const formattedProductId = formatString(product);

      // Update the product document in Firestore
      await db
        .collection("Categories")
        .doc(formattedCategoryId)
        .collection("SubCategories")
        .doc(formattedSubcategoryId)
        .collection("Products")
        .doc(formattedProductId)
        .update(updatedProductData);

      res.status(200).send("Product updated successfully.");
    } catch (err) {
      console.error("❌ Error updating product:", err);
      res.status(500).send("Server error.");
    }
  }
);

// ✅ Delete a Category
router.delete("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;

    const formattedCategoryId = formatString(category);

    await db.collection("Categories").doc(formattedCategoryId).delete();

    res.status(200).send("Category deleted successfully.");
  } catch (err) {
    console.error("❌ Error deleting category:", err);
    res.status(500).send("Server error.");
  }
});

// ✅ Delete a Subcategory
router.delete(
  "/category/:category/subcategory/:subcategory",
  async (req, res) => {
    try {
      const { category, subcategory } = req.params;

      // Format the IDs to match Firestore document IDs
      const formattedCategoryId = formatString(category);
      const formattedSubcategoryId = formatString(subcategory);

      // Delete the subcategory document from Firestore
      await db
        .collection("Categories")
        .doc(formattedCategoryId)
        .collection("SubCategories")
        .doc(formattedSubcategoryId)
        .delete();

      res.status(200).send("Subcategory deleted successfully.");
    } catch (err) {
      console.error("❌ Error deleting subcategory:", err);
      res.status(500).send("Server error.");
    }
  }
);

// ✅ Delete a Product
router.delete(
  "/category/:category/subcategory/:subcategory/product/:product",
  async (req, res) => {
    try {
      const { category, subcategory, product } = req.params;

      // Format the IDs to match Firestore document IDs
      const formattedCategoryId = formatString(category);
      const formattedSubcategoryId = formatString(subcategory);
      const formattedProductId = formatString(product);

      // Delete the product document from Firestore
      await db
        .collection("Categories")
        .doc(formattedCategoryId)
        .collection("SubCategories")
        .doc(formattedSubcategoryId)
        .collection("Products")
        .doc(formattedProductId)
        .delete();

      res.status(200).send("Product deleted successfully.");
    } catch (err) {
      console.error("❌ Error deleting product:", err);
      res.status(500).send("Server error.");
    }
  }
);

// ✅ Bulk Delete Categories, Subcategories, or Products
router.delete("/bulk", async (req, res) => {
  try {
    const { ids, type } = req.body;

    // Validate inputs
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
        await db.collection("Categories").doc(formattedCategoryId).delete();
      }
    }

    // Delete subcategories
    if (type === "subcategory") {
      for (const subcategoryId of ids) {
        const [categoryId, subcategoryIdOnly] = subcategoryId.split("::");
        if (!categoryId || !subcategoryIdOnly) {
          return res
            .status(400)
            .send(`Invalid subcategory ID: ${subcategoryId}`);
        }

        const formattedCategoryId = formatString(categoryId);
        const formattedSubcategoryId = formatString(subcategoryIdOnly);

        await db
          .collection("Categories")
          .doc(formattedCategoryId)
          .collection("SubCategories")
          .doc(formattedSubcategoryId)
          .delete();
      }
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
