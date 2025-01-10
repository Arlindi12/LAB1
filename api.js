import axios from 'axios';

const API = axios.create({ baseURL: 'https://localhost:7253/api' });

export default API;
