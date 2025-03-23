import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Category from "../pages/Category";
import Product from "../pages/Product";
import Dashboard from "../admin/Dashboard";

const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/:category/:subcategory/:subtopic/:productName"
          element={<Product />}
        />
        <Route path="/:category/" element={<Category />} />
        <Route path="/:category/:subcategory" element={<Category />} />
        <Route
          path="/:category/:subcategory/:subtopic"
          element={<Category />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
};

export default Router;
