import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  Image,
  Alert,
} from "@heroui/react";
import ArrowRight from "../assets/arrow_right4.svg";
import ArrowDown from "../assets/arrow_down2.svg";
import Cancel from "../assets/cancel.svg";
import Edit from "../assets/edit.svg";
import Delete from "../assets/delete2.svg";
import { Popconfirm } from "antd";

interface Product {
  id: string;
  category: string;
  categoryTitle?: string;
  categoryImage?: string;
  subcategory: string;
  title: string;
  allProducts: {
    name: string;
    productImageUrl?: string;
    productImages?: string[];
  }[];
}

interface Category {
  id: string;
  category: string;
  categoryTitle?: string;
  categoryImage?: string;
  subcategory: string;
  title: string;
  allProducts: {
    name: string;
    productImageUrl?: string;
    productImages?: string[];
  }[];
}

type EditEntityType = "category" | "subcategory" | "product";

interface GroupedProducts {
  [key: string]: {
    categoryImage: string;
    subcategories: {
      [key: string]: Product[];
    };
  };
}

interface UploadResponse {
  imageUrl: string;
}

const ProductList: React.FC = () => {
  const [alert, setAlert] = useState<{
    message: string;
    visible: boolean;
    type: "success" | "error" | "warning";
  } | null>(null);
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

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get<Product[]>(
        "hotel-supplies-backend.vercel.app/api/products"
      );
      setProducts(response.data);
      setGroupedProducts(groupProducts(response.data));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    try {
      const productToDelete = products.find((product) => product.id === id);
      if (!productToDelete) {
        console.error("Product not found");
        return;
      }

      await axios.delete(
        `hotel-supplies-backend.vercel.app/api/products/category/${encodeURIComponent(
          productToDelete.category
        )}/subcategory/${encodeURIComponent(
          productToDelete.subcategory
        )}/product/${encodeURIComponent(id)}`
      );

      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      let type = "";
      if (isCategorySelectMode) {
        type = "category";
      } else if (isSubcategorySelectMode) {
        type = "subcategory";
      } else if (isProductSelectMode) {
        type = "product";
      }

      await axios.request({
        method: "DELETE",
        url: "hotel-supplies-backend.vercel.app/api/products/bulk",
        data: { ids: selectedIds, type },
      });

      setSelectedIds([]);
      setIsCategorySelectMode(false);
      setIsSubcategorySelectMode(false);
      setIsProductSelectMode(false);
      setActiveSelectionMode(null);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting products:", error);
    }
  };

  const toggleProduct = (productId: string) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  function formatString(str: string) {
    if (!str || typeof str !== "string") {
      console.error("Invalid input to formatString:", str);
      throw new Error("Invalid input: Input must be a non-empty string.");
    }
    return str
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  const handleEdit = (
    entity: Product | Category,
    entityType: EditEntityType
  ) => {
    setSelectedProduct({
      ...entity,
      category: entity.categoryTitle ? formatString(entity.categoryTitle) : "",
      categoryTitle: entity.categoryTitle || entity.category,
    });
    setEditEntityType(entityType);
    onOpen();
  };

  const handleSave = async () => {
    if (selectedProduct) {
      try {
        if (editEntityType === "category") {
          await axios.put(
            `hotel-supplies-backend.vercel.app/api/products/category/${encodeURIComponent(
              selectedProduct.category
            )}`,
            {
              categoryTitle: selectedProduct.categoryTitle,
              categoryImage: selectedProduct.categoryImage,
            }
          );
        } else if (editEntityType === "product") {
          const productToUpdate = products.find(
            (product) => product.id === selectedProduct.id
          );
          if (!productToUpdate) {
            console.error("Product not found");
            return;
          }

          await axios.put(
            `hotel-supplies-backend.vercel.app/api/products/category/${encodeURIComponent(
              productToUpdate.category
            )}/subcategory/${encodeURIComponent(
              productToUpdate.subcategory
            )}/product/${encodeURIComponent(selectedProduct.id)}`,
            selectedProduct
          );
        }

        fetchProducts();
        onOpenChange();
      } catch (error) {
        console.error("Error updating entity:", error);
      }
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
      formattedId = `${selectedCategory}::${selectedSubcategory}::${id}`;
    }

    if (selectedIds.includes(formattedId)) {
      setSelectedIds(
        selectedIds.filter((selectedId) => selectedId !== formattedId)
      );
    } else {
      setSelectedIds([...selectedIds, formattedId]);
    }
  };

  const groupProducts = (products: Product[]): GroupedProducts => {
    const grouped: GroupedProducts = {};

    products.forEach((product) => {
      if (!grouped[product.category]) {
        grouped[product.category] = {
          categoryImage: product.categoryImage || "",
          subcategories: {},
        };
      }
      if (!grouped[product.category].subcategories[product.subcategory]) {
        grouped[product.category].subcategories[product.subcategory] = [];
      }
      grouped[product.category].subcategories[product.subcategory].push(
        product
      );
    });

    return grouped;
  };

  const handleDeleteCategory = async (category: string) => {
    try {
      await axios.delete(
        `hotel-supplies-backend.vercel.app/api/products/category/${category}`
      );

      if (selectedCategory === category) {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
      }
      fetchProducts();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleDeleteSubcategory = async (
    category: string,
    subcategory: string
  ) => {
    try {
      await axios.delete(
        `hotel-supplies-backend.vercel.app/api/products/category/${encodeURIComponent(
          category
        )}/subcategory/${encodeURIComponent(subcategory)}`
      );

      if (selectedSubcategory === subcategory) {
        setSelectedSubcategory(null);
      }
      fetchProducts();
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(category);
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
        "hotel-supplies-backend.vercel.app/api/upload",
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
        "hotel-supplies-backend.vercel.app/api/upload",
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
                : alert.message === "Uploading image..."
                ? "default"
                : alert.message === "Image uploaded successfully!"
                ? "success"
                : "warning"
            }
            title={alert.message}
            onClose={() =>
              setAlert({ message: "", visible: false, type: "success" })
            }
          />
        </div>
      )}

      <div className="w-full p-4">
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
                Delete Selected{" "}
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
                onClick={handleCategorySelectMode}
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
                    <Checkbox
                      isSelected={selectedIds.includes(category)}
                      onChange={() => handleSelect(category, "category")}
                    />
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
                      onClick={() =>
                        handleEdit(
                          {
                            id: "",
                            category,
                            subcategory: "",
                            title: "",
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
                      onConfirm={() => handleDeleteCategory(category)}
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
                <Button
                  isIconOnly
                  className="bg-gray-100 hover:shadow-sm rounded-lg"
                  onClick={handleSubcategorySelectMode}
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
                      <Checkbox
                        isSelected={selectedIds.includes(
                          `${selectedCategory}::${subcategory}`
                        )}
                        onChange={() =>
                          handleSelect(subcategory, "subcategory")
                        }
                      />
                    )}
                    <p className="text-[14px] font-medium">{subcategory}</p>
                    <div className="flex gap-2 ml-auto">
                      <Button
                        color="primary"
                        size="sm"
                        isIconOnly
                        aria-label="Edit item"
                        variant="flat"
                        onClick={() =>
                          handleEdit(
                            {
                              id: "",
                              category: selectedCategory,
                              subcategory,
                              title: "",
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
                          handleDeleteSubcategory(selectedCategory, subcategory)
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
                  <Button
                    isIconOnly
                    className="bg-gray-100 hover:shadow-sm rounded-lg"
                    onClick={handleProductSelectMode}
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
                          <Checkbox
                            isSelected={selectedIds.includes(
                              `${selectedCategory}::${selectedSubcategory}::${product.id}`
                            )}
                            onChange={() => handleSelect(product.id, "product")}
                          />
                        )}
                        <span className="cursor-pointer flex justify-start items-center gap-x-2">
                          {expandedProducts[product.id] ? (
                            <img className="w-[18px]" src={ArrowDown} alt="" />
                          ) : (
                            <img className="w-[18px]" src={ArrowRight} alt="" />
                          )}

                          <p className="text-[16px]">{product.title}</p>
                        </span>
                        <div className="flex gap-2 ml-auto">
                          <Button
                            isIconOnly
                            aria-label="Edit item"
                            color="primary"
                            size="sm"
                            variant="flat"
                            onClick={() => handleEdit(product, "product")}
                          >
                            <img src={Edit} className="w-[18px]" alt="" />
                          </Button>

                          <Popconfirm
                            title="Are you sure you want to delete this product?"
                            onConfirm={() => handleDelete(product.id)}
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
                                <p className="ml-7 text-[14px] text-black/60">
                                  {prod.name}
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

        <Modal
          isOpen={isOpen}
          size="5xl"
          className="overflow-y-scroll"
          placement="top"
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Edit {editEntityType}</ModalHeader>
                <ModalBody>
                  {selectedProduct && (
                    <div className="space-y-4">
                      {editEntityType === "category" && (
                        <>
                          <Input
                            label="Category Title"
                            value={selectedProduct.categoryTitle || ""}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setSelectedProduct({
                                ...selectedProduct,
                                categoryTitle: e.target.value,
                                category: formatString(e.target.value),
                              })
                            }
                          />
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              {selectedProduct.categoryImage && (
                                <Image
                                  src={selectedProduct.categoryImage}
                                  alt={
                                    selectedProduct.categoryTitle || "Category"
                                  }
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
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
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
                                className="mt-2"
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {editEntityType === "subcategory" && (
                        <Input
                          label="Sub Category"
                          value={selectedProduct.subcategory}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSelectedProduct({
                              ...selectedProduct,
                              subcategory: e.target.value,
                            })
                          }
                        />
                      )}
                      {editEntityType === "product" && (
                        <>
                          <Input
                            label="Product Name"
                            value={selectedProduct.title}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setSelectedProduct({
                                ...selectedProduct,
                                title: e.target.value,
                              })
                            }
                          />
                          {selectedProduct.allProducts.map((prod, index) => (
                            <div key={index} className="space-y-4">
                              <Input
                                label={`Product ${index + 1} Name`}
                                value={prod.name}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  const updatedAllProducts = [
                                    ...selectedProduct.allProducts,
                                  ];
                                  updatedAllProducts[index].name =
                                    e.target.value;
                                  setSelectedProduct({
                                    ...selectedProduct,
                                    allProducts: updatedAllProducts,
                                  });
                                }}
                              />
                              <div className="flex gap-4">
                                <div className="flex-shrink-0">
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
                                      updatedAllProducts[
                                        index
                                      ].productImageUrl = e.target.value;
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
                                    className="mt-2"
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
                                          alt={`${prod.name}-image-${imgIndex}`}
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
                                          updatedAllProducts[
                                            index
                                          ].productImages![imgIndex] =
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
                                            handleImageUpload(
                                              file,
                                              index,
                                              imgIndex
                                            );
                                          }
                                        }}
                                        className="mt-2"
                                      />
                                      <Button
                                        color="danger"
                                        size="sm"
                                        onClick={() => {
                                          const updatedAllProducts = [
                                            ...selectedProduct.allProducts,
                                          ];
                                          updatedAllProducts[
                                            index
                                          ].productImages = updatedAllProducts[
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
                                  onClick={() => {
                                    const updatedAllProducts = [
                                      ...selectedProduct.allProducts,
                                    ];
                                    updatedAllProducts[index].productImages = [
                                      ...(updatedAllProducts[index]
                                        .productImages || []),
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
                                  className=""
                                  id={`upload-image-${index}`}
                                />
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onClick={handleSave}>
                    Save
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default ProductList;
