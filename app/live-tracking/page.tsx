"use client";
import React, { useState } from "react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "400px",
};

const center = {
    lat: 20.5937, // Latitude for India
    lng: 78.9629, // Longitude for India
};

export default function HeroReact() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [orderId, setOrderId] = useState("");

    return (
        <>
            <div>
                <Navbar />
                <div className="min-h-[calc(100vh-69px)] sm:min-h-[calc(100vh-63px)] flex items-center justify-start px-1 z-10 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/Hero.jpg')" }}>
                    <div className="w-full h-96 mt-8">
                        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={center}
                                zoom={5} // Zoom level for India
                            />
                        </LoadScript>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
