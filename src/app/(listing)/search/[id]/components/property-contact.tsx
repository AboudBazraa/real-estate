import { useState } from "react";
import { Property } from "@/shared/types/property";
import { useRouter } from "next/navigation";
import { MessageSquare, Mail, User, Phone, Send } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";

interface PropertyContactProps {
  property: Property;
}

export default function PropertyContact({ property }: PropertyContactProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement contact form submission
      console.log("Form submitted:", formData);

      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast({
        title: "Message Sent",
        description: "Your message has been sent to the property owner.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChatClick = () => {
    if (!property.user_id) {
      toast({
        title: "Cannot start chat",
        description: "Unable to identify the property owner.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to chat page with the owner's ID
    router.push(`/messages?user=${property.user_id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Contact Property Poster
      </h3>

      {property.agent ? (
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shadow-sm">
              <span className="text-primary font-semibold text-lg">
                {property.agent.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-lg">
                {property.agent.name}
              </h4>
              <p className="text-sm text-gray-500">{property.agent.email}</p>
              <p className="text-xs text-primary mt-1">Property Agent</p>
            </div>
          </div>

          <div className="flex gap-3 mt-3 mb-4">
            <button
              onClick={handleChatClick}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2.5 px-4 rounded-md transition-colors hover:bg-primary-dark"
            >
              <MessageSquare size={18} />
              <span>Chat Now</span>
            </button>
            <a
              href={
                property.agent.email ? `mailto:${property.agent.email}` : "#"
              }
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-800 py-2.5 px-4 rounded-md transition-colors"
            >
              <Mail size={18} />
              <span>Email</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-md text-gray-500 text-center">
          No contact information available for this property
        </div>
      )}

      <div className="relative mb-6 mt-6 flex items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-gray-500 text-sm font-medium">
          or send a message
        </span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <User size={16} />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail size={16} />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number{" "}
            <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Phone size={16} />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(123) 456-7890"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 "
            placeholder="I'm interested in this property and would like to schedule a viewing..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors bg-cyan-700 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </>
          ) : (
            <>
              <Send size={18} />
              Send Message
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          By sending a message, you agree to our{" "}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </div>
  );
}
