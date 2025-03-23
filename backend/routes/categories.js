// routes/categories.js
const express = require("express");
const router = express.Router();
const db = require("../firebase");

// POST /api/categories
router.post("/", async (req, res) => {
  try {
    const { categoryTitle, categoryImage, subCategories } = req.body;

    // Validate required fields
    if (!categoryTitle || !categoryImage || !subCategories) {
      return res.status(400).send("Missing required fields.");
    }

    // Save category data to Firestore
    const categoryId = categoryTitle
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/&/g, "");
    const categoryRef = db.collection("Categories").doc(categoryId);
    await categoryRef.set({
      id: categoryId,
      categoryTitle: categoryTitle, // Use categoryTitle instead of name
      categoryImage: categoryImage || "", // Use categoryImage instead of imageUrl
    });

    // Save subcategories and products
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

        // Ensure allProducts is an array, even if it's undefined
        const allProducts = Array.isArray(product.allProducts)
          ? product.allProducts.map((nestedProduct) => ({
              title: nestedProduct.title || "", // Ensure title is not undefined
              productImageUrl: nestedProduct.productImageUrl || "", // Ensure imageUrl is not undefined
              productImages: nestedProduct.productImages || [], // Ensure productImages is not undefined
            }))
          : []; // Default to an empty array if allProducts is undefined

        await productRef.set({
          id: productId,
          name: product.name || "",
          allProducts: allProducts, // Use allProducts instead of products
        });
      }
    }

    res.status(201).send("Category added successfully.");
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).send("Server error.");
  }
});

module.exports = router;
