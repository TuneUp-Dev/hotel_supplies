import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import OurProducts from "../components/OurProducts";
import Blog from "../components/Blog";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
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
