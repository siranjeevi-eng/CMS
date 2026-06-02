import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addUser, loginUser } from "../services/authService";


export default function useUser(){
    const [err, setErr] = useState(null)
    const [user, setUser] = useState([])
    const navigate = useNavigate()

    async function insertUser(data){
        try{
            const response = await addUser(data)
            setUser(prev => [...prev, response.data])

            alert("User added")

            localStorage.setItem("token", response.data.token)

            navigate("/dashboard")

        }catch(err){
            console.error(err.message)
            setErr(err.response?.data?.message ||
                "Something went wrong")
            
        }
    }
    async function LoginUser(data){
        try{
            const response = await loginUser(data)
            
            if(response.data.token){
            
            localStorage.setItem("token", response.data.token)
            alert("Logged In")
            navigate("/dashboard")
            }
            else{
                alert(response.data)
            }
        }

        catch(err){
            setErr(err.message)
            alert('Invalid credentials')
        }
    }

    function logout(){
        localStorage.removeItem('token')
        navigate("/login")
    }

    return{user, err, insertUser, LoginUser, logout}
}