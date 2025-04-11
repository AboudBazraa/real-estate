"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X } from "lucide-react";

// Define property data type
interface PropertyInfo {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  neighborhood?: string;
}

// Sample properties data
const sampleProperties: PropertyInfo[] = [
  {
    id: "1",
    address: "Modern Villa in Sana'a",
    neighborhood: "Hadda District, Sana'a",
    price: 700000,
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
  },
  {
    id: "2",
    address: "Traditional Yemeni House",
    neighborhood: "Old City, Sana'a",
    price: 1200000,
    bedrooms: 3,
    bathrooms: 2,
    area: 240,
  },
  {
    id: "3",
    address: "Coastal Villa with Sea View",
    neighborhood: "Gold Mohur, Aden",
    price: 1700000,
    bedrooms: 5,
    bathrooms: 4,
    area: 380,
  },
  {
    id: "4",
    address: "Mountain View Apartment",
    neighborhood: "Rawdah District, Sana'a",
    price: 900000,
    bedrooms: 2,
    bathrooms: 1,
    area: 120,
  },
  {
    id: "7",
    address: "Luxury Modern Villa",
    neighborhood: "Ibb City Center",
    price: 2700000,
    bedrooms: 6,
    bathrooms: 5,
    area: 480,
  },
];

interface Message {
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  propertyInfo?: PropertyInfo;
}

interface ChatBotProps {
  selectedProperty?: string;
}

export default function ChatBot({ selectedProperty }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your Omae assistant. How can I help you find your dream property today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // When new messages are added, scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show property details when a property is selected
  useEffect(() => {
    if (selectedProperty && isOpen) {
      const property = sampleProperties.find((p) => p.id === selectedProperty);
      if (property) {
        setMessages((prev) => [
          ...prev,
          {
            text: `Here are the details for the property you selected:`,
            sender: "bot",
            timestamp: new Date(),
            propertyInfo: property,
          },
        ]);
      }
    }
  }, [selectedProperty, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (inputValue.trim() === "") return;

    // Add user message
    const newUserMessage: Message = {
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");

    // Process and add bot response
    setTimeout(() => {
      let botResponse = "";
      let propertyInfo: PropertyInfo | undefined;

      // Simple keyword detection for demo purposes
      const lowercaseInput = inputValue.toLowerCase();

      if (lowercaseInput.includes("hello") || lowercaseInput.includes("hi")) {
        botResponse =
          "Hello! How can I help you with your property search today?";
      } else if (
        lowercaseInput.includes("property") &&
        lowercaseInput.includes("expensive")
      ) {
        const mostExpensiveProperty = [...sampleProperties].sort(
          (a, b) => b.price - a.price
        )[0];
        botResponse = `The most expensive property we have is a ${
          mostExpensiveProperty.address
        } for $${mostExpensiveProperty.price.toLocaleString()}.`;
        propertyInfo = mostExpensiveProperty;
      } else if (
        lowercaseInput.includes("price") ||
        lowercaseInput.includes("cost")
      ) {
        botResponse =
          "Our properties range from $700,000 to $2.7M depending on location, size, and features.";
      } else if (
        lowercaseInput.includes("location") ||
        lowercaseInput.includes("area")
      ) {
        botResponse =
          "We have properties in many premium locations. Which area are you interested in?";
      } else if (
        lowercaseInput.includes("2.7") ||
        lowercaseInput.includes("2700000")
      ) {
        const property = sampleProperties.find((p) => p.price === 2700000);
        if (property) {
          botResponse = `Yes, we have a luxury villa in ${property.neighborhood} for $2.7M. It's a spectacular property with ${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms.`;
          propertyInfo = property;
        }
      } else {
        botResponse =
          "I'd be happy to help you find a property that meets your needs. Could you tell me more about what you're looking for? For example, location, budget, or number of bedrooms?";
      }

      const newBotMessage: Message = {
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
        propertyInfo,
      };

      setMessages((prev) => [...prev, newBotMessage]);
    }, 1000);
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg ${
          isOpen ? "bg-gray-900 text-white" : "bg-black text-white"
        } transition-all duration-300 focus:outline-none`}
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-[450px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-100">
          {/* Chat header */}
          <div className="px-4 py-3 bg-black text-white flex justify-between items-center">
            <h3 className="font-medium flex items-center text-sm">
              <MessageSquare size={16} className="mr-2" /> Omae Assistant
            </h3>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-black text-white"
                      : "bg-white text-gray-700 border border-gray-200"
                  } max-w-[85%] break-words text-sm`}
                >
                  {message.text}

                  {/* Property card within message */}
                  {message.propertyInfo && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="text-sm font-semibold mb-1">
                        {message.propertyInfo.address}
                      </div>
                      <div className="flex justify-between mb-1">
                        <span
                          className={
                            message.sender === "user"
                              ? "text-white font-bold"
                              : "text-black font-bold"
                          }
                        >
                          ${message.propertyInfo.price.toLocaleString()}
                        </span>
                        <span className="text-xs">
                          {message.propertyInfo.neighborhood}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>{message.propertyInfo.bedrooms} beds</span>
                        <span>{message.propertyInfo.bathrooms} baths</span>
                        <span>{message.propertyInfo.area} sqft</span>
                      </div>
                      <button className="w-full mt-2 px-2 py-1 bg-gray-100 text-black rounded-md text-xs font-medium">
                        View Details
                      </button>
                    </div>
                  )}
                </div>
                <div
                  className={`text-xs text-gray-500 mt-1 ${
                    message.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-gray-100 bg-white"
          >
            <div className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 py-2 px-3 border border-gray-200 rounded-l-md focus:outline-none focus:ring-1 focus:ring-black bg-white text-gray-900"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-r-md hover:bg-gray-800 focus:outline-none"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
