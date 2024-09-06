"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { useUser } from "@clerk/nextjs";  // Clerk.js hook to get user info

const Chatbot = ({ setIsChatOpen }: { setIsChatOpen: (open: boolean) => void }) => {
    const [messages, setMessages] = useState<{ text: string; isBot: boolean, buttons?: string[] }[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // Track the conversation step
    const [buttonSelected, setButtonSelected] = useState(""); // Track the selected button
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const { user } = useUser();  // Use Clerk's useUser hook to access the user info

    // Extract the clerk name (this assumes the user object has a fullName or firstName field)
    const clerkName = user?.fullName || user?.firstName || "Valued Customer";

    // Scroll to bottom whenever new message is added
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Initial greeting with buttons
        const initialMessage = {
            text: `How can I help you today?`,
            isBot: true,
            buttons: ["Order Tracking", "Slot Booking", "Customer Care", "Others"],
        };
        setMessages([initialMessage]);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleButtonClick = (buttonText: string) => {
        // Add the user response to the chat and store the selected button
        setButtonSelected(buttonText); // Store the selected button
        const userMessage = { text: buttonText, isBot: false };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        // Depending on the button clicked, move to the next step
        if (step === 1) {
            setStep(2);
            const botReply = { text: "What is your order ID?", isBot: true };
            setMessages((prevMessages) => [...prevMessages, botReply]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inputMessage.trim() === "") return;

        // Add the user message to the conversation
        const userMessage = { text: inputMessage, isBot: false };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setLoading(true);

        // After order ID is provided, process the request
        if (step === 2) {
            const botReply = {
                text: `Thank you for providing your order ID: ${inputMessage} ${clerkName}.Your item has been shipped in the nearest warehouse. Thank you for contacting us!`,
                isBot: true,
            };
            setMessages((prevMessages) => [...prevMessages, botReply]);
            setStep(3); // Optionally end or continue the conversation
        }

        setInputMessage("");
        setLoading(false);
    };

    return (
        <div className="fixed bottom-4 right-4 w-80 h-[80vh] max-h-[500px] bg-[#F5F6F9] rounded-xl shadow-lg flex flex-col justify-between">
            {/* Chat Title */}
            <div className="bg-black bg-opacity-30 text-white uppercase p-4 flex items-center space-x-4 rounded-t-xl">
                <figure className="w-10 h-10 rounded-full ">
                    <img
                        src="https://www.indiapost.gov.in/_layouts/15/images/DOP.Portal.UILayer/Emblem_of_India.svg"
                        alt="Bot Avatar"
                        className="w-full h-full "
                    />
                </figure>
                <div>
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">भारत <span className="text-red-600">डाक</span></span>
                    <h2 className="text-sm text-[#4F46E5] font-bold">Online</h2>
                </div>
                <X className="absolute right-2 top-2 cursor-pointer" onClick={() => setIsChatOpen(false)} />
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`p-2 rounded-lg text-black mb-4 max-w-xs ${msg.isBot
                        ? "bg-black bg-opacity-30"
                        : "bg-gradient-to-r from-green-500 to-teal-600 self-end text-right"
                        }`}>
                        {msg.text}
                        {/* Render buttons if they exist */}
                        {msg.buttons && (
                            <div className="mt-4 space-y-2">
                                {msg.buttons.map((buttonText, idx) => (
                                    <button
                                        key={idx}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                        onClick={() => handleButtonClick(buttonText)}
                                    >
                                        {buttonText}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="flex items-center space-x-2 text-white">
                        <figure className="w-6 h-6 rounded-full overflow-hidden border border-white">
                            <img
                                src="https://www.pikpng.com/pngl/b/109-1099794_ios-emoji-emoji-iphone-ios-heart-hearts-spin.png"
                                alt="Loading Avatar"
                                className="w-full h-full object-cover"
                            />
                        </figure>
                        <div className="flex space-x-2">
                            <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
                            <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
                            <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {step === 2 && (
                <div className="bg-black bg-opacity-30 p-4 rounded-b-xl">
                    <form onSubmit={handleSubmit} className="flex space-x-2">
                        <textarea
                            className="flex-1 p-1 rounded-lg border-none text-black placeholder-white focus:ring-0 resize-none"
                            placeholder="Type your order ID..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
