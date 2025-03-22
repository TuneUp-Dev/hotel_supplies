import React from "react";
import Hero from "../components/Category/Hero";
import { Footer } from "antd/es/layout/layout";
import NavbarCart from "../components/NavbarCart";
import NewsLetter from "../components/NewsLetter";
import Navbar from "../components/Navbar";

const Category = () => {
  return (
    <>
      <div className="w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 hidden md:block">
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

export default Category;
