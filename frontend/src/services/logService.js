import API from './api'

export const getLogsAPI = (patientId, logPage) => API.get(`/patient/${patientId}/logs?page=${logPage}`)