import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Check if required environment variables are set
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Initialize Supabase client - server-side
// Use service role key if available, otherwise fall back to anon key
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY
);

// Default model to use if not specified
const DEFAULT_MODEL = "deepseek/deepseek-chat-v3-0324:free";

export async function POST(request: NextRequest) {
  try {
    // Check if OpenRouter API key is configured
    if (!OPENROUTER_API_KEY) {
      console.error("OpenRouter API key is not configured");
      return NextResponse.json(
        {
          error: "OpenRouter API is not configured",
          arabic_error: "واجهة برمجة التطبيقات غير مكوّنة",
        },
        { status: 500 }
      );
    }

    const {
      messages,
      userId,
      properties: clientProperties, // We'll now ignore client-provided properties
      model = DEFAULT_MODEL,
      filters = {}, // Accept filters to query specific properties
      mapBounds = null, // Optional map bounds to focus on properties in view
    } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        {
          error: "Invalid request: messages array is required",
          arabic_error: "طلب غير صالح: مصفوفة الرسائل مطلوبة",
        },
        { status: 400 }
      );
    }

    // Get user data if available
    let userData = null;
    if (userId && SUPABASE_URL && (SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY)) {
      try {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        userData = data;
      } catch (error) {
        console.warn("Error fetching user data:", error);
        // Continue without user data
      }
    }

    // Fetch properties directly from Supabase with any provided filters
    let propertiesQuery = supabase.from("properties").select(`
        *,
        property_images (
          id,
          image_url,
          is_primary,
          display_order
        )
      `);

    // Apply any filters provided
    if (filters.property_type) {
      propertiesQuery = propertiesQuery.eq(
        "property_type",
        filters.property_type
      );
    }

    if (filters.min_price !== undefined) {
      propertiesQuery = propertiesQuery.gte("price", filters.min_price);
    }

    if (filters.max_price !== undefined) {
      propertiesQuery = propertiesQuery.lte("price", filters.max_price);
    }

    if (filters.bedrooms !== undefined) {
      propertiesQuery = propertiesQuery.gte("bedrooms", filters.bedrooms);
    }

    if (filters.bathrooms !== undefined) {
      propertiesQuery = propertiesQuery.gte("bathrooms", filters.bathrooms);
    }

    // Handle geographic filters if map bounds provided
    if (mapBounds && Array.isArray(mapBounds) && mapBounds.length === 2) {
      // mapBounds should be in format: [[south, west], [north, east]]
      const [[south, west], [north, east]] = mapBounds;

      // Only apply if they're valid numbers
      if (!isNaN(south) && !isNaN(west) && !isNaN(north) && !isNaN(east)) {
        propertiesQuery = propertiesQuery
          .gte("latitude", south)
          .lte("latitude", north)
          .gte("longitude", west)
          .lte("longitude", east);
      }
    }

    // Limit the number of properties to avoid token limits
    propertiesQuery = propertiesQuery.limit(10);

    const { data: propertiesData, error: propertiesError } =
      await propertiesQuery;

    if (propertiesError) {
      console.error("Error fetching properties:", propertiesError);
      return NextResponse.json(
        {
          error: "Failed to fetch properties",
          arabic_error: "فشل في جلب العقارات",
        },
        { status: 500 }
      );
    }

    // Process properties to add primaryImage field
    const properties = propertiesData.map((property) => {
      const propertyImages = property.property_images || [];

      // Find primary image or first image
      const primaryImage =
        propertyImages.find((img) => img.is_primary)?.image_url ||
        (propertyImages.length > 0 ? propertyImages[0].image_url : null);

      // Format for the AI
      return {
        ...property,
        primaryImage,
        property_images: undefined, // Remove nested array to simplify JSON for AI
        location_data: {
          latitude: property.latitude,
          longitude: property.longitude,
          full_address: property.address
            ? `${property.address}, ${property.city}, ${property.state}`
            : property.location,
        },
      };
    });

    // System prompt for real estate assistant
    const systemPrompt = `You are an AI-powered real estate assistant. You help users find properties and answer their questions about real estate listings.
      
Here are the available properties directly from the database:
${JSON.stringify(properties, null, 2)}

${
  userData
    ? `Here is information about the current user:
${JSON.stringify(userData, null, 2)}`
    : "No user data available."
}

When recommending properties:
1. Focus on properties that match the user's search criteria
2. Always include prices, locations, and key features
3. Be conversational and helpful
4. Refer to the coordinates (latitude/longitude) when discussing property locations on the map
5. You can suggest users look at specific areas on the map when relevant
6. If the user asks about a property or feature you don't have data on, admit that and offer alternatives
7. Be concise but informative in your responses
8. For Arabic users, respond in Arabic when they ask in Arabic
9. IMPORTANT: Never mention property IDs in your responses
10. When describing properties, use their title, location, and features instead of ID
11. Use property letters (Property A, Property B, etc.) when comparing multiple properties
12. Ensure all property information is accurate based on the provided data

Available map functionality:
- Users can view properties on an interactive Leaflet map
- Map coordinates are in latitude/longitude format
- Properties are displayed as markers on the map
- Users can filter properties by location by zooming the map
`;

    // Format conversation for OpenRouter
    const formattedMessages = formatMessagesForOpenRouter(
      messages,
      systemPrompt
    );

    // Call OpenRouter API
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer":
            request.headers.get("referer") || "https://yourwebsite.com",
          "X-Title": "Real Estate Assistant",
        },
        body: JSON.stringify({
          model: model,
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter API error: ${response.status} ${errorText}`);

      // Handle different error codes
      if (response.status === 429) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded. Please try again later.",
            arabic_error:
              "تم تجاوز حد الاستخدام. يرجى المحاولة مرة أخرى لاحقًا.",
          },
          { status: 429 }
        );
      }

      if (response.status === 402) {
        return NextResponse.json(
          {
            error:
              "Payment required for this model. Please use a different model or check your API subscription.",
            arabic_error:
              "هذا النموذج يتطلب اشتراك مدفوع. يرجى استخدام نموذج مختلف أو التحقق من اشتراك واجهة برمجة التطبيقات.",
          },
          { status: 402 }
        );
      }

      return NextResponse.json(
        {
          error: `OpenRouter API error: ${response.status}`,
          arabic_error: `خطأ في واجهة برمجة التطبيقات: ${response.status}`,
        },
        { status: response.status }
      );
    }

    const result = await response.json();

    // Extract content from OpenRouter response format
    let content = "";
    if (
      result.choices &&
      result.choices.length > 0 &&
      result.choices[0].message
    ) {
      content = result.choices[0].message.content;
    } else {
      content = "Sorry, I couldn't generate a response. Please try again.";
    }

    // Return the AI's response with fetched properties
    return NextResponse.json({
      content,
      role: "assistant",
      model,
      properties: properties, // Return the actual properties from database for UI use
      request_payload: {
        model,
        messages: formattedMessages,
      },
    });
  } catch (error: any) {
    console.error("Error in chat API route:", error);
    return NextResponse.json(
      {
        error: error.message || "Something went wrong",
        arabic_error: "حدث خطأ ما",
      },
      { status: 500 }
    );
  }
}

// Helper function to format messages for OpenRouter
function formatMessagesForOpenRouter(messages, systemPrompt) {
  // Start with system message
  const formattedMessages = [
    {
      role: "system",
      content: systemPrompt,
    },
  ];

  // Add conversation history (limit to last 10 messages to avoid token limits)
  const conversationHistory = messages.slice(-10);
  conversationHistory.forEach((message) => {
    formattedMessages.push({
      role: message.role,
      content: message.content,
    });
  });

  return formattedMessages;
}
