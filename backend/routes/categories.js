const express = require("express");
const router = express.Router();
const db = require("../firebase");

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
            ...p,
            orderCount: Number(p.orderCount) || 0,
            totalOrderCount: Number(p.totalOrderCount) || 0,
            availableColors: Array.isArray(p.availableColors)
              ? p.availableColors
              : [],
            availableSizes: Array.isArray(p.availableSizes)
              ? p.availableSizes
              : [],
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
    res.status(500).json({ message: "Failed to add subcategory" });
  }
});

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

module.exports = router;
