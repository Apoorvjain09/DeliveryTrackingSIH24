"use client";
import React, { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Chatbot from "@/components/Chatbox";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen); // Toggle the chatbot visibility
  };

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}

          {!isChatOpen && (
            <div className="fixed bottom-4 right-4 z-50">
              <img
                src="/chatgpticon.png"
                alt="ChatGPT Logo"
                className="w-[9rem] h-[7rem] cursor-pointer animate-pulse"
                onClick={toggleChat}
              />
            </div>
          )}

          {isChatOpen && <Chatbot setIsChatOpen={setIsChatOpen} />}
        </body>
      </html>
    </ClerkProvider>
  );
}
