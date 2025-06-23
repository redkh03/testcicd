import axios from "axios";

const BASE_URL = "http://localhost:8081/api/countries";

export const getCountries = () => axios.get(BASE_URL);
export const getCountryById = (id: number) => axios.get(`${BASE_URL}/${id}`);
export const createCountry = (data: any) => axios.post(BASE_URL, data);
export const updateCountry = (id: number, data: any) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteCountry = (id: number) => axios.delete(`${BASE_URL}/${id}`);
export const getDiseasesByCountry = (countryId: number) =>
  axios.get(`${BASE_URL}/${countryId}/diseases`);

export {};
