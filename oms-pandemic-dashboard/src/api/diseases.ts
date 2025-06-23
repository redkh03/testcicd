import axios from "axios";

const BASE_URL = "http://localhost:8081/api/diseases";

export const getDiseases = () => axios.get(BASE_URL);
export const getDiseaseById = (id: number) => axios.get(`${BASE_URL}/${id}`);
export const createDisease = (data: any) => axios.post(BASE_URL, data);
export const updateDisease = (id: number, data: any) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteDisease = (id: number) => axios.delete(`${BASE_URL}/${id}`);

export {};
