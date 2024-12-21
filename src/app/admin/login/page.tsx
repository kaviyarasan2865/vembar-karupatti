"use client";
import React, { useState } from "react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit=async(e: React.FormEvent)=>{
    const response=await fetch(`api/admin/login`);
    const data=await response.json();
    console.log(data);
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-amber-100 w-full max-w-md p-10 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-semibold text-center mb-8">Admin Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block mb-2 text-gray-700">Email:</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-gray-700">Password:</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-800 text-white py-2 rounded-full hover:bg-amber-700 transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
