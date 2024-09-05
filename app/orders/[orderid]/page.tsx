"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "../../../components/NavBar";
import Notification from "../../../components/Notifacation";
import Footer from "../../../components/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface OrderDetails {
    orderId: string;
    productName: string;
    location: string;
    deliveryTime: string;
}

const OrderPage = () => {
    const pathname = usePathname(); // To extract orderId from the URL
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null); // Initially null
    const [newDeliveryTime, setNewDeliveryTime] = useState<Date | null>(null); // For new time input as a Date object
    const [showNotification, setShowNotification] = useState(false); // Notification state
    const [notificationType, setNotificationType] = useState<"success" | "error">("error"); // Strict typing for notificationType
    const [notificationMessage, setNotificationMessage] = useState("You can modify the delivery time as you were not able to pick up the order on time the previous day.");
    const orderIdFromUrl = pathname.split("/").pop(); // Extract the orderId from the URL

    useEffect(() => {
        // Simulate loading product details
        const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");

        // Assume orders are loaded, show the notification
        if (storedOrders.length > 0) {
            setShowNotification(true); // Show notification when product loads
        }
    }, []);

    useEffect(() => {
        const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");

        if (storedOrders.length === 0) {
            // No products found, add some products to localStorage
            const initialOrders = [
                {
                    orderId: "1234",
                    productName: "Iphone 13 Pro",
                    location: "Rajasthan, pincode-302001 Jaipur",
                    deliveryTime: "10:00",
                },
                {
                    orderId: "5678",
                    productName: "HP Laptop i6",
                    location: "Delhi, pincode-110001 Connaught Place",
                    deliveryTime: "23:00",
                },
            ];

            localStorage.setItem("orders", JSON.stringify(initialOrders));
        }

        // Find matching order by orderId in URL
        const order = storedOrders.find(
            (o: { orderId: string }) => o.orderId === orderIdFromUrl
        );

        if (order) {
            setOrderDetails(order);
        } else {
            console.log("No matching order found");
        }
    }, [orderIdFromUrl]);

    // Handle the submission of the new delivery time
    const handleTimeUpdate = () => {
        if (newDeliveryTime && orderDetails) {
            const updatedOrder = { ...orderDetails, deliveryTime: newDeliveryTime.toLocaleString() }; // Format as string

            // Update localStorage with the new delivery time
            const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
            const updatedOrders = storedOrders.map((order: OrderDetails) =>
                order.orderId === orderDetails.orderId ? updatedOrder : order
            );

            localStorage.setItem("orders", JSON.stringify(updatedOrders));
            setOrderDetails(updatedOrder); // Update state with new delivery time

            // Change notification to success and hide error notification
            setNotificationType("success");
            setNotificationMessage("Order Time and Date Updated Successfully! You will recieve call from out agent before delivery.");
            setShowNotification(true);
        }
    };

    return (
        <>
            <Navbar />
            {showNotification && (
                <Notification type={notificationType} message={notificationMessage} />
            )}

            <div className="p-4 flex flex-row justify-center gap-4 ">
                <div className="w-[50%]">
                    {orderDetails ? (
                        <div className="p-6 rounded-lg border border-black shadow-3xl">
                            <h1 className="text-2xl font-bold mb-4">Order Details</h1>
                            <p className="mb-2">
                                <span className="font-semibold">Product Name:</span>{" "}
                                {orderDetails.productName}
                            </p>
                            <p className="mb-2">
                                <span className="font-semibold">Location:</span>{" "}
                                {orderDetails.location}
                            </p>
                            <p className="mb-4">
                                <span className="font-semibold">Delivery Time:</span>{" "}
                                {orderDetails.deliveryTime}
                            </p>
                        </div>
                    ) : (
                        <p>Loading order details...</p>
                    )}

                    {/* Modify delivery time */}
                    <div className="mt-6 gap-4 flex flex-col">
                        <h2 className="text-xl font-semibold mb-2">Modify Delivery Time for Tomorrow</h2>
                        <DatePicker
                            selected={newDeliveryTime}
                            onChange={(date) => setNewDeliveryTime(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className="w-full p-2 border border-gray-300 rounded-md mb-4"
                            placeholderText="Select date and time"
                        />
                        <button
                            onClick={handleTimeUpdate}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        >
                            Update Delivery Time
                        </button>
                    </div>
                </div>

                <div className="w-[50%] h-full">
                    <img
                        src="https://images.pexels.com/photos/4246109/pexels-photo-4246109.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt=""
                        className="w-[100%] rounded-lg shadow-2xl"
                    />
                </div>
            </div>

            <Footer />
        </>
    );
};

export default OrderPage;
