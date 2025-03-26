import React, { useState } from "react";
import axios from "axios";
import {
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Alert,
} from "@heroui/react";
import { generate, green, presetPalettes, red } from "@ant-design/colors";
import { ColorPicker, theme } from "antd";
import type { ColorPickerProps } from "antd";

interface FormData {
  categoryTitle: string;
  categoryImage: File | null;
  subCategories: {
    name: string;
    products: {
      name: string;
      allProducts: {
        title: string;
        productImageUrl: File | null;
        imageUrl?: string;
        productImages: File[];
        description: string;
        price: number;
        availableColors: string[];
        availableSizes: string[];
        orderCount: number;
        totalOrderCount: number;
      }[];
    }[];
  }[];
}

interface UploadResponse {
  imageUrl: string;
}

type Presets = Required<ColorPickerProps>["presets"][number];

function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map<Presets>(([label, colors]) => ({
    label,
    colors,
    key: label,
  }));
}

const ProductForm: React.FC = () => {
  const { token } = theme.useToken();
  const presets = genPresets({
    primary: generate(token.colorPrimary),
    red,
    green,
  });
  const [tempColor, setTempColor] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    visible: boolean;
    type: "success" | "error" | "warning";
  }>({ message: "", visible: false, type: "success" });
  const [formData, setFormData] = useState<FormData>({
    categoryTitle: "",
    categoryImage: null,
    subCategories: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post<UploadResponse>(
        "https://hotel-supplies-backend.vercel.app/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const validateForm = () => {
    if (!formData.categoryTitle.trim()) {
      setNotification({
        message: "Category title is required.",
        visible: true,
        type: "error",
      });
      return false;
    }

    if (!formData.categoryImage) {
      setNotification({
        message: "Category image is required.",
        visible: true,
        type: "error",
      });
      return false;
    }

    for (const subCategory of formData.subCategories) {
      if (!subCategory.name.trim()) {
        setNotification({
          message: "Subcategory name is required.",
          visible: true,
          type: "error",
        });
        return false;
      }

      for (const product of subCategory.products) {
        if (!product.name.trim()) {
          setNotification({
            message: "Product name is required.",
            visible: true,
            type: "error",
          });
          return false;
        }

        for (const allProduct of product.allProducts) {
          if (!allProduct.title.trim()) {
            setNotification({
              message: "Product title is required.",
              visible: true,
              type: "error",
            });
            return false;
          }

          if (allProduct.productImages.length > 4) {
            setNotification({
              message: "Maximum of 4 images allowed for product.",
              visible: true,
              type: "error",
            });
            return false;
          }

          if (!allProduct.productImageUrl) {
            setNotification({
              message: "Product image is required.",
              visible: true,
              type: "error",
            });
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setNotification({
      message: "Adding Category...",
      visible: true,
      type: "success",
    });

    try {
      const categoryImageUrl = formData.categoryImage
        ? await handleFileUpload(formData.categoryImage)
        : "";

      const subCategoriesWithImages = await Promise.all(
        formData.subCategories.map(async (subCategory) => ({
          ...subCategory,
          products: await Promise.all(
            subCategory.products.map(async (product) => ({
              ...product,
              allProducts: await Promise.all(
                product.allProducts.map(async (allProduct) => {
                  const imageUrl = allProduct.productImageUrl
                    ? await handleFileUpload(allProduct.productImageUrl)
                    : "";
                  const productImages = await Promise.all(
                    allProduct.productImages.map((file) =>
                      handleFileUpload(file)
                    )
                  );

                  return {
                    ...allProduct,
                    productImageUrl: imageUrl,
                    imageUrl,
                    productImages,
                  };
                })
              ),
            }))
          ),
        }))
      );

      const payload = {
        categoryTitle: formData.categoryTitle,
        categoryImage: categoryImageUrl,
        subCategories: subCategoriesWithImages,
      };

      await axios.post(
        "https://hotel-supplies-backend.vercel.app/api/categories",
        payload
      );

      setNotification({
        message: "Category added successfully!",
        visible: true,
        type: "success",
      });

      setFormData({
        categoryTitle: "",
        categoryImage: null,
        subCategories: [],
      });
    } catch (error) {
      console.error("Error adding category:", error);
      setNotification({
        message:
          "Failed to add category. Please check the console for details.",
        visible: true,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSubCategory = () => {
    setFormData({
      ...formData,
      subCategories: [...formData.subCategories, { name: "", products: [] }],
    });
  };

  const addProduct = (subCategoryIndex: number) => {
    const newSubCategories = [...formData.subCategories];
    newSubCategories[subCategoryIndex].products.push({
      name: "",
      allProducts: [],
    });
    setFormData({ ...formData, subCategories: newSubCategories });
  };

  const addAllProduct = (subCategoryIndex: number, productIndex: number) => {
    const newSubCategories = [...formData.subCategories];
    newSubCategories[subCategoryIndex].products[productIndex].allProducts.push({
      title: "",
      productImageUrl: null,
      productImages: [],
      description: "",
      price: 0,
      availableColors: [],
      availableSizes: [],
      orderCount: 0,
      totalOrderCount: 0,
    });
    setFormData({ ...formData, subCategories: newSubCategories });
  };

  return (
    <>
      {notification.visible && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            color={
              notification.message.includes("Error")
                ? "danger"
                : notification.message.includes("Failed")
                ? "danger"
                : notification.message.includes("...")
                ? "default"
                : notification.message.includes("!")
                ? "success"
                : "default"
            }
            title={notification.message}
            onClose={() =>
              setNotification({ message: "", visible: false, type: "success" })
            }
          />
        </div>
      )}

      <Card className="w-[800px] mx-auto p-3">
        <CardHeader>
          <h2 className="text-2xl font-bold">Add New Category</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category Title
              </label>
              <Input
                name="categoryTitle"
                placeholder="Enter category title"
                value={formData.categoryTitle}
                onChange={handleChange}
                fullWidth
              />
            </div>

            {/* Category Image */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category Image
              </label>
              <input
                type="file"
                name="categoryImage"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    categoryImage: e.target.files?.[0] || null,
                  });
                }}
                className="cursor-pointer block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Subcategories */}
            {formData.subCategories.map((subCategory, subCategoryIndex) => (
              <div
                key={subCategoryIndex}
                className="space-y-4 p-4 border rounded-lg"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Sub Category Name
                  </label>
                  <Input
                    name="subCategoryName"
                    placeholder="Enter sub category name"
                    value={subCategory.name}
                    onChange={(e) => {
                      const newSubCategories = [...formData.subCategories];
                      newSubCategories[subCategoryIndex].name = e.target.value;
                      setFormData({
                        ...formData,
                        subCategories: newSubCategories,
                      });
                    }}
                    fullWidth
                  />
                </div>

                {/* Products */}
                {subCategory.products.map((product, productIndex) => (
                  <div
                    key={productIndex}
                    className="space-y-4 p-4 border rounded-lg"
                  >
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Product Name
                      </label>
                      <Input
                        name="productName"
                        placeholder="Enter product name"
                        value={product.name}
                        onChange={(e) => {
                          const newSubCategories = [...formData.subCategories];
                          newSubCategories[subCategoryIndex].products[
                            productIndex
                          ].name = e.target.value;
                          setFormData({
                            ...formData,
                            subCategories: newSubCategories,
                          });
                        }}
                        fullWidth
                      />
                    </div>

                    {/* All Products */}
                    {product.allProducts.map((allProduct, allProductIndex) => (
                      <div
                        key={allProductIndex}
                        className="space-y-4 p-4 border rounded-lg"
                      >
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Product Title
                          </label>
                          <Input
                            name="productTitle"
                            placeholder="Enter product title"
                            value={allProduct.title}
                            onChange={(e) => {
                              const newSubCategories = [
                                ...formData.subCategories,
                              ];
                              newSubCategories[subCategoryIndex].products[
                                productIndex
                              ].allProducts[allProductIndex].title =
                                e.target.value;
                              setFormData({
                                ...formData,
                                subCategories: newSubCategories,
                              });
                            }}
                            fullWidth
                          />
                        </div>

                        {/* Product Image */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Product Image
                          </label>
                          <input
                            type="file"
                            name="productImage"
                            onChange={(e) => {
                              const newSubCategories = [
                                ...formData.subCategories,
                              ];
                              newSubCategories[subCategoryIndex].products[
                                productIndex
                              ].allProducts[allProductIndex].productImageUrl =
                                e.target.files?.[0] || null;
                              setFormData({
                                ...formData,
                                subCategories: newSubCategories,
                              });
                            }}
                            className="cursor-pointer block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </div>

                        {/* Product Images */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Product Images (Max 4)
                          </label>
                          <input
                            type="file"
                            name="productImages"
                            multiple
                            onChange={(e) => {
                              const files = e.target.files
                                ? Array.from(e.target.files)
                                : [];
                              const truncatedFiles = files.slice(0, 4);

                              if (files.length > 4) {
                                setNotification({
                                  message:
                                    "Only the first 4 images will be uploaded.",
                                  visible: true,
                                  type: "warning",
                                });
                              }

                              const newSubCategories = [
                                ...formData.subCategories,
                              ];
                              newSubCategories[subCategoryIndex].products[
                                productIndex
                              ].allProducts[allProductIndex].productImages =
                                truncatedFiles;
                              setFormData({
                                ...formData,
                                subCategories: newSubCategories,
                              });
                            }}
                            className="cursor-pointer block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <Input
                            name="description"
                            placeholder="Enter product description"
                            value={allProduct.description}
                            onChange={(e) => {
                              const newSubCategories = [
                                ...formData.subCategories,
                              ];
                              newSubCategories[subCategoryIndex].products[
                                productIndex
                              ].allProducts[allProductIndex].description =
                                e.target.value;
                              setFormData({
                                ...formData,
                                subCategories: newSubCategories,
                              });
                            }}
                            fullWidth
                          />
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Price
                          </label>
                          <Input
                            type="number"
                            name="price"
                            placeholder="Enter product price"
                            value={allProduct.price.toString()}
                            onChange={(e) => {
                              const newSubCategories = [
                                ...formData.subCategories,
                              ];
                              newSubCategories[subCategoryIndex].products[
                                productIndex
                              ].allProducts[allProductIndex].price = parseFloat(
                                e.target.value
                              );
                              setFormData({
                                ...formData,
                                subCategories: newSubCategories,
                              });
                            }}
                            fullWidth
                          />
                        </div>

                        {/* Available Colors */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Available Colors
                            </label>

                            {/* Reset Selected Colors Button */}
                            <Button
                              type="button"
                              onPress={() => {
                                const newSubCategories = [
                                  ...formData.subCategories,
                                ];
                                newSubCategories[subCategoryIndex].products[
                                  productIndex
                                ].allProducts[allProductIndex].availableColors =
                                  [];
                                setFormData({
                                  ...formData,
                                  subCategories: newSubCategories,
                                });
                              }}
                              className="mb-2"
                              color="warning"
                            >
                              Reset Colors
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {allProduct.availableColors.map(
                              (color, colorIndex) => (
                                <div
                                  key={colorIndex}
                                  className="flex items-center gap-2 p-2 rounded"
                                  style={{ backgroundColor: color }}
                                >
                                  <span className="text-white">{color}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newSubCategories = [
                                        ...formData.subCategories,
                                      ];
                                      newSubCategories[
                                        subCategoryIndex
                                      ].products[productIndex].allProducts[
                                        allProductIndex
                                      ].availableColors =
                                        allProduct.availableColors.filter(
                                          (_, i) => i !== colorIndex
                                        );
                                      setFormData({
                                        ...formData,
                                        subCategories: newSubCategories,
                                      });
                                    }}
                                    className="text-white hover:text-red-500"
                                  >
                                    &times;
                                  </button>
                                </div>
                              )
                            )}
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
                                    const newSubCategories = [
                                      ...formData.subCategories,
                                    ];
                                    newSubCategories[subCategoryIndex].products[
                                      productIndex
                                    ].allProducts[
                                      allProductIndex
                                    ].availableColors = [
                                      ...allProduct.availableColors,
                                      tempColor,
                                    ];
                                    setFormData({
                                      ...formData,
                                      subCategories: newSubCategories,
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

                        {/* Available Sizes */}
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
                                  allProduct.availableSizes.includes(size)
                                    ? "primary"
                                    : "default"
                                }
                                onPress={() => {
                                  const newSubCategories = [
                                    ...formData.subCategories,
                                  ];
                                  const sizes =
                                    newSubCategories[subCategoryIndex].products[
                                      productIndex
                                    ].allProducts[allProductIndex]
                                      .availableSizes;
                                  const updatedSizes = sizes.includes(size)
                                    ? sizes.filter((s) => s !== size)
                                    : [...sizes, size];
                                  newSubCategories[subCategoryIndex].products[
                                    productIndex
                                  ].allProducts[
                                    allProductIndex
                                  ].availableSizes = updatedSizes;
                                  setFormData({
                                    ...formData,
                                    subCategories: newSubCategories,
                                  });
                                }}
                              >
                                {size}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Order Count */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Order Count
                          </label>
                          <Input
                            type="number"
                            name="orderCount"
                            placeholder="Enter order count"
                            value={allProduct.orderCount.toString()}
                            onChange={(e) => {
                              const newSubCategories = [
                                ...formData.subCategories,
                              ];
                              newSubCategories[subCategoryIndex].products[
                                productIndex
                              ].allProducts[allProductIndex].orderCount =
                                parseInt(e.target.value);
                              setFormData({
                                ...formData,
                                subCategories: newSubCategories,
                              });
                            }}
                            fullWidth
                          />
                        </div>

                        {/* Total Order Count */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Total Order Count
                          </label>
                          <Input
                            type="number"
                            name="totalOrderCount"
                            placeholder="Enter total order count"
                            value={allProduct.totalOrderCount.toString()}
                            onChange={(e) => {
                              const newSubCategories = [
                                ...formData.subCategories,
                              ];
                              newSubCategories[subCategoryIndex].products[
                                productIndex
                              ].allProducts[allProductIndex].totalOrderCount =
                                parseInt(e.target.value);
                              setFormData({
                                ...formData,
                                subCategories: newSubCategories,
                              });
                            }}
                            fullWidth
                          />
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      onPress={() =>
                        addAllProduct(subCategoryIndex, productIndex)
                      }
                      className="mt-4"
                    >
                      Add Product
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  onPress={() => addProduct(subCategoryIndex)}
                  className="mt-4"
                >
                  Add Product
                </Button>
              </div>
            ))}

            <Button type="button" onPress={addSubCategory} className="mt-4">
              Add Sub Category
            </Button>

            <Button
              type="submit"
              color="primary"
              fullWidth
              className="mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Category"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default ProductForm;
