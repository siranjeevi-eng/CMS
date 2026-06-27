import API from './api'

export const getLogsAPI = (patientId) => API.get(`/patient/${patientId}/logs`)