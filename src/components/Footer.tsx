import React from "react";
import TwitterIcon from "../assets/twitter.svg";
import FacebookIcon from "../assets/facebook.svg";
import InstagramIcon from "../assets/instagram.svg";
import GithubIcon from "../assets/github.svg";

const Footer = () => {
  return (
    <footer
      id="contact"
      className="bg-[#F0F0F0] text-gray-700 w-full xl:max-w-[1440px] mx-auto px-6 md:px-10 lg:px-14 xl:px-10 -mt-10 md:-mt-12 lg:-mt-16 xl:-mt-20 pt-16 md:pt-20 lg:pt-28 xl:pt-32 pb-6 md:pb-8 lg:pb-10 xl:pb-12 satoshi"
    >
      <div className="xl:ml-12 mx-auto flex flex-col lg:flex-row justify-start lg:justify-between items-start lg:items-center gap-y-7 lg:gap-y-0 lg:gap-x-20 xl:gap-x-40">
        {/* Left Section */}
        <div className="">
          <p className="text-[11px] md:text-[12px] lg:text-[12px] xl:text-[14px] md:w-[350px] lg:w-[215px] xl:w-[248px] text-black/60">
            We have clothes that suits your style and which you’re proud to
            wear. From women to men.
          </p>
          <div className="flex gap-1 md:gap-2 lg:gap-3 xl:gap-4 mt-1.5 md:mt-2 lg:mt-3 xl:mt-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[18px] h-[18px] md:w-[22px] md:h-[22px] lg:w-[24px] lg:h-[24px] xl:w-[28px] xl:h-[28px] flex justify-center items-center group hover:bg-black bg-white rounded-full border-[0.8px] md:border-[1px] border-black/20 transition-all duration-300 ease-linear"
            >
              <img
                src={TwitterIcon}
                alt="Twitter"
                className="h-[7px] md:h-[9px] lg:h-[10px] xl:h-[12px] group-hover:invert group-hover:brightness-200 transition-all duration-300 ease-linear"
              />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[18px] h-[18px] md:w-[22px] md:h-[22px] lg:w-[24px] lg:h-[24px] xl:w-[28px] xl:h-[28px] flex justify-center items-center group hover:bg-black bg-white rounded-full border-[0.8px] md:border-[1px] border-black/20 transition-all duration-300 ease-linear"
            >
              <img
                src={FacebookIcon}
                alt="Facebook"
                className="h-[8px] md:h-[10px] lg:h-[11px] xl:h-[13px] group-hover:invert group-hover:brightness-200 transition-all duration-300 ease-linear"
              />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[18px] h-[18px] md:w-[22px] md:h-[22px] lg:w-[24px] lg:h-[24px] xl:w-[28px] xl:h-[28px] flex justify-center items-center group hover:bg-black bg-white rounded-full border-[0.8px] md:border-[1px] border-black/20 transition-all duration-300 ease-linear"
            >
              <img
                src={InstagramIcon}
                alt="Instagram"
                className="h-[9px] md:h-[11px] lg:h-[12px] xl:h-[14px] group-hover:invert group-hover:brightness-200 transition-all duration-300 ease-linear"
              />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[18px] h-[18px] md:w-[22px] md:h-[22px] lg:w-[24px] lg:h-[24px] xl:w-[28px] xl:h-[28px] flex justify-center items-center group hover:bg-black bg-white rounded-full border-[0.8px] md:border-[1px] border-black/20 transition-all duration-300 ease-linear"
            >
              <img
                src={GithubIcon}
                alt="GitHub"
                className="h-[10px] md:h-[10px] lg:h-[11.5px] xl:h-[13.5px] group-hover:invert group-hover:brightness-200 transition-all duration-300 ease-linear"
              />
            </a>
          </div>
        </div>

        {/* Links Section */}
        <div className="w-full mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-5 md:gap-y-0">
          <div className="">
            <h3 className="text-black font-medium text-[12px] md:text-[13px] lg:text-[14px] xl:text-[16px]">
              COMPANY
            </h3>
            <ul className="text-[12px] md:text-[13px] lg:text-[14px] xl:text-[16px] text-black/60 space-y-1 md:space-y-2 lg:space-y-2 xl:space-y-3 mt-1.5 md:mt-2 lg:mt-3 xl:mt-4">
              <li>About</li>
              <li>Features</li>
              <li>Works</li>
              <li>Career</li>
            </ul>
          </div>

          <div className="">
            <h3 className="text-black font-medium text-[12px] md:text-[13px] lg:text-[14px] xl:text-[16px]">
              HELP
            </h3>
            <ul className="text-[12px] md:text-[13px] lg:text-[14px] xl:text-[16px] text-black/60 space-y-1 md:space-y-2 lg:space-y-2 xl:space-y-3 mt-1.5 md:mt-2 lg:mt-3 xl:mt-4">
              <li>Customer Support</li>
              <li>Delivery Details</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div className="">
            <h3 className="text-black font-medium text-[12px] md:text-[13px] lg:text-[14px] xl:text-[16px]">
              FAQ
            </h3>
            <ul className="text-[12px] md:text-[13px] lg:text-[14px] xl:text-[16px] text-black/60 space-y-1 md:space-y-2 lg:space-y-2 xl:space-y-3 mt-1.5 md:mt-2 lg:mt-3 xl:mt-4">
              <li>Account</li>
              <li>Manage Deliveries</li>
              <li>Orders</li>
              <li>Payments</li>
            </ul>
          </div>

          <div className="">
            <h3 className="text-black font-medium text-[12px] md:text-[13px] lg:text-[14px] xl:text-[16px]">
              RESOURCES
            </h3>
            <ul className="text-[12px] md:text-[13px] lg:text-[14px] xl:text-[16px] text-black/60 space-y-1 md:space-y-2 lg:space-y-2 xl:space-y-3 mt-1.5 md:mt-2 lg:mt-3 xl:mt-4">
              <li>Free eBooks</li>
              <li>Development Tutorial</li>
              <li>How to - Blog</li>
              <li>YouTube Playlist</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="xl:mx-12 mt-3.5 md:mt-4 lg:mt-6 xl:mt-8 border-t border-black/10 pt-1.5 md:pt-2 lg:pt-3 xl:pt-5 text-start text-black/60 text-[10px] md:text-[11px] lg:text-[12px] xl:text-[14px]">
        © 2000-2023, All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
