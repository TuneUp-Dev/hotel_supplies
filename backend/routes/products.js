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

// ✅ Fetch All Products
router.get("/", async (req, res) => {
  try {
    const categoriesSnapshot = await db.collection("Categories").get();

    if (categoriesSnapshot.empty) {
      console.log("No categories found.");
      return res.json([]);
    }

    const categories = [];

    for (const categoryDoc of categoriesSnapshot.docs) {
      const categoryData = categoryDoc.data();
      if (!categoryData) {
        console.warn(`Empty category document: ${categoryDoc.id}`);
        continue;
      }

      const category = {
        id: categoryData.id || categoryDoc.id,
        categoryTitle: categoryData.categoryTitle || "Unnamed Category",
        categoryImage: categoryData.categoryImage || "",
        subCategories: [],
      };

      // Fetch subcategories
      let subcategoriesSnapshot;
      try {
        subcategoriesSnapshot = await categoryDoc.ref
          .collection("SubCategories")
          .get();
      } catch (err) {
        console.error(
          `Error fetching subcategories for category ${category.id}:`,
          err
        );
        continue;
      }

      for (const subcategoryDoc of subcategoriesSnapshot.docs) {
        const subcategoryData = subcategoryDoc.data();
        if (!subcategoryData) {
          console.warn(`Empty subcategory document: ${subcategoryDoc.id}`);
          continue;
        }

        const subcategory = {
          id: subcategoryData.id || subcategoryDoc.id,
          name: subcategoryData.name || "Unnamed Subcategory",
          products: [],
        };

        // Fetch products
        let productsSnapshot;
        try {
          productsSnapshot = await subcategoryDoc.ref
            .collection("Products")
            .get();
        } catch (err) {
          console.error(
            `Error fetching products for subcategory ${subcategory.id}:`,
            err
          );
          continue;
        }

        for (const productDoc of productsSnapshot.docs) {
          const productData = productDoc.data();
          if (!productData) {
            console.warn(`Empty product document: ${productDoc.id}`);
            continue;
          }

          const product = {
            id: productData.id || productDoc.id,
            name: productData.name || "Unnamed Product",
            description: productData.description || "",
            price: Number(productData.price) || 0,
            orderCount: Number(productData.orderCount) || 0,
            totalOrderCount: Number(productData.totalOrderCount) || 0,
            availableColors: Array.isArray(productData.availableColors)
              ? productData.availableColors
              : [],
            availableSizes: Array.isArray(productData.availableSizes)
              ? productData.availableSizes
              : [],
            allProducts: Array.isArray(productData.allProducts)
              ? productData.allProducts
              : [],
          };

          subcategory.products.push(product);
        }

        category.subCategories.push(subcategory);
      }

      categories.push(category);
    }

    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories and products:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Fetch a Specific Product
router.get(
  "/:category/:subcategory/:product/:productName",
  async (req, res) => {
    try {
      const { category, subcategory, product, productName } = req.params;

      const formattedCategoryId = formatString(category);
      const formattedSubcategoryId = formatString(subcategory);

      const categoryDoc = await db
        .collection("Categories")
        .doc(formattedCategoryId)
        .get();

      if (!categoryDoc.exists) {
        console.log("❌ Category not found.");
        return res.status(404).send("Category not found.");
      }

      const categoryData = categoryDoc.data();

      const subcategoryDoc = await db
        .collection("Categories")
        .doc(formattedCategoryId)
        .collection("SubCategories")
        .doc(formattedSubcategoryId)
        .get();

      if (!subcategoryDoc.exists) {
        console.log("❌ Subcategory not found.");
        return res.status(404).send("Subcategory not found.");
      }

      const subcategoryData = subcategoryDoc.data();

      const productDoc = await db
        .collection("Categories")
        .doc(formattedCategoryId)
        .collection("SubCategories")
        .doc(formattedSubcategoryId)
        .collection("Products")
        .doc(product)
        .get();

      if (!productDoc.exists) {
        console.log("❌ Product document not found.");
        return res.status(404).send("Product document not found.");
      }

      const productData = productDoc.data();

      const allProducts = Array.isArray(productData.allProducts)
        ? productData.allProducts
        : [];

      const formattedProductName = productName
        .toLowerCase()
        .replace(/-/g, " ")
        .trim();

      const specificProduct = allProducts.find(
        (p) =>
          p.title.toLowerCase().replace(/-/g, " ").trim() ===
          formattedProductName
      );

      if (!specificProduct) {
        console.log("❌ Product not found in allProducts.");
        return res.status(404).send("Product not found.");
      }

      res.json({
        category: categoryData.categoryTitle,
        subcategoryId: subcategoryData.id,
        subcategory: subcategoryData.name,
        name: specificProduct.title,
        description: specificProduct.description || "Sample description",
        price: specificProduct.price || 0,
        imageUrl: specificProduct.productImageUrl,
        productImageUrl: specificProduct.productImageUrl,
        availableColors: specificProduct.availableColors || [
          "#000000",
          "#FFFFFF",
        ],
        availableSizes: specificProduct.availableSizes || [
          "Small",
          "Medium",
          "Large",
        ],
        orderCount: specificProduct.orderCount || 0,
        totalOrderCount: specificProduct.totalOrderCount || 100,
        productImages: specificProduct.productImages || [],
      });
    } catch (err) {
      console.error("❌ Error fetching product:", err);
      res.status(500).send("Server error.");
    }
  }
);

// ✅ Edit a Category
router.put("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const { categoryTitle, categoryImage } = req.body;

    const formattedCategoryId = formatString(categoryTitle);

    const categoryDoc = await db.collection("Categories").doc(category).get();

    if (!categoryDoc.exists) {
      console.error("❌ Category not found:", category);
      return res.status(404).send("Category not found.");
    }

    if (category !== formattedCategoryId) {
      await db
        .collection("Categories")
        .doc(formattedCategoryId)
        .set({ categoryTitle, categoryImage });

      // Delete the old document
      await db.collection("Categories").doc(category).delete();
    } else {
      await db
        .collection("Categories")
        .doc(category)
        .update({ categoryTitle, categoryImage });
    }

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

      // Format the IDs to match document IDs
      const formattedCategoryId = formatString(category);
      const formattedSubcategoryId = formatString(subcategory);
      const formattedProductId = formatString(product);

      // Update the product document
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

      // Format the IDs to match document IDs
      const formattedCategoryId = formatString(category);
      const formattedSubcategoryId = formatString(subcategory);

      // Delete the subcategory document
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

      const formattedCategoryId = formatString(category);
      const formattedSubcategoryId = formatString(subcategory);
      const formattedProductId = formatString(product);

      const productRef = db
        .collection("Categories")
        .doc(formattedCategoryId)
        .collection("SubCategories")
        .doc(formattedSubcategoryId)
        .collection("Products")
        .doc(formattedProductId);

      const productDoc = await productRef.get();
      if (!productDoc.exists) {
        console.error("❌ Product not found");
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Delete the product
      await productRef.delete();

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (err) {
      console.error("❌ Error deleting product:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  }
);

// ✅ Bulk Delete Categories, Subcategories, or Products
router.delete("/bulk", async (req, res) => {
  try {
    const { ids, type } = req.body;

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
