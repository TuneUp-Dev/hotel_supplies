import React, { useEffect, useState } from "react";
import { Breadcrumbs, BreadcrumbItem, Button, Spinner } from "@heroui/react";
import { Alert } from "@heroui/alert";
import { Popconfirm } from "antd";
import Arrow from "../../assets/cart_arrow_right.svg";
import CartIcon from "../../assets/cart.svg";
import Delete from "../../assets/delete.svg";
import Minus from "../../assets/minus.svg";
import Plus from "../../assets/plus.svg";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  color: string;
  size: string;
  quantity: number;
  category: string;
  subcategory: string;
  subtopic: string;
  productName: string;
}

const Cart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    visible: boolean;
  }>({ message: "", visible: false });
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve cart items from localStorage
    const storedCartItems = JSON.parse(
      localStorage.getItem("cartItems") || "[]"
    ) as CartItem[];
    setCartItems(storedCartItems);

    // Log cart items with their IDs
    console.log("Cart Items on Load:", storedCartItems);
    console.log(
      "Cart Item IDs:",
      storedCartItems.map((item) => item.id)
    );
  }, []);

  const handleRemoveItem = (index: number) => {
    // Show deletion in progress notification
    setNotification({ message: "Deleting item...", visible: true });

    try {
      // Simulating an error scenario
      if (Math.random() < 0.2) {
        throw new Error("Failed to delete item. Please try again.");
      }

      // Proceed with deletion
      const updatedCartItems = [...cartItems];
      updatedCartItems.splice(index, 1);
      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

      // Update notification to show deletion completed
      setNotification({ message: "Item deleted successfully!", visible: true });

      // Hide the notification after 3 seconds
      setTimeout(() => {
        setNotification({ message: "", visible: false });
      }, 3000);
    } catch (error) {
      // Display warning notification on error
      setNotification({
        message: "Error: Unable to delete item.",
        visible: true,
      });

      setTimeout(() => {
        setNotification({ message: "", visible: false });
      }, 3000);
    }
  };

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch("http://localhost:5003/send-enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          contactNumber,
          message,
          cartItems,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.message || "Failed to send enquiry.");
      }

      // Clear the form fields
      setName("");
      setEmail("");
      setContactNumber("");
      setMessage("");

      // Set success state to true and reset after 5 seconds
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Error sending enquiry:", error);
      alert("Failed to send enquiry. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    // Retrieve stored input values from sessionStorage
    setName(sessionStorage.getItem("name") || "");
    setEmail(sessionStorage.getItem("email") || "");
    setContactNumber(sessionStorage.getItem("contactNumber") || "");
    setMessage(sessionStorage.getItem("message") || "");
  }, []);

  const handleInputChange = (key: string, value: string) => {
    sessionStorage.setItem(key, value);
  };

  // Function to handle product navigation
  const handleProductNavigation = async (item: CartItem) => {
    const { category, subcategory, subtopic, productName } = item;

    // Construct the URL using category, subcategory, subtopic, and productName
    const url = `/${category}/${subcategory}/${subtopic}/${productName}`;
    console.log("Navigating to:", url);

    // Navigate to the product page
    navigate(url);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulating data fetch from DB
        const storedCartItems = JSON.parse(
          localStorage.getItem("cartItems") || "[]"
        ) as CartItem[];
        setCartItems(storedCartItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="absolute z-50 top-0 left-0 w-screen h-screen bg-white flex justify-center items-center">
          <Spinner color="default" size="lg" className="brightness-0" />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Notification Alert */}
      {notification.visible && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            color={
              notification.message.includes("Error")
                ? "warning"
                : notification.message === "Item deleted successfully!"
                ? "success"
                : "default"
            }
            title={notification.message}
            onClose={() => setNotification({ message: "", visible: false })}
          />
        </div>
      )}

      <div className="w-full px-6 md:px-8 lg:px-14 xl:px-24 pt-6 pb-6 md:pb-10 md:pt-0 Satoshi">
        <Breadcrumbs size={"sm"} className="my-6">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/cart">Cart</BreadcrumbItem>
        </Breadcrumbs>
        <div className="w-full flex flex-col lg:flex-row gap-x-10 gap-y-4">
          {/* Main Items Section */}
          <div className="flex-1">
            <h2 className="text-[40px] agbalumo font-normal mb-4 md:mb-6 -mt-4 md:mt-0">
              Your cart
            </h2>
            <div className="">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="relative flex items-start justify-between py-5"
                >
                  {/* Product Image */}
                  <div
                    className="w-[100px] h-[100px] md:w-[125px] md:h-[125px] bg-[#F3F3F3] rounded-[9px] flex items-center justify-center cursor-pointer"
                    onClick={() => handleProductNavigation(item)}
                  >
                    <img
                      src={item.imageUrl || CartIcon}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 px-4 satoshi">
                    <h3
                      className="text-[16px] md:text-[20px] lg:text-[18px] xl:text-[20px] font-bold cursor-pointer"
                      onClick={() => handleProductNavigation(item)}
                    >
                      {item.name}
                    </h3>
                    <p className="text-[12px] md:text-[14px] lg:text-[12px] xl:text-[14px] text-black/60">
                      <b className="font-normal text-black">Size:</b>{" "}
                      {item.size}
                    </p>
                    <p className="text-[12px] md:text-[14px] lg:text-[12px] xl:text-[14px] text-black/60">
                      <b className="font-normal text-black">Color:</b>{" "}
                      {item.color}
                      <span
                        className="mt-2 w-[40px] h-[40px] sm:w-[25px] sm:h-[25px] md:w-[30px] md:h-[30px] lg:w-[37px] lg:h-[37px] rounded-[4px] flex justify-center items-center"
                        style={{ backgroundColor: item.color }}
                      ></span>
                    </p>
                  </div>

                  <div className="h-[125px] flex flex-col justify-between items-end">
                    {/* Delete Button with Popconfirm */}
                    <Popconfirm
                      title="Are you sure you want to delete this item?"
                      onConfirm={() => handleRemoveItem(index)}
                      okText="Yes"
                      cancelText="No"
                      placement="topRight"
                    >
                      <button>
                        <img
                          className="w-[20px] xl:w-[24px]"
                          src={Delete}
                          alt=""
                        />
                      </button>
                    </Popconfirm>

                    {/* Quantity Selector */}
                    <div className="flex items-center bg-[#F0F0F0] w-[100px] sm:w-auto px-4 sm:px-[20px] py-[10px] xl:py-[12px] rounded-[62px] gap-1 sm:gap-2">
                      <button>
                        <img
                          className="w-[16px] xl:w-[20px]"
                          src={Minus}
                          alt=""
                        />
                      </button>
                      <span className="px-2.5 sm:px-3 text-[13px] sm:text-[14px]">
                        {item.quantity}
                      </span>
                      <button>
                        <img
                          className="w-[16px] xl:w-[20px]"
                          src={Plus}
                          alt=""
                        />
                      </button>
                    </div>
                  </div>

                  {/* Line Divider (only if not the last item) */}
                  {index < cartItems.length - 1 && (
                    <div className="absolute left-0 bottom-0 w-full h-[1px] bg-black/10"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="w-full lg:w-[400px] xl:w-[500px] h-[450px] border-[1px] border-black/10 bg-white px-[24px] py-[20px] rounded-[20px]">
            <h3 className="text-[24px] satoshi font-bold">Send Enquiry</h3>
            <form className="space-y-5 mt-6" onSubmit={handleSubmitEnquiry}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  handleInputChange("name", e.target.value);
                }}
                className="w-full h-[50px] px-5 rounded-[62px] text-black/50 satoshi font-normal bg-[#F0F0F0] focus:outline-none outline-none focus:ring-0 ring-0"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleInputChange("email", e.target.value);
                }}
                className="w-full h-[50px] px-5 rounded-[62px] text-black/50 satoshi font-normal bg-[#F0F0F0] focus:outline-none outline-none focus:ring-0 ring-0"
                required
              />
              <input
                type="text"
                placeholder="Contact Number"
                value={contactNumber}
                onChange={(e) => {
                  setContactNumber(e.target.value);
                  handleInputChange("contactNumber", e.target.value);
                }}
                className="w-full h-[50px] px-5 rounded-[62px] text-black/50 satoshi font-normal bg-[#F0F0F0] focus:outline-none outline-none focus:ring-0 ring-0"
                required
              />
              <input
                placeholder="Message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleInputChange("message", e.target.value);
                }}
                className="w-full h-[50px] px-5 rounded-[62px] text-black/50 satoshi font-normal bg-[#F0F0F0] focus:outline-none outline-none focus:ring-0 ring-0"
                required
              ></input>
              <Button
                type="submit"
                className="w-full h-[60px] p-4 bg-black satoshi text-[16px] text-white rounded-[62px] flex items-center justify-center gap-2"
                disabled={isSending}
              >
                {isSending ? (
                  "Sending Enquiry..."
                ) : isSuccess ? (
                  "Send Successfully!"
                ) : (
                  <>
                    Send Enquiry{" "}
                    <span>
                      <img src={Arrow} className="w-[24px]" alt="" />
                    </span>
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
