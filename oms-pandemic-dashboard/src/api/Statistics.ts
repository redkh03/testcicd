import axiosInstance from "../axiosInstance";

// Pas besoin de BASE_URL car axiosInstance l’a déjà dans sa config
const STATISTICS_ENDPOINT = "/statistics";

// Fonctions API
export const getStatistics = () => axiosInstance.get(STATISTICS_ENDPOINT);

export const getStatisticById = (id: number) =>
  axiosInstance.get(`${STATISTICS_ENDPOINT}/${id}`);

export const createStatistic = (data: any) =>
  axiosInstance.post(STATISTICS_ENDPOINT, data);

export const updateStatistic = (id: number, data: any) =>
  axiosInstance.put(`${STATISTICS_ENDPOINT}/${id}`, data);

export const deleteStatistic = (id: number) =>
  axiosInstance.delete(`${STATISTICS_ENDPOINT}/${id}`);
