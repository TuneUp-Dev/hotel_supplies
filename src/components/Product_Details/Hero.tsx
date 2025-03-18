import React, { useState, useEffect } from "react";
import { Breadcrumbs, BreadcrumbItem, Button } from "@heroui/react";
import Tick from "../../assets/tick2.svg";
import Minus from "../../assets/minus.svg";
import Plus from "../../assets/plus.svg";

const Hero = () => {
  const currentOrders = 480;
  const totalOrders = 1000;
  const percentage = (currentOrders / totalOrders) * 100;

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const colors = ["#4F4631", "#314F4A", "#31344F"];
  const sizes = ["Small", "Medium", "Large"];

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const getMaxLength = () => {
    if (windowWidth < 640) return 5;
    if (windowWidth < 1024) return 20;
    return 50;
  };

  return (
    <div className="px-4 sm:px-10 md:px-16 lg:px-20 py-6 md:py-10">
      {/* Breadcrumbs */}
      <Breadcrumbs size="md" className="my-4 md:my-6 whitespace-nowrap">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/">
          {truncateText(
            "Premium Hospitality Linen & Equipment",
            getMaxLength()
          )}
        </BreadcrumbItem>
        <BreadcrumbItem href="/">
          {truncateText("Bedroom Linen", getMaxLength())}
        </BreadcrumbItem>
        <BreadcrumbItem href="/">
          {truncateText("Mattress Protector", getMaxLength())}
        </BreadcrumbItem>
      </Breadcrumbs>

      {/* Main Section */}
      <div className="w-full flex flex-wrap lg:flex-nowrap justify-between items-start gap-y-10 md:gap-y-16 gap-x-6 lg:gap-10 mt-6 sm:mt-8 lg:mt-10 xl:mt-12">
        {/* Image Section */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center w-full lg:w-auto xl:min-w-[600px] h-[430px] sm:h-[300px] md:h-[450px] lg:h-[530px] gap-3">
          <div className="w-full h-full flex sm:flex-col justify-between items-center gap-3">
            <div className="w-full h-full bg-white md:bg-white rounded-2xl border border-black"></div>
            <div className="w-full h-full bg-[#F0F0F0] md:bg-white rounded-2xl"></div>
            <div className="w-full h-full bg-[#F0F0F0] md:bg-white rounded-2xl"></div>
          </div>
          <div className="w-full sm:min-w-[380px] md:min-w-[420px] lg:min-w-[370px] xl:min-w-[440px] min-h-[300px] sm:h-full bg-white md:bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.25)] md:shadow-none rounded-2xl"></div>
        </div>

        {/* Product Details */}
        <div className="w-full h-[480px] md:h-[430px] lg:h-[530px] lg:w-auto flex flex-col justify-between items-start">
          <div className="w-full h-full">
            <h2 className="text-2xl md:text-3xl lg:text-[35px] xl:text-[40px] agbalumo font-normal">
              Mattress Protector
            </h2>

            {/* Order Progress */}
            <div className="w-full max-w-[240px] mt-2.5 lg:mt-4">
              <div className="text-start text-[14px] sm:text-[11px] md:text-[13px] lg:text-[13.5px] xl:text-[16px]">
                {currentOrders}/{totalOrders} Orders Count
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
              This mattress protector is perfect for any setting, offering
              enhanced comfort and durability. Crafted from soft, breathable
              fabric, it provides superior protection while maintaining a cozy
              and luxurious feel.
            </p>

            {/* Color Selection */}
            <div className="border-y border-black/10 py-4 mt-10 sm:mt-6 md:mt-8 xl:mt-10 flex flex-col gap-2.5">
              <div className="font-light sm:font-normal text-[14px] sm:text-[11px] md:text-[13px] lg:text-[13.5px] xl:text-[16px] text-black/60">
                Select Colors
              </div>
              <div className="flex gap-2 md:gap-3">
                {colors.map((color, index) => (
                  <span
                    key={index}
                    className="w-[40px] h-[40px] sm:w-[25px] sm:h-[25px] md:w-[30px] md:h-[30px] lg:w-[37px] lg:h-[37px] rounded-full flex justify-center items-center cursor-pointer"
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <img
                        className="w-[16px] sm:w-[12px] md:w-[14px] lg:w-[16px]"
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
                {sizes.map((size, index) => (
                  <Button
                    key={index}
                    className={`w-[75px] lg:w-[86px] h-[37px] sm:h-[30px] md:h-[35px] lg:h-[48px] rounded-full flex justify-center items-center cursor-pointer transition-all duration-300 ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "bg-[#F0F0F0] md:bg-white text-black/60 md:first-letter:border border-gray-300"
                    }`}
                    onClick={() => setSelectedSize(size)}
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
            {/* Quantity Selector */}
            <div className="w-[110px] sm:w-[140px] md:w-[170px] h-full flex justify-between items-center bg-[#F0F0F0] px-3 sm:px-5 rounded-full gap-0.5 sm:gap-2">
              <button>
                <img
                  className="min-w-[18px] sm:w-4 md:w-5"
                  src={Minus}
                  alt="minus"
                />
              </button>
              <span className="px-3 text-[11px] md:text-[13px] lg:text-[13.5px] xl:text-[16px] font-medium">
                1
              </span>
              <button>
                <img
                  className="min-w-[18px] sm:w-4 md:w-5"
                  src={Plus}
                  alt="plus"
                />
              </button>
            </div>

            {/* Add to Cart Button */}
            <Button className="w-full h-full flex justify-center items-center text-center text-[14px] sm:text-[11px] md:text-[13px] lg:text-[13.5px] xl:text-[16px] sm:font-medium text-white bg-black px-5 rounded-full">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
