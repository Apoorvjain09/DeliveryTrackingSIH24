"use client";

import { useState } from "react";

export function Form() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [complaint, setComplaint] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [open, setopen] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setopen(!open)
    e.preventDefault();
    if (!name) {
      setError("Name is required");
      return;
    }
    if (!email || !isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!mobile || mobile.length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }
    if (!orderId) {
      setError("Order ID is required");
      return;
    }
    if (!complaint || complaint.length < 10) {
      setError("Complaint must be at least 10 characters long");
      return;
    }

    // Create an object with the form data
    const formData = { name, email, mobile, orderId, complaint };

    // Store form data in localStorage
    const existingData = localStorage.getItem("formData");
    let newData = [];
    if (existingData) {
      newData = JSON.parse(existingData); // Parse existing data if any
    }
    newData.push(formData); // Add the new form data
    localStorage.setItem("formData", JSON.stringify(newData)); // Save the updated array in localStorage

    // Show success message and clear form
    setSuccess(true);
    setName("");
    setEmail("");
    setMobile("");
    setOrderId("");
    setComplaint("");
  };

  const isValidEmail = (email: string) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 my-10 px-4 md:px-0">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        {!open && (
          <div className="mb-6">
            <h1 className="text-2xl mb-2 font-bold text-gray-800 border-b-2 border-gray-400 pb-2">
              Submit your<span className="text-red-600"> Feedback</span>
            </h1>
            <p className="text-gray-600">
              We're here to help resolve your issue. Please fill out the form below.
            </p>
          </div>
        )}
        {success ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-green-500">Thank you!</h2>
            <p>We have received your complaint and will look into it as soon as possible.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="mobile" className="mb-1 block text-sm font-medium text-gray-700">
                Mobile
              </label>
              <input
                type="tel"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="orderId" className="mb-1 block text-sm font-medium text-gray-700">
                Order ID
              </label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="complaint" className="mb-1 block text-sm font-medium text-gray-700">
                Complaint
              </label>
              <textarea
                id="complaint"
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>
            {error && (
              <div className="rounded-md bg-red-100 p-4 text-red-700">
                <p>{error}</p>
              </div>
            )}
            <button
              type="submit"
              className="w-full rounded-md bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Complaint
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
