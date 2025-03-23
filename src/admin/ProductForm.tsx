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
      }[];
    }[];
  }[];
}

interface UploadResponse {
  imageUrl: string;
}

const ProductForm: React.FC = () => {
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
        "hotel-supplies-backend.vercel.app/api/upload",
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
        "hotel-supplies-backend.vercel.app/api/categories",
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
                : notification.message === "Category Adding..."
                ? "default"
                : notification.message === "Category added successfully!"
                ? "success"
                : "warning"
            }
            title={notification.message}
            onClose={() =>
              setNotification({ message: "", visible: false, type: "success" })
            }
          />
        </div>
      )}

      <Card className="w-[700px] mx-auto mt-8">
        <CardHeader>
          <h2 className="text-xl font-bold">Add New Category</h2>
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
