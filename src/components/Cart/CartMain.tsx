import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import Arrow from "../../assets/cart_arrow_right.svg";
import ArrowDown from "../../assets/arrow_down.svg";
import Search from "../../assets/search_cart.svg";
import Cart from "../../assets/cart.svg";
import Delete from "../../assets/delete.svg";
import Minus from "../../assets/minus.svg";
import Plus from "../../assets/plus.svg";
import { Button } from "@heroui/button";

const CartMain = () => {
  // Dummy cartMain data
  const cartMainItems = [
    { id: 1, name: "Bed Sheet", size: "Large", color: "White" },
    { id: 2, name: "Cloth Hangers", size: "Medium", color: "Red" },
    { id: 3, name: "Table Cloth", size: "Large", color: "Blue" },
  ];

  return (
    <>
      <div className="w-full px-6 md:px-8 lg:px-14 xl:px-24 Satoshi">
        <div className="hidden border-b-[1px] border-black/10 mt-5 py-6 md:flex items-center justify-between">
          {/* Left Side Menu */}
          <div className="flex justify-between items-center md:space-x-4 xl:space-x-6">
            <div className="hidden md:block md:w-[140px] lg:w-[160px] xl:w-[210px] text-nowrap">
              <h1 className="text-black agbalumo text-[18px] md:text-[20px] lg:text-[25px] xl:text-[29px] flex items-center gap-x-2">
                Hotel <span className="text-[#EDCF46]">Supplies</span>
              </h1>
            </div>
            <p className="cursor-pointer font-light text-[16px] md:text-[14px] flex justify-start items-center gap-x-1 md:pl-6 lg:pl-16">
              Shop <img className="w-[16px] mt-1" src={ArrowDown} alt="" />
            </p>
            <p className="cursor-pointer font-light text-[16px] md:text-[14px]">
              On Sale
            </p>
            <p className="cursor-pointer font-light text-[16px] md:text-[14px]">
              New Arrivals
            </p>
            <p className="cursor-pointer font-light text-[16px] md:text-[14px]">
              Brands
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-[630px] ml-8 md:ml-6 xl:ml-8 mr-6 md:mr-4 xl:mr-6">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full h-[45px] md:h-[35px] px-14 md:pl-9 md:pr-3 py-2 bg-[#F0F0F0] rounded-full font-light text-black/40 text-[16px] md:text-[13px] outline-none"
            />
            <span className="absolute left-3 md:left-2.5 top-1/2 transform -translate-y-1/2">
              <img className="w-[24px] md:w-[20px]" src={Search} alt="" />
            </span>
          </div>

          {/* Cart Icon */}
          <div className="text-xl cursor-pointer">
            <img className="w-[24px] md:w-[22px]" src={Cart} alt="" />
          </div>
        </div>

        <Breadcrumbs size={"sm"} className="my-6">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/cart">Cart</BreadcrumbItem>
        </Breadcrumbs>
        <div className="w-full flex flex-col lg:flex-row gap-x-10 gap-y-4">
          {/* CartMain Items Section */}
          <div className="flex-1">
            <h2 className="text-[40px] agbalumo font-normal mb-4 md:mb-6 -mt-4 md:mt-0">
              Your cart
            </h2>
            <div className="">
              {cartMainItems.map((item, index) => (
                <div
                  key={item.id}
                  className="relative flex items-start justify-between py-5"
                >
                  {/* Product Image */}
                  <div className="w-[100px] h-[100px] md:w-[125px] md:h-[125px] bg-[#F3F3F3] rounded-[9px] flex items-center justify-center">
                    <img
                      src={Cart}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 px-4 satoshi">
                    <h3 className="text-[16px] md:text-[20px] lg:text-[18px] xl:text-[20px] font-bold">
                      {item.name}
                    </h3>
                    <p className="text-[12px] md:text-[14px] lg:text-[12px] xl:text-[14px] text-black/60">
                      <b className="font-normal text-black">Size:</b>{" "}
                      {item.size}
                    </p>
                    <p className="text-[12px] md:text-[14px] lg:text-[12px] xl:text-[14px] text-black/60">
                      <b className="font-normal text-black">Color:</b>{" "}
                      {item.color}
                    </p>
                  </div>

                  <div className="h-[125px] flex flex-col justify-between items-end">
                    {/* Delete Button */}
                    <button className="">
                      <img
                        className="w-[20px] xl:w-[24px]"
                        src={Delete}
                        alt=""
                      />
                    </button>

                    {/* Quantity Selector */}
                    <div className="flex items-center bg-[#F0F0F0] px-[20px] py-[10px] xl:py-[12px] rounded-[62px] gap-2">
                      <button className="">
                        <img
                          className="w-[16px] xl:w-[20px]"
                          src={Minus}
                          alt=""
                        />
                      </button>
                      <span className="px-3 text-[14px]">1</span>
                      <button className="">
                        <img
                          className="w-[16px] xl:w-[20px]"
                          src={Plus}
                          alt=""
                        />
                      </button>
                    </div>
                  </div>

                  {/* Line Divider (only if not the last item) */}
                  {index < cartMainItems.length - 1 && (
                    <div className="absolute left-0 bottom-0 w-full h-[1px] bg-black/10"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="w-full lg:w-[400px] xl:w-[500px] h-[450px] border-[1px] border-black/10 bg-white px-[24px] py-[20px] rounded-[20px]">
            <h3 className="text-[24px] satoshi font-bold">Send Enquiry</h3>
            <form className="space-y-5 mt-6">
              <input
                type="text"
                placeholder="Name"
                className="w-full h-[50px] px-5 rounded-[62px] text-black/50 satoshi font-[350] bg-[#F0F0F0]"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full h-[50px] px-5 rounded-[62px] text-black/50 satoshi font-[350] bg-[#F0F0F0]"
              />
              <input
                type="text"
                placeholder="Contact Number"
                className="w-full h-[50px] px-5 rounded-[62px] text-black/50 satoshi font-[350] bg-[#F0F0F0]"
              />
              <input
                placeholder="Message"
                className="w-full h-[50px] px-5 rounded-[62px] text-black/50 satoshi font-[350] bg-[#F0F0F0]"
              ></input>
              <Button className="w-full h-[60px] p-4 bg-black satoshi text-[16px] text-white rounded-[62px] flex items-center justify-center gap-2">
                Send Enquiry{" "}
                <span>
                  <img src={Arrow} className="w-[24px]" alt="" />
                </span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartMain;
