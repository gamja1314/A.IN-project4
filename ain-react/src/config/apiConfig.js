// src/config/apiConfig.js
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-url.com' 
  : 'http://192.168.44.212:9999';