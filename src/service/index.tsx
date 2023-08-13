import axios from 'axios';
import Toast from 'react-native-simple-toast';

const BASE_URL = 'https://api.realworld.io/api/'; // Replace with your API base URL

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Adjust the timeout as needed
});

const AppService = async (
  endpoint: string,
  method = 'GET',
  data = null,
  headers = {},
) => {
  try {
    const response = await api.request({
      url: endpoint,
      method,
      data,
      headers,
    });

    return response.data;
  } catch (error) {
    Toast.show(error.message);
    throw error;
  }
};

export {AppService};
