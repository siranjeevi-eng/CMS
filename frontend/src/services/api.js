import axios from 'axios'

const API = axios.create({
    baseURL: "http://localhost:4000/cms"
})

API.interceptors.request.use((req) => {

    const token = localStorage.getItem("token")

    if (token) {
        req.headers.Authorization = `Bearer ${token}`
        console.log(req.headers.Authorization)
    }
    return req
})

export default API