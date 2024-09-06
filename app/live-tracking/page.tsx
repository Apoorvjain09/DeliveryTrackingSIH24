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
    const [address, setAddress] = useState<string>(""); // Address input for the POST request
    const [nearestLocation, setNearestLocation] = useState<string | null>(null); // Nearest location from API
    const [distance, setDistance] = useState<number | null>(null); // Distance from API
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

    const handleAddressSubmit = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8080/process-data/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ address }),
            });

            if (!response.ok) {
                throw new Error("Failed to send the address.");
            }

            const data = await response.json();
            console.log("Response from server:", data);
            
            // Update state with the nearest location and distance from API response
            setNearestLocation(data.nearest_location.location);
            setDistance(data.nearest_location.distance_km);
        } catch (error) {
            console.error("Error sending address:", error);
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

                {/* Input for address and submit button */}
                <div className="mt-8 flex flex-col items-center mt-36">
                    <input
                        type="text"
                        placeholder="Enter address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="p-2 border border-gray-300 rounded mb-4"
                    />
                    <button
                        onClick={handleAddressSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Send Address
                    </button>

                    {/* Display the nearest location and distance */}
                    {nearestLocation && distance !== null && (
                        <div className="mt-4 p-4 border border-gray-300 rounded">
                            <p>Nearest Location: {nearestLocation}</p>
                            <p>Distance: {distance.toFixed(2)} km</p>
                        </div>
                    )}
                </div>

            </div >
            <Footer />
        </>
    );
};

export default HeroReact;
