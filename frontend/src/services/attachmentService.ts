import { string } from 'joi';
import API from './api'

export const createAttachmentAPI =(data:FormData,patientId:string)=> API.post(`patient/${patientId}/attachment`, data)
export const getAttachmentAPI = (patientId:string) => API.get(`patient/${patientId}/attachment`)
export const downloadAttachmentAPI = (patientId:string, attachmentId:string) => API.get(`patient/${patientId}/attachment/${attachmentId}/download`)
export const deleteAttachmentAPI = (patientId:string, attachmentId:string) => API.delete(`patient/${patientId}/attachment/${attachmentId}/delete`)