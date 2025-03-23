import React, { useState, useEffect, useCallback } from "react";
import { Breadcrumbs, BreadcrumbItem, Button, Spinner } from "@heroui/react";
import Tick from "../../assets/tick2.svg";
import Minus from "../../assets/minus.svg";
import Plus from "../../assets/plus.svg";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  availableColors: string[];
  availableSizes: string[];
  orderCount: string;
  totalOrderCount: string;
  productImages: string[];
}

interface ProductGroup {
  id: string;
  name: string;
  products: Product[];
}

const Hero = () => {
  const [productData, setProductData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const navigate = useNavigate();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    console.log(windowWidth);
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const location = useLocation();

  const toPascalCase = (text: string) => {
    return text
      .replace(/--/g, " & ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const fetchProduct = useCallback(async () => {
    setIsLoading(true);

    try {
      const paths = location.pathname.split("/").filter((path) => path !== "");
      const [category, subcategory, subtopic, productId] = paths;

      const endpoint = `hotel-supplies-backend.vercel.app/api/products/${category}/${subcategory}/${subtopic}`;
      console.log("Fetching product from:", endpoint);

      const response = await axios.get<ProductGroup>(endpoint);
      const productGroup = response.data;

      console.log("Fetched product group:", productGroup);

      const specificProduct = productGroup.products.find(
        (p) => p.id === productId
      );

      if (!specificProduct) {
        throw new Error("Product not found");
      }

      setProductData(specificProduct);
      console.log("Fetched specific product:", specificProduct);
    } catch (error) {
      console.error("Error fetching product:", error);
      setProductData(null);
    } finally {
      setIsLoading(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    fetchProduct();
  }, [location.pathname, fetchProduct]);

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
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

  if (!productData) {
    return <div>Product not found</div>;
  }

  const percentage =
    (parseInt(productData.orderCount) / parseInt(productData.totalOrderCount)) *
    100;

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

  const isLightColor = (color: string): boolean => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5;
  };

  const handleAddToCart = () => {
    if (!productData || !selectedColor || !selectedSize) {
      alert("Please select color and size before adding to cart.");
      return;
    }

    const paths = location.pathname.split("/").filter((path) => path !== "");
    const [category, subcategory, subtopic, productName] = paths;

    const cartItem = {
      id: productData.id,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      imageUrl: productData.imageUrl,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      category: category,
      subcategory: subcategory,
      subtopic: subtopic,
      productName: productName,
    };

    const existingCartItems = JSON.parse(
      localStorage.getItem("cartItems") || "[]"
    );

    const updatedCartItems = [...existingCartItems, cartItem];

    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

    navigate("/cart");
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <>
      <div className="px-4 sm:px-10 md:px-16 lg:px-20 pt-0 pb-6 md:pb-10">
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

        <div className="w-full flex flex-wrap lg:flex-nowrap justify-between items-start gap-y-10 md:gap-y-16 gap-x-6 lg:gap-10 mt-6 sm:mt-8 lg:mt-10 xl:mt-12">
          {/* Image Section */}
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center w-full lg:w-auto xl:min-w-[600px] h-[430px] sm:h-[300px] md:h-[450px] lg:h-[530px] gap-3">
            <div className="w-full h-full flex sm:flex-col justify-between items-center gap-3">
              {productData.productImages.map((image, index) => (
                <div
                  key={index}
                  className="w-full h-full bg-white md:bg-white rounded-2xl border-[1px] border-transparent hover:border-black transition-all duration-200 ease-linear"
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              ))}
            </div>
            <div
              className="w-full sm:min-w-[380px] md:min-w-[420px] lg:min-w-[370px] xl:min-w-[440px] min-h-[300px] sm:h-full bg-white md:bg-white border-[1px] border-transparent hover:border-black transition-all duration-200 ease-linear shadow-[0px_0px_4px_rgba(0,0,0,0.25)] md:shadow-none rounded-2xl"
              style={{
                backgroundImage: `url(${productData.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          </div>

          {/* Product Details */}
          <div className="w-full h-[480px] md:h-[430px] lg:h-[530px] lg:w-auto flex flex-col justify-between items-start">
            <div className="w-full h-full">
              <h2 className="text-2xl md:text-3xl lg:text-[35px] xl:text-[40px] agbalumo font-normal">
                {productData.name}
              </h2>

              {/* Order Progress */}
              <div className="w-full max-w-[240px] mt-2.5 lg:mt-4">
                <div className="text-start text-[14px] sm:text-[11px] md:text-[13px] lg:text-[13.5px] xl:text-[16px]">
                  {productData.orderCount}/{productData.totalOrderCount} Orders
                  Count
                </div>
                <div className="w-full h-[6px] bg-[#F0F0F0] md:bg-white rounded-full relative overflow-hidden mt-2">
                  <div
                    className="h-full bg-[#FFC738] rounded-full transition-all duration-700"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Description */}
              <p className="font-light text-[14px] sm:text-[11px] md:text-[13px] lg:text-[13.5px] xl:text-[16px] text-black/60 mt-3">
                {productData.description}
              </p>

              {/* Color Selection */}
              <div className="border-y border-black/10 py-4 mt-10 sm:mt-6 md:mt-8 xl:mt-10 flex flex-col gap-2.5">
                <div className="font-light sm:font-normal text-[14px] sm:text-[11px] md:text-[13px] lg:text-[13.5px] xl:text-[16px] text-black/60">
                  Select Colors
                </div>
                <div className="flex gap-2 md:gap-3">
                  {productData.availableColors.map((color, index) => (
                    <span
                      key={index}
                      className={`w-[40px] h-[40px] sm:w-[25px] sm:h-[25px] md:w-[30px] md:h-[30px] lg:w-[37px] lg:h-[37px] rounded-full flex justify-center items-center cursor-pointer 
                      ${
                        isLightColor(color)
                          ? "border md:border-none"
                          : "border-none"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    >
                      {selectedColor === color && (
                        <img
                          className={`w-[16px] sm:w-[12px] md:w-[14px] lg:w-[16px] ${
                            isLightColor(color) ? "invert" : ""
                          }`}
                          src={Tick}
                          alt="tick"
                        />
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mt-5 flex flex-col gap-2.5">
                <div className="font-light sm:font-normal text-[14px] sm:text-[11px] md:text-[13px] lg:text-[13.5px] xl:text-[16px] text-black/60">
                  Choose Size
                </div>
                <div className="flex gap-3">
                  {productData.availableSizes.map((size, index) => (
                    <Button
                      key={index}
                      className={`w-[75px] lg:w-[100px] h-[37px] sm:h-[30px] md:h-[35px] lg:h-[45px] rounded-full flex justify-center items-center cursor-pointer transition-all duration-300 ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "bg-[#F0F0F0] md:bg-white text-black/60 md:first-letter:border border-gray-300"
                      }`}
                      onPress={() => setSelectedSize(size)}
                    >
                      <div className="text-[11px] md:text-[13px] lg:text-[13.5px] xl:text-[16px]">
                        {size}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mt-8 w-full min-h-[37px] md:min-h-[40px] xl:min-h-[52px] flex flex-nowrap justify-between items-center gap-4">
              <div className="w-[110px] sm:w-[140px] md:w-[170px] h-full flex justify-between items-center bg-[#F0F0F0] px-3 sm:px-5 rounded-full gap-0.5 sm:gap-2">
                <button onClick={handleDecreaseQuantity}>
                  <img
                    className="min-w-[18px] sm:w-4 md:w-5"
                    src={Minus}
                    alt="minus"
                  />
                </button>
                {/* Quantity Count */}
                <span className="px-3 text-[11px] md:text-[13px] lg:text-[13.5px] xl:text-[16px] font-medium">
                  {quantity}
                </span>
                <button onClick={handleIncreaseQuantity}>
                  <img
                    className="min-w-[18px] sm:w-4 md:w-5"
                    src={Plus}
                    alt="plus"
                  />
                </button>
              </div>

              <Button
                className="w-full h-full flex justify-center items-center text-center text-[14px] sm:text-[11px] md:text-[13px] lg:text-[13.5px] xl:text-[16px] sm:font-medium text-white bg-black px-5 rounded-full"
                onPress={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
