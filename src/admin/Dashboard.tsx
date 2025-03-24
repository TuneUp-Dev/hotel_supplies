import React, { useState, useEffect } from "react";
import { Alert, Button, Input, Card } from "@heroui/react";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import Logout from "../assets/logout.svg";
import { Link } from "react-router-dom";

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
    if (!username || !password) {
      setNotification({
        message: "Please fill in all fields",
        visible: true,
        type: "warning",
      });
      setTimeout(
        () => setNotification({ message: "", visible: false, type: "success" }),
        3000
      );
      return;
    }

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
                : notification.message === "Logout successful!"
                ? "success"
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

      <div className="w-full flex flex-col justify-center items-center min-h-screen bg-black">
        {!isAuthenticated ? (
          <Card className="w-full max-w-md p-8">
            <div className="flex flex-col items-center">
              <h2 className="text-3xl font-bold text-gray-800">
                Authentication
              </h2>
              <p className="text-[12px] text-black/60 mt-2">
                This authentication is restricted to admins only
              </p>

              <div className="w-full mt-6 space-y-4">
                <Input
                  type="text"
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full"
                />

                <Input
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>

              <Button
                onPress={handleLogin}
                className="w-full py-6 mt-6 font-medium"
              >
                Let's Authenticate
              </Button>

              <div className="mt-6 text-[12px] text-gray-500">
                If you're not an admin?{" "}
                <Link to="/" className="text-primary-500 hover:underline">
                  Go to home page.
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <>
            <div className="bg-white min-w-full min-h-screen">
              <div className="w-full flex justify-end items-end p-6">
                <Button
                  onPress={handleLogout}
                  variant="flat"
                  className="px-6 py-3 bg-black text-white"
                  endContent={<img className="w-4" src={Logout} alt="Logout" />}
                >
                  Logout
                </Button>
              </div>
              <div className="flex flex-col justify-start items-center px-12 pt-4 pb-20 gap-y-16">
                <ProductForm />
                <div className="w-full h-[1px] bg-black/20"></div>
                <ProductList />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
