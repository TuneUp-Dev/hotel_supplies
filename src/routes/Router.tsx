import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import UseAnalytics from "../pages/UseAnalytics";
import Cart from "../pages/Cart";
import Category from "../pages/Category";
import ProductDetails from "../pages/ProductDetails";

const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/:category/:subcategory/:subtopic/:productName"
          element={<ProductDetails />}
        />
        <Route path="/:category/" element={<Category />} />
        <Route path="/:category/:subcategory" element={<Category />} />
        <Route
          path="/:category/:subcategory/:subtopic"
          element={<Category />}
        />
        <Route path="/dashboard" element={<UseAnalytics />} />
      </Routes>
    </>
  );
};

export default Router;
