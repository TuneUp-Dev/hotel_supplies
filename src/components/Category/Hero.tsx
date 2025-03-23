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
import Close from "../../assets/close.svg";
import Tick from "../../assets/tick2.svg";
import Arrow from "../../assets/arrow_down.svg";
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

  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const formatSubtopicName = (str: string) => {
    return str
      .replace(/--/g, " / ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatString = (str: string) =>
    str
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/\//g, "@")
      .replace(/[^a-z0-9-@]/g, "");

  const toPascalCase = (text: string) => {
    return text
      .replace(/--/g, " & ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const fetchProducts = async () => {
    try {
      console.log("Fetching products from backend...");
      const response = await axios.get<Subtopic[]>(
        "http://localhost:5003/api/products"
      );
      const fetchedSubtopics = response.data;
      console.log("Fetched subtopics:", fetchedSubtopics);

      // Validate and transform the data
      const validatedSubtopics = fetchedSubtopics.map((subtopic) => ({
        ...subtopic,
        products: subtopic.products.map((product) => ({
          ...product,
          imageUrl:
            product.imageUrl ||
            "https://imgs.search.brave.com/_yApi6wFU0dingr3KOPa4qgD6PlrjpS95F461TB78fs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9z/bW9vdGgtZ3JheS1i/YWNrZ3JvdW5kLXdp/dGgtaGlnaC1xdWFs/aXR5XzUzODc2LTEy/NDYwNi5qcGc_c2Vt/dD1haXNfaHlicmlk",
        })),
      }));

      const organizedData: Record<string, Record<string, Subtopic[]>> = {};

      validatedSubtopics.forEach((subtopic) => {
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

  useEffect(() => {
    if (!isLoading && Object.keys(productData).length > 0) {
      if (category) {
        const formattedCategory = Object.keys(productData).find(
          (key) => formatString(key) === formatString(category)
        );

        if (formattedCategory) {
          const categoryData = productData[formattedCategory];

          if (subcategory) {
            const formattedSubcategory = Object.keys(categoryData).find(
              (key) => formatString(key) === formatString(subcategory)
            );

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
  }, [category, subcategory, subtopic, productData, isLoading]);

  if (isLoading) {
    return (
      <>
        <div className="fixed z-[9999] top-0 left-0 w-screen h-screen bg-white flex justify-center items-center">
          <Spinner color="default" size="lg" className="brightness-0" />
        </div>
      </>
    );
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "alphabetical") return a.name.localeCompare(b.name);
    if (sortBy === "price") return 0;
    return 0;
  });

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

  const generateBreadcrumbPaths = () => {
    const paths = location.pathname.split("/").filter((path) => path !== "");
    const breadcrumbs = [];

    breadcrumbs.push({
      label: "Home",
      href: "/",
    });

    let currentPath = "";
    for (let i = 0; i < paths.length; i++) {
      currentPath += `/${paths[i]}`;
      breadcrumbs.push({
        label: toPascalCase(paths[i]),
        href: currentPath,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbPaths();

  const handleProductClick = (product: Product) => {
    let foundCategory: string | undefined;
    let foundSubcategory: string | undefined;
    let foundSubtopic: string | undefined;

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
      if (foundCategory) break;
    }

    if (foundCategory && foundSubcategory && foundSubtopic) {
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

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <>
      <div className="px-4 sm:px-8 lg:px-12 xl:px-16 pt-0 pb-6 md:pb-10">
        <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center">
          <Breadcrumbs size={"md"} className="my-6">
            {breadcrumbs.map((breadcrumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const truncatedLabel = truncateText(breadcrumb.label, 20);
              return (
                <BreadcrumbItem key={index} href={breadcrumb.href}>
                  {isLast ? (
                    <p className="font-semibold">{truncatedLabel}</p>
                  ) : (
                    truncatedLabel
                  )}
                </BreadcrumbItem>
              );
            })}
          </Breadcrumbs>
        </div>

        <div className="flex lg:space-x-10 my-6">
          <div
            className={`overflow-y-scroll fixed lg:static lg:block sm:min-w-[300px] sm:max-w-[300px] w-screen h-[60vh] sm:h-auto bottom-0 top-auto sm:top-0 sm:bottom-auto shadow-[0px_0px_15px_0px_gray] lg:shadow-none left-0 lg:h-full bg-white lg:bg-transparent border-[1px] border-black/10 p-6 sm:p-5 rounded-tr-[20px] rounded-tl-[20px] sm:rounded-tl-[0px] sm:rounded-r-[20px] lg:rounded-[20px] transform transition-transform duration-300 ease-in-out ${
              isFilterOpen
                ? "translate-y-0 translate-x-0"
                : "translate-y-[65vh] sm:translate-y-[0px] sm:-translate-x-[300px]"
            } lg:translate-x-0 z-40`}
          >
            <div className="flex justify-between items-center border-b-[1px] pb-4">
              <h2 className="satoshi text-[20px] font-semibold">Filters</h2>
              <img className="w-[24px] hidden lg:block" src={Filter} alt="" />
              <img
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-[24px] lg:hidden"
                src={Close}
                alt=""
              />
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
                      {toPascalCase(category)}
                    </h3>
                    {openSections[category] ? (
                      <ChevronDownIcon className="min-h-5 max-h-5 min-w-5 max-w-5 text-black/60" />
                    ) : (
                      <ChevronRightIcon className="min-h-5 max-h-5 min-w-5 max-w-5 text-black/60" />
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
                                {toPascalCase(subcategory)}
                              </h4>
                            </div>

                            <ul className="pl-3 mt-2 space-y-2">
                              {subtopics.map((subtopic) => (
                                <li
                                  key={subtopic.name}
                                  className="flex justify-between items-center cursor-pointer text-[15px] font-light"
                                  onClick={() => {
                                    navigate(
                                      `/${formatString(
                                        category
                                      )}/${formatString(
                                        subcategory
                                      )}/${formatString(subtopic.name)}`
                                    );
                                    setProducts(subtopic.products);
                                  }}
                                >
                                  {toPascalCase(subtopic.name)}{" "}
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

          {/* Total Products Count and Sort Options */}
          <div className="w-full max-w-full">
            <div className=" flex justify-between items-center mb-4">
              <h1 className="satoshi text-[24px] md:text-[26px] xl:text-[32px] font-bold">
                {subtopic ? `${formatSubtopicName(subtopic)}` : "All Products"}
              </h1>

              <div className="flex justify-end items-center gap-x-4">
                <div className="satoshi text-[10px] md:text-[13px] xl:text-[16px] font-normal text-black/60">
                  Showing {indexOfFirstProduct + 1}-
                  {Math.min(indexOfLastProduct, products.length)} of{" "}
                  {products.length} Products
                </div>

                <div className="hidden md:flex items-center space-x-1.5">
                  <span className="satoshi md:text-[13px] xl:text-[16px] font-normal text-black/60">
                    Sort by:
                  </span>
                  <div className="relative md:w-[110px] xl:w-[125px]">
                    <button
                      className="w-full flex items-center justify-between rounded-md satoshi md:text-[14px] xl:text-[16px] font-medium text-left focus:outline-none"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      {options.find((opt) => opt.key === selected)?.label}

                      <img
                        src={Arrow}
                        alt=""
                        className={`transition-transform duration-300 w-4 ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <ul className="absolute md:w-[130px] xl:w-[150px] right-0 mt-1 lg:mt-2 border-[1px] border-gray-200 rounded-2xl shadow-lg bg-white text-black z-10 transition-all transform duration-500 ease-linear">
                        {options.map((option) => (
                          <li
                            key={option.key}
                            className="px-3 md:py-1 lg:py-1.5 m-2 cursor-pointer rounded-[10px] md:text-[14px] xl:text-[16px] hover:bg-[#F6F6F6]"
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

                <div
                  className="w-[32px] h-[32px] rounded-full bg-[#F0F0F0] flex justify-center items-center cursor-pointer lg:hidden"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <img className="w-[16px]" src={Filter} alt="" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-x-8 lg:gap-x-4 gap-y-7 sm:gap-y-6">
              {isLoading ? (
                <div className="col-span-3 text-center">
                  <div className="w-full h-full bg-white flex justify-center items-center">
                    <Spinner
                      color="default"
                      size="lg"
                      className="brightness-0"
                    />
                  </div>
                </div>
              ) : (
                currentProducts.map((product, index) => (
                  <div key={index} className="">
                    <div
                      className="w-full h-[300px] rounded-[20px] cursor-pointer bg-[#EFEFEF] mb-2 hover:shadow-[0px_0px_2px_0px_lightgray] hover:scale-[1.002] transition-all duration-200 ease-linear"
                      onClick={() => handleProductClick(product)}
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-[20px]"
                      />
                    </div>
                    <h3 className="satoshi text-[18px] sm:text-[20px] md:text-[18px] lg:text-[20px] font-semibold mt-2">
                      {product.name}
                    </h3>
                  </div>
                ))
              )}
            </div>

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
    </>
  );
};

export default Hero;
