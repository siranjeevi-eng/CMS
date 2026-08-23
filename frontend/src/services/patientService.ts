import API from "./api"
import { Doctor } from "./docService";

export interface PatientBody {
    patientInfo: {
        name: string;
        email: string;
        age: number;
        gender: "male" | "female" | "other";
        phone: string;
    },
    medicalRecord: {
        disease: string;
        treatment: string;
        status: "under_treatment" | "recovered" | "discharged";
        admissionDate: string;
        doctorAssigned: string;
    }
}

export interface Patient {
    _id: string;
    patientInfo: {
        name: string;
        email: string;
        age: number;
        gender: "male" | "female" | "other";
        phone: string;
    };
    medicalRecord: {
        disease: string;
        treatment: string;
        status: "under_treatment" | "recovered" | "discharged";
        admissionDate: string;
        doctorAssigned: Doctor | null;
    };
    createdAt: string;
}

export const getPatientsAPI =(search = "",
    page = 1,
    limit = 10,
    filter = "",
    status = "",
    mine ="") => API.get(`/patient?search=${search}&page=${page}&limit=${limit}&filter=${filter}&status=${status}&mine=${mine}`)
export const showOnePatientAPI = (id:string) => API.get(`/patient/${id}`)
export const editPatientAPI = (id:string, data:PatientBody) => API.put(`/patient/${id}/edit`, data)
export const addPatientAPI = (data:PatientBody) => API.post('/patient/add', data)
export const deletePatientAPI = (id:string) => API.delete(`/patient/${id}/delete`)