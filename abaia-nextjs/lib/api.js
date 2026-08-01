'use client';
import axios from 'axios';

const api = axios.create({
  baseURL: typeof window !== 'undefined' ? '' : 'http://localhost:5000',
});

export default api;
