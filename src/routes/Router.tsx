import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import UseAnalytics from "../pages/UseAnalytics";
import Cart from "../pages/Cart";

const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/Dashboard" element={<UseAnalytics />} />
      </Routes>
    </>
  );
};

export default Router;
