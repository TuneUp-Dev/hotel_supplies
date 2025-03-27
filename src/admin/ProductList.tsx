import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import {
  Button,
  Input,
  useDisclosure,
  Checkbox,
  Image,
  Alert,
} from "@heroui/react";
import ArrowRight from "../assets/arrow_right4.svg";
import ArrowDown from "../assets/arrow_down2.svg";
import Cancel from "../assets/cancel.svg";
import Edit from "../assets/edit.svg";
import Plus from "../assets/plus.svg";
import Delete from "../assets/delete2.svg";
import { Popconfirm } from "antd";
import { Spinner } from "@heroui/react";
import { generate, green, red } from "@ant-design/colors";
import { ColorPicker, theme, Modal } from "antd";

interface Product {
  id: string;
  category: string;
  originalCategoryId?: string;
  categoryTitle?: string;
  categoryImage?: string;
  subcategory: string;
  subcategoryId: string;
  name: string;
  productId: string;
  allProducts: {
    title: string;
    productImageUrl?: string;
    productImages?: string[];
    description: string;
    price: number;
    orderCount: number;
    totalOrderCount: number;
    availableColors: string[];
    availableSizes: string[];
  }[];
}

interface Category {
  id: string;
  category: string;
  categoryId: string;
  categoryTitle?: string;
  categoryImage?: string;
  subcategory: string;
  subcategoryId: string;
  title: string;
  productId: string;
  allProducts: {
    name: string;
    productImageUrl?: string;
    productImages?: string[];
  }[];
}

type EditEntityType = "category" | "subcategory" | "product";

interface CategoryData {
  id: string;
  categoryImage: string;
  subcategories: {
    [key: string]: Product[];
  };
}

interface GroupedProducts {
  [key: string]: CategoryData;
}

interface UploadResponse {
  imageUrl: string;
}

