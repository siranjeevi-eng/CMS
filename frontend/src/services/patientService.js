import axios from "axios"
import API from "./api"


export const getPatientsAPI = (search,page) => API.get(`/patient?search=${search}&page=${page}&limit=10`)
export const showOnePatientAPI = (id) => API.get(`/patient/${id}`)
export const editPatientAPI = (id, data) => API.put(`/patient/${id}/edit`, data)
export const addPatientAPI = (data) => API.post('/patient/add', data)
export const deletePatientAPI = (id) => API.delete(`/patient/${id}/delete`)