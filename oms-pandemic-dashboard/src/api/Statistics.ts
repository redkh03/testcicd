import axios from "axios";

// Base URL de ton backend Spring
const BASE_URL = "http://localhost:8081/api/statistics";

// Fonctions API
export const getStatistics = () => axios.get(BASE_URL);
export const getStatisticById = (id: number) => axios.get(`${BASE_URL}/${id}`);
export const createStatistic = (data: any) => axios.post(BASE_URL, data);
export const updateStatistic = (id: number, data: any) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteStatistic = (id: number) => axios.delete(`${BASE_URL}/${id}`);

export {};