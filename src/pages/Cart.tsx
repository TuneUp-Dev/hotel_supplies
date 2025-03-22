import Hero from "../components/Cart/Hero";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import NavbarCart from "../components/NavbarCart";
import NewsLetter from "../components/NewsLetter";

const Cart = () => {
  return (
    <>
      <div className="w-full">
        <div className="w-full px-6 md:px-8 lg:px-14 xl:px-24 hidden md:block">
          <NavbarCart />
        </div>
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
