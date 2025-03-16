import { Button } from "@heroui/button";
import React, { useState, useEffect } from "react";
import Menu from "../assets/menu.svg";
import Close from "../assets/close.svg";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Disable background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }

    // Cleanup function to re-enable scrolling when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <div className="xl:w-[1280px] mx-auto flex justify-between items-center w-full mt-6 md:mt-10 px-4 md:px-10 lg:px-16 xl:px-10">
        {/* Logo */}
        <div className="lg:w-[160px] xl:w-[210px] text-nowrap">
          <h1 className="text-black agbalumo text-[20px] md:text-[22px] lg:text-[25px] xl:text-[29px] flex justify-start items-center gap-x-2">
            Hotel <span className="text-[#EDCF46]">Supplies</span>
          </h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex list-none inter-light justify-between items-center md:gap-x-[30px] lg:gap-x-[40px] xl:gap-x-[50px] lg:text-[12px] xl:text-[14px]">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#products">Products</a>
          </li>
          <li>
            <a href="#testimonials">Testimonial</a>
          </li>
          <li>
            <a href="#blog">Blog</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-black">
            {isMobileMenuOpen ? (
              <img src={Close} alt="Close Menu" className="w-6 h-6" />
            ) : (
              <img src={Menu} alt="Open Menu" className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Contact Button (Hidden on Mobile) */}
        <div className="hidden md:block md:w-[80px] lg:w-[170px] xl:w-[210px]">
          <a href="#contact">
            <Button className="airbnb font-light md:text-[12px] lg:text-[14px] xl:text-[16px] bg-black text-white rounded-[62px] md:min-w-[80px] lg:w-[170px] xl:min-w-[210px] md:min-h-[30px] lg:h-[40px] xl:min-h-[52px]">
              Download Brochure
            </Button>
          </a>
        </div>
      </div>

      {/* Mobile Menu Overlay and Content */}
      <>
        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-[2px] z-40"
            onClick={toggleMobileMenu}
          ></div>
        )}

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed top-0 w-[60%] rounded-l-[15px] h-full bg-white z-50 transform transition-all duration-200 ease-linear ${
            isMobileMenuOpen ? "right-0" : "-right-[60vw]"
          }`}
        >
          <div className="p-6">
            <div className="md:hidden w-full flex items-center justify-end z-[9999]">
              <button onClick={toggleMobileMenu} className="text-black -mr-2">
                <img src={Close} alt="Close Menu" className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items */}
            <ul className="list-none inter-light text-left space-y-6 mt-12">
              <li className="text-[15px] hover:text-black transition-colors duration-200">
                <a href="#home" onClick={toggleMobileMenu}>
                  Home
                </a>
              </li>
              <li className="text-[15px] hover:text-black transition-colors duration-200">
                <a href="#about-us" onClick={toggleMobileMenu}>
                  About Us
                </a>
              </li>
              <li className="text-[15px] hover:text-black transition-colors duration-200">
                <a href="#products" onClick={toggleMobileMenu}>
                  Products
                </a>
              </li>
              <li className="text-[15px] hover:text-black transition-colors duration-200">
                <a href="#testimonial" onClick={toggleMobileMenu}>
                  Testimonial
                </a>
              </li>
              <li className="text-[15px] hover:text-black transition-colors duration-200">
                <a href="#blog" onClick={toggleMobileMenu}>
                  Blog
                </a>
              </li>
              <li className="text-[15px] hover:text-black transition-colors duration-200">
                <a href="#contact" onClick={toggleMobileMenu}>
                  Contact
                </a>
              </li>
            </ul>

            {/* Contact Button for Mobile */}
            <div className="mt-10">
              <a href="#contact">
                <Button className="airbnb font-light md:text-[12px] lg:text-[14px] xl:text-[16px] bg-black text-white rounded-[62px] md:min-w-[80px] lg:w-[170px] xl:min-w-[210px] md:min-h-[30px] lg:h-[40px] xl:min-h-[52px]">
                  Download Brochure
                </Button>
              </a>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default Navbar;
