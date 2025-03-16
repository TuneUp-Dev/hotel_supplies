import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Tick from "../assets/tick.svg";
import ArrowLeft from "../assets/arrow_left.svg";
import ArrowRight from "../assets/arrow_right3.svg";

interface Testimonial {
  id: number;
  description: string;
  name: string;
  link: string;
  rating: number;
}

// Define the type for the testimonial array
const testimonial: Testimonial[] = [
  {
    id: 1,
    description:
      "“I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.”",
    name: "Sarah M.",
    link: "https://medium.com/@ecococoproduct/the-future-of-coir-sustainable-solutions-for-a-greener-planet-92fb9aa8f6ef",
    rating: 5,
  },
  {
    id: 2,
    description:
      "“Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.”",
    name: "Alex K.",
    link: "https://medium.com/@ecococoproduct/eco-friendly-farming-the-role-of-coir-pith-in-agriculture-ae496a2f3473",
    rating: 5,
  },
  {
    id: 3,
    description:
      "“As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.”",
    name: "Jerome Bell",
    link: "https://medium.com/@ecococoproduct/coir-based-products-a-step-towards-sustainability-d32ad32d3f3a",
    rating: 5,
  },
  {
    id: 4,
    description:
      "“Shop.co has become my go-to for all my fashion needs. The quality and variety are unmatched, and I always receive compliments on my outfits.”",
    name: "Emily R.",
    link: "#",
    rating: 5,
  },
  {
    id: 5,
    description:
      "“I love how Shop.co offers such a wide range of styles. Whether I need something casual or formal, I can always find it here.”",
    name: "Michael T.",
    link: "#",
    rating: 5,
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<Slider>(null);

  if (10 < 0) {
    console.log(activeIndex);
  }

  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    return <>{"★".repeat(fullStars)}</>;
  };

  // Handle next slide
  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  // Handle previous slide
  const handlePrevious = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  // Settings for react-slick
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    arrows: false,
    variableWidth: true,
    centerMode: true,
    beforeChange: (current: number, next: number) => setActiveIndex(next),
  };

  return (
    <>
      <div
        id="testimonials"
        className="mt-20 text-center relative md:max-w-[90vw] xl:max-w-[1440px] mx-auto"
      >
        <div className="flex justify-between items-center lg:px-0 xl:px-24">
          <p className="integral font-extrabold lg:text-[36px] xl:text-[48px] md:text-[36px] text-black text-start">
            OUR HAPPY CUSTOMERS
          </p>

          {/* Arrow Buttons */}
          <div className="flex justify-end items-center gap-x-2.5">
            <button onClick={handlePrevious}>
              <img
                className="lg:w-[20px] xl:w-[24px]"
                src={ArrowLeft}
                alt="Previous"
              />
            </button>
            <button onClick={handleNext}>
              <img
                className="lg:w-[20px] xl:w-[24px]"
                src={ArrowRight}
                alt="Next"
              />
            </button>
          </div>
        </div>

        {/* Shadow Wrapper */}
        <div className="relative lg:-mt-4 xl:mt-1">
          {/* Left Faded Blur */}
          <div className="absolute inset-y-0 left-0 w-20 max-w-20 bg-gradient-to-r from-white/20 to-transparent backdrop-blur-[1px] z-50 pointer-events-none"></div>

          {/* Slider Container */}
          <div className="mx-auto w-full py-4 z-40 relative">
            <Slider ref={sliderRef} {...settings}>
              {testimonial.map((testimonial) => {
                return (
                  <div key={testimonial.id} className="py-10 pr-4">
                    <div className="w-[300px] lg:w-[350px] xl:w-[400px] lg:h-[200px] xl:h-[240px] cursor-grab rounded-[20px] flex flex-col justify-start items-start lg:p-4 xl:p-6 border-[1px] border-black/10 text-white hover:shadow-sm hover:scale-[1.005] ml-[5px] snap-center transform transition-all ease-linear duration-100">
                      <div className="w-full flex justify-start items-start">
                        <h1 className="lg:text-[18px] xl:text-[22px] text-[#FFC633]">
                          {renderRating(testimonial.rating)}
                        </h1>
                      </div>
                      <div className="lg:pt-1 xl:pt-1.5">
                        <h1 className="text-start lg:text-[16px] xl:text-[20px] text-black satoshi font-bold flex justify-start items-center gap-x-0.5">
                          {testimonial.name}
                          <img
                            className="lg:w-[20px] xl:w-[24px]"
                            src={Tick}
                            alt=""
                          />
                        </h1>
                        <p className="mt-2 text-[13px] lg:text-[14px] xl:text-[16px] text-black/60 satoshi font-light lg:leading-[20px] xl:leading-[22px] work-sans-light text-start">
                          {testimonial.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>

          {/* Right Faded Blur */}
          <div className="absolute inset-y-0 right-0 w-20 max-w-20 bg-gradient-to-l from-white/20 to-transparent backdrop-blur-[1px] z-50 pointer-events-none"></div>
        </div>
      </div>
    </>
  );
};

export default Testimonials;
