import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowRight from "../../assets/arrow_right2.svg";
import Blog1 from "../../assets/blog1.png";
import Blog2 from "../../assets/blog2.png";
import Blog3 from "../../assets/blog3.png";
import { Button, Link } from "@heroui/react";

const blog = [
  {
    id: 1,
    image: Blog1,
    title:
      "How Wireless Calling Systems Improve Customer Service in Restaurants",
    description:
      "Wireless calling systems in restaurants enhance customer service by allowing guests to request assistance instantly, reducing wait times and improving staff efficiency. This technology ensures a seamless dining experience, leading to higher customer satisfaction and better service management.",
    link: "https://medium.com/@sevenseasiqbal/navigating-global-markets-how-sea-species-trading-companies-expand-worldwide-efd6c9dd6f68",
  },
  {
    id: 2,
    image: Blog2,
    title: "Why Every Hotel & Resort Needs an ERP System for Better Management",
    description:
      "An ERP system streamlines hotel and resort management by integrating operations like bookings, inventory, and customer service into one platform. This enhances efficiency, reduces costs, and improves guest experiences with seamless automation.",
    link: "https://medium.com/@sevenseasiqbal/sustainable-seafood-trade-ensuring-quality-compliance-in-international-markets-36355defd2a5",
  },
  {
    id: 3,
    image: Blog3,
    title: "How to Choose the Right Bed Linen for Hotels & Resorts",
    description:
      "Choosing the right bed linen for hotels and resorts is essential for ensuring guest comfort, durability, and luxury. Factors like fabric quality, thread count, and maintenance ease play a crucial role in creating a premium guest experience.",
    link: "https://medium.com/@sevenseasiqbal/the-future-of-marine-exports-trends-challenges-in-global-seafood-trading-739796cd8b6c",
  },
];

const Blog = () => {
  return (
    <>
      <div
        id="blog"
        className="mt-8 md:mt-10 lg:mt-16 xl:mt-20 text-center relative xl:max-w-[1440px] mx-auto px-4"
      >
        <h1 className="romanesco text-[32px] md:text-[34px] lg:text-[44px] xl:text-[48px] text-[#0F172A] text-center">
          Blogs
        </h1>
        <h1 className="rouge text-[26px] md:text-[30px] lg:text-[40px] xl:text-[48px] text-[#0F172A] text-center -mt-1">
          Hotel Supply Innovations
        </h1>
        <p className="text-[10px] md:text-[12px] lg:text-[16px] xl:text-[20px] satoshi text-black/60 md:w-[650px] lg:w-[950px] xl:w-[1280px] mx-auto text-center lg:mt-4 xl:mt-6">
          From premium linens to advanced air freshening systems, innovative
          hotel supplies elevate guest comfort and operational efficiency.
          Discover the latest trends in hospitality essentials designed to
          enhance luxury, hygiene, and convenience.
        </p>

        <div className="mx-auto w-full md:w-[90vw] lg:w-[980px] xl:w-[1280px] py-4 z-50 relative mt-0 md:mt-1 lg:mt-2 xl:mt-6">
          {/* Slider */}

          <div className="flex flex-col lg:flex-row justify-start lg:justify-between items-start lg:items-start">
            {blog.map((blog) => (
              <div key={blog.id} className="py-3 md:py-4 lg:py-5 lg:px-2">
                <div className="w-full lg:w-[300px] xl:w-[395px] mx-auto rounded-[8px] border-[1px] border-[#0F172A] hover:shadow-lg hover:scale-[1.005] transform transition-all ease-linear duration-300">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-auto max-h-[280px] md:max-h-[320px] object-cover"
                  />
                  <div className="px-3 md:px-4 lg:px-5 xl:px-6 pt-3 md:pt-0.5 lg:pt-3 xl:pt-4 pb-1 md:pb-2 lg:pb-3 xl:pb-4">
                    <h2 className="mt- md:mt-3 text-[16px] md:text-[18px] lg:text-[18px] xl:text-[24px] poltawski font-semibold leading-[20px] md:leading-8 lg:leading-[22px] xl:leading-[23px] text-start text-[#282A3A]">
                      {blog.title}
                    </h2>
                    <p className="mt-2 md:mt-3 lg:mt-2 xl:mt-4 text-[11px] md:text-[13px] lg:text-[13px] xl:text-[16px] barlow font-light leading-[150%] text-start text-[#282A3A]">
                      {blog.description}
                    </p>
                    <div className="flex justify-start md:justify-end items-center">
                      <Link
                        href={blog.link}
                        target="_blank"
                        className="rounded-2xl flex justify-center items-center mt-2 lg:mt-4 xl:mt-6"
                      >
                        <Button className="text-center rounded-2xl px-0 py-0 md:px-4 md:py-2 text-[11px] md:text-[12px] lg:text-[13px] xl:text-[16px] flex items-center gap-x-1 md:gap-x-1.5 lg:gap-x-2 text-[#701A75] bg-white">
                          Read article{" "}
                          <img
                            className="w-[16px] md:w-[18px] lg:w-[20px] xl:w-[24px]"
                            src={ArrowRight}
                            alt=""
                          />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
