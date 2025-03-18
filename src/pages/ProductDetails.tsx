import React from "react";
import Hero from "../components/Product_Details/Hero";
import NewsLetter from "../components/NewsLetter";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const ProductDetails = () => {
  return (
    <>
      <div className="w-full min-h-screen h-full bg-white md:bg-[#DBDBDB]">
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

export default ProductDetails;
