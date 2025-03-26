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
    .replace(/\+/g, "+")
    .replace(/[^a-z0-9-@]/g, "");
}

// ✅ Add new product
router.post(
  "/:categoryId/subcategories/:subcategoryId/products",
  async (req, res) => {
    try {
      const { categoryId, subcategoryId } = req.params;
      const { name, allProducts } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Product name is required" });
      }

      const categoryRef = db.collection("Categories").doc(categoryId);

      const categoryDoc = await categoryRef.get();
      if (!categoryDoc.exists) {
        return res.status(404).json({ message: "Category not found" });
      }

      const subcategoryRef = categoryRef
        .collection("SubCategories")
        .doc(subcategoryId);

      const subcategoryDoc = await subcategoryRef.get();
      if (!subcategoryDoc.exists) {
        return res.status(404).json({ message: "Subcategory not found" });
      }

      const productId = name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/&/g, "");

      const productData = {
        id: productId,
        name: name,
        createdAt: new Date().toISOString(),
      };

      if (Array.isArray(allProducts) && allProducts.length > 0) {
        productData.allProducts = allProducts.map((product) => ({
          ...product,

          productImageUrl: product.productImageUrl || "",
          productImages: product.productImages || [],
          description: product.description || "",
          price: Number(product.price) || 0,
          orderCount: Number(product.orderCount) || 0,
          totalOrderCount: Number(product.totalOrderCount) || 0,
          availableColors: Array.isArray(product.availableColors)
            ? product.availableColors
            : [],
          availableSizes: Array.isArray(product.availableSizes)
            ? product.availableSizes
            : [],
        }));
      } else {
        productData.allProducts = [];
      }

      const productRef = subcategoryRef.collection("Products").doc(productId);
      await productRef.set(productData);

      res.status(201).json({
        message: "Product added successfully",
        productId: productId,
        product: productData,
      });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ message: "Failed to add product" });
    }
  }
);

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

// ✅ Fetch a Specific Product (USER)
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

// ✅ Update a Product
router.put(
  "/:categoryId/subcategories/:subcategoryId/products/:productId",
  async (req, res) => {
    try {
      const { categoryId, subcategoryId, productId } = req.params;
      const { name, allProducts } = req.body;

      // Validate IDs exist
      if (!categoryId || !subcategoryId || !productId) {
        return res.status(400).send("Missing required IDs");
      }

      const categoryRef = db.collection("Categories").doc(categoryId);
      const categoryDoc = await categoryRef.get();
      if (!categoryDoc.exists) {
        return res.status(404).send("Category not found");
      }

      const subcategoryRef = categoryRef
        .collection("SubCategories")
        .doc(subcategoryId);
      const subcategoryDoc = await subcategoryRef.get();
      if (!subcategoryDoc.exists) {
        return res.status(404).send("Subcategory not found");
      }

      // Validate required fields
      if (!name || !allProducts || !Array.isArray(allProducts)) {
        return res.status(400).send("Invalid product data structure");
      }

      // Format the new ID based on the product name
      const newProductId = formatString(name);

      const productRef = db
        .collection("Categories")
        .doc(categoryId)
        .collection("SubCategories")
        .doc(subcategoryId)
        .collection("Products")
        .doc(productId);

      // Check if the product exists
      const productDoc = await productRef.get();
      if (!productDoc.exists) {
        return res.status(404).send("Product not found");
      }

      // If the ID is changing, we need to migrate the document
      if (productId !== newProductId) {
        const newProductRef = db
          .collection("Categories")
          .doc(categoryId)
          .collection("SubCategories")
          .doc(subcategoryId)
          .collection("Products")
          .doc(newProductId);

        // Check if new ID already exists
        const newDoc = await newProductRef.get();
        if (newDoc.exists) {
          return res.status(400).send("Product with this name already exists");
        }

        // Create the new document with updated data
        await newProductRef.set({
          id: newProductId,
          name,
          allProducts,
        });

        // Delete the old document
        await productRef.delete();
      } else {
        // Just update the existing document if ID isn't changing
        await productRef.update({
          name,
          allProducts,
        });
      }

      res.status(200).json({
        message: "Product updated successfully",
        updatedProduct: {
          id: productId !== newProductId ? newProductId : productId,
          name,
          allProducts,
        },
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send("Server error");
    }
  }
);

// ✅ Delete a Product
router.delete(
  "/:category/subcategory/:subcategory/product/:product",
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

module.exports = router;
