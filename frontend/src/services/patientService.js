import axios from "axios"
import API from "./api"


export const getPatientsAPI = () => API.get('/patient')
export const showOnePatientAPI = (id) => API.get(`/patient/${id}`)
export const editPatientAPI = (id, data) => API.put(`/patient/${id}/edit`, data)
export const addPatientAPI = (data) => API.post('/patient/add', data)
export const deletePatientAPI = (id) => API.delete(`/patient/${id}/delete`)