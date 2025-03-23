import { Button } from "@heroui/button";
import Hero1 from "../../assets/hero1.svg";
import Hero2 from "../../assets/hero2.svg";
import Hero3 from "../../assets/hero3.svg";
import Hero4 from "../../assets/hero4.svg";
import Hero5 from "../../assets/hero5.svg";
import Hero6 from "../../assets/hero6.svg";

const Hero = () => {
  return (
    <>
      <div
        id="home"
        className="w-full flex flex-col justify-center items-center gap-y-3 md:gap-y-5 lg:gap-y-8 xl:gap-y-10 mt-10 md:mt-12 lg:mt-16 xl:mt-20"
      >
        <h1 className="text-black text-[20px] md:text-[33px] lg:text-[50px] xl:text-[64px] agbalumo w-[280px] md:w-[450px] lg:w-[700px] xl:w-[880px] text-center leading-[30px] md:leading-[40px] lg:leading-[70px] xl:leading-[85px]">
          Elevate Hospitality with Premium Linen,{" "}
          <span className="text-[#EDCF46]">Luxury</span> Amenities & Smart
          Solutions
        </h1>
        <p className="text-[11px] md:text-[12px] lg:text-[14px] xl:text-[16px] satoshi text-black/60 w-[280px] md:w-[450px] lg:w-[550px] text-center">
          Browse through our diverse range of meticulously crafted garments,
          designed to bring out your individuality and cater to your sense of
          style.
        </p>
        <a href="#products">
          <Button className="satoshi font-medium text-[13px] md:text-[12px] lg:text-[14px] xl:text-[16px] bg-black text-white rounded-[62px] w-[120px] md:w-[120px] lg:w-[150px] xl:w-[210px] h-[40px] md:h-[35px] lg:h-[40px] xl:h-[52px]">
            Shop Now
          </Button>
        </a>

        <div className="flex justify-center items-stretch gap-2 md:gap-4 lg:gap-5 mt-3 md:mt-1">
          <span className="flex flex-col items-start">
            <h1 className="satoshi font-bold text-[16px] md:text-[20px] lg:text-[26px] xl:text-[40px] text-black">
              200+
            </h1>
            <p className="satoshi text-[10px] md:text-[10px] lg:text-[14px] xl:text-[16px] text-black/60 -mt-1">
              International Brands
            </p>
          </span>

          <div className="bg-black/10 w-[1px]" />

          <span className="flex flex-col items-start">
            <h1 className="satoshi font-bold text-[16px] md:text-[20px] lg:text-[26px] xl:text-[40px] text-black">
              2,000+
            </h1>
            <p className="satoshi text-[10px] md:text-[10px] lg:text-[14px] xl:text-[16px] text-black/60 -mt-1">
              International Brands
            </p>
          </span>

          <div className="bg-black/10 w-[1px]" />

          <span className="flex flex-col items-start">
            <h1 className="satoshi font-bold text-[16px] md:text-[20px] lg:text-[26px] xl:text-[40px] text-black">
              30,000+
            </h1>
            <p className="satoshi text-[10px] md:text-[10px] lg:text-[14px] xl:text-[16px] text-black/60 -mt-1">
              International Brands
            </p>
          </span>
        </div>

        {/* Floating Images */}
        <div className="pop_images absolute -z-10 md:w-[768px] lg:w-[1024px] xl:w-[1280px] mx-auto top-[130px] md:top-[160px] lg:top-[260px] xl:top-[270px] left-0 right-0 flex flex-col justify-start gap-10 md:gap-10 lg:gap-20 xl:gap-24">
          <span className="flex justify-between items-center px-8 md:px-20 lg:px-28 xl:px-36">
            <img
              className="w-[25px] h-[25px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px] xl:w-[70px] xl:h-[70px]"
              src={Hero1}
              alt=""
            />
            <img
              className="w-[25px] h-[25px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px] xl:w-[70px] xl:h-[70px]"
              src={Hero4}
              alt=""
            />
          </span>
          <span className="flex justify-between items-center px-4 md:px-16 lg:px-20 xl:px-28">
            <img
              className="w-[25px] h-[25px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px] xl:w-[70px] xl:h-[70px]"
              src={Hero2}
              alt=""
            />
            <img
              className="w-[25px] h-[25px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px] xl:w-[70px] xl:h-[70px]"
              src={Hero5}
              alt=""
            />
          </span>
          <span className="flex justify-between items-center px-16 md:px-36 lg:px-44 xl:px-52">
            <img
              className="w-[25px] h-[25px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px] xl:w-[70px] xl:h-[70px]"
              src={Hero3}
              alt=""
            />
            <img
              className="w-[25px] h-[25px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px] xl:w-[70px] xl:h-[70px]"
              src={Hero6}
              alt=""
            />
          </span>
        </div>
      </div>
    </>
  );
};

export default Hero;
