export async function getFetch({ signal, search, url }) {
    try {
        // Base URL should be configured - replace with your actual API base URL
        const baseUrl = process.env.API_URL || url;

        // Build URL with proper encoding
        const Url = new URL(baseUrl);
        if (search) {
            Url.searchParams.append('search', search);
        }

        const response = await fetch(Url.toString(), { signal });

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Re-throw to let caller handle the error
    }
}

export async function mutateData({ method, url, data, signal }) {
    try {
        const baseUrl = process.env.API_URL || url;
        const Url = new URL(baseUrl);

        const options = {
            method: method, // 'POST', 'PUT', or 'DELETE'
            headers: {
                'Content-Type': 'application/json',
                // Add any additional headers here
            },
            signal,
        };

        // Only add body for POST and PUT requests
        if (method !== 'DELETE' && data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(Url.toString(), options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Some DELETE operations might not return data
        if (method === 'DELETE') {
            return { success: true, status: response.status };
        }

        const responseData = await response.json();
        return responseData;

    } catch (error) {
        console.error(`Error ${method} data:`, error);
        throw error;
    }
}
