import React, { useState, useEffect } from "react";
import { Alert } from "@heroui/react";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState({
    message: "",
    visible: false,
    type: "success",
  });

  useEffect(() => {
    const authStatus = sessionStorage.getItem("auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    const userName = "admin";
    const userPassword = "admin";

    if (username === userName && password === userPassword) {
      sessionStorage.setItem("auth", "true");
      setIsAuthenticated(true);
      setNotification({
        message: "Login successful!",
        visible: true,
        type: "success",
      });
      setTimeout(
        () => setNotification({ message: "", visible: false, type: "success" }),
        3000
      );
    } else {
      setNotification({
        message: "Invalid username or password",
        visible: true,
        type: "danger",
      });
      setTimeout(
        () => setNotification({ message: "", visible: false, type: "success" }),
        3000
      );
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("auth");
    setIsAuthenticated(false);
    setNotification({
      message: "Logout successful!",
      visible: true,
      type: "success",
    });
    setTimeout(
      () => setNotification({ message: "", visible: false, type: "success" }),
      3000
    );
  };

  return (
    <>
      {notification.visible && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            color={
              notification.message.includes("Error")
                ? "danger"
                : notification.message.includes("Failed")
                ? "danger"
                : notification.message === "Login successful!"
                ? "success"
                : "warning"
            }
            title={notification.message}
            onClose={() =>
              setNotification({
                message: "",
                visible: false,
                type: "success",
              })
            }
          />
        </div>
      )}

      <div className="w-full flex flex-col justify-center items-center min-h-screen bg-gray-50">
        {!isAuthenticated ? (
          <div className="flex flex-col items-center p-8 border rounded-lg shadow-lg w-96 bg-white">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-3 mb-6 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleLogin}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg w-full hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>
          </div>
        ) : (
          <>
            <div className="w-full flex justify-end p-6">
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
              >
                Logout
              </button>
            </div>
            <ProductForm />
            <ProductList />
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
