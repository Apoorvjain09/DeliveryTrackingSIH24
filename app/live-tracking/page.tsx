"use client";
import React, { useState } from "react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { GoogleMap, DirectionsRenderer, LoadScript } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "500px",
};

const center = {
    lat: 20.5937, // Latitude for India
    lng: 78.9629, // Longitude for India
};

const HeroReact: React.FC = () => {
    const [startLocation, setStartLocation] = useState<string>(""); // Start Location
    const [endLocation, setEndLocation] = useState<string>(""); // End Location
    const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const fetchDirections = async () => {
        if (!startLocation || !endLocation) {
            setErrorMessage("Please enter both start and end locations.");
            return;
        }

        const directionsService = new google.maps.DirectionsService();

        try {
            // Fetch the directions
            directionsService.route(
                {
                    origin: startLocation,
                    destination: endLocation,
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK && result) {
                        setDirectionsResponse(result);
                        setErrorMessage(""); // Clear any previous errors
                    } else {
                        setErrorMessage("Unable to find directions. Please try different locations.");
                    }
                }
            );
        } catch (error) {
            console.error("Error fetching directions:", error);
            setErrorMessage("An error occurred while fetching directions. Please try again.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="sm:min-h-[120vh] flex flex-col items-center justify-start px-1 z-10 bg-cover bg-center bg-no-repeat">
                <div className="w-full h-96 mt-8">
                    <LoadScript
                        googleMapsApiKey="AIzaSyCrCtZQtI7Y-H1wAKWkuxhUg5cIFMr5K04"
                        onError={(error) => console.error("Google Maps API Error: ", error)}
                    >
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={5}
                        >
                            {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
                        </GoogleMap>
                    </LoadScript>
                </div>
                {/* You can add other content here if needed */}
            </div>
            <Footer />
        </>
    );
};

export default HeroReact;
