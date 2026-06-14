import API from './api'

export const getNotesAPI = (patientId)=> API.get(`/patient/${patientId}/note`)
export const addNotesAPI = (data, patientId) => API.post(`/patient/${patientId}/note/add`, data)
export const editNoteAPI = (data,patientId, noteId) => API.put(`/patient/${patientId}/note/${noteId}/edit`, data)
