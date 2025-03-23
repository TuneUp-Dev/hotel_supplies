import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowDown from "../assets/arrow_down.svg";
import Search from "../assets/search_cart.svg";
import CartIcon from "../assets/cart.svg";

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  color: string;
  size: string;
  quantity: number;
}

const NavbarCart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCartItems = JSON.parse(
      localStorage.getItem("cartItems") || "[]"
    ) as CartItem[];
    setCartItems(storedCartItems);

    console.log("Cart Items on Load:", storedCartItems);
    console.log(
      "Cart Item IDs:",
      storedCartItems.map((item) => item.id)
    );
  }, []);

  const totalCartItems = cartItems.length;

  return (
    <>
      <div className="w-full max-w-screen Satoshi">
        <div className="hidden border-b-[1px] border-black/10 pt-[44px] py-6 md:flex items-center justify-between">
          {/* Left Side Menu */}
          <div className="flex justify-between items-center md:space-x-4 xl:space-x-6">
            <div className="hidden md:block md:w-[140px] lg:w-[160px] xl:w-[210px] text-nowrap">
              <h1
                className="text-black agbalumo text-[18px] md:text-[20px] lg:text-[25px] xl:text-[29px] flex items-center gap-x-2 cursor-pointer"
                onClick={() => navigate("/")}
              >
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

          {/* Cart Icon with Item Count */}
          <div
            className="text-xl cursor-pointer relative"
            onClick={() => navigate("/cart")}
          >
            <img className="w-[24px] md:w-[22px]" src={CartIcon} alt="" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarCart;