const ProductList: React.FC = () => {
  const { token } = theme.useToken();

  const genPresets = (colors: {
    primary: string[];
    red: string[];
    green: string[];
  }) => {
    return [
      {
        label: "Recommended",
        colors: colors.primary,
      },
      {
        label: "Red",
        colors: colors.red,
      },
      {
        label: "Green",
        colors: colors.green,
      },
    ];
  };

  const presets = genPresets({
    primary: generate(token.colorPrimary),
    red,
    green,
  });

  const [newProduct, setNewProduct] = useState({
    name: "",
    allProducts: [
      {
        title: "",
        description: "",
        price: 0,
        orderCount: 0,
        totalOrderCount: 0,
        availableColors: [] as string[],
        availableSizes: [] as string[],
        productImageUrl: "",
        productImages: [] as string[],
      },
    ],
  });

  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");

  const [tempColor, setTempColor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<
    | {
        message: string;
        visible: boolean;
        type: "success" | "error" | "warning";
      }
    | false
  >(false);
  const [expandedProducts, setExpandedProducts] = useState<{
    [key: string]: boolean;
  }>({});
  const [activeSelectionMode, setActiveSelectionMode] = useState<
    "category" | "subcategory" | "product" | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editEntityType, setEditEntityType] = useState<EditEntityType | null>(
    null
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});
  const [isCategorySelectMode, setIsCategorySelectMode] = useState(false);
  const [isSubcategorySelectMode, setIsSubcategorySelectMode] = useState(false);
  const [isProductSelectMode, setIsProductSelectMode] = useState(false);

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }

  const handleAddSubcategory = async () => {
    if (!selectedCategory || !newSubcategoryName.trim()) return;

    try {
      setAlert({
        message: "Adding subcategory...",
        visible: true,
        type: "warning",
      });

      const categoryData = groupedProducts[selectedCategory];
      if (!categoryData) {
        throw new Error("Category data not found");
      }

      const productsToSend = [
        {
          name: newProduct.name,
          allProducts: newProduct.allProducts.map((p) => ({
            title: p.title || newProduct.name,
            description: p.description,
            price: p.price,
            orderCount: p.orderCount,
            totalOrderCount: p.totalOrderCount,
            availableColors: p.availableColors,
            availableSizes: p.availableSizes,
            productImageUrl: p.productImageUrl,
            productImages: p.productImages,
          })),
        },
      ];

      const response = await axios.post(
        `https://hotel-supplies-backend.vercel.app/api/subcategories/${encodeURIComponent(
          categoryData.id
        )}/subcategories`,
        {
          name: newSubcategoryName,
          products: productsToSend,
        }
      );

      console.log("Subcategory added:", response.data);

      setAlert({
        message: "Subcategory and products added successfully!",
        visible: true,
        type: "success",
      });

      // Reset form
      setIsSubcategoryModalOpen(false);
      setNewSubcategoryName("");
      setNewProduct({
        name: "",
        allProducts: [
          {
            title: "",
            description: "",
            price: 0,
            orderCount: 0,
            totalOrderCount: 0,
            availableColors: [],
            availableSizes: [],
            productImageUrl: "",
            productImages: [],
          },
        ],
      });

      await fetchProducts();
    } catch (error: any) {
      console.error("Error adding subcategory:", error);
      setAlert({
        message: `Failed to add subcategory: ${
          error.response?.data?.message || error.message
        }`,
        visible: true,
        type: "error",
      });
    }
  };

  const handleAddProduct = async () => {
    if (!selectedCategory || !selectedSubcategory || !newProduct.name.trim()) {
      return;
    }

    try {
      setAlert({
        message: "Adding product...",
        visible: true,
        type: "warning",
      });

      const categoryData = groupedProducts[selectedCategory];
      if (!categoryData) {
        throw new Error("Category data not found");
      }

      const subcategoryEntry = Object.entries(categoryData.subcategories).find(
        ([name]) => name === selectedSubcategory
      );

      if (!subcategoryEntry) {
        throw new Error("Subcategory data not found");
      }

      const productId = newProduct.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      const [subcategoryName, products] = subcategoryEntry;
      const subcategoryId = products[0]?.subcategoryId;

      console.log(subcategoryName);

      if (!subcategoryId) {
        throw new Error("Subcategory ID not found");
      }

      const response = await axios.post(
        `https://hotel-supplies-backend.vercel.app/api/products/${encodeURIComponent(
          categoryData.id
        )}/subcategories/${encodeURIComponent(subcategoryId)}/products`,
        {
          name: newProduct.name,
          id: productId,
          allProducts: newProduct.allProducts.map((product) => ({
            title: product.title,
            description: product.description,
            price: product.price,
            orderCount: product.orderCount,
            totalOrderCount: product.totalOrderCount,
            availableColors: product.availableColors,
            availableSizes: product.availableSizes,
            productImageUrl: product.productImageUrl,
            productImages: product.productImages,
          })),
        }
      );

      console.log("Product added:", response.data);

      setAlert({
        message: "Product added successfully!",
        visible: true,
        type: "success",
      });

      setIsProductModalOpen(false);
      setNewProduct({
        name: "",
        allProducts: [
          {
            title: "",
            description: "",
            price: 0,
            orderCount: 0,
            totalOrderCount: 0,
            availableColors: [],
            availableSizes: [],
            productImageUrl: "",
            productImages: [],
          },
        ],
      });
      fetchProducts();
    } catch (error: any) {
      console.error("Error adding product:", error);
      setAlert({
        message: `Failed to add product: ${
          error.response?.data?.message || error.message
        }`,
        visible: true,
        type: "error",
      });
    }
  };

  const groupProducts = useCallback((products: Product[]): GroupedProducts => {
    const grouped: GroupedProducts = {};

    products.forEach((product) => {
      const categoryKey = product.category.toLowerCase();

      if (!grouped[categoryKey]) {
        grouped[categoryKey] = {
          id: formatId(product.originalCategoryId || product.category),
          categoryImage: product.categoryImage || "",
          subcategories: {},
        };
      }

      if (!grouped[categoryKey].subcategories[product.subcategory]) {
        grouped[categoryKey].subcategories[product.subcategory] = [];
      }
      grouped[categoryKey].subcategories[product.subcategory].push({
        ...product,
        subcategoryId: product.subcategoryId,
      });
    });

    return grouped;
  }, []);

  function generateId(name: string): string {
    return name.toLowerCase().replace(/\s+/g, "-");
  }

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<any[]>(
        "https://hotel-supplies-backend.vercel.app/api/products"
      );
      console.log("Raw API response:", response.data);

      const transformedProducts: Product[] = [];

      response.data.forEach((category) => {
        const categoryData = {
          id:
            category.id ||
            category.originalCategoryId ||
            generateId(category.categoryTitle || category.category),
          title: category.categoryTitle || category.category,
          image: category.categoryImage || "",
        };

        category.subCategories?.forEach((subcategory: any) => {
          subcategory.products?.forEach((product: any) => {
            const productId =
              product.id ||
              `${categoryData.id}-${subcategory.id}-${Date.now()}`;

            transformedProducts.push({
              id: productId,
              productId: productId,
              category: categoryData.title,
              categoryTitle: categoryData.title,
              categoryImage: categoryData.image,
              subcategory: subcategory.name,
              subcategoryId: subcategory.id,
              name: product.name,
              allProducts:
                product.allProducts?.map((p: any) => ({
                  title: p.title || product.name,
                  productImageUrl: p.productImageUrl || "",
                  productImages: p.productImages || [],
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
                })) || [],
            });
          });
        });
      });

      console.log("Transformed products with IDs:", transformedProducts);
      setProducts(transformedProducts);
      setGroupedProducts(groupProducts(transformedProducts));
    } catch (error) {
      console.error("Error fetching products:", error);
      setAlert({
        message: "Failed to fetch products. Please try again.",
        visible: true,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [groupProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteProduct = async (id: string) => {
    try {
      setAlert({
        message: "Product deleting...",
        visible: true,
        type: "warning",
      });

      const productToDelete = products.find((p) => p.id === id);
      if (!productToDelete) {
        console.error("Product not found");
        return;
      }

      const deleteUrl = `https://hotel-supplies-backend.vercel.app/api/products/${encodeURIComponent(
        productToDelete.category
      )}/subcategory/${encodeURIComponent(
        productToDelete.subcategoryId
      )}/product/${encodeURIComponent(id)}`;

      console.log("Deleting product at:", deleteUrl);
      await axios.delete(deleteUrl);

      setProducts((prev) => prev.filter((p) => p.id !== id));
      setGroupedProducts((prev) => {
        const newGrouped = { ...prev };
        const categoryKey = productToDelete.category.toLowerCase();
        if (
          newGrouped[categoryKey]?.subcategories[productToDelete.subcategory]
        ) {
          newGrouped[categoryKey].subcategories[productToDelete.subcategory] =
            newGrouped[categoryKey].subcategories[
              productToDelete.subcategory
            ].filter((p) => p.id !== id);
        }
        return newGrouped;
      });

      setAlert({
        message: "Product deleted successfully",
        visible: true,
        type: "success",
      });
    } catch (error: any) {
      console.error("Error deleting product:", error);
      setAlert({
        message: error.response?.data?.message || "Failed to delete product",
        visible: true,
        type: "error",
      });
      await fetchProducts();
    }
  };

  const handleBulkDelete = async () => {
    try {
      let type = "";
      if (isCategorySelectMode) {
        type = "category";
        setAlert({
          message: "Deleting Categories...",
          visible: true,
          type: "warning",
        });

        const formattedSelectedIds = selectedIds.map((id) => formatId(id));

        await axios.request({
          method: "DELETE",
          url: "https://hotel-supplies-backend.vercel.app/api/bulk",
          data: { ids: formattedSelectedIds, type },
        });
      } else if (isSubcategorySelectMode) {
        type = "subcategory";
        setAlert({
          message: "Deleting Subcategories...",
          visible: true,
          type: "warning",
        });

        const formattedIds = selectedIds.map((id) => {
          const parts = id.split("::");
          return parts[1];
        });

        await axios.request({
          method: "DELETE",
          url: "https://hotel-supplies-backend.vercel.app/api/bulk",
          data: { ids: formattedIds, type, category: selectedCategory },
        });
      } else if (isProductSelectMode) {
        type = "product";
        setAlert({
          message: "Deleting Products...",
          visible: true,
          type: "warning",
        });

        await axios.request({
          method: "DELETE",
          url: "https://hotel-supplies-backend.vercel.app/api/bulk",
          data: { ids: selectedIds, type },
        });
      }

      setSelectedIds([]);
      setIsCategorySelectMode(false);
      setIsSubcategorySelectMode(false);
      setIsProductSelectMode(false);
      setActiveSelectionMode(null);
      fetchProducts();
      setAlert({
        message: "Deleted Successfully!",
        visible: true,
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting products:", error);
      setAlert({
        message: "Failed to delete items. Please try again.",
        visible: true,
        type: "error",
      });
    }
  };

  const toggleProduct = (productId: string) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleEdit = (
    entity: Product | Category,
    entityType: EditEntityType
  ) => {
    if (entityType === "category") {
      const categoryData = groupedProducts[entity.category.toLowerCase()];

      setSelectedProduct({
        id: categoryData?.id || entity.category.toLowerCase(),
        category: entity.category,
        categoryTitle: entity.categoryTitle || entity.category,
        categoryImage: categoryData?.categoryImage || "",
        subcategory: "",
        subcategoryId: "",
        name: "",
        productId: "",
        allProducts: [],
      });
    } else if (entityType === "subcategory") {
      const subcategoryProducts =
        groupedProducts[selectedCategory || ""]?.subcategories[
          entity.subcategory
        ];
      const subcategoryId = subcategoryProducts?.[0]?.subcategoryId || "";

      setSelectedProduct({
        id: "",
        category: selectedCategory || "",
        subcategory: entity.subcategory,
        subcategoryId: subcategoryId,
        name: "",
        productId: "",
        allProducts: [],
      });
    } else {
      const product = entity as Product;

      if (!product.category || !product.subcategoryId || !product.id) {
        console.error("Missing required IDs for product edit");
        return;
      }
      setSelectedProduct(product);
      setEditEntityType("product");
      onOpen();
    }
    setEditEntityType(entityType);
    onOpen();
  };

  const formatId = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleSave = async () => {
    if (!selectedProduct || !editEntityType) return;

    try {
      if (editEntityType === "product") {
        setAlert({
          message: "Product updating...",
          visible: true,
          type: "warning",
        });

        const categoryData =
          groupedProducts[selectedProduct.category.toLowerCase()];
        if (!categoryData) {
          throw new Error("Category data not found");
        }

        const subcategoryData = Object.entries(categoryData.subcategories).find(
          ([name]) => name === selectedProduct.subcategory
        );

        if (!subcategoryData) {
          throw new Error("Subcategory data not found");
        }

        const [_, products] = subcategoryData;
        const subcategoryId = products[0]?.subcategoryId;

        if (10 < 0) {
          console.log(_);
        }

        if (!subcategoryId) {
          throw new Error("Subcategory ID not found");
        }

        const newProductId = selectedProduct.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");

        const updateData = {
          name: selectedProduct.name,
          allProducts: selectedProduct.allProducts.map((prod) => ({
            ...prod,
            name: selectedProduct.name,
          })),
        };

        const productIdChanged = newProductId !== selectedProduct.productId;

        const response = await axios.put(
          `https://hotel-supplies-backend.vercel.app/api/products/${encodeURIComponent(
            categoryData.id
          )}/subcategories/${encodeURIComponent(subcategoryId)}/products/${
            productIdChanged ? selectedProduct.productId : newProductId
          }`,
          {
            ...updateData,
            newId: productIdChanged ? newProductId : undefined,
          }
        );

        console.log("Product update response:", response.data);
        setAlert({
          message: "Product updated successfully!",
          visible: true,
          type: "success",
        });

        if (productIdChanged) {
          await fetchProducts();
        }
      } else if (editEntityType === "category") {
        setAlert({
          message: "Category updating...",
          visible: true,
          type: "warning",
        });

        const updateData = {
          categoryTitle: selectedProduct.categoryTitle,
          categoryImage: selectedProduct.categoryImage,
        };

        await axios.put(
          `https://hotel-supplies-backend.vercel.app/api/categories/${selectedProduct.id}`,
          updateData
        );

        setAlert({
          message: "Category updated successfully!",
          visible: true,
          type: "success",
        });
      } else if (editEntityType === "subcategory") {
        setAlert({
          message: "Subcategory updating...",
          visible: true,
          type: "warning",
        });

        if (!selectedCategory || !selectedProduct.subcategoryId) {
          throw new Error("Missing category or subcategory ID");
        }

        const categoryData = groupedProducts[selectedCategory];
        if (!categoryData) {
          throw new Error("Category data not found");
        }
        const actualCategoryId = formatId(categoryData.id);

        const response = await axios.put(
          `https://hotel-supplies-backend.vercel.app/api/subcategories/${encodeURIComponent(
            actualCategoryId
          )}/subcategories/${encodeURIComponent(
            selectedProduct.subcategoryId
          )}`,
          {
            name: selectedProduct.subcategory,
          }
        );

        console.log("Subcategory update response:", response.data);

        setAlert({
          message: "Subcategory updated successfully!",
          visible: true,
          type: "success",
        });
      }

      await fetchProducts();
      onOpenChange();
    } catch (error: any) {
      console.error("Error updating entity:", error);
      setAlert({
        message:
          error.response?.data?.message ||
          "Failed to update. Please try again.",
        visible: true,
        type: "error",
      });
    }
  };

  const handleCategorySelectMode = () => {
    setIsCategorySelectMode((prev) => !prev);
    setActiveSelectionMode((prev) => (prev === "category" ? null : "category"));
    setSelectedIds([]);
  };

  const handleSubcategorySelectMode = () => {
    setIsSubcategorySelectMode((prev) => !prev);
    setActiveSelectionMode((prev) =>
      prev === "subcategory" ? null : "subcategory"
    );
    setSelectedIds([]);
  };

  const handleProductSelectMode = () => {
    setIsProductSelectMode((prev) => !prev);
    setActiveSelectionMode((prev) => (prev === "product" ? null : "product"));
    setSelectedIds([]);
  };

  const handleSelect = (id: string, type: string) => {
    let formattedId = id;

    if (type === "subcategory") {
      formattedId = `${selectedCategory}::${id}`;
    } else if (type === "product") {
      const product = products.find((p) => p.id === id);
      if (product) {
        formattedId = `${product.category}::${product.subcategory}::${product.id}`;
      }
    }

    setSelectedIds((prev) =>
      prev.includes(formattedId)
        ? prev.filter((selectedId) => selectedId !== formattedId)
        : [...prev, formattedId]
    );
  };

  const handleDeleteProductCategory = async (category: string) => {
    setAlert({
      message: "Deleting Category...",
      visible: true,
      type: "warning",
    });

    try {
      await axios.delete(
        `https://hotel-supplies-backend.vercel.app/api/categories/${category}`
      );

      if (selectedCategory === category) {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
      }
      fetchProducts();
      setAlert({
        message: "Category Deleted Successfully!",
        visible: true,
        type: "warning",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleDeleteProductSubcategory = async (
    category: string,
    subcategory: string
  ) => {
    setAlert({
      message: "Deleting Subcategory...",
      visible: true,
      type: "warning",
    });

    try {
      await axios.delete(
        `https://hotel-supplies-backend.vercel.app/api/subcategories/${encodeURIComponent(
          category
        )}/subcategory/${encodeURIComponent(subcategory)}`
      );

      if (selectedSubcategory === subcategory) {
        setSelectedSubcategory(null);
      }
      fetchProducts();
      setAlert({
        message: "SubCategory Deleted Successfully!",
        visible: true,
        type: "warning",
      });
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  const handleCategoryClick = (category: string) => {
    const lowerCaseCategory = category.toLowerCase();
    if (selectedCategory === lowerCaseCategory) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(lowerCaseCategory);
      setSelectedSubcategory(null);
    }
    setActiveSelectionMode(null);
    setSelectedIds([]);
  };

  const handleSubcategoryClick = (subcategory: string) => {
    if (selectedSubcategory === subcategory) {
      setSelectedSubcategory(null);
    } else {
      setSelectedSubcategory(subcategory);
    }
    setActiveSelectionMode(null);
    setSelectedIds([]);
  };

  const handleCategoryImageUpload = async (
    file: File,
    index?: number,
    imgIndex?: number
  ) => {
    setAlert({ message: "Uploading image...", visible: true, type: "warning" });
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post<UploadResponse>(
        "https://hotel-supplies-backend.vercel.app/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = response.data.imageUrl;

      if (editEntityType === "category") {
        setSelectedProduct({
          ...selectedProduct!,
          categoryImage: imageUrl,
        });
      } else if (editEntityType === "product") {
        const updatedAllProducts = [...selectedProduct!.allProducts];
        if (imgIndex !== undefined) {
          updatedAllProducts[index!].productImages![imgIndex] = imageUrl;
        } else if (index !== undefined) {
          updatedAllProducts[index].productImageUrl = imageUrl;
        }
        setSelectedProduct({
          ...selectedProduct!,
          allProducts: updatedAllProducts,
        });
      }

      setAlert({
        message: "Image uploaded successfully!",
        visible: true,
        type: "success",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      setAlert({
        message: "Failed to upload image.",
        visible: true,
        type: "error",
      });
    }
  };

  const handleImageUpload = async (
    file: File,
    index?: number,
    imgIndex?: number
  ) => {
    setAlert({ message: "Uploading image...", visible: true, type: "warning" });
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post<UploadResponse>(
        "https://hotel-supplies-backend.vercel.app/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = response.data.imageUrl;

      if (editEntityType === "category") {
        setSelectedProduct({
          ...selectedProduct!,
          categoryImage: imageUrl,
        });
      } else if (editEntityType === "product") {
        const updatedAllProducts = [...selectedProduct!.allProducts];

        if (imgIndex !== undefined) {
          updatedAllProducts[index!].productImages![imgIndex] = imageUrl;
        } else if (index !== undefined) {
          updatedAllProducts[index].productImages = [
            ...(updatedAllProducts[index].productImages || []),
            imageUrl,
          ];
        }
        setSelectedProduct({
          ...selectedProduct!,
          allProducts: updatedAllProducts,
        });
      }

      setAlert({
        message: "Image uploaded successfully!",
        visible: true,
        type: "success",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      setAlert({
        message: "Failed to upload image.",
        visible: true,
        type: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="fixed z-[9999] top-0 left-0 w-screen h-screen bg-white flex justify-center items-center">
          <Spinner color="default" size="lg" className="brightness-0" />
        </div>
      </>
    );
  }

  return (
    <>
      {alert && (
        <div className="fixed top-4 right-4 z-[9999]">
          <Alert
            color={
              alert.message.includes("Error")
                ? "danger"
                : alert.message.includes("Failed")
                ? "danger"
                : alert.message.includes("...")
                ? "default"
                : alert.message.includes("!")
                ? "success"
                : "default"
            }
            title={alert.message}
            onClose={() =>
              setAlert({ message: "", visible: false, type: "success" })
            }
          />
        </div>
      )}

      <div className="w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-4">Product List</h1>

          {selectedIds.length > 0 && (
            <Popconfirm
              title={`Are you sure you want to delete the selected ${
                isCategorySelectMode
                  ? "categories"
                  : isSubcategorySelectMode
                  ? "subcategories"
                  : "products"
              }?`}
              onConfirm={handleBulkDelete}
              okText="Yes"
              cancelText="No"
            >
              <Button
                color="warning"
                className="text-medium text-[14px] px-5 py-3"
              >
                Delete Selected
                <span className="bg-white/25 border-[1px] border-white/50 w-6 h-6 text-center flex justify-center items-center rounded-md">
                  {selectedIds.length}
                </span>
              </Button>
            </Popconfirm>
          )}
        </div>

        <div className="w-full flex justify-start items-start space-x-4">
          {/* Left Column: Categories */}
          <div className="w-[40%] bg-white rounded-lg border-[1px] border-gray-200 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[18px] font-semibold">Categories</h2>
              <Button
                isIconOnly
                className="bg-gray-100 hover:shadow-sm rounded-lg"
                onPress={handleCategorySelectMode}
                isDisabled={
                  activeSelectionMode !== null &&
                  activeSelectionMode !== "category"
                }
              >
                {isCategorySelectMode ? (
                  <img className="w-6 brightness-0" src={Cancel} alt="" />
                ) : (
                  <img className="w-6 brightness-0" src={Edit} alt="" />
                )}
              </Button>
            </div>
            {Object.entries(groupedProducts).map(([category, data]) => (
              <div
                key={category}
                className={`p-2 my-2 hover:bg-gray-200 rounded cursor-pointer transition-colors ${
                  selectedCategory === category ? "bg-gray-100" : ""
                }`}
                onClick={() =>
                  !isCategorySelectMode && handleCategoryClick(category)
                }
              >
                <div className="flex items-center gap-3">
                  {isCategorySelectMode && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        isSelected={selectedIds.includes(category)}
                        onChange={() => handleSelect(category, "category")}
                      />
                    </div>
                  )}
                  {data.categoryImage && (
                    <Image
                      src={data.categoryImage}
                      alt={category}
                      width={40}
                      height={40}
                      className="rounded min-w-[40px] min-h-[40px]"
                    />
                  )}
                  <p className="text-[14px] font-medium">{category}</p>
                  <div className="flex gap-2 ml-auto">
                    <Button
                      isIconOnly
                      aria-label="Edit item"
                      color="primary"
                      variant="flat"
                      size="sm"
                      onPress={() =>
                        handleEdit(
                          {
                            id: data.id,
                            category,
                            subcategory: "",
                            subcategoryId: "",
                            name: "",
                            productId: "",
                            allProducts: [],
                            categoryImage: data.categoryImage,
                          },
                          "category"
                        )
                      }
                    >
                      <img src={Edit} className="w-[18px]" alt="" />
                    </Button>

                    <Popconfirm
                      title="Are you sure you want to delete this category?"
                      onConfirm={() => handleDeleteProductCategory(category)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        isIconOnly
                        aria-label="Delete item"
                        variant="flat"
                        color="danger"
                        size="sm"
                      >
                        <img src={Delete} className="w-[18px]" alt="" />
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Middle Column: Subcategories */}
          {selectedCategory && groupedProducts[selectedCategory] && (
            <div className="w-[40%] bg-white rounded-lg border-[1px] border-gray-200 shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[16px] font-semibold">
                  Sub Categories of {selectedCategory}
                </h2>

                <div className="flex justify-end items-center gap-x-3">
                  {selectedCategory && (
                    <Button
                      className="bg-gray-100 hover:shadow-sm rounded-lg"
                      onPress={() => setIsSubcategoryModalOpen(true)}
                      isIconOnly
                    >
                      <img src={Plus} className="w-6" alt="" />
                    </Button>
                  )}

                  <Button
                    isIconOnly
                    className="bg-gray-100 hover:shadow-sm rounded-lg"
                    onPress={handleSubcategorySelectMode}
                    isDisabled={
                      activeSelectionMode !== null &&
                      activeSelectionMode !== "subcategory"
                    }
                  >
                    {isSubcategorySelectMode ? (
                      <img className="w-6 brightness-0" src={Cancel} alt="" />
                    ) : (
                      <img className="w-6 brightness-0" src={Edit} alt="" />
                    )}
                  </Button>
                </div>
              </div>
              {Object.entries(
                groupedProducts[selectedCategory].subcategories
              ).map(([subcategory, products]) => (
                <div
                  key={subcategory}
                  className={`p-2 hover:bg-gray-200 rounded cursor-pointer transition-colors ${
                    selectedSubcategory === subcategory ? "bg-gray-100" : ""
                  }`}
                  onClick={() =>
                    !isSubcategorySelectMode &&
                    handleSubcategoryClick(subcategory)
                  }
                >
                  <div className="flex justify-start items-center gap-2">
                    {isSubcategorySelectMode && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          isSelected={selectedIds.includes(
                            `${selectedCategory}::${subcategory}`
                          )}
                          onChange={() =>
                            handleSelect(subcategory, "subcategory")
                          }
                        />
                      </div>
                    )}
                    <p className="text-[14px] font-medium">{subcategory}</p>
                    <div className="flex gap-2 ml-auto">
                      <Button
                        color="primary"
                        size="sm"
                        isIconOnly
                        aria-label="Edit item"
                        variant="flat"
                        onPress={() =>
                          handleEdit(
                            {
                              id: "",
                              category: selectedCategory,
                              subcategory,
                              subcategoryId: "",
                              name: "",
                              productId: "",
                              allProducts: [],
                            },
                            "subcategory"
                          )
                        }
                      >
                        <img src={Edit} className="w-[18px]" alt="" />
                      </Button>
                      <Popconfirm
                        title="Are you sure you want to delete this subcategory?"
                        onConfirm={() =>
                          handleDeleteProductSubcategory(
                            selectedCategory,
                            subcategory
                          )
                        }
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          color="danger"
                          isIconOnly
                          aria-label="Delete item"
                          variant="flat"
                          size="sm"
                        >
                          <img src={Delete} className="w-[18px]" alt="" />
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Right Column: Products */}
          {selectedCategory &&
            selectedSubcategory &&
            groupedProducts[selectedCategory]?.subcategories[
              selectedSubcategory
            ] && (
              <div className="w-[40%] bg-white rounded-lg border-[1px] border-gray-200 shadow-sm p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-[16px] font-semibold">
                    Products of {selectedSubcategory}
                  </h2>

                  <div className="flex justify-end items-center gap-x-3">
                    {selectedCategory && (
                      <Button
                        className="bg-gray-100 hover:shadow-sm rounded-lg"
                        onPress={() => setIsProductModalOpen(true)}
                        isIconOnly
                      >
                        <img src={Plus} className="w-6" alt="" />
                      </Button>
                    )}

                    <Button
                      isIconOnly
                      className="bg-gray-100 hover:shadow-sm rounded-lg"
                      onPress={handleProductSelectMode}
                      isDisabled={
                        activeSelectionMode !== null &&
                        activeSelectionMode !== "product"
                      }
                    >
                      {isProductSelectMode ? (
                        <img className="w-6 brightness-0" src={Cancel} alt="" />
                      ) : (
                        <img className="w-6 brightness-0" src={Edit} alt="" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {groupedProducts[selectedCategory]?.subcategories[
                    selectedSubcategory
                  ].map((product: any) => (
                    <div
                      key={product.id}
                      className={`p-3 hover:bg-gray-100 rounded transition-colors ${
                        expandedProducts[product.id]
                          ? "bg-gray-50"
                          : "bg-transparent"
                      }`}
                    >
                      <div
                        className="cursor-pointer flex items-center gap-2"
                        onClick={() => toggleProduct(product.id)}
                      >
                        {isProductSelectMode && (
                          <div onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              isSelected={selectedIds.includes(
                                `${product.category}::${product.subcategory}::${product.id}`
                              )}
                              onChange={() =>
                                handleSelect(product.id, "product")
                              }
                            />
                          </div>
                        )}
                        <span className="cursor-pointer flex justify-start items-center gap-x-2">
                          {expandedProducts[product.id] ? (
                            <img className="w-[18px]" src={ArrowDown} alt="" />
                          ) : (
                            <img className="w-[18px]" src={ArrowRight} alt="" />
                          )}

                          <p className="text-[16px]">{product.name}</p>
                        </span>
                        <div className="flex gap-2 ml-auto">
                          <Button
                            isIconOnly
                            aria-label="Edit item"
                            color="primary"
                            size="sm"
                            variant="flat"
                            onPress={() => handleEdit(product, "product")}
                          >
                            <img src={Edit} className="w-[18px]" alt="" />
                          </Button>

                          <Popconfirm
                            title="Are you sure you want to delete this product?"
                            onConfirm={() => handleDeleteProduct(product.id)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button
                              isIconOnly
                              aria-label="Delete item"
                              variant="flat"
                              size="sm"
                              color="danger"
                            >
                              <img src={Delete} className="w-[18px]" alt="" />
                            </Button>
                          </Popconfirm>
                        </div>
                      </div>
                      {expandedProducts[product.id] && (
                        <>
                          {product.allProducts.map((prod: any, index: any) => (
                            <div
                              key={index}
                              className="border-l-[1px] border-black/10 py-3.5"
                            >
                              <div className="flex items-center gap-2">
                                <p className="ml-7 text-[14px] text-black/60 flex justify-start items-center gap-x-2">
                                  <div className="bg-black text-white rounded-full w-5 h-5 flex justify-center items-center font-medium">
                                    {index + 1}
                                  </div>{" "}
                                  {prod.title}
                                </p>
                              </div>
                              <div className="flex items-center justify-start gap-5 mt-2">
                                <div className="w-7 h-[1px] rounded-r-full -mr-3 bg-black/10"></div>
                                <div className="bg-gray-200 flex justify-start items-start rounded-md w-auto gap-x-2 p-1.5">
                                  {prod.productImageUrl && (
                                    <Image
                                      src={prod.productImageUrl}
                                      alt={prod.name}
                                      width={50}
                                      height={50}
                                      className="rounded"
                                    />
                                  )}
                                </div>
                                <div className="min-h-[50px] w-[1px] bg-black/20 rounded-full"></div>
                                <div className="bg-gray-200 flex justify-start items-start rounded-md w-auto gap-x-2 p-1.5">
                                  {prod.productImages?.map(
                                    (image: any, imgIndex: any) => (
                                      <Image
                                        key={imgIndex}
                                        src={image}
                                        alt={`${prod.name}-image-${imgIndex}`}
                                        width={50}
                                        height={50}
                                        className="rounded shadow-sm"
                                      />
                                    )
                                  )}
                                </div>
                              </div>
                              <div className="ml-7 mt-5 flex flex-col justify-start items-start gap-y-1.5">
                                <p className="text-[14px] text-black font-medium flex justify-start items-center gap-x-2">
                                  Description:{" "}
                                  <p className="text-black/60 font-normal">
                                    {prod.description}
                                  </p>
                                </p>
                                <p className="text-[14px] text-black font-medium flex justify-start items-center gap-x-2">
                                  Price:{" "}
                                  <p className="text-black/60 font-normal">
                                    ₹{prod.price}
                                  </p>
                                </p>
                                <p className="text-[14px] text-black font-medium flex justify-start items-center gap-x-2">
                                  Orders:{" "}
                                  <p className="text-black/60 font-normal">
                                    {prod.orderCount}
                                  </p>
                                </p>
                                <p className="text-[14px] text-black font-medium flex justify-start items-center gap-x-2">
                                  Total Orders:{" "}
                                  <p className="text-black/60 font-normal">
                                    {prod.totalOrderCount}
                                  </p>
                                </p>
                                <p className="text-[14px] text-black font-medium flex justify-start items-center gap-x-2">
                                  Colors:{" "}
                                  <p className="text-black/60 font-normal">
                                    {prod.availableColors.join(", ")}
                                  </p>
                                </p>
                                <p className="text-[14px] text-black font-medium flex justify-start items-center gap-x-2">
                                  Sizes:{" "}
                                  <span className="text-black/60 font-normal">
                                    {prod.availableSizes
                                      .slice()
                                      .sort((a: string, b: string) => {
                                        const order = [
                                          "Extra Small",
                                          "Small",
                                          "Medium",
                                          "Large",
                                          "Extra Large",
                                        ];
                                        return (
                                          order.indexOf(a) - order.indexOf(b)
                                        );
                                      })
                                      .join(", ")}
                                  </span>
                                </p>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Add Subcategory Modal */}
        <Modal
          title="Add New Subcategory with Products"
          open={isSubcategoryModalOpen}
          onCancel={() => setIsSubcategoryModalOpen(false)}
          onOk={handleAddSubcategory}
          width="80%"
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
            borderRadius: "10px",
            scrollbarWidth: "none",
          }}
          footer={
            <>
              <div className="flex justify-end items-center gap-x-3">
                <Button
                  key="back"
                  onPress={() => setIsSubcategoryModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  key="submit"
                  color="primary"
                  onPress={handleAddSubcategory}
                >
                  Add Subcategory
                </Button>
              </div>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Subcategory Name"
              value={newSubcategoryName}
              onChange={(e) => setNewSubcategoryName(e.target.value)}
              placeholder="Enter subcategory name"
              required
            />

            <h3 className="text-lg font-medium mt-6">Add Products</h3>

            <div className="space-y-4">
              <Input
                label="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                placeholder="Enter product name"
              />

              {newProduct.allProducts.map((product, index) => (
                <div key={index} className="space-y-4 border p-4 rounded-lg">
                  <Button
                    isIconOnly
                    color="danger"
                    variant="flat"
                    size="sm"
                    className="top-2 right-2"
                    onPress={() => {
                      const updatedAllProducts = [...newProduct.allProducts];
                      updatedAllProducts.splice(index, 1);
                      setNewProduct({
                        ...newProduct,
                        allProducts: updatedAllProducts,
                      });
                    }}
                  >
                    <img src={Delete} className="w-4" alt="Remove variant" />
                  </Button>

                  <Input
                    label={`Variant ${index + 1} Title`}
                    value={product.title}
                    onChange={(e) => {
                      const updatedAllProducts = [...newProduct.allProducts];
                      updatedAllProducts[index].title = e.target.value;
                      setNewProduct({
                        ...newProduct,
                        allProducts: updatedAllProducts,
                      });
                    }}
                    placeholder="Enter variant title"
                  />
                  <Input
                    label="Description"
                    value={product.description}
                    onChange={(e) => {
                      const updatedAllProducts = [...newProduct.allProducts];
                      updatedAllProducts[index].description = e.target.value;
                      setNewProduct({
                        ...newProduct,
                        allProducts: updatedAllProducts,
                      });
                    }}
                    placeholder="Enter product description"
                  />
                  <Input
                    label="Price"
                    type="number"
                    value={product.price.toString()}
                    onChange={(e) => {
                      const updatedAllProducts = [...newProduct.allProducts];
                      updatedAllProducts[index].price =
                        parseFloat(e.target.value) || 0;
                      setNewProduct({
                        ...newProduct,
                        allProducts: updatedAllProducts,
                      });
                    }}
                    placeholder="Enter product price"
                  />
                  <Input
                    label="Order Count"
                    type="number"
                    value={product.orderCount.toString()}
                    onChange={(e) => {
                      const updatedAllProducts = [...newProduct.allProducts];
                      updatedAllProducts[index].orderCount =
                        parseInt(e.target.value) || 0;
                      setNewProduct({
                        ...newProduct,
                        allProducts: updatedAllProducts,
                      });
                    }}
                    placeholder="Enter order count"
                  />
                  <Input
                    label="Total Order Count"
                    type="number"
                    value={product.totalOrderCount.toString()}
                    onChange={(e) => {
                      const updatedAllProducts = [...newProduct.allProducts];
                      updatedAllProducts[index].totalOrderCount =
                        parseInt(e.target.value) || 0;
                      setNewProduct({
                        ...newProduct,
                        allProducts: updatedAllProducts,
                      });
                    }}
                    placeholder="Enter total order count"
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Available Colors
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.availableColors.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="flex items-center gap-2 p-2 rounded"
                          style={{ backgroundColor: color }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              const updatedAllProducts = [
                                ...newProduct.allProducts,
                              ];
                              updatedAllProducts[index].availableColors =
                                updatedAllProducts[
                                  index
                                ].availableColors.filter(
                                  (_, i) => i !== colorIndex
                                );
                              setNewProduct({
                                ...newProduct,
                                allProducts: updatedAllProducts,
                              });
                            }}
                            className="ml-8 flex justify-center items-center bg-white/50 border rounded p-1"
                          >
                            <img className="w-3" src={Cancel} alt="" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <ColorPicker
                        presets={presets}
                        defaultValue="#3b82f6"
                        onChange={(color) => {
                          setTempColor(color.toHexString());
                        }}
                      />
                      <Button
                        type="button"
                        onPress={() => {
                          if (tempColor) {
                            const updatedAllProducts = [
                              ...newProduct.allProducts,
                            ];
                            updatedAllProducts[index].availableColors = [
                              ...updatedAllProducts[index].availableColors,
                              tempColor,
                            ];
                            setNewProduct({
                              ...newProduct,
                              allProducts: updatedAllProducts,
                            });
                            setTempColor(null);
                          }
                        }}
                        disabled={!tempColor}
                      >
                        Add Color
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Available Sizes
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Extra Small",
                        "Small",
                        "Medium",
                        "Large",
                        "Extra Large",
                      ].map((size) => (
                        <Button
                          key={size}
                          type="button"
                          color={
                            product.availableSizes.includes(size)
                              ? "primary"
                              : "default"
                          }
                          onPress={() => {
                            const updatedAllProducts = [
                              ...newProduct.allProducts,
                            ];
                            updatedAllProducts[index].availableSizes =
                              updatedAllProducts[index].availableSizes.includes(
                                size
                              )
                                ? updatedAllProducts[
                                    index
                                  ].availableSizes.filter((s) => s !== size)
                                : [
                                    ...updatedAllProducts[index].availableSizes,
                                    size,
                                  ];
                            setNewProduct({
                              ...newProduct,
                              allProducts: updatedAllProducts,
                            });
                          }}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {product.productImageUrl && (
                        <Image
                          src={product.productImageUrl}
                          alt="Product"
                          width={50}
                          height={50}
                          className="rounded"
                        />
                      )}
                    </div>
                    <div className="flex-grow">
                      <Input
                        label="Product Image URL"
                        value={product.productImageUrl}
                        onChange={(e) => {
                          const updatedAllProducts = [
                            ...newProduct.allProducts,
                          ];
                          updatedAllProducts[index].productImageUrl =
                            e.target.value;
                          setNewProduct({
                            ...newProduct,
                            allProducts: updatedAllProducts,
                          });
                        }}
                        placeholder="Enter product image URL"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append("file", file);
                            axios
                              .post<UploadResponse>(
                                "https://hotel-supplies-backend.vercel.app/api/upload",
                                formData,
                                {
                                  headers: {
                                    "Content-Type": "multipart/form-data",
                                  },
                                }
                              )
                              .then((response) => {
                                const updatedAllProducts = [
                                  ...newProduct.allProducts,
                                ];
                                updatedAllProducts[index].productImageUrl =
                                  response.data.imageUrl;
                                setNewProduct({
                                  ...newProduct,
                                  allProducts: updatedAllProducts,
                                });
                              });
                          }
                        }}
                        className="cursor-pointer block w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Additional Product Images
                    </label>
                    {product.productImages?.map((image, imgIndex) => (
                      <div key={imgIndex} className="flex gap-4">
                        <div className="flex-shrink-0">
                          {image && (
                            <Image
                              src={image}
                              alt={`Product image ${imgIndex}`}
                              width={40}
                              height={40}
                              className="rounded"
                            />
                          )}
                        </div>
                        <div className="flex-grow flex gap-2">
                          <Input
                            value={image}
                            onChange={(e) => {
                              const updatedAllProducts = [
                                ...newProduct.allProducts,
                              ];
                              updatedAllProducts[index].productImages![
                                imgIndex
                              ] = e.target.value;
                              setNewProduct({
                                ...newProduct,
                                allProducts: updatedAllProducts,
                              });
                            }}
                            placeholder="Enter image URL"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const formData = new FormData();
                                formData.append("file", file);
                                axios
                                  .post<UploadResponse>(
                                    "https://hotel-supplies-backend.vercel.app/api/upload",
                                    formData,
                                    {
                                      headers: {
                                        "Content-Type": "multipart/form-data",
                                      },
                                    }
                                  )
                                  .then((response) => {
                                    const updatedAllProducts = [
                                      ...newProduct.allProducts,
                                    ];
                                    updatedAllProducts[index].productImages![
                                      imgIndex
                                    ] = response.data.imageUrl;
                                    setNewProduct({
                                      ...newProduct,
                                      allProducts: updatedAllProducts,
                                    });
                                  });
                              }
                            }}
                            className="cursor-pointer block w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          <Button
                            color="danger"
                            size="sm"
                            onPress={() => {
                              const updatedAllProducts = [
                                ...newProduct.allProducts,
                              ];
                              updatedAllProducts[index].productImages =
                                updatedAllProducts[index].productImages?.filter(
                                  (_, i) => i !== imgIndex
                                );
                              setNewProduct({
                                ...newProduct,
                                allProducts: updatedAllProducts,
                              });
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      color="primary"
                      size="sm"
                      className="mt-2"
                      onPress={() => {
                        const updatedAllProducts = [...newProduct.allProducts];
                        updatedAllProducts[index].productImages = [
                          ...(updatedAllProducts[index].productImages || []),
                          "",
                        ];
                        setNewProduct({
                          ...newProduct,
                          allProducts: updatedAllProducts,
                        });
                      }}
                    >
                      Add Image URL
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                color="primary"
                size="sm"
                className="mt-2"
                onPress={() => {
                  setNewProduct({
                    ...newProduct,
                    allProducts: [
                      ...newProduct.allProducts,
                      {
                        title: "",
                        description: "",
                        price: 0,
                        orderCount: 0,
                        totalOrderCount: 0,
                        availableColors: [],
                        availableSizes: [],
                        productImageUrl: "",
                        productImages: [],
                      },
                    ],
                  });
                }}
              >
                Add Product Variant
              </Button>
            </div>
          </div>
        </Modal>

        {/* Add Product Modal */}
        <Modal
          title="Add New Product"
          open={isProductModalOpen}
          onCancel={() => setIsProductModalOpen(false)}
          onOk={handleAddProduct}
          width="80%"
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
            borderRadius: "10px",
            scrollbarWidth: "none",
          }}
          footer={
            <>
              <div className="flex justify-end items-center gap-x-3">
                <Button key="back" onPress={() => setIsProductModalOpen(false)}>
                  Cancel
                </Button>
                <Button key="submit" color="primary" onPress={handleAddProduct}>
                  Add Product
                </Button>
              </div>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              placeholder="Enter product name"
            />

            {newProduct.allProducts.map((product, index) => (
              <div key={index} className="space-y-4 border p-4 rounded-lg">
                <div className="flex justify-end items-start">
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    variant="flat"
                    className="top-2 right-2"
                    onPress={() => {
                      const updatedAllProducts = [...newProduct.allProducts];
                      updatedAllProducts.splice(index, 1);
                      setNewProduct({
                        ...newProduct,
                        allProducts: updatedAllProducts,
                      });
                    }}
                  >
                    <img src={Delete} className="w-4" alt="Remove variant" />
                  </Button>
                </div>
                <Input
                  label={`Variant ${index + 1} Title`}
                  value={product.title}
                  onChange={(e) => {
                    const updatedAllProducts = [...newProduct.allProducts];
                    updatedAllProducts[index].title = e.target.value;
                    setNewProduct({
                      ...newProduct,
                      allProducts: updatedAllProducts,
                    });
                  }}
                  placeholder="Enter variant title"
                />
                <Input
                  label="Description"
                  value={product.description}
                  onChange={(e) => {
                    const updatedAllProducts = [...newProduct.allProducts];
                    updatedAllProducts[index].description = e.target.value;
                    setNewProduct({
                      ...newProduct,
                      allProducts: updatedAllProducts,
                    });
                  }}
                  placeholder="Enter product description"
                />
                <Input
                  label="Price"
                  type="number"
                  value={product.price.toString()}
                  onChange={(e) => {
                    const updatedAllProducts = [...newProduct.allProducts];
                    updatedAllProducts[index].price =
                      parseFloat(e.target.value) || 0;
                    setNewProduct({
                      ...newProduct,
                      allProducts: updatedAllProducts,
                    });
                  }}
                  placeholder="Enter product price"
                />
                <Input
                  label="Order Count"
                  type="number"
                  value={product.orderCount.toString()}
                  onChange={(e) => {
                    const updatedAllProducts = [...newProduct.allProducts];
                    updatedAllProducts[index].orderCount =
                      parseFloat(e.target.value) || 0;
                    setNewProduct({
                      ...newProduct,
                      allProducts: updatedAllProducts,
                    });
                  }}
                  placeholder="Enter product price"
                />
                <Input
                  label="Total Order Count"
                  type="number"
                  value={product.totalOrderCount.toString()}
                  onChange={(e) => {
                    const updatedAllProducts = [...newProduct.allProducts];
                    updatedAllProducts[index].totalOrderCount =
                      parseFloat(e.target.value) || 0;
                    setNewProduct({
                      ...newProduct,
                      allProducts: updatedAllProducts,
                    });
                  }}
                  placeholder="Enter product price"
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Available Colors
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.availableColors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="flex items-center gap-2 p-2 rounded"
                        style={{ backgroundColor: color }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            const updatedAllProducts = [
                              ...newProduct.allProducts,
                            ];
                            updatedAllProducts[index].availableColors =
                              updatedAllProducts[index].availableColors.filter(
                                (_, i) => i !== colorIndex
                              );
                            setNewProduct({
                              ...newProduct,
                              allProducts: updatedAllProducts,
                            });
                          }}
                          className="ml-8 flex justify-center items-center bg-white/50 border rounded p-1"
                        >
                          <img className="w-3" src={Cancel} alt="" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <ColorPicker
                      presets={presets}
                      defaultValue="#3b82f6"
                      onChange={(color) => {
                        setTempColor(color.toHexString());
                      }}
                    />
                    <Button
                      type="button"
                      onPress={() => {
                        if (tempColor) {
                          const updatedAllProducts = [
                            ...newProduct.allProducts,
                          ];
                          updatedAllProducts[index].availableColors = [
                            ...updatedAllProducts[index].availableColors,
                            tempColor,
                          ];
                          setNewProduct({
                            ...newProduct,
                            allProducts: updatedAllProducts,
                          });
                          setTempColor(null);
                        }
                      }}
                      disabled={!tempColor}
                    >
                      Add Color
                    </Button>
                  </div>
                </div>

                {/* Add similar sections for sizes, images, etc. */}

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {product.productImageUrl && (
                      <Image
                        src={product.productImageUrl}
                        alt="Product"
                        width={50}
                        height={50}
                        className="rounded"
                      />
                    )}
                  </div>
                  <div className="flex-grow">
                    <Input
                      label="Product Image URL"
                      value={product.productImageUrl}
                      onChange={(e) => {
                        const updatedAllProducts = [...newProduct.allProducts];
                        updatedAllProducts[index].productImageUrl =
                          e.target.value;
                        setNewProduct({
                          ...newProduct,
                          allProducts: updatedAllProducts,
                        });
                      }}
                      placeholder="Enter product image URL"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append("file", file);
                          axios
                            .post<UploadResponse>(
                              "https://hotel-supplies-backend.vercel.app/api/upload",
                              formData,
                              {
                                headers: {
                                  "Content-Type": "multipart/form-data",
                                },
                              }
                            )
                            .then((response) => {
                              const updatedAllProducts = [
                                ...newProduct.allProducts,
                              ];
                              updatedAllProducts[index].productImageUrl =
                                response.data.imageUrl;
                              setNewProduct({
                                ...newProduct,
                                allProducts: updatedAllProducts,
                              });
                            });
                        }
                      }}
                      className="cursor-pointer block w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              color="primary"
              size="sm"
              className="mt-2"
              onPress={() => {
                setNewProduct({
                  ...newProduct,
                  allProducts: [
                    ...newProduct.allProducts,
                    {
                      title: "",
                      description: "",
                      price: 0,
                      orderCount: 0,
                      totalOrderCount: 0,
                      availableColors: [],
                      availableSizes: [],
                      productImageUrl: "",
                      productImages: [],
                    },
                  ],
                });
              }}
            >
              Add Product Variant
            </Button>
          </div>
        </Modal>

        <Modal
          title={`Edit ${editEntityType}`}
          open={isOpen}
          onCancel={onOpenChange}
          onOk={handleSave}
          width="80%"
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
            borderRadius: "10px",
            scrollbarWidth: "none",
          }}
          footer={[
            <div className="flex justify-end items-center gap-x-3">
              <Button key="back" onPress={onOpenChange}>
                Cancel
              </Button>
              <Button key="submit" color="primary" onPress={handleSave}>
                Save
              </Button>
            </div>,
          ]}
        >
          {selectedProduct && (
            <div className="space-y-4">
              {editEntityType === "category" && (
                <>
                  <Input
                    label="Category Title"
                    value={selectedProduct.categoryTitle || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        categoryTitle: e.target.value,
                      })
                    }
                  />
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {selectedProduct.categoryImage && (
                        <Image
                          src={selectedProduct.categoryImage}
                          alt={selectedProduct.categoryTitle || "Category"}
                          width={60}
                          height={60}
                          className="rounded"
                        />
                      )}
                    </div>
                    <div className="flex-grow">
                      <Input
                        label="Category Image URL"
                        value={selectedProduct.categoryImage || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSelectedProduct({
                            ...selectedProduct,
                            categoryImage: e.target.value,
                          })
                        }
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file);
                          }
                        }}
                        className="cursor-pointer block w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>
                </>
              )}

              {editEntityType === "subcategory" && (
                <div className="space-y-4">
                  <Input
                    label="Subcategory Name"
                    value={selectedProduct.subcategory}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        subcategory: e.target.value,
                      })
                    }
                  />
                  <p className="text-sm text-gray-500">
                    Subcategory ID: {selectedProduct.subcategoryId}
                  </p>
                </div>
              )}

              {editEntityType === "product" && (
                <>
                  <Input
                    label="Product Name"
                    value={selectedProduct.name}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        name: e.target.value,
                      })
                    }
                  />
                  {selectedProduct.allProducts.map((prod, index) => (
                    <div key={index} className="space-y-4">
                      <Input
                        label={`Product ${index + 1} Name`}
                        value={prod.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const updatedAllProducts = [
                            ...selectedProduct.allProducts,
                          ];
                          updatedAllProducts[index].title = e.target.value;
                          setSelectedProduct({
                            ...selectedProduct,
                            allProducts: updatedAllProducts,
                          });
                        }}
                      />
                      <Input
                        label={`Product ${index + 1} Description`}
                        value={prod.description}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const updatedAllProducts = [
                            ...selectedProduct.allProducts,
                          ];
                          updatedAllProducts[index].description =
                            e.target.value;
                          setSelectedProduct({
                            ...selectedProduct,
                            allProducts: updatedAllProducts,
                          });
                        }}
                      />
                      <Input
                        label={`Product ${index + 1} Price`}
                        type="number"
                        value={prod.price.toString()}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const updatedAllProducts = [
                            ...selectedProduct.allProducts,
                          ];
                          updatedAllProducts[index].price = parseFloat(
                            e.target.value
                          );
                          setSelectedProduct({
                            ...selectedProduct,
                            allProducts: updatedAllProducts,
                          });
                        }}
                      />
                      <Input
                        label={`Product ${index + 1} Order Count`}
                        type="number"
                        value={prod.orderCount.toString()}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const updatedAllProducts = [
                            ...selectedProduct.allProducts,
                          ];
                          updatedAllProducts[index].orderCount = parseInt(
                            e.target.value
                          );
                          setSelectedProduct({
                            ...selectedProduct,
                            allProducts: updatedAllProducts,
                          });
                        }}
                      />
                      <Input
                        label={`Product ${index + 1} Total Order Count`}
                        type="number"
                        value={prod.totalOrderCount.toString()}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const updatedAllProducts = [
                            ...selectedProduct.allProducts,
                          ];
                          updatedAllProducts[index].totalOrderCount = parseInt(
                            e.target.value
                          );
                          setSelectedProduct({
                            ...selectedProduct,
                            allProducts: updatedAllProducts,
                          });
                        }}
                      />
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Available Colors
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {prod.availableColors.map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="flex items-center gap-2 p-2 rounded"
                              style={{ backgroundColor: color }}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedAllProducts = [
                                    ...selectedProduct.allProducts,
                                  ];
                                  updatedAllProducts[index].availableColors =
                                    updatedAllProducts[
                                      index
                                    ].availableColors.filter(
                                      (_, i) => i !== colorIndex
                                    );
                                  setSelectedProduct({
                                    ...selectedProduct,
                                    allProducts: updatedAllProducts,
                                  });
                                }}
                                className="ml-8 flex justify-center items-center bg-white/50 border rounded p-1"
                              >
                                <img className="w-3" src={Cancel} alt="" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <div className="flex gap-2 items-center">
                            <ColorPicker
                              presets={presets}
                              defaultValue="#3b82f6"
                              onChange={(color) => {
                                setTempColor(color.toHexString());
                              }}
                            />

                            <Button
                              type="button"
                              onPress={() => {
                                if (tempColor) {
                                  const updatedAllProducts = [
                                    ...selectedProduct.allProducts,
                                  ];
                                  updatedAllProducts[index].availableColors = [
                                    ...updatedAllProducts[index]
                                      .availableColors,
                                    tempColor,
                                  ];
                                  setSelectedProduct({
                                    ...selectedProduct,
                                    allProducts: updatedAllProducts,
                                  });
                                  setTempColor(null);
                                }
                              }}
                              disabled={!tempColor}
                            >
                              Add Color
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Available Sizes
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Extra Small",
                            "Small",
                            "Medium",
                            "Large",
                            "Extra Large",
                          ].map((size) => (
                            <Button
                              key={size}
                              type="button"
                              color={
                                prod.availableSizes.includes(size)
                                  ? "primary"
                                  : "default"
                              }
                              onPress={() => {
                                const updatedAllProducts = [
                                  ...selectedProduct.allProducts,
                                ];
                                updatedAllProducts[index].availableSizes =
                                  updatedAllProducts[
                                    index
                                  ].availableSizes.includes(size)
                                    ? updatedAllProducts[
                                        index
                                      ].availableSizes.filter((s) => s !== size)
                                    : [
                                        ...updatedAllProducts[index]
                                          .availableSizes,
                                        size,
                                      ];
                                setSelectedProduct({
                                  ...selectedProduct,
                                  allProducts: updatedAllProducts,
                                });
                              }}
                            >
                              {size}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div key={index} className="space-y-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            {prod.productImageUrl && (
                              <Image
                                src={prod.productImageUrl}
                                alt={prod.title}
                                width={50}
                                height={50}
                                className="rounded"
                              />
                            )}
                          </div>
                          <div className="flex-grow">
                            <Input
                              label={`Product ${index + 1} Image URL`}
                              value={prod.productImageUrl || ""}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                const updatedAllProducts = [
                                  ...selectedProduct.allProducts,
                                ];
                                updatedAllProducts[index].productImageUrl =
                                  e.target.value;
                                setSelectedProduct({
                                  ...selectedProduct,
                                  allProducts: updatedAllProducts,
                                });
                              }}
                            />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleCategoryImageUpload(file, index);
                                }
                              }}
                              className="cursor-pointer block w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">
                            Product {index + 1} Images
                          </label>
                          {prod.productImages?.map((image, imgIndex) => (
                            <div key={imgIndex} className="flex gap-4">
                              <div className="flex-shrink-0">
                                {image && (
                                  <Image
                                    src={image}
                                    alt={`${prod.title}-image-${imgIndex}`}
                                    width={40}
                                    height={40}
                                    className="rounded"
                                  />
                                )}
                              </div>
                              <div className="flex-grow flex gap-2">
                                <Input
                                  value={image}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    const updatedAllProducts = [
                                      ...selectedProduct.allProducts,
                                    ];
                                    updatedAllProducts[index].productImages![
                                      imgIndex
                                    ] = e.target.value;
                                    setSelectedProduct({
                                      ...selectedProduct,
                                      allProducts: updatedAllProducts,
                                    });
                                  }}
                                />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleImageUpload(file, index, imgIndex);
                                    }
                                  }}
                                  className="cursor-pointer block w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <Button
                                  color="danger"
                                  size="sm"
                                  onPress={() => {
                                    const updatedAllProducts = [
                                      ...selectedProduct.allProducts,
                                    ];
                                    updatedAllProducts[index].productImages =
                                      updatedAllProducts[
                                        index
                                      ].productImages?.filter(
                                        (_, i) => i !== imgIndex
                                      );
                                    setSelectedProduct({
                                      ...selectedProduct,
                                      allProducts: updatedAllProducts,
                                    });
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button
                            color="primary"
                            size="sm"
                            className="mt-2"
                            onPress={() => {
                              const updatedAllProducts = [
                                ...selectedProduct.allProducts,
                              ];
                              updatedAllProducts[index].productImages = [
                                ...(updatedAllProducts[index].productImages ||
                                  []),
                                "",
                              ];
                              setSelectedProduct({
                                ...selectedProduct,
                                allProducts: updatedAllProducts,
                              });
                            }}
                          >
                            Add Image URL
                          </Button>

                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, index);
                              }
                            }}
                            className="cursor-pointer block w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            id={`upload-image-${index}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    color="primary"
                    size="sm"
                    className="mt-2"
                    onPress={() => {
                      setSelectedProduct({
                        ...selectedProduct,
                        allProducts: [
                          ...selectedProduct.allProducts,
                          {
                            title: "",
                            description: "",
                            price: 0,
                            orderCount: 0,
                            totalOrderCount: 0,
                            availableColors: [],
                            availableSizes: [],
                            productImageUrl: "",
                            productImages: [],
                          },
                        ],
                      });
                    }}
                  >
                    Add Product
                  </Button>
                </>
              )}
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default ProductList;
