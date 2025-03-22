const express = require("express");
const db = require("../firebase");

const router = express.Router();

// 🔹 Function to format strings for Firestore document IDs
function formatString(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\//g, "@")
    .replace(/[^a-z0-9-@]/g, "");
}

// ✅ Add Product Data to Firestore
router.post("/", async (req, res) => {
  try {
    const productData = req.body;
    const batch = db.batch();

    for (const [category, subcategories] of Object.entries(productData)) {
      const categoryId = formatString(category);
      const categoryRef = db.collection("Categories").doc(categoryId);
      batch.set(categoryRef, { id: categoryId, name: category });

      for (const [subcategory, products] of Object.entries(subcategories)) {
        const subcategoryId = formatString(subcategory);
        const subcategoryRef = categoryRef
          .collection("SubCategories")
          .doc(subcategoryId);
        batch.set(subcategoryRef, { id: subcategoryId, name: subcategory });

        for (const productGroup of products) {
          const productTypeId = formatString(productGroup.name);
          const productTypeRef = subcategoryRef
            .collection("Products")
            .doc(productTypeId);

          const productsArray = productGroup.products.map((product) => ({
            name: product.name,
            imageUrl: product.imageUrl || null,
          }));

          batch.set(productTypeRef, {
            id: productTypeId,
            name: productGroup.name,
            products: productsArray,
          });
        }
      }
    }

    await batch.commit();
    res.status(201).send("✅ Products added successfully.");
  } catch (err) {
    console.error("❌ Error adding products:", err);
    res.status(500).send("Server error.");
  }
});

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

          productList.push({
            id: productDoc.id,
            category: categoryData.name,
            subcategory: subcategoryData.name,
            name: productData.name,
            imageUrl: categoryData.imageUrl || "",
            products: productData.products || [],
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
    const { category, subcategory, product, productId } = req.params;

    console.log("🔍 Fetching product from Firestore...");
    console.log("Category:", category);
    console.log("Subcategory:", subcategory);
    console.log("Product:", product);
    console.log("Product ID:", productId);

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
      products: productData.products || [],
    });
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).send("Server error.");
  }
});

module.exports = router;
