"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import data from "./script/delivery.json";
import { Deliverypage } from "@/components/component/deliverypage";
import 'mapbox-gl/dist/mapbox-gl.css';

// Helper function to convert minutes into AM/PM format
function convertMinutesToAmPm(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = mins.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

interface Order {
    orderId: string;
    productName: string;
    location: string;
    deliveryTime: string;
}

export default function Component() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [optimalDeliveryTimes, setOptimalDeliveryTimes] = useState<any>({});
    const [visualization, setVisualization] = useState<string | null>(null);
    const [address, setAddress] = useState<string>(""); // State for address input
    const [nearestLocation, setNearestLocation] = useState<string | null>(null); // Nearest location from API
    const [distance, setDistance] = useState<number | null>(null); // Distance from API
    const [errorMessage, setErrorMessage] = useState<string>(""); // Error message
    const [loading, setLoading] = useState<boolean>(false); // Loading state for button

    // Load orders from local storage
    useEffect(() => {
        const storedOrders: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");
        if (storedOrders.length > 0) {
            setOrders(storedOrders);
        }
    }, []);

    // Fetch optimal delivery times
    const fetchData = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/process-data/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            setOptimalDeliveryTimes(result.optimal_delivery_times || {});
            setVisualization(result.visualization || null);
            console.log(result);
        } catch (error) {
            if (error instanceof Error) {
                console.error("There was a problem with the fetch operation:", error.message);
            } else {
                console.error("There was a problem with the fetch operation:", error);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle address submission
    const handleAddressSubmit = async () => {
        setLoading(true); // Start loading animation
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
            setErrorMessage(""); // Clear any previous errors
        } catch (error) {
            console.error("Error sending address:", error);
            setErrorMessage("An error occurred while processing the address. Please try again.");
        } finally {
            setLoading(false); // Stop loading animation
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="bg-background border-b px-4 py-3 sm:px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                        <img src="https://www.indiapost.gov.in/_layouts/15/images/DOP.Portal.UILayer/Emblem_of_India.svg" className="h-8" alt="Logo" />
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-4">
                        <span className="hover:text-foreground text-black">
                            Admin Dashboard
                        </span>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="pl-8 rounded-lg bg-muted/40 focus:bg-background"
                        />
                    </div>
                    <DropdownMenu>
                        <UserButton />
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">World's Fastest Delivery Tracking System</h2>

                    <p className="mt-4 text-gray-500 sm:text-xl">
                        A purchase order that allows a customer to request certain products and quantities from a company for delivery.
                    </p>
                </div>

                {/* Display Optimal Delivery Times */}
                <div className="mt-8">
                    <h3 className="text-2xl font-semibold mb-6 text-gray-800">Optimal Delivery Times</h3>
                    <div className="overflow-x-auto ">
                        <Table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg ">
                            <TableHeader>
                                <TableRow className="bg-gray-100 border-b border-gray-200">
                                    {/* <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-600">Location</TableHead> */}
                                    {/* <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-600">Optimal Delivery Time</TableHead> */}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(optimalDeliveryTimes).map(([location, time]) => (
                                    <TableRow key={location} className="border-b border-gray-200 hover:bg-gray-50">
                                        <TableCell className="px-4 py-3 text-gray-700 font-medium">{location}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-700">{convertMinutesToAmPm(time as number)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Display Visualization */}
                {visualization && (
                    <div className="mt-8">
                        <h3 className="text-2xl font-semibold mb-4">Delivery Visualization</h3>
                        <img src={visualization} alt="Delivery Data Visualization" className="max-w-full h-auto" />
                    </div>
                )}

                {/* Address Input and Submit */}
                <div className="mt-8 flex flex-col items-center">
                    <input
                        type="text"
                        placeholder="Enter address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="p-2 border border-gray-300 rounded mb-4"
                    />
                    <div className="flex flex-row gap-5 items-center justify-center">
                        <button
                            onClick={() => {
                                window.location.href = "https://www.google.com/maps/dir/?api=1&origin=28.7041,77.1025&destination=28.6139,77.2090&waypoints=28.6898,77.1288|28.6430,77.2177|28.5583,77.1901|28.6296,77.2086|28.5245,77.1855|28.4744,77.0793|28.4595,77.0266|28.4501,77.0293";
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Shortest Route
                        </button>
                        <button
                            onClick={handleAddressSubmit}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Nearest Address
                        </button>
                    </div>
                    {/* Display nearest location and distance */}
                    {nearestLocation && distance !== null && (
                        <div className="mt-4 p-4 border border-gray-300 rounded">
                            <p>Nearest Location: {nearestLocation}</p>
                            <p>Distance: {distance.toFixed(2)} km</p>
                        </div>
                    )}

                    {/* Display error message */}
                    {errorMessage && (
                        <div className="mt-4 p-4 border border-red-300 text-red-600 rounded">
                            {errorMessage}
                        </div>
                    )}
                </div>
            </div>
            <Deliverypage />
        </div>
    );
}
