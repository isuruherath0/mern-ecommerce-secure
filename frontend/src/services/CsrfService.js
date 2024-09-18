import axios from 'axios';

// Fetch CSRF Token from the backend
export const fetchCsrfToken = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/csrf-token`);
        return response.data.csrfToken; // Assuming backend sends { csrfToken }
    } catch (error) {
        console.error("Error fetching CSRF token", error);
        throw error;
    }
};
