import Hero from "../components/Cart/Hero";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import NewsLetter from "../components/NewsLetter";

const Cart = () => {
  return (
    <>
      <div className="w-full">
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

export default Cart;
