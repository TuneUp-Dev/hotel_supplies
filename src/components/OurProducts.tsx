import { Button } from "@heroui/button";
import Arrow from "../assets/arrow_right.svg";
import ArrowTop from "../assets/arrow_top_right.svg";
import Product1 from "../assets/product1.png";
import Product2 from "../assets/product2.png";
import Product3 from "../assets/product3.png";
import Product4 from "../assets/product4.png";
import Product5 from "../assets/product5.png";

// Product Data
const products = [
  {
    id: 1,
    image: Product1,
    title: "Premium Hospitality Linen & Equipment",
    features: [
      "Bedroom Linen",
      "Bedroom Linen",
      "Bedroom Linen",
      "Bedroom Linen",
    ],
  },
  {
    id: 2,
    image: Product2,
    title: "Premium Hospitality Linen & Equipment",
    features: [
      "Bedroom Linen",
      "Bedroom Linen",
      "Bedroom Linen",
      "Bedroom Linen",
    ],
  },
  {
    id: 3,
    image: Product3,
    title: "Premium Hospitality Linen & Equipment",
    features: [
      "Bedroom Linen",
      "Bedroom Linen",
      "Bedroom Linen",
      "Bedroom Linen",
    ],
  },
  {
    id: 4,
    image: Product4,
    title: "Premium Hospitality Linen & Equipment",
    features: [
      "Bedroom Linen",
      "Bedroom Linen",
      "Bedroom Linen",
      "Bedroom Linen",
    ],
  },
  {
    id: 5,
    image: Product5,
    title: "Premium Hospitality Linen & Equipment",
    features: [
      "Bedroom Linen",
      "Bedroom Linen",
      "Bedroom Linen",
      "Bedroom Linen",
    ],
  },
];

const OurProducts = () => {
  return (
    <>
      <div
        id="products"
        className="w-full md:w-[720px] lg:w-[1024px] xl:w-[1280px] mx-auto flex flex-col justify-center items-center gap-y-2.5 md:gap-y-4 mt-12 md:mt-16 lg:mt-20 xl:mt-28"
      >
        {/* Section Title */}
        <h1 className="outfit font-medium text-[26px] md:text-[32px] lg:text-[39px] text-black text-center">
          Our Products Range
        </h1>
        <p className="text-[12px] md:text-[15px] lg:text-[16px] satoshi text-black/60 w-[90vw] md:w-[500px] lg:w-[550px] text-center leading-4 md:leading-5">
          Browse through our extensive range of high-quality hotel supplies,
          designed to enhance guest comfort and elevate hospitality experiences.
        </p>

        {/* Product Cards */}
        <div className="mt-4 md:mt-6 lg:mt-7 xl:mt-8 w-full flex flex-wrap justify-center gap-5 md:gap-6 lg:gap-8 xl:gap-28">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative w-[90vw] md:w-[250px] h-[350px] md:h-[380px] lg:w-[300px] lg:h-[450px] xl:w-[350px] xl:h-[535px] overflow-hidden rounded-[12px] rounded-br-[30px] rounded-bl-[30px] md:rounded-br-[40px] md:rounded-bl-[40px] lg:rounded-br-[50px] lg:rounded-bl-[50px] flex flex-col justify-start items-start gap-y-3 bg-white"
              style={{
                position: "relative",
                padding: "1px",
                background: "linear-gradient(195deg, white, white, #666666)",
              }}
            >
              {/* Inner Container */}
              <div
                className="w-full h-full rounded-tr-[30px] rounded-br-[30px] rounded-bl-[30px] md:rounded-tr-[40px] md:rounded-br-[40px] md:rounded-bl-[40px] lg:rounded-tr-[50px] lg:rounded-br-[50px] lg:rounded-bl-[50px] overflow-hidden bg-white"
                style={{
                  position: "relative",
                }}
              >
                {/* Product Image */}
                <div
                  className="w-full overflow-hidden"
                  style={{
                    position: "absolute",
                    zIndex: 0,
                  }}
                >
                  <img src={product.image} alt={product.title} />
                </div>

                {/* Product Details */}
                <div
                  className="absolute bottom-0 w-full min-h-[200px] max-h-[200px] md:min-h-[220px] md:max-h-[220px] lg:min-h-[260px] lg:max-h-[260px] xl:min-h-[320px] xl:max-h-[320px] p-3 md:p-5 lg:p-6 xl:p-8 pt-3 lg:pt-4 xl:pt-6 pb-1 lg:pb-2 xl:pb-4 bg-white rounded-tr-[30px] rounded-br-[30px] rounded-bl-[30px] md:rounded-tr-[40px] md:rounded-br-[40px] md:rounded-bl-[40px] lg:rounded-tr-[50px] lg:rounded-br-[50px] lg:rounded-bl-[50px] xl:rounded-tr-[60px] xl:rounded-br-[60px] xl:rounded-bl-[60px] flex flex-col justify-start items-start gap-y-2 lg:gap-y-3 xl:gap-y-4"
                  style={{
                    zIndex: 1,
                  }}
                >
                  <h1 className="playfair font-medium text-[18px] md:text-[18px] lg:text-[20px] xl:text-[22px] leading-[112%]">
                    {product.title}
                  </h1>
                  <ul className="flex flex-col justify-start items-start gap-y-1 md:gap-y-1.5 lg:gap-y-2 xl:gap-y-3">
                    {product.features.map((feature, index) => (
                      <li
                        key={index}
                        className="w-full lato text-[12px] md:text-[13px] lg:text-[14px] xl:text-[16px] flex justify-start items-center gap-x-1 xl:gap-x-1.5"
                      >
                        {feature}
                        <img
                          src={Arrow}
                          className="w-[10px] lg:w-[11px] xl:w-[12px]"
                          alt=""
                        />
                      </li>
                    ))}
                  </ul>

                  {/* View Details Button */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[100px] md:w-[130px] lg:w-[150px] xl:w-[176px]">
                    <Button className="outfit font-normal text-[10px] md:text-[11px] lg:text-[13px] xl:text-[16px] border-[0.9px] bg-white border-black text-black rounded-[44px] w-[80px] md:w-[105px] lg:w-[110px] xl:w-[140px] max-h-[28px] md:min-h-[32px] lg:min-h-[40px] xl:min-h-[50px] overflow-hidden">
                      View Details
                    </Button>

                    {/* Arrow Container */}
                    <span className="bg-[#003F2E] absolute top-0 right-0 md:right-2 lg:right-3 xl:right-1 rounded-full w-[28px] md:w-[32px] lg:w-[40px] xl:w-[50px] h-[28px] md:h-[32px] lg:h-[40px] xl:h-[50px] flex justify-center items-center overflow-visible">
                      <img
                        src={ArrowTop}
                        className="w-[17px] md:w-[20px] lg:w-[30px]"
                        alt="Arrow"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default OurProducts;
