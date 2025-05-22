// ChatBot component for real estate application
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  X,
  User,
  Home,
  MapPin,
  PanelRightOpen,
  Info,
  ChevronDown,
  AlertTriangle,
  ExternalLink,
  Map as MapIcon,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Badge } from "@/shared/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { useProperties } from "@/shared/hooks/useProperties";
import { cn } from "@/shared/lib/utils";
import { useToast } from "@/shared/hooks/use-toast";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useSupabase } from "@/shared/providers/SupabaseProvider";
import { useRouter, useSearchParams } from "next/navigation";
import type { Property } from "@/shared/types/property";
import dynamic from "next/dynamic";

// Import the map component with no SSR
const PropertyMapDialog = dynamic(() => import("./property-map-dialog"), {
  ssr: false,
});

// Initialize Supabase client - for client-side authentication
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Available models
const MODELS = [
  { id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B" },
  { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash" },
  { id: "deepseek/deepseek-chat-v3-0324:free", name: "DeepSeek" },
  { id: "meta-llama/llama-4-scout:free", name: "Llama 4 Scout" },
];

const MAX_CHAR_COUNT = 500;

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  model?: string;
  recommendedProperties?: Property[];
};

type ChatMessage = {
  role: string;
  content: string;
};

type MapBounds = [[number, number], [number, number]]; // [[south, west], [north, east]]

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your real estate assistant. How can I help you find your perfect property today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [loadingState, setLoadingState] = useState<
    "idle" | "connecting" | "thinking"
  >("idle");
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [lastRequestPayload, setLastRequestPayload] = useState<any>(null);
  const [isArabicError, setIsArabicError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { properties } = useProperties();
  const { toast } = useToast();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapProperties, setMapProperties] = useState<Property[]>([]);
  const [mapSelectedProperty, setMapSelectedProperty] =
    useState<Property | null>(null);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);

  const { supabase } = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get user session on component mount
  useEffect(() => {
    const getUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUserId(data.session.user.id);
      }
    };

    getUserSession();
  }, []);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim() || loadingState !== "idle") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    // Add to UI
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoadingState("connecting");

    try {
      // Add to chat history
      const userChatMessage: ChatMessage = {
        role: "user",
        content: input,
      };

      const updatedHistory = [...chatHistory, userChatMessage];
      setChatHistory(updatedHistory);

      // After a brief delay, change to "thinking" state
      setTimeout(() => {
        setLoadingState("thinking");
      }, 800);

      // Look for map-related commands
      const inputLower = input.toLowerCase();
      if (
        inputLower.includes("show map") ||
        inputLower.includes("open map") ||
        inputLower.includes("view map") ||
        inputLower.includes("على الخريطة") || // Arabic for "on the map"
        inputLower.includes("أظهر الخريطة")
      ) {
        // Arabic for "show the map"
        // Check if we have properties to show
        if (properties.length > 0 || mapProperties.length > 0) {
          // Use mapProperties if available, otherwise use general properties
          const propsToShow =
            mapProperties.length > 0 ? mapProperties : properties;
          openPropertyMap(propsToShow as Property[]);

          // Add a system message acknowledging map opened
          const systemMessage: Message = {
            id: Date.now().toString() + "-map",
            content: "I've opened the map view for you to explore properties.",
            role: "assistant",
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, userMessage, systemMessage]);
          setInput("");
          return; // Skip AI call since we're handling this directly
        }
      }

      // Call the server-side API route
      const response = await callChatAPI(input, updatedHistory);

      if (response) {
        // Process content to identify recommended properties
        const recommendedProperties = extractRecommendedProperties(
          response.content,
          response.properties || []
        );

        // Filter out any property IDs from content just in case
        let filteredContent = response.content;
        // Remove any "/search/{id}" links
        filteredContent = filteredContent.replace(
          /\/search\/[a-zA-Z0-9-_]+/g,
          "View Details"
        );
        // Remove any direct reference to IDs
        filteredContent = filteredContent.replace(
          /ID:?\s*[a-zA-Z0-9-_]+/gi,
          ""
        );

        // Add AI response to messages
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: formatAIResponse(
            filteredContent,
            recommendedProperties || []
          ),
          role: "assistant",
          timestamp: new Date(),
          model: response.model,
          recommendedProperties,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Update request payload for How It Works panel
        if (response.request_payload) {
          setLastRequestPayload(response.request_payload);
        }

        // Update chat history
        setChatHistory([
          ...updatedHistory,
          {
            role: "assistant",
            content: response.content,
          },
        ]);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingState("idle");
      setIsArabicError(false); // Reset Arabic error state
    }
  };

  // Extract mentioned properties from AI response
  const extractRecommendedProperties = (
    content: string,
    availableProperties: Property[]
  ): Property[] => {
    if (!availableProperties || availableProperties.length === 0) return [];

    const recommendedProps: Property[] = [];
    const processedPropertyIds = new Set<string>();

    // Check for property references like "Property A", "Property B", etc.
    const propertyLetterMatches = content.match(/Property\s+([A-Z])/gi);

    if (propertyLetterMatches && propertyLetterMatches.length > 0) {
      // Extract just the letters (A, B, C, etc.)
      const propertyLetters = propertyLetterMatches.map((match) => {
        const letter = match.replace(/Property\s+/i, "").toUpperCase();
        return letter;
      });

      // For each letter, create a property with that name if it doesn't exist
      propertyLetters.forEach((letter, index) => {
        // Find if we already have this property
        const existingProp = availableProperties.find(
          (p) =>
            p.title.toUpperCase().includes(`PROPERTY ${letter}`) ||
            p.title.toUpperCase().includes(`PROPERTY${letter}`)
        );

        if (existingProp && !processedPropertyIds.has(existingProp.id)) {
          // Clone the property to avoid modifying original data
          const clonedProp = { ...existingProp };
          recommendedProps.push(clonedProp);
          processedPropertyIds.add(existingProp.id);
        } else if (index < availableProperties.length) {
          // If no matching property found, use an available property
          // and modify its title to include the property letter
          const prop = { ...availableProperties[index] };
          prop.title = `Property ${letter}: ${prop.title}`;
          recommendedProps.push(prop);
          processedPropertyIds.add(prop.id);
        }
      });

      // If we found property letters, return these properties
      if (recommendedProps.length > 0) {
        return recommendedProps.slice(0, 3);
      }
    }

    // Fall back to other methods if no property letters found

    // Check each property to see if it's mentioned in the response
    availableProperties.forEach((property) => {
      // Skip if we've already processed this property
      if (processedPropertyIds.has(property.id)) return;

      // Check if property title is mentioned in the content
      // Using case-insensitive comparison
      if (content.toLowerCase().includes(property.title.toLowerCase())) {
        recommendedProps.push(property);
        processedPropertyIds.add(property.id);
      }
    });

    // If we didn't find direct title matches, let's try to identify properties by other means
    if (recommendedProps.length === 0) {
      // If the message contains numbers that could be prices, try to match by price
      const priceMatches = content.match(/\$[\d,]+|\d{3,}[\d,]*/g);

      if (priceMatches) {
        priceMatches.forEach((priceStr) => {
          // Clean up price string and convert to number
          const price = Number(priceStr.replace(/[$,]/g, ""));
          if (!isNaN(price)) {
            // Find properties with similar prices
            availableProperties.forEach((property) => {
              if (
                !processedPropertyIds.has(property.id) &&
                Math.abs(property.price - price) < property.price * 0.1
              ) {
                // Within 10% of the price
                recommendedProps.push(property);
                processedPropertyIds.add(property.id);
              }
            });
          }
        });
      }

      // If still no matches, check for bedroom/location mentions
      if (recommendedProps.length === 0) {
        // Check for bedroom counts (e.g., "2 bedrooms", "3 beds")
        const bedroomMatches = content.match(
          /(\d+)\s*(?:bed|bedroom|bedrooms)/gi
        );
        // Check for locations
        const locationMatches = content.match(
          /in\s+([A-Za-z\s]+)(?:\.|\,|\s)/i
        );

        if (bedroomMatches || locationMatches) {
          // Safe way to extract the first number from bedroom matches
          const bedrooms =
            bedroomMatches && bedroomMatches.length > 0
              ? parseInt(bedroomMatches[0].match(/\d+/)?.[0] || "0")
              : null;
          const location = locationMatches ? locationMatches[1].trim() : null;

          availableProperties.forEach((property) => {
            if (processedPropertyIds.has(property.id)) return;

            let matches = true;
            if (bedrooms !== null && property.bedrooms !== bedrooms)
              matches = false;
            if (
              location !== null &&
              !property.location.toLowerCase().includes(location.toLowerCase())
            )
              matches = false;

            if (matches) {
              recommendedProps.push(property);
              processedPropertyIds.add(property.id);
              if (recommendedProps.length >= 3) return; // Limit to 3 properties
            }
          });
        }
      }
    }

    // If we found more than 3 properties, just return the first 3
    return recommendedProps.slice(0, 3);
  };

  // Call the chat API route
  const callChatAPI = async (
    userMessage: string,
    history: ChatMessage[],
    propertyFilters = {},
    propertyId: string | null = null
  ) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: history,
          userId: userId,
          model: selectedModel,
          filters: {
            ...propertyFilters,
            ...(propertyId ? { id: propertyId } : {}), // Focus on specific property if ID provided
          },
          mapBounds: mapBounds, // Send current map view bounds if available
        }),
      });

      if (!response.ok) {
        // Check content type to determine if response is JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();

          // Check if we have an Arabic error message
          if (errorData.arabic_error) {
            setIsArabicError(true);
            throw new Error(errorData.arabic_error);
          }

          throw new Error(errorData.error || "Error calling chat API");
        } else {
          // Handle non-JSON error responses
          const errorText = await response.text();
          console.error("Non-JSON error response:", errorText);
          throw new Error("Server error: API returned non-JSON response");
        }
      }

      // Check content type before parsing JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        console.error("Unexpected response format:", responseText);
        throw new Error("API returned non-JSON response");
      }

      const data = await response.json();

      // If properties came back from the API, update local map properties
      if (
        data.properties &&
        Array.isArray(data.properties) &&
        data.properties.length > 0
      ) {
        setMapProperties(data.properties);
      }

      return data;
    } catch (error) {
      console.error("Error calling chat API:", error);
      // Fallback to local response if API fails
      return {
        content: await simulateAIResponse(
          userMessage,
          properties as Property[]
        ),
        role: "assistant",
        model: "fallback",
      };
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "YER",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Fallback function to simulate AI responses if API fails
  const simulateAIResponse = async (
    input: string,
    properties: Property[]
  ): Promise<string> => {
    const inputLower = input.toLowerCase();

    // Handle property search
    if (
      inputLower.includes("show") ||
      inputLower.includes("find") ||
      inputLower.includes("properties") ||
      inputLower.includes("listings")
    ) {
      // Check for price mentions
      const priceMatch = input.match(/(\d+)[\s]*(k|thousand|million|m|yer)/i);
      let maxPrice = 1000000;
      if (priceMatch) {
        const priceValue = parseInt(priceMatch[1]);
        const modifier = priceMatch[2].toLowerCase();
        if (modifier === "k" || modifier === "thousand") {
          maxPrice = priceValue * 1000;
        } else if (modifier === "m" || modifier === "million") {
          maxPrice = priceValue * 1000000;
        } else {
          maxPrice = priceValue;
        }
      }

      // Check for bedrooms
      const bedroomsMatch = input.match(/(\d+)[\s]*(bed|bedroom|bedrooms)/i);
      const bedrooms = bedroomsMatch ? parseInt(bedroomsMatch[1]) : 0;

      // Check for location
      let location = "";
      ["sanaa", "aden", "taiz", "hodeidah"].forEach((city) => {
        if (inputLower.includes(city)) {
          location = city;
        }
      });

      // Filter properties
      const filtered = properties.filter((property) => {
        let matches = true;
        if (maxPrice && property.price > maxPrice) matches = false;
        if (bedrooms && property.bedrooms < bedrooms) matches = false;
        if (location && !property.location.toLowerCase().includes(location))
          matches = false;
        return matches;
      });

      if (filtered.length === 0) {
        return "I couldn't find any properties matching your criteria. Would you like to try with different preferences?";
      }

      // Format the response with top 3 properties
      const topProperties = filtered.slice(0, 3);
      let response = `I found ${filtered.length} properties matching your criteria. Here are some top picks:\n\n`;

      topProperties.forEach((property, index) => {
        response += `${index + 1}. ${property.title} - ${formatPrice(
          property.price
        )}\n`;
        response += `   ${property.bedrooms} beds, ${property.bathrooms} baths, ${property.area} sqft\n`;
        response += `   Located in ${property.location}\n\n`;
      });

      response += "Would you like more details about any of these properties?";
      return response;
    }

    // Handle property type questions
    if (
      inputLower.includes("apartment") ||
      inputLower.includes("house") ||
      inputLower.includes("villa") ||
      inputLower.includes("types")
    ) {
      const apartments = properties.filter(
        (p) => p.property_type === "apartment"
      ).length;
      const houses = properties.filter(
        (p) => p.property_type === "house"
      ).length;
      const villas = properties.filter(
        (p) => p.property_type === "villa"
      ).length;

      return `We currently have ${apartments} apartments, ${houses} houses, and ${villas} villas available. What type of property are you interested in?`;
    }

    // Handle price range questions
    if (
      inputLower.includes("price") ||
      inputLower.includes("cost") ||
      inputLower.includes("expensive") ||
      inputLower.includes("cheap")
    ) {
      const prices = properties.map((p) => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice =
        prices.reduce((sum, price) => sum + price, 0) / prices.length;

      return `Our properties range from ${formatPrice(
        minPrice
      )} to ${formatPrice(maxPrice)}, with an average price of ${formatPrice(
        Math.round(avgPrice)
      )}. What's your budget range?`;
    }

    // Handle location questions
    if (
      inputLower.includes("location") ||
      inputLower.includes("area") ||
      inputLower.includes("where") ||
      inputLower.includes("neighborhood")
    ) {
      const locations = [...new Set(properties.map((p) => p.location))];

      return `We have properties in various locations, including ${locations
        .slice(0, 3)
        .join(", ")}${
        locations.length > 3 ? ` and ${locations.length - 3} more areas` : ""
      }. Which area are you interested in?`;
    }

    // Default response
    return "I'm here to help you find the perfect property. You can ask me about available properties, price ranges, locations, or property features.";
  };

  const getModelName = (modelId: string) => {
    // Check if it's in our predefined models list
    const model = MODELS.find((m) => m.id === modelId);
    if (model) return model.name;

    // Handle OpenRouter format - modelId often looks like "mistralai/mistral-7b-instruct:free"
    if (modelId.includes(":")) {
      const parts = modelId.split(":");
      const mainPart = parts[0].split("/").pop() || "";
      return mainPart.charAt(0).toUpperCase() + mainPart.slice(1); // Capitalize first letter
    }

    // Fallback to standard format
    return modelId.split("/").pop() || modelId;
  };

  // Improved PropertyCard component
  const PropertyCard = ({ property }: { property: Property }) => {
    const propertyNameMatch = property.title.match(/Property\s+([A-Z])/i);
    const propertyIdentifier = propertyNameMatch
      ? propertyNameMatch[1].toUpperCase()
      : "";

    return (
      <div className="rounded-xl overflow-hidden border border-border/50 hover:shadow-lg transition-all bg-card/50 backdrop-blur-sm">
        {/* Property identifier with improved visual hierarchy */}
        {propertyIdentifier && (
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium px-4 py-2 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl font-bold mr-2">
                {propertyIdentifier}
              </span>
              <span className="text-sm">Property {propertyIdentifier}</span>
            </div>
            <Badge
              variant="outline"
              className="bg-white/20 text-white border-white/30"
            >
              Featured
            </Badge>
          </div>
        )}

        {/* Improved image container with aspect ratio */}
        <div className="relative aspect-[16/9] w-full bg-muted overflow-hidden">
          {property.primaryImage ? (
            <Image
              src={property.primaryImage}
              alt={property.title}
              fill
              className="object-cover hover:scale-105 transition-transform"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Home className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <p className="text-white font-semibold text-base">
              {formatPrice(property.price)}
            </p>
          </div>
        </div>

        {/* Property details with improved layout */}
        <div className="p-4 space-y-3">
          <h4 className="font-semibold text-sm mb-1 line-clamp-2">
            {property.title.replace(/Property\s+[A-Z]:\s*/i, "")}
          </h4>
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1.5" />
            <span className="truncate">{property.location}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs py-0.5">
              {property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}
            </Badge>
            <Badge variant="secondary" className="text-xs py-0.5">
              {property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}
            </Badge>
            <Badge variant="secondary" className="text-xs py-0.5">
              {property.area} sqft
            </Badge>
          </div>
          <Link href={`/search/${property.id}`} className="w-full block mt-2">
            <Button
              variant="default"
              size="sm"
              className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-primary to-blue-600"
            >
              View Details <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  // Format AI responses with structured sections - hide property IDs
  const formatAIResponse = (
    content: string,
    properties: Property[]
  ): string => {
    // Safe guard against null/undefined content
    if (!content) return "Sorry, I couldn't generate a proper response.";

    // Safely handle null/undefined properties
    const safeProperties = Array.isArray(properties) ? properties : [];

    // Identify if this is a property recommendation response
    const isPropertyRecommendation =
      content.includes("properties") ||
      content.includes("recommend") ||
      content.includes("Property");

    // Return regular content if no recommendation or empty properties array
    if (!isPropertyRecommendation || safeProperties.length === 0)
      return content;

    // Extract the main property being recommended (safely)
    const recommendedProperty = safeProperties[0]; // Assuming the first property is the main recommendation

    // Ensure recommendedProperty exists
    if (!recommendedProperty) return content;

    return `## Property Recommendation

**Overview**
${content.split(".")[0]}. ${content.split(".")[1] || ""}

**Recommended Property: ${recommendedProperty.title}**
• Location: ${recommendedProperty.location}
• Price: ${formatPrice(recommendedProperty.price)}
• Details: ${recommendedProperty.bedrooms} bedrooms, ${
      recommendedProperty.bathrooms
    } bathrooms, ${recommendedProperty.area} sqft
• Type: ${recommendedProperty.property_type || "Residential"}

**View Property**
Use the "View Details" button below to see full details and photos.

${content.split(".").slice(2).join(".")}`;
  };

  // Function to open map with properties from the conversation
  const openPropertyMap = (properties: Property[]) => {
    if (properties && properties.length > 0) {
      setMapProperties(properties);
      setIsMapOpen(true);
    } else {
      toast({
        title: "No properties to display",
        description: "There are no properties available to show on the map.",
        variant: "destructive",
      });
    }
  };

  // Handle property selection on map
  const handleMapPropertySelect = (property: Property | null) => {
    // Prevent recursive updates by checking if we're already showing this property
    if (property?.id === mapSelectedProperty?.id) {
      return; // Exit if same property already selected
    }

    // First update the selected property
    setMapSelectedProperty(property);

    // Exit early if no property selected to avoid unnecessary processing
    if (!property) return;

    // Use a longer timeout to ensure we break the React render cycle
    const timer = setTimeout(() => {
      // Create a user message about interest in this property
      const message: Message = {
        id: Date.now().toString(),
        content: `I'm interested in this property: ${property.title} at ${property.location}. Can you tell me more about it?`,
        role: "user",
        timestamp: new Date(),
      };

      // Update messages state
      setMessages((prev) => [...prev, message]);

      // Prepare chat message (without mentioning ID)
      const chatMessage: ChatMessage = {
        role: "user",
        content: `Tell me more about this property: ${property.title} located at ${property.location}`,
      };

      // Update chat history
      const updatedHistory = [...chatHistory, chatMessage];
      setChatHistory(updatedHistory);

      // Get AI response for this property after a brief delay
      handleAIResponseForProperty(property.id, updatedHistory);
    }, 50); // Use a longer delay to ensure state updates have settled

    // Clean up timer if component unmounts during the delay
    return () => clearTimeout(timer);
  };

  // Handle map bounds changes
  const handleMapBoundsChange = (bounds: MapBounds) => {
    setMapBounds(bounds);
  };

  // Navigate to property detail page
  const viewPropertyDetails = (propertyId: string) => {
    router.push(`/search/${propertyId}`);
  };

  // Handle AI response specifically for a property
  const handleAIResponseForProperty = async (
    propertyId: string,
    history: ChatMessage[]
  ) => {
    setLoadingState("connecting");

    try {
      // Create a reference to the timeout so we can clear it later
      const thinkingTimer = setTimeout(() => {
        setLoadingState("thinking");
      }, 800);

      const response = await callChatAPI("", history, {}, propertyId);

      // Clear the timeout to prevent state updates if component unmounts
      clearTimeout(thinkingTimer);

      if (response) {
        // Process content to identify recommended properties with safe fallback
        const props = response.properties || [];
        const recommendedProperties = extractRecommendedProperties(
          response.content,
          props
        );

        // Filter out any property IDs from content
        let filteredContent = response.content;
        // Remove any "/search/{id}" links
        filteredContent = filteredContent.replace(
          /\/search\/[a-zA-Z0-9-_]+/g,
          "View Details"
        );
        // Remove any direct reference to IDs
        filteredContent = filteredContent.replace(
          /ID:?\s*[a-zA-Z0-9-_]+/gi,
          ""
        );
        filteredContent = filteredContent.replace(
          /property\s+[a-zA-Z0-9-_]+/gi,
          "this property"
        );

        // Add AI response to messages
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: formatAIResponse(
            filteredContent,
            recommendedProperties || []
          ),
          role: "assistant",
          timestamp: new Date(),
          model: response.model,
          recommendedProperties,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Update chat history
        setChatHistory([
          ...history,
          {
            role: "assistant",
            content: response.content,
          },
        ]);
      }
    } catch (error) {
      console.error("Error getting property AI response:", error);
      toast({
        title: "Error",
        description: "Failed to get property information.",
        variant: "destructive",
      });
    } finally {
      setLoadingState("idle");
    }
  };

  // Add this function to handle map button click
  const handleMapButtonClick = () => {
    const propsToShow = mapProperties.length > 0 ? mapProperties : properties;
    openPropertyMap(propsToShow as Property[]);
  };

  return (
    <>
      {/* Fixed chat button without tooltip to avoid infinite loop issues */}
      <Button
        variant="default"
        size="icon"
        className="rounded-3xl shadow-lg fixed bottom-6 right-6 z-50 h-14 w-14"
        onClick={() => setIsOpen(true)}
        aria-label="Ask me about properties"
      >
        <Bot className="h-6 w-6" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg p-0 flex flex-col bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm border-l border-gray-400 shadow-lg dark:border-gray-700"
        >
          <SheetHeader className="border-b border-gray-400 dark:border-gray-700 pb-3 px-4 pt-4 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <SheetTitle className="text-lg font-medium">
                  Real Estate Advisor
                </SheetTitle>
              </div>
              <div className="flex items-center gap-2 mr-6">
                {/* Map button without tooltip to prevent infinite update loops */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  onClick={handleMapButtonClick}
                  aria-label="View properties on map"
                >
                  <MapIcon className="h-4 w-4" />
                </Button>

                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-[160px] h-9 text-xs bg-background/80 border-muted-foreground/20">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Models</SelectLabel>
                      {MODELS.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="flex flex-col space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex w-max max-w-[90%] flex-col gap-2 rounded-xl px-4 py-3 shadow-sm",
                    message.role === "user"
                      ? "ml-auto bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-sm"
                      : "bg-gradient-to-br from-card to-muted/70 rounded-bl-sm border border-gray-400 dark:border-gray-700"
                  )}
                >
                  <div className="flex items-center gap-2 justify-between w-full mb-1">
                    <div className="flex items-center">
                      {message.role === "assistant" ? (
                        <div className="bg-primary/10 p-1 rounded-full">
                          <Bot className="h-3 w-3 text-primary" />
                        </div>
                      ) : (
                        <div className="bg-primary-foreground/20 p-1 rounded-full">
                          <User className="h-3 w-3" />
                        </div>
                      )}
                      <span className="text-xs font-medium ml-1.5">
                        {message.role === "user" ? "You" : "Assistant"}
                      </span>
                    </div>
                    {message.role === "assistant" &&
                      message.model &&
                      message.model !== "fallback" && (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-background/40 h-5"
                        >
                          {getModelName(message.model)}
                        </Badge>
                      )}
                  </div>
                  <div className="text-sm whitespace-pre-line leading-relaxed">
                    {message.content}
                  </div>

                  {/* Property recommendations */}
                  {message.role === "assistant" &&
                    message.recommendedProperties &&
                    message.recommendedProperties.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-sm">
                            Featured Properties
                          </p>
                          <Badge variant="outline" className="text-xs">
                            From conversation
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {message.recommendedProperties.map((property) => (
                            <PropertyCard
                              key={property.id}
                              property={property}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ))}

              {loadingState !== "idle" && (
                <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-4 py-3 bg-muted rounded-bl-none">
                  <div className="flex items-center gap-2 justify-between w-full">
                    <div className="flex items-center">
                      <Bot className="h-4 w-4" />
                      <span className="text-xs font-semibold ml-1">
                        Assistant
                      </span>
                    </div>
                    <span className="text-[10px] opacity-70">
                      {loadingState === "connecting"
                        ? "Connecting..."
                        : "Thinking..."}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-100"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-200"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* <div className="px-4 border-t border-gray-700 flex justify-between items-center">
            <Collapsible
              open={showHowItWorks}
              onOpenChange={setShowHowItWorks}
              className="w-full"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex gap-2 items-center w-full justify-between h-8"
                >
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    <span className="text-xs">How It Works</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      showHowItWorks ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="bg-muted p-2 rounded-md text-xs mt-1 max-h-[200px] overflow-auto">
                <div className="space-y-2">
                  <div>
                    <h5 className="font-semibold">Model:</h5>
                    <p>{getModelName(selectedModel)}</p>
                  </div>
                  {lastRequestPayload && (
                    <div>
                      <h5 className="font-semibold">Last Request:</h5>
                      <pre className="text-[10px] overflow-auto max-h-[100px] bg-black/10 p-1 rounded">
                        {JSON.stringify(lastRequestPayload, null, 2)}
                      </pre>
                    </div>
                  )}
                  <div>
                    <h5 className="font-semibold">Notes:</h5>
                    <ul className="list-disc list-inside text-[10px] space-y-1">
                      <li>500 character limit per message</li>
                      <li>Messages are temporarily stored for context</li>
                      <li>Try different models for varied responses</li>
                    </ul>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div> */}

          <SheetFooter className="flex-row space-x-2 p-2 pt-2 border-t border-gray-400 dark:border-gray-700">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Ask about properties..."
                className="w-full rounded-2xl border border-gray-400 dark:border-gray-700 bg-background/80 backdrop-blur-sm px-4 py-3 pr-10 text-sm shadow-sm focus:ring-1 focus:ring-primary/30 transition-all"
                value={input}
                onChange={(e) =>
                  setInput(e.target.value.slice(0, MAX_CHAR_COUNT))
                }
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                maxLength={MAX_CHAR_COUNT}
                disabled={loadingState !== "idle"}
                aria-label="Chat input"
              />
              <Button
                size="icon"
                variant="default"
                className="rounded-2xl h-10 w-10 flex-shrink-0 shadow-md absolute right-0 top-1/2 -translate-y-1/2 mr-1"
                onClick={handleSendMessage}
                disabled={loadingState !== "idle" || !input.trim()}
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Property Map Dialog - with key to force remount and avoid state issues */}
      {isMapOpen && (
        <PropertyMapDialog
          key={`map-dialog-${Date.now()}`}
          properties={mapProperties}
          selectedProperty={mapSelectedProperty}
          onPropertySelect={handleMapPropertySelect}
          onClose={() => {
            // First clear the selected property, then close the map
            setMapSelectedProperty(null);
            setIsMapOpen(false);
          }}
          onBoundsChange={handleMapBoundsChange}
          onViewDetails={viewPropertyDetails}
        />
      )}
    </>
  );
}
