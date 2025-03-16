import { Button } from "@heroui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import Mail from "../assets/email.svg";

const NewsLetter = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await axios.post(
        "https://hotel-supplies.vercel.app/send-newsletter",
        formData
      );

      console.log(response);
      setStatus("Email sent successfully!");
      setFormData({ email: "" });
    } catch (error) {
      setStatus("Failed to send email. Please try again.");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center w-[80vw] lg:w-[900px] xl:w-[1240px] mx-auto rounded-[53px] lg:mt-16 xl:mt-20 md:mt-24">
        <div className="bg-black lg:w-[900px] xl:w-[1240px] lg:h-[150px] xl:h-[180px] rounded-[20px] lg:px-14 xl:px-16 flex justify-between items-center">
          <h1 className="text-white integral font-black text-[15px] md:text-[30px] lg:text-[30px] xl:text-[40px] w-[450px] xl:w-[550px] leading-[45px]">
            STAY UPTO DATE ABOUT OUR LATEST OFFERS
          </h1>

          <form
            onSubmit={handleSubmit}
            className="lg:w-[260px] xl:w-[350px] flex flex-col justify-between items-center gap-y-3"
          >
            <div className="relative w-full">
              <img
                src={Mail}
                alt=""
                className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full h-[20px] md:h-[30px] lg:h-[46px] satoshi font-normal bg-white md:border-[1px] border-gray-300 text-[9px] md:text-[12px] lg:text-[14px] xl:text-[16px] text-black/40 text-opacity-[34%] pl-12 pr-5 rounded-[34px] outline-none"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-[20px] md:h-[30px] lg:h-[43px] satoshi font-medium bg-white text-black text-[9px] md:text-[12px] lg:text-[14px] xl:text-[16px] rounded-[34px]"
            >
              {status ? status : "Subscribe to Newsletter"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewsLetter;
