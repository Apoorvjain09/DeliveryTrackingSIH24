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
                    <h3 className="text-2xl font-semibold mb-4">Optimal Delivery Times</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Location</TableHead>
                                <TableHead>Optimal Delivery Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(optimalDeliveryTimes).map(([location, time]) => (
                                <TableRow key={location}>
                                    <TableCell>{location}</TableCell>
                                    <TableCell>{convertMinutesToAmPm(time as number)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
                    <button
                        onClick={handleAddressSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Send Address
                    </button>

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
