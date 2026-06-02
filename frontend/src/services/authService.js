import axios from 'axios'
import API from "./api"

// User signup and login API
export const addUser = (data) => axios.post('http://localhost:4000/cms/auth/signup', data)
export const loginUser = (data) => API.post('/auth/login', data)