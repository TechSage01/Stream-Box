import React, { useState } from "react";
import { FaTwitter, FaFacebook, FaInstagram, FaTelegram } from "react-icons/fa";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder: You can connect this to your backend or email service
    console.log(formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center mb-12 text-red-600">
          Contact Us
        </h1>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Get in Touch */}
          <div className="bg-black p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-red-500">Get in Touch</h2>
            <p className="text-gray-300 leading-relaxed">
              We'd love to hear from you! If you have any questions, feedback, or need support,
              please don't hesitate to reach out.
            </p>
          </div>

          {/* Contact Info */}
          <div className="bg-black p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-red-500">Contact Information</h2>
            <ul className="space-y-2 text-gray-300">
              <li><strong>Email:</strong> streambox.ng@mbox.ng</li>
              <li><strong>Support:</strong> 24/7 Technical Assistance</li>
              <li><strong>Response Time:</strong> Within 24 hours</li>
            </ul>
          </div>

          {/* FAQs */}
          <div className="bg-black p-6 rounded-xl shadow-lg md:col-span-2">
            <h2 className="text-2xl font-semibold mb-6 text-red-500">Frequently Asked Questions</h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-medium text-white">How do I reset my password?</h3>
                <p>Go to the login page and click "Forgot Password" to reset your password.</p>
              </div>
              <div>
                <h3 className="font-medium text-white">How do I report a bug?</h3>
                <p>Email us with details about the issue you're experiencing.</p>
              </div>
              <div>
                <h3 className="font-medium text-white">How do I suggest a feature?</h3>
                <p>We'd love to hear your ideas! Send us an email with your suggestions.</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-black p-6 rounded-xl shadow-lg md:col-span-2">
            <h2 className="text-2xl font-semibold mb-6 text-red-500">Send Us a Message</h2>
            {submitted && (
              <p className="text-green-400 mb-4">Thank you! Your message has been sent.</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full p-3 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Follow Us */}
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 text-red-500">Follow Us</h2>
            <p className="text-gray-300 mb-4">
              Stay updated with our latest news and updates by following us on social media.
            </p>
            <div className="flex gap-6 text-gray-400">
              <a href="#" className="hover:text-red-500 transition"><FaTwitter size={22} /></a>
              <a href="#" className="hover:text-red-500 transition"><FaFacebook size={22} /></a>
              <a href="#" className="hover:text-red-500 transition"><FaInstagram size={22} /></a>
              <a href="#" className="hover:text-red-500 transition"><FaTelegram size={22} /></a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;