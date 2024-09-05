/**
 * v0 by Vercel.
 * @see https://v0.dev/t/4L1WBMq9aDo
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

"use client"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { ResponsiveBar } from "@nivo/bar"
import { ResponsiveLine } from "@nivo/line"
import { UserButton, UserProfile } from "@clerk/nextjs"
import { useEffect, useState } from "react"

interface Order {
    orderId: string;
    productName: string;
    location: string;
    deliveryTime: string;
}

export default function Component() {
    const deliveryData = [
        { city: "Anytown", optimalDeliveryTime: "2-3 days" },
        { city: "Somewhere", optimalDeliveryTime: "1-2 days" },
        { city: "Somewhere Else", optimalDeliveryTime: "2-3 days" },
        { city: "Metropolis", optimalDeliveryTime: "1 day" },
        { city: "Smallville", optimalDeliveryTime: "3 days" },
    ]
    const [orders, setOrders] = useState<Order[]>([]); // Use the Order interface for type safety

    useEffect(() => {
        // Fetch orders from localStorage
        const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        if (storedOrders.length > 0) {
            setOrders(storedOrders); // Set orders if found
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="bg-background border-b px-4 py-3 sm:px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="#" className="flex items-center gap-2 text-lg font-semibold" prefetch={false}>
                        <img src="https://www.indiapost.gov.in/_layouts/15/images/DOP.Portal.UILayer/Emblem_of_India.svg" className="h-8" alt="Flowbite Logo" />
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
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="pl-8 rounded-lg bg-muted/40 focus:bg-background focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
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
            <main className="flex-1 px-4 py-6 sm:px-6">
                <div className="max-w-4xl mx-auto grid gap-6">
                    <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">Orders</h1>
                            <Button variant="outline" size="sm">
                                <PlusIcon className="w-4 h-4 mr-2" />
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
                                                    <div className="text-muted-foreground text-sm">
                                                        {order.productName}
                                                    </div>
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
                                            <TableCell colSpan={3}>
                                                <div className="text-center text-muted-foreground">Loading Orders!</div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <div className="bg-background rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Optimal Delivery Time</h2>
                            <div className="flex items-center gap-2">
                                <ClockIcon className="w-5 h-5 text-muted-foreground" />
                                <span className="text-2xl font-bold">1-2 days</span>
                            </div>
                        </div>
                        <p className="text-muted-foreground mt-2">
                            Based on the current orders, the optimal delivery time is 1-2 days.
                        </p>
                        <div className="mt-6">
                            <BarChart className="w-full aspect-[4/3]" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}


function BarChart(props: any) {
    return (
        <div {...props}>
            <ResponsiveBar
                data={[
                    { name: "Jan", count: 111 },
                    { name: "Feb", count: 157 },
                    { name: "Mar", count: 129 },
                    { name: "Apr", count: 150 },
                    { name: "May", count: 119 },
                    { name: "Jun", count: 72 },
                ]}
                keys={["count"]}
                indexBy="name"
                margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
                padding={0.3}
                colors={["#2563eb"]}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 16,
                }}
                axisLeft={{
                    tickSize: 0,
                    tickValues: 4,
                    tickPadding: 16,
                }}
                gridYValues={4}
                theme={{
                    tooltip: {
                        chip: {
                            borderRadius: "9999px",
                        },
                        container: {
                            fontSize: "12px",
                            textTransform: "capitalize",
                            borderRadius: "6px",
                        },
                    },
                    grid: {
                        line: {
                            stroke: "#f3f4f6",
                        },
                    },
                }}
                tooltipLabel={({ id }) => `${id}`}
                enableLabel={false}
                role="application"
                ariaLabel="A bar chart showing data"
            />
        </div>
    )
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}

function LineChart(props: any) {
    return (
        <div {...props}>
            <ResponsiveLine
                data={[
                    {
                        id: "Desktop",
                        data: [
                            { x: "Jan", y: 43 },
                            { x: "Feb", y: 137 },
                            { x: "Mar", y: 61 },
                            { x: "Apr", y: 145 },
                            { x: "May", y: 26 },
                            { x: "Jun", y: 154 },
                        ],
                    },
                    {
                        id: "Mobile",
                        data: [
                            { x: "Jan", y: 60 },
                            { x: "Feb", y: 48 },
                            { x: "Mar", y: 177 },
                            { x: "Apr", y: 78 },
                            { x: "May", y: 96 },
                            { x: "Jun", y: 204 },
                        ],
                    },
                ]}
                margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
                xScale={{
                    type: "point",
                }}
                yScale={{
                    type: "linear",
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 16,
                }}
                axisLeft={{
                    tickSize: 0,
                    tickValues: 5,
                    tickPadding: 16,
                }}
                colors={["#2563eb", "#e11d48"]}
                pointSize={6}
                useMesh={true}
                gridYValues={6}
                theme={{
                    tooltip: {
                        chip: {
                            borderRadius: "9999px",
                        },
                        container: {
                            fontSize: "12px",
                            textTransform: "capitalize",
                            borderRadius: "6px",
                        },
                    },
                    grid: {
                        line: {
                            stroke: "#f3f4f6",
                        },
                    },
                }}
                role="application"
            />
        </div>
    )
}


function Package2Icon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
            <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
            <path d="M12 3v6" />
        </svg>
    )
}


function PlusIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}


function SearchIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}