import axios from "axios"
import API from "./api"


//API for Doctor CRUD
export const getDoctor = ()=> API.get('/doctor/get')
export const AddDoctorAPI = (data)=> API.post('/doctor/add', data)
export const showDoctorAPI = (id) => API.get(`/doctor/${id}`)
export const editDoctorAPI = (id,data) => API.put(`/doctor/${id}/edit`, data)
export const deleteDoctorAPI = (id) => API.delete(`/doctor/${id}/delete`)


