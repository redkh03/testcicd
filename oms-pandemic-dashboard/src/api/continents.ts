import axios from "axios";

const BASE_URL = "http://localhost:8081/api/continents";

export const getContinents = () => axios.get(BASE_URL);
export const getContinentById = (id: number) => axios.get(`${BASE_URL}/${id}`);
export const createContinent = (data: any) => axios.post(BASE_URL, data);
export const updateContinent = (id: number, data: any) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteContinent = (id: number) => axios.delete(`${BASE_URL}/${id}`);

export {};
