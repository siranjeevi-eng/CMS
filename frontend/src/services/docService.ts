import API from "./api"

export interface DoctorBody{
    name: string;
    email: string;
    specialization: string;
    experience: number;
}
export interface Doctor {
    _id: string;
    userId: string;
    name: string;
    email: string;
    specialization: string;
    experience: number;
}

//API for Doctor CRUD
export const getDoctor = ()=> API.get('/doctor')
export const dashboardAPI = () => API.get('/dashboard')
export const AddDoctorAPI = (data: DoctorBody)=> API.post('/doctor/add', data)
export const showDoctorAPI = (id: string) => API.get(`/doctor/${id}`)
export const editDoctorAPI = (id: string,data: DoctorBody) => API.put(`/doctor/${id}/edit`, data)
export const deleteDoctorAPI = (id: string) => API.delete(`/doctor/${id}/delete`)



