import API from './api'

export const getLogsAPI = (patientId:string, logPage:number) => API.get(`/patient/${patientId}/logs?page=${logPage}`)