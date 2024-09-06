"use client"
import { Form } from "@/components/component/form";
import Footer from "@/components/Footer";
import Navbar from "@/components/NavBar";

export default function page() {
    return (
        <div className="bg-gray-100">
            <Navbar />
            <div className="bg-gray-100">
                <Form />
            </div>
            <Footer />
        </div>)
}