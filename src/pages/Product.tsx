import React from "react";
import Hero from "../components/Product/Hero";
import NewsLetter from "../components/NewsLetter";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import NavbarCart from "../components/NavbarCart";

const Product = () => {
  return (
    <>
      <div className="w-full min-h-screen h-full bg-white md:bg-[#DBDBDB]">
        <div className="w-full px-4 sm:px-10 md:px-16 lg:px-20 hidden md:block">
          <NavbarCart />
        </div>
        <div className="md:hidden pt-4">
          <Navbar />
          <div className="mx-5 h-[1px] bg-black/10 mt-5"></div>
        </div>
        <Hero />
        <NewsLetter />
        <Footer />
      </div>
    </>
  );
};

export default Product;
