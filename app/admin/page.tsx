"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import data from "./script/delivery.json";
import { LineChartComponent } from "@/components/component/LineChart";
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
            <main className="border mx-4 rounded-lg shadow-lg my-10 flex-1 px-4 py-6 sm:px-6">
                <div className="max-w-4xl mx-auto grid gap-6">

                    {/* Orders Section */}
                    <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">Orders</h1>
                            <Button variant="outline" size="sm">
                                Create Order
                            </Button>
                        </div>
                        <div className="bg-background rounded-lg shadow overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Address</TableHead>
                                        <TableHead>Delivery Time</TableHead>
                                        <TableHead>Order ID</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.length > 0 ? (
                                        orders.map((order) => (
                                            <TableRow key={order.orderId}>
                                                <TableCell>
                                                    <div className="font-medium">{order.location}</div>
                                                    <div className="text-muted-foreground text-sm">{order.productName}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{order.deliveryTime}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{order.orderId}</div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                                                Loading Orders!
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Optimal Delivery Time Section */}
                    <div className="bg-background rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold">Optimal Delivery Time</h2>
                        <div className="mt-4">
                            {Object.keys(optimalDeliveryTimes).length > 0 ? (
                                <ul className="space-y-2">
                                    {Object.entries(optimalDeliveryTimes).map(([city, timeInMinutes]) => (
                                        <li key={city}>
                                            <strong>{city}:</strong> {convertMinutesToAmPm(timeInMinutes as number)}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No optimal delivery times available yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Visualization Section */}
                    {visualization && (
                        <div className="bg-background rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold">Delivery Visualization</h2>
                            <img src={visualization} alt="Delivery visualization" className="mt-4" />
                        </div>
                    )}

                </div>
            </main>
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Worlds Fastest Delivery Tracking System</h2>

                    <p className="mt-4 text-gray-500 sm:text-xl">
                        a purchase order that allows a customer to request certain products and quantities from a company for delivery. Categories.
                    </p>
                </div>

                <dl className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
                        <dt className="order-last text-lg font-medium text-gray-500">Total Sales</dt>

                        <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">$4.8m</dd>
                    </div>

                    <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
                        <dt className="order-last text-lg font-medium text-gray-500">Official Addons</dt>

                        <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">24</dd>
                    </div>

                    <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
                        <dt className="order-last text-lg font-medium text-gray-500">Total Addons</dt>

                        <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">86</dd>
                    </div>

                    <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
                        <dt className="order-last text-lg font-medium text-gray-500">Page Visits</dt>

                        <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">86k</dd>
                    </div>
                </dl>
            </div>
            <Deliverypage />
        </div>
    );
}
