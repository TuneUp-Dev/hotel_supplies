import { useState } from "react";
import Arrow from "../../assets/arrow_down.svg";

const faqs = [
  {
    question: "What types of products do you offer?",
    answer:
      "We offer a wide range of products including electronics, apparel, and home essentials.",
  },
  {
    question: "Who can purchase from your website?",
    answer:
      "Our website is open to everyone, including individuals and businesses worldwide.",
  },
  {
    question: "Do you offer customization options?",
    answer:
      "Yes, we provide customization on select products. Contact our support team for details.",
  },
  {
    question: "How can I place an order?",
    answer:
      "Simply add your desired products to the cart and proceed to checkout.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship internationally. Shipping costs and delivery times vary based on location.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery typically takes 5-7 business days, depending on your location and chosen shipping method.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <div className="w-full xl:max-w-[1440px] mx-auto mt-5 md:mt-9 lg:mt-10 xl:mt-12">
        <h1 className="text-center text-[25px] md:text-[32px] lg:text-[46px] xl:text-[56px] font-extrabold leading-7 md:leading-none">
          Frequently asked questions
        </h1>

        <div className="px-6 md:px-12 lg:px-20 mt-4 md:mt-8 lg:mt-12 xl:mt-16">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border-t-[1px] hover:bg-gray-50 group border-[#E2E8F0] ${
                openIndex === index ? "bg-gray-50" : ""
              }`}
            >
              <button
                className="w-full flex justify-between items-center py-4 md:py-3.5 lg:py-5 text-left roboto text-[14px] md:text-[18px] lg:text-[22px] xl:text-[24px] font-[370] focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <img
                  src={Arrow}
                  alt=""
                  className={`transition-transform duration-300 w-[16px] md:w-[18px] lg:w-[21px] xl:w-[24px] ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 bg-white ${
                  openIndex === index
                    ? "max-h-40 opacity-100 py-4 md:py-3 lg:py-5"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="roboto text-[11px] md:text-[14px] lg:text-[15px] xl:text-[16px] font-[370] text-gray-500">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQ;
