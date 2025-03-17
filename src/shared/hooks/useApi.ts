import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";

const getAuthToken = () => localStorage.getItem("authToken");

export function useApiQuery(queryKey: string[], params) {
  return useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      const token = getAuthToken();
      const response = await fetch(`https://localhost:7085${params.url}`, {
        signal,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json();
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useApiMutation(
  mutationKey: string[],
  params: any,
  method: string
) {
  return useMutation({
    mutationKey,
    mutationFn: async (data: any) => {
      try {
        console.log("Request URL:", `https://localhost:7085${params.url}`);
        console.log("Request Data:", data);

        const response = await fetch(`https://localhost:7085${params.url}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("authToken")
              ? `Bearer ${localStorage.getItem("authToken")}`
              : "",
          },
          body: method !== "DELETE" ? JSON.stringify(data) : undefined,
        });

        const responseText = await response.text();
        console.log("Response:", responseText);

        if (!response.ok) {
          // Try to parse the error response
          try {
            // If it's a JSON response
            const errorData = responseText.startsWith("{")
              ? JSON.parse(responseText)
              : responseText;
            throw new Error(
              typeof errorData === "string"
                ? errorData
                : errorData.message || `Failed with status: ${response.status}`
            );
          } catch (e) {
            // If parsing fails, use the raw text
            throw new Error(
              responseText || `Failed with status: ${response.status}`
            );
          }
        }

        // Try to parse the success response
        try {
          return responseText ? JSON.parse(responseText) : { success: true };
        } catch (e) {
          return { success: true, data: responseText };
        }
      } catch (error) {
        console.error("Mutation error:", error);
        throw error;
      }
    },
  });
}

export function useApiQueryPlus(queryKey: string[], params) {
  return useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      const response = await fetch(`https://localhost:7085${params.url}`, {
        signal,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json();
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useApiMutatioPlus(
  mutationKey: string[],
  params: any,
  method: string
) {
  return useMutation({
    mutationKey,
    mutationFn: async (data: any) => {
      try {
        const response = await fetch(`https://localhost:7085${params.url}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            // Add any auth headers if needed
          },
          body: method !== "DELETE" ? JSON.stringify(data) : undefined,
        });

        // For DELETE requests, we might not get JSON back
        if (method === "DELETE") {
          if (!response.ok) {
            throw new Error(`Failed to delete: ${response.status}`);
          }
          return { success: true };
        }

        // For other requests, handle JSON response
        const contentType = response.headers.get("content-type");
        let responseData;

        if (contentType && contentType.includes("application/json")) {
          const text = await response.text();
          responseData = text ? JSON.parse(text) : { success: response.ok };
        } else {
          responseData = { success: response.ok };
        }

        if (!response.ok) {
          throw new Error(
            responseData.message || `Failed with status: ${response.status}`
          );
        }

        return responseData;
      } catch (error) {
        console.error("Mutation error:", error);
        throw error;
      }
    },
  });
}
