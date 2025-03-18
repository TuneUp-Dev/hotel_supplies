import { Button } from "@heroui/button";
import React, { useState, useEffect } from "react";
import Menu from "../assets/menu.svg";
import Close from "../assets/close.svg";
import Search from "../assets/search.svg";
import Cart from "../assets/cart.svg";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (id: any) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="xl:w-[1280px] mx-auto flex justify-between items-center w-full mt-6 md:mt-8 lg:mt-10 px-4 md:px-8 lg:px-12 xl:px-16">
        {/* Logo */}
        <div className="hidden md:block md:w-[140px] lg:w-[160px] xl:w-[210px] text-nowrap">
          <h1 className="text-black agbalumo text-[18px] md:text-[20px] lg:text-[25px] xl:text-[29px] flex items-center gap-x-2">
            Hotel <span className="text-[#EDCF46]">Supplies</span>
          </h1>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden w-full px-1 flex justify-between items-center">
          <button onClick={toggleMobileMenu} className="text-black">
            {isMobileMenuOpen ? (
              <img src={Close} alt="" className="w-6 h-6" />
            ) : (
              <img src={Menu} alt="" className="w-6 h-6" />
            )}
          </button>

          <div className="flex justify-end items-center gap-x-3">
            <button onClick={toggleMobileMenu} className="text-black">
              <img src={Search} alt="" className="w-6 h-6" />
            </button>
            <button onClick={toggleMobileMenu} className="text-black">
              <img src={Cart} alt="" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex list-none inter-light justify-between items-center md:gap-x-[20px] lg:gap-x-[30px] xl:gap-x-[50px] md:text-[12px] lg:text-[14px] xl:text-[16px]">
          <li>
            <button onClick={() => scrollToSection("home")}>Home</button>
          </li>
          <li>
            <button onClick={() => scrollToSection("products")}>
              Products
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection("testimonials")}>
              Testimonial
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection("blog")}>Blog</button>
          </li>
          <li>
            <button onClick={() => scrollToSection("contact")}>Contact</button>
          </li>
        </ul>

        {/* Contact Button (Hidden on Mobile) */}
        <div className="hidden md:block md:w-[140px] lg:w-[150px] xl:w-[210px]">
          <a href="#contact">
            <Button className="airbnb font-light md:text-[11px] lg:text-[14px] xl:text-[16px] bg-black text-white rounded-[62px] md:w-[140px] lg:min-w-[150px] xl:min-w-[210px] md:h-[35px] lg:h-[40px] xl:min-h-[52px]">
              Download Brochure
            </Button>
          </a>
        </div>
      </div>

      {/* Mobile Menu Overlay and Content */}
      <>
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-[2px] z-40"
            onClick={toggleMobileMenu}
          ></div>
        )}

        <div
          className={`md:hidden fixed top-0 w-[70%] rounded-r-[15px] h-full bg-white z-50 transform transition-all duration-200 ease-linear ${
            isMobileMenuOpen ? "left-0" : "-left-[70vw]"
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
              <li className="text-[14px] md:text-[15px] hover:text-black transition-colors duration-200">
                <button onClick={() => scrollToSection("home")}>Home</button>
              </li>
              <li className="text-[14px] md:text-[15px] hover:text-black transition-colors duration-200">
                <button onClick={() => scrollToSection("products")}>
                  Products
                </button>
              </li>
              <li className="text-[14px] md:text-[15px] hover:text-black transition-colors duration-200">
                <button onClick={() => scrollToSection("testimonials")}>
                  Testimonial
                </button>
              </li>
              <li className="text-[14px] md:text-[15px] hover:text-black transition-colors duration-200">
                <button onClick={() => scrollToSection("blog")}>Blog</button>
              </li>
              <li className="text-[14px] md:text-[15px] hover:text-black transition-colors duration-200">
                <button onClick={() => scrollToSection("contact")}>
                  Contact
                </button>
              </li>
            </ul>

            {/* Contact Button for Mobile */}
            <div className="mt-8">
              <a href="#contact">
                <Button className="airbnb font-light text-[14px] md:text-[15px] bg-black text-white rounded-[62px] w-full md:w-auto md:min-w-[100px] lg:min-w-[150px] xl:min-w-[210px] min-h-[30px] lg:min-h-[40px] xl:min-h-[52px]">
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
