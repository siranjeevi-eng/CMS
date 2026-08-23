import API from './api'

interface NoteBody {
    content: string;
}

export const getNotesAPI = (patientId:string,notesPage:number )=> API.get(`/patient/${patientId}/note?page=${notesPage}`)
export const addNotesAPI = (data:string, patientId:string) => API.post(`/patient/${patientId}/note/add`, data)
export const editNoteAPI = (data:NoteBody,patientId:string, noteId:string) => API.put(`/patient/${patientId}/note/${noteId}/edit`, data)
