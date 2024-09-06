import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function Navbar() {
    const { isSignedIn } = useUser();
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <nav className="bg-white  z-[100]">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="https://www.indiapost.gov.in/_layouts/15/images/DOP.Portal.UILayer/Emblem_of_India.svg" className="h-8" alt="Flowbite Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">भारत <span className="text-red-600">डाक</span></span>
                </a>
                <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0  dark:border-gray-700 items-center">
                        <li>
                            <a href="/" className="block py-2 px-3 text-gray-500 rounded hover:text-black" aria-current="page">Home</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-gray-500 rounded hover:text-black ">About</a>
                        </li>
                        <li>
                            <a href="/live-tracking" className="block py-2 px-3 text-gray-500 rounded hover:text-black ">Live Tracking</a>
                        </li>
                        <li>
                            <a href="/complaint" className="block py-2 px-3 text-gray-500 rounded hover:text-black md:p-0">Support</a>
                        </li>
                        <li className="relative">
                            {!isSignedIn ? (
                                <button
                                    onClick={toggleDropdown}
                                    className="text-black bg-white p-2 rounded-lg"
                                >
                                    LogIn
                                </button>
                            ) : (
                                <SignOutButton />
                            )}
                            {/* Dropdown Menu */}
                            {showDropdown && (
                                <div className="absolute z-[100] right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                                    <a
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    >
                                        <SignInButton>Admin Login</SignInButton>
                                    </a>
                                    <a
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    >
                                        <SignInButton>User Login</SignInButton>
                                    </a>
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
