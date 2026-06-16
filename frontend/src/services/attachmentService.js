import API from './api'

export const createAttachmentAPI =(data,patientId)=> API.post(`patient/${patientId}/attachment`, data)
export const getAttachmentAPI = (patientId) => API.get(`patient/${patientId}/attachment`)
export const downloadAttachmentAPI = (patientId, attachmentId) => API.get(`patient/${patientId}/attachment/${attachmentId}/download`)