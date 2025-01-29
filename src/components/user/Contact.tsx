"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Phone, Mail, MapPin } from "lucide-react";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/user/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (!res.ok) {
        throw new Error("Failed to send message");
      }
      toast.success("Successfully sent message");
      // setName("");
      // setEmail("");
      // setSubject("general");
      // setMessage("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message");
    }
  };

  return (
    <section id="contact" className="py-20 bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate__animated animate__fadeIn">
          <span className="text-amber-500 font-medium text-sm uppercase tracking-wider">
            Contact Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">
            Get In Touch
          </h2>
          <p className="text-gray-400 mt-4">
            Have questions? We&apos;re here to help you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8 animate__animated animate__fadeInLeft">
            <div className="bg-neutral-800 p-6 rounded-xl">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-white font-bold">Phone</h3>
                  <p className="text-gray-400">+91 98765 43210</p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-800 p-6 rounded-xl">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-white font-bold">Email</h3>
                  <p className="text-gray-400">info@jaggeryproducts.com</p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-800 p-6 rounded-xl">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-white font-bold">Address</h3>
                  <p className="text-gray-400">
                    123 Natural Way, Healthy City, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-neutral-800 p-8 rounded-xl animate__animated animate__fadeInRight">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-white mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-neutral-700 border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-neutral-700 border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-white mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-neutral-700 border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="general">General Inquiry</option>
                  <option value="support">Product Support</option>
                  <option value="wholesale">Wholesale Query</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-white mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-neutral-700 border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 text-white py-3 rounded-lg hover:bg-amber-600 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
