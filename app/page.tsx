"use client"
import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HeroReact() {
  const [title, setTitle] = useState("Time Slot Selection");
  const [showMenu, setShowMenu] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const toggleClass = () => {
    setIsNavOpen(!isNavOpen);
    const closeAfterClick = document.querySelector("#nav-icon4");
    closeAfterClick?.classList?.toggle("open");
  };

  const [orderId, setOrderId] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderId(e.target.value);
  };

  const handleSearchClick = () => {
    if (orderId.trim() !== '') {
      // Construct the new URL with the order ID
      const newPath = `/orders/${orderId}`;
      window.location.href = newPath;
    }
  };

  return (
    <>
      <div>
        <Navbar />
        {/* <div className="bg-black/60 h-full w-full absolute"></div> */}
        <div className="min-h-[calc(100vh-69px)] sm:min-h-[calc(100vh-63px)] flex items-center justify-start px-1 z-10 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/Hero.jpg')" }}>
          <Card className="w-full max-w-md p-6 z-[100] sm:ml-[4rem]">
            <CardHeader className="flex justify-between border-b pb-4">
              <div className="flex items-center space-x-4">
                <Button variant="link" className="text-black font-bold border-b-2 border-red-500">
                  Track order
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold mt-4">Track your order through</h2>
              </div>
              <div className="flex justify-between space-x-2">
                <Button variant="outline" className="flex-1">
                  Mobile
                </Button>
                <Button variant="outline" className="flex-1">
                  IP Address
                </Button>
                <Button variant="outline" className="flex-1 bg-black text-white">
                  Order Id
                </Button>
                <Button variant="outline" className="hidden sm:flex flex-1">
                  LRN
                </Button>
              </div>
              <div>
                <Input type="text" onChange={handleInputChange} value={orderId} placeholder="Enter your Order Id" className="w-full" />
              </div>
              <div className="text-center">
                <Button onClick={handleSearchClick} className="w-full bg-black text-white">Track Order</Button>
              </div>
              <div className="text-center text-muted-foreground text-sm">
                Live tracking updates & extra support on our App
              </div>
              <div className="flex justify-center space-x-4">
                <Button variant="link" className="flex items-center space-x-2">
                  <CheckCircle />
                  <span>Terms and conditions Applied</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    </>
  );
};
