import React, { SVGProps, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  cn,
  Pagination,
  PaginationItemType,
  PaginationItemRenderProps,
  Spinner,
} from "@heroui/react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import Filter from "../../assets/filter.svg";
import Tick from "../../assets/tick2.svg";
import Arrow from "../../assets/arrow_down.svg";
import Cart from "../../assets/cart.svg";
import axios from "axios";

type IconSvgProps = SVGProps<SVGSVGElement>;

export const ChevronIcon = (props: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M15.5 19l-7-7 7-7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};

type Product = {
  id: string;
  name: string;
  imageUrl: string;
};

type Subtopic = {
  id: string;
  category: string;
  subcategory: string;
  name: string;
  products: Product[];
};

const Hero: React.FC = () => {
  const [productData, setProductData] = useState<
    Record<string, Record<string, Subtopic[]>>
  >({});
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { category, subcategory, subtopic } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("mostPopular");

  const [selectedColor, setSelectedColor] = useState<string | "black">("black");
  const [selectedSize, setSelectedSize] = useState("Large");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy] = useState<string>("mostPopular");
  const productsPerPage = 9;

  const sizes = ["Small", "Medium", "Large"];
  const options = [
    { key: "mostPopular", label: "Most Popular" },
    { key: "alphabetical", label: "Alphabetical" },
    { key: "price", label: "Price" },
  ];

  // Trigger subtopic on page load
  useEffect(() => {
    console.log("Category:", category);
    console.log("Subcategory:", subcategory);
    console.log("Subtopic:", subtopic);
    console.log("Product Data:", JSON.stringify(productData, null, 2));

    if (Object.keys(productData).length > 0) {
      if (category) {
        const formattedCategory = Object.keys(productData).find(
          (key) => formatString(key) === formatString(category)
        );

        console.log("Formatted Category:", formattedCategory);

        if (formattedCategory) {
          const categoryData = productData[formattedCategory];

          if (subcategory) {
            const formattedSubcategory = Object.keys(categoryData).find(
              (key) => formatString(key) === formatString(subcategory)
            );

            console.log("Formatted Subcategory:", formattedSubcategory);

            if (formattedSubcategory) {
              const subcategoryData = categoryData[formattedSubcategory];

              if (subtopic) {
                const selectedSubtopic = subcategoryData.find(
                  (st) => formatString(st.name) === formatString(subtopic)
                );
                if (selectedSubtopic) {
                  console.log(
                    "Setting products for subtopic:",
                    selectedSubtopic.name
                  );
                  setProducts(selectedSubtopic.products);
                } else {
                  console.error("Subtopic not found in data:", subtopic);
                }
              } else {
                console.log(
                  "Displaying all products for subcategory:",
                  subcategory
                );
                const allProducts = subcategoryData.flatMap(
                  (st) => st.products
                );
                setProducts(allProducts);
              }
            } else {
              console.error("Subcategory not found in data:", subcategory);
            }
          } else {
            console.log("Displaying all products for category:", category);
            const allProducts = Object.values(categoryData).flatMap(
              (subcategoryData) => subcategoryData.flatMap((st) => st.products)
            );
            setProducts(allProducts);
          }
        } else {
          console.error("Category not found in data:", category);
        }
      } else {
        console.log("Displaying all products");
        const allProducts = Object.values(productData).flatMap((categoryData) =>
          Object.values(categoryData).flatMap((subcategoryData) =>
            subcategoryData.flatMap((st) => st.products)
          )
        );
        setProducts(allProducts);
      }
    }
  }, [category, subcategory, subtopic, productData]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleColorClick = (color: string) => {
    setSelectedColor(color === selectedColor ? "black" : color);
  };

  const handleSizesClick = (size: any) => {
    setSelectedSize(size);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Utility function to format the subtopic name
  const formatSubtopicName = (str: string) => {
    return str
      .replace(/--/g, " / ") // Replace double hyphens with a slash
      .replace(/-/g, " ") // Replace single hyphens with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  };

  // Define formatString in the global scope of the component
  const formatString = (str: string) =>
    str
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/\//g, "@") // Replace slashes with hyphens
      .replace(/[^a-z0-9-@]/g, ""); // Remove any non-alphanumeric characters except hyphens and @

  // Function to format text like breadcrumb text
  const toCamelCase = (text: string) => {
    return text
      .replace(/--/g, " & ") // Replace double hyphens with a slash
      .replace(/-/g, " ") // Replace single hyphens with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  };

  // Fetch products when the component mounts or the filter changes
  const fetchProducts = async () => {
    try {
      console.log("Fetching products from backend...");
      const response = await axios.get<Subtopic[]>(
        "http://localhost:5003/api/products"
      );
      const fetchedSubtopics = response.data;
      console.log("Fetched subtopics:", fetchedSubtopics);

      // Organize products by category and subcategory
      const organizedData: Record<string, Record<string, Subtopic[]>> = {};

      fetchedSubtopics.forEach((subtopic) => {
        const { category, subcategory } = subtopic;

        if (!organizedData[category]) {
          organizedData[category] = {};
        }
        if (!organizedData[category][subcategory]) {
          organizedData[category][subcategory] = [];
        }
        organizedData[category][subcategory].push(subtopic);
      });

      setProductData(organizedData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, subcategory, subtopic]);

  // Set products based on URL parameters after productData is populated
  useEffect(() => {
    if (!isLoading && Object.keys(productData).length > 0) {
      if (category) {
        // Format the category to match the keys in productData
        const formattedCategory = Object.keys(productData).find(
          (key) => formatString(key) === formatString(category)
        );

        if (formattedCategory) {
          const categoryData = productData[formattedCategory];

          if (subcategory) {
            // If subcategory is provided, find and display its products
            const formattedSubcategory = Object.keys(categoryData).find(
              (key) => formatString(key) === formatString(subcategory)
            );

            if (formattedSubcategory) {
              const subcategoryData = categoryData[formattedSubcategory];

              if (subtopic) {
                // If subtopic is provided, find and display its products
                const selectedSubtopic = subcategoryData.find(
                  (st) => formatString(st.name) === formatString(subtopic)
                );
                if (selectedSubtopic) {
                  console.log(
                    "Setting products for subtopic:",
                    selectedSubtopic.name
                  );
                  setProducts(selectedSubtopic.products);
                } else {
                  console.error("Subtopic not found in data:", subtopic);
                }
              } else {
                // If only subcategory is provided, display all products under that subcategory
                console.log(
                  "Displaying all products for subcategory:",
                  subcategory
                );
                const allProducts = subcategoryData.flatMap(
                  (st) => st.products
                );
                setProducts(allProducts);
              }
            } else {
              console.error("Subcategory not found in data:", subcategory);
            }
          } else {
            // If only category is provided, display all products under that category
            console.log("Displaying all products for category:", category);
            const allProducts = Object.values(categoryData).flatMap(
              (subcategoryData) => subcategoryData.flatMap((st) => st.products)
            );
            setProducts(allProducts);
          }
        } else {
          console.error("Category not found in data:", category);
        }
      } else {
        // If no category, subcategory, or subtopic is provided, display all products
        console.log("Displaying all products");
        const allProducts = Object.values(productData).flatMap((categoryData) =>
          Object.values(categoryData).flatMap((subcategoryData) =>
            subcategoryData.flatMap((st) => st.products)
          )
        );
        setProducts(allProducts);
      }
    }
  }, [category, subcategory, subtopic, productData, isLoading]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-white flex justify-center items-center">
        <Spinner color="default" size="lg" className="brightness-0" />
      </div>
    );
  }

  // Sort products based on the selected sort option
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "alphabetical") return a.name.localeCompare(b.name);
    if (sortBy === "price") return 0; // Add price logic if available
    return 0; // Default: most popular (no sorting)
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
    className,
  }: PaginationItemRenderProps) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <Button
          key={key}
          className={cn(
            className,
            "bg-default-200/50 w-[85px] h-[40px] flex justify-between items-center"
          )}
          onPress={onNext}
        >
          Next <ChevronIcon className="rotate-180" />
        </Button>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <Button
          key={key}
          className={cn(
            className,
            "bg-default-200/50 w-[110px] h-[40px] flex justify-between items-center"
          )}
          onPress={onPrevious}
        >
          <ChevronIcon /> Previous
        </Button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <button key={key} className={className}>
          ...
        </button>
      );
    }

    // cursor is the default item
    return (
      <button
        key={key}
        ref={ref}
        className={cn(className, isActive && "")}
        onClick={() => setPage(value)}
      >
        {value}
      </button>
    );
  };

  // Function to generate breadcrumb paths
  const generateBreadcrumbPaths = () => {
    const paths = location.pathname.split("/").filter((path) => path !== "");
    const breadcrumbs = [];

    // Add "Home" as the first breadcrumb
    breadcrumbs.push({
      label: "Home",
      href: "/",
    });

    let currentPath = "";
    for (let i = 0; i < paths.length; i++) {
      currentPath += `/${paths[i]}`;
      breadcrumbs.push({
        label: toCamelCase(paths[i]),
        href: currentPath,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbPaths();

  // Function to handle product click and navigate to product page
  const handleProductClick = (product: Product) => {
    // Find the product's category, subcategory, and subtopic from the productData
    let foundCategory: string | undefined;
    let foundSubcategory: string | undefined;
    let foundSubtopic: string | undefined;

    // Iterate through the productData to find the product's hierarchy
    for (const [categoryKey, subcategories] of Object.entries(productData)) {
      for (const [subcategoryKey, subtopics] of Object.entries(subcategories)) {
        const subtopicWithProduct = subtopics.find((st) =>
          st.products.some((p) => p.name === product.name)
        );

        if (subtopicWithProduct) {
          foundCategory = categoryKey;
          foundSubcategory = subcategoryKey;
          foundSubtopic = subtopicWithProduct.name;
          break;
        }
      }
      if (foundCategory) break; // Exit outer loop if found
    }

    if (foundCategory && foundSubcategory && foundSubtopic) {
      // Construct the URL using the found hierarchy
      const productName = formatString(product.name);
      const url = `/${formatString(foundCategory)}/${formatString(
        foundSubcategory
      )}/${formatString(foundSubtopic)}/${productName}`;

      console.log("Navigating to:", url);
      navigate(url);
    } else {
      console.error("Product hierarchy not found in productData.");
    }
  };

  return (
    <div className="py-10 px-16">
      <div className="flex justify-between items-center">
        <Breadcrumbs size={"md"} className="my-6">
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <BreadcrumbItem key={index} href={breadcrumb.href}>
                {isLast ? (
                  <p className="font-semibold">{breadcrumb.label}</p>
                ) : (
                  breadcrumb.label
                )}
              </BreadcrumbItem>
            );
          })}
        </Breadcrumbs>

        <Button className="bg-black text-white">
          <img
            src={Cart}
            className="w-5 invert brightness-0 contrast-200"
            alt=""
          />
          View Cart
        </Button>
      </div>

      <div className="flex space-x-10 mb-6">
        <div className="w-[300px] border-[1px] border-black/10 p-5 rounded-[20px]">
          <div className="flex justify-between items-center border-b-[1px] pb-4">
            <h2 className="satoshi text-[20px] font-semibold">Filters</h2>
            <img className="w-[24px]" src={Filter} alt="" />
          </div>
          <div className="space-y-4 mt-4">
            {/* Dynamically generate filter sections based on productData */}
            {Object.entries(productData).map(([category, subcategories]) => (
              <div key={category}>
                <div
                  className="flex justify-between items-center cursor-pointer text-[16px] font-light"
                  onClick={() => toggleSection(category)}
                >
                  <h3 className="satoshi text-[16px] font-semibold text-black/60">
                    {toCamelCase(category)}
                  </h3>
                  {openSections[category] ? (
                    <ChevronDownIcon className="h-5 w-5 text-black/60" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-black/60" />
                  )}
                </div>
                {openSections[category] && (
                  <ul className="font-light mt-2 space-y-2.5 text-black/60">
                    {Object.entries(subcategories).map(
                      ([subcategory, subtopics]) => (
                        <li key={subcategory}>
                          <div
                            className="flex justify-between items-center cursor-pointer text-[16px] font-semibold"
                            onClick={() => toggleSection(subcategory)}
                          >
                            <h4 className="satoshi text-[15px] font-semibold text-black">
                              {toCamelCase(subcategory)}
                            </h4>
                          </div>

                          <ul className="pl-3 mt-2 space-y-2">
                            {subtopics.map((subtopic) => (
                              <li
                                key={subtopic.name}
                                className="flex justify-between items-center cursor-pointer text-[15px] font-light"
                                onClick={() => {
                                  navigate(
                                    `/${formatString(category)}/${formatString(
                                      subcategory
                                    )}/${formatString(subtopic.name)}`
                                  );
                                  setProducts(subtopic.products);
                                }}
                              >
                                {toCamelCase(subtopic.name)}{" "}
                                <ChevronRightIcon className="min-h-4 max-h-4 min-w-4 max-w-4" />
                              </li>
                            ))}
                          </ul>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Colors and Size Components */}
          <div className="w-full flex flex-col justify-between items-center border-y-[1px] mt-5 py-4">
            <div
              className="w-full flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection("colors")}
            >
              <h2 className="satoshi text-[20px] font-semibold">Colors</h2>
              {openSections.colors ? (
                <ChevronDownIcon className="h-5 w-5 text-black/60" />
              ) : (
                <ChevronRightIcon className="h-5 w-5 text-black/60" />
              )}
            </div>
            {openSections.colors && (
              <div className="w-full flex justify-start items-center gap-x-4">
                {["#063AF5", "#F506A4", "#7D06F5", "white", "black"].map(
                  (color) => (
                    <span
                      key={color}
                      className={`w-[35px] h-[35px] rounded-full flex justify-center items-center cursor-pointer border-[1px] border-black/20`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorClick(color)}
                    >
                      {selectedColor === color && (
                        <img
                          src={Tick}
                          alt="Selected"
                          className={`w-4 h-4 ${
                            selectedColor === "white" ? "invert" : ""
                          }`}
                        />
                      )}
                    </span>
                  )
                )}
              </div>
            )}
          </div>

          <div className="w-full flex flex-col justify-between items-center border-b-[1px] py-4">
            <div
              className="w-full flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection("size")}
            >
              <h2 className="satoshi text-[20px] font-semibold">Sizes</h2>
              {openSections.size ? (
                <ChevronDownIcon className="h-5 w-5 text-black/60" />
              ) : (
                <ChevronRightIcon className="h-5 w-5 text-black/60" />
              )}
            </div>

            {openSections.size && (
              <div className="w-full flex flex-wrap justify-start items-center gap-3 mt-2">
                {sizes.map((size) => (
                  <Button
                    key={size}
                    className={`w-auto max-w-[90px] h-[40px] px-10 rounded-full satoshi font-light text-[14px] flex justify-center items-center cursor-pointer transition-all duration-300`}
                    style={{
                      backgroundColor:
                        selectedSize === size ? "black" : "#F0F0F0",
                      color: selectedSize === size ? "white" : "black",
                    }}
                    onPress={() => handleSizesClick(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <div className="w-full flex flex-wrap justify-start items-center gap-3 py-6">
            <Button
              className={`w-full h-[50px] bg-black text-white px-10 rounded-full satoshi font-light text-[14px] flex justify-center items-center cursor-pointer transform transition-all duration-300 ease-linear`}
            >
              Apply Filter
            </Button>
          </div>
        </div>

        <div className="w-3/4">
          {/* Total Products Count and Sort Options */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="satoshi text-[32px] font-bold">
              {subtopic ? `${formatSubtopicName(subtopic)}` : "All Products"}
            </h1>

            <div className="flex justify-end items-center gap-x-4">
              <div className="satoshi text-[16px] font-normal text-black/60">
                Showing {indexOfFirstProduct + 1}-
                {Math.min(indexOfLastProduct, products.length)} of{" "}
                {products.length} Products
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="satoshi text-[16px] font-normal text-black/60">
                  Sort by:
                </span>
                <div className="relative w-[125px]">
                  <button
                    className="w-full flex items-center justify-between rounded-md satoshi text-[16px] font-medium text-left focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {options.find((opt) => opt.key === selected)?.label}

                    {/* Animated Arrow */}
                    <img
                      src={Arrow}
                      alt=""
                      className={`transition-transform duration-300 w-4 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <ul className="absolute w-[150px] right-0 mt-1 border-[1px] border-gray-200 rounded-2xl shadow-lg bg-white text-black z-10 transition-all transform duration-500 ease-linear">
                      {options.map((option) => (
                        <li
                          key={option.key}
                          className="px-3 py-1.5 m-2 cursor-pointer rounded-[10px] hover:bg-[#F6F6F6]"
                          onClick={() => {
                            setSelected(option.key);
                            setIsOpen(false);
                          }}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-x-4 gap-y-6">
            {isLoading ? (
              <div className="col-span-3 text-center">
                <div className="w-full h-full bg-white flex justify-center items-center">
                  <Spinner color="default" size="lg" className="brightness-0" />
                </div>
              </div>
            ) : (
              currentProducts.map((product, index) => (
                <div key={index} className="">
                  <div
                    className="w-[300px] h-[300px] rounded-[20px] cursor-pointer bg-[#EFEFEF] mb-2 hover:shadow-[0px_0px_2px_0px_lightgray] hover:scale-[1.002] transition-all duration-200 ease-linear"
                    onClick={() => handleProductClick(product)}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-[20px]"
                    />
                  </div>
                  <h3 className="satoshi text-[20px] font-semibold mt-2">
                    {product.name}
                  </h3>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center w-full mt-20">
              <Button
                className="bg-default-200/50 w-[110px] flex justify-between items-center"
                onPress={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronIcon /> Previous
              </Button>

              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                renderItem={renderItem}
                classNames={{
                  item: "text-[14px] rounded-[10px] bg-transparent shadow-none",
                  cursor: "bg-[#F1F1F1] text-[14px] text-black",
                }}
              />

              <Button
                className="bg-default-200/50 w-[85px] flex justify-between items-center"
                onPress={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next <ChevronIcon className="rotate-180" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
