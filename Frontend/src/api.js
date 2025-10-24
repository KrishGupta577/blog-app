import axios from 'axios';

const api = axios.create({
  baseURL: 'https://blog-app-pz71-backend.vercel.app/api',
  withCredentials: true,
});

export default api;
