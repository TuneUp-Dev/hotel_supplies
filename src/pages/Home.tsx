import Navbar from "../components/Navbar";
import Hero from "../components/Home/Hero";
import OurProducts from "../components/Home/OurProducts";
import Blog from "../components/Home/Blog";
import Testimonials from "../components/Home/Testimonials";
import FAQ from "../components/Home/FAQ";
import NewsLetter from "../components/NewsLetter";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <div className="w-full">
        <Navbar />
        <Hero />
        <OurProducts />
        <Testimonials />
        <Blog />
        <FAQ />
        <NewsLetter />
        <Footer />
      </div>
    </>
  );
};

export default Home;
