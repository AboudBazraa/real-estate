"use client";
import Listing from "./components/listing";
import MapView from "./components/map-view";
import ChatBot from "./components/chat-bot";
import { Search, Heart, Menu, User } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function PropertiesPage() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Update document class for dark mode
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Handle property selection from map
  const handleSelectProperty = (propertyId) => {
    setSelectedProperty(propertyId);
    console.log(`Selected property: ${propertyId}`);
  };

  return (
    <div className="flex flex-col bg-white min-h-screen w-screen overflow-hidden">
      {/* Header/Navbar */}
      <header className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 mr-8">
              <span className="text-black font-extrabold">O</span>mae
            </h1>
            <div className="relative ml-4">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 w-72">
                <input
                  type="text"
                  placeholder="Search your dream place"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="py-2 px-4 w-full bg-transparent outline-none text-sm text-gray-800"
                />
                <button className="bg-gray-900 text-white rounded-r-lg p-2 h-full">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            <a
              href="#"
              className="text-gray-700 hover:text-black text-sm font-medium"
            >
              Rent
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-black text-sm font-medium"
            >
              Buy
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-black text-sm font-medium"
            >
              Sell
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-black text-sm font-medium"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-black text-sm font-medium"
            >
              Contact
            </a>
            <button className="ml-2 px-4 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 text-sm font-medium">
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Main content area with listing and map */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 h-screen overflow-auto border-r border-gray-100">
          <Listing
            selectedProperty={selectedProperty}
            onSelectProperty={handleSelectProperty}
            searchQuery={searchQuery}
          />
        </div>
        <div className="hidden md:block w-1/2 h-screen">
          <MapView onSelectProperty={handleSelectProperty} darkMode={false} />
        </div>
      </main>

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatBot selectedProperty={selectedProperty} />
      </div>
    </div>
  );
}
