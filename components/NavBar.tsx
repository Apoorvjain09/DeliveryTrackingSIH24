import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
    const { isSignedIn } = useUser();
    return (
        <nav className="bg-white dark:bg-gray-900/70 z-[100]">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="https://www.indiapost.gov.in/_layouts/15/images/DOP.Portal.UILayer/Emblem_of_India.svg" className="h-8" alt="Flowbite Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">Team Elite</span>
                </a>
                <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0  dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 items-center">
                        <li>
                            <a href="#" className="block py-2 px-3 text-gray-500 rounded hover:text-black" aria-current="page">Home</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-gray-500 rounded hover:text-black ">About</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-gray-500 rounded hover:text-black ">Live Tracking</a>
                        </li>
                        <li>
                            <a href="/Complaint" className="block py-2 px-3 text-gray-500 rounded hover:text-black md:p-0">Complaint</a>
                        </li>
                        <li className="text-black bg-white p-2 rounded-lg">
                            {isSignedIn ? <SignOutButton /> : <SignInButton />}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    )
}