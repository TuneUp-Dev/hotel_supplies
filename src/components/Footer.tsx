import React from "react";
import TwitterIcon from "../assets/twitter.svg";
import FacebookIcon from "../assets/facebook.svg";
import InstagramIcon from "../assets/instagram.svg";
import GithubIcon from "../assets/github.svg";

const Footer = () => {
  return (
    <footer
      id="contact"
      className="bg-[#F0F0F0] text-gray-700 w-full xl:max-w-[1440px] mx-auto lg:px-14 xl:px-10 lg:-mt-16 xl:-mt-20 lg:pt-28 xl:pt-32 lg:pb-10 xl:pb-12 satoshi"
    >
      <div className="xl:ml-12 mx-auto flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center lg:gap-x-20 xl:gap-x-40">
        {/* Left Section */}
        <div className="">
          <p className="lg:text-[12px] xl:text-[14px] lg:w-[215px] xl:w-[248px] text-black/60">
            We have clothes that suits your style and which you’re proud to
            wear. From women to men.
          </p>
          <div className="flex lg:gap-3 xl:gap-4 lg:mt-3 xl:mt-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="lg:w-[24px] lg:h-[24px] xl:w-[28px] xl:h-[28px] flex justify-center items-center group hover:bg-black bg-white rounded-full shadow-md transition-all duration-300 ease-linear"
            >
              <img
                src={TwitterIcon}
                alt="Twitter"
                className="lgh-[10px] xl:h-[12px] group-hover:invert group-hover:brightness-200 transition-all duration-300 ease-linear"
              />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="lg:w-[24px] lg:h-[24px] xl:w-[28px] xl:h-[28px] flex justify-center items-center group hover:bg-black bg-white rounded-full shadow-md transition-all duration-300 ease-linear"
            >
              <img
                src={FacebookIcon}
                alt="Facebook"
                className="lg:h-[11px] xl:h-[13px] group-hover:invert group-hover:brightness-200 transition-all duration-300 ease-linear"
              />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="lg:w-[24px] lg:h-[24px] xl:w-[28px] xl:h-[28px] flex justify-center items-center group hover:bg-black bg-white rounded-full shadow-md transition-all duration-300 ease-linear"
            >
              <img
                src={InstagramIcon}
                alt="Instagram"
                className="lg:h-[12px] xl:h-[14px] group-hover:invert group-hover:brightness-200 transition-all duration-300 ease-linear"
              />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="lg:w-[24px] lg:h-[24px] xl:w-[28px] xl:h-[28px] flex justify-center items-center group hover:bg-black bg-white rounded-full shadow-md transition-all duration-300 ease-linear"
            >
              <img
                src={GithubIcon}
                alt="GitHub"
                className="lg:h-[11.5px] xl:h-[13.5px] group-hover:invert group-hover:brightness-200 transition-all duration-300 ease-linear"
              />
            </a>
          </div>
        </div>

        {/* Links Section */}
        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-4">
          <div className="">
            <h3 className="text-black font-medium lg:text-[14px] xl:text-[16px]">
              COMPANY
            </h3>
            <ul className="lg:text-[14px] xl:text-[16px] text-black/60 lg:space-y-2 xl:space-y-3 lg:mt-3 xl:mt-4">
              <li>About</li>
              <li>Features</li>
              <li>Works</li>
              <li>Career</li>
            </ul>
          </div>

          <div className="">
            <h3 className="text-black font-medium lg:text-[14px] xl:text-[16px]">
              HELP
            </h3>
            <ul className="lg:text-[14px] xl:text-[16px] text-black/60 lg:space-y-2 xl:space-y-3 lg:mt-3 xl:mt-4">
              <li>Customer Support</li>
              <li>Delivery Details</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div className="">
            <h3 className="text-black font-medium lg:text-[14px] xl:text-[16px]">
              FAQ
            </h3>
            <ul className="lg:text-[14px] xl:text-[16px] text-black/60 lg:space-y-2 xl:space-y-3 lg:mt-3 xl:mt-4">
              <li>Account</li>
              <li>Manage Deliveries</li>
              <li>Orders</li>
              <li>Payments</li>
            </ul>
          </div>

          <div className="">
            <h3 className="text-black font-medium lg:text-[14px] xl:text-[16px]">
              RESOURCES
            </h3>
            <ul className="lg:text-[14px] xl:text-[16px] text-black/60 lg:space-y-2 xl:space-y-3 lg:mt-3 xl:mt-4">
              <li>Free eBooks</li>
              <li>Development Tutorial</li>
              <li>How to - Blog</li>
              <li>YouTube Playlist</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="xl:mx-12 lg:mt-6 xl:mt-8 border-t border-black/10 lg:pt-3 xl:pt-5 text-start text-black/60 lg:text-[12px] xl:text-[14px]">
        © 2000-2023, All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
