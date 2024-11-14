import axios from "axios";

const GOOGLE_PLACES_API_KEY = "YOUR_GOOGLE_PLACES_API_KEY";
const CITATION_API_URL = 'http://localhost:3001/'

export const fetchBusinessSuggestions = async (query) => {
  if (!query) return [];

  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
    {
      params: {
        input: query,
        key: GOOGLE_PLACES_API_KEY,
        types: "establishment",
        language: "en",
      },
    }
  );

  return response.data.predictions.map((prediction) => ({
    label: prediction.description,
    value: prediction.place_id,
  }));
};

export const fetchBusinessDetails = async (placeId) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/place/details/json`,
    {
      params: {
        place_id: placeId,
        key: GOOGLE_PLACES_API_KEY,
        fields: "name,formatted_address,formatted_phone_number,website",
      },
    }
  );

  const result = response.data.result;
  return {
    name: result.name,
    address: result.formatted_address,
    phone: result.formatted_phone_number,
    website: result.website,
  };
};

export const loginUser = async (email, password, onSuccess) => {
    try {
      const response = await axios.post(`${CITATION_API_URL}users/login`, {
        email,
        password,
      });
      const token = response.data.token;
      
      if (onSuccess) {
        onSuccess(token);
      }
  
      return token;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };
  
  export const registerUser = async (username, email, password, onSuccess) => {
    try {
      await axios.post(`${CITATION_API_URL}users/register`, {
        email,
        password,
        username,
      });
  
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };