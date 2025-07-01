import axios from "axios";
/**
 * Creates an HTTP client using axios with the specified configuration.
 * @param {Object} config - Configuration for the HTTP client.
 * @param {string} config.baseUrl - The base URL for the API.
 * @param {number} config.timeout - The timeout for requests in milliseconds.
 * @param {Object} config.headers - Additional headers to include in requests.
 * @returns {Object} An axios instance configured with the provided settings.
 */
const createHttpClient = ({ baseURL, timeout, headers } = {}) => {
  const commonHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  return axios.create({
    baseURL,
    timeout: timeout || 10000, // Default timeout is 10000ms
    headers: { ...commonHeaders, ...headers }
  });
}

export const httpClient = createHttpClient;