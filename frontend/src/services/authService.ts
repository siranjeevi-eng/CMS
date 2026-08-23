import API from "./api"

enum Role{
    ADMIN = "admin",
    DOCTOR = "doctor"
}

export interface SignupData {
    name: string;
    email: string;
    password: string;
    role: Role;
}
export interface LoginData{
    email: string;
    password: string;
}

// User signup and login API
export const addUser = (data: SignupData) => API.post('/auth/signup', data);
export const loginUser = (data: LoginData) => API.post('/auth/login', data);