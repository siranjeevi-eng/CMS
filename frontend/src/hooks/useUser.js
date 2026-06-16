import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addUser, loginUser } from "../services/authService";


export default function useUser(){
    const [user, setUser] = useState([])
    const navigate = useNavigate()

    async function insertUser(data){
        try{
            const response = await addUser(data)
            setUser(prev => [...prev, response.data])

            toast.success("User added successfully");

            localStorage.setItem("token", response.data.token)
            localStorage.setItem("role", response.data.user.role)
            localStorage.setItem("userId", response.data.user._id)

            navigate("/dashboard")

        }catch(err){
            console.error(err.message)
            toast.error(
                err.response?.data?.message || "Something went wrong"
            );
            
        }
    }
    async function LoginUser(data){
        try{
            const response = await loginUser(data)

            if(response.data.token){

            localStorage.setItem("token", response.data.token)
            localStorage.setItem("role", response.data.user.role)
            localStorage.setItem("userId", response.data.user._id)

            toast.success("Logged In");
            navigate("/dashboard")

            }
            else{
                alert(response.data)
            }
        }

        catch(err){
            console.error("Logged in failed", err.response.data.message)
            toast.error(
                err.response?.data?.message || "Something went wrong"
            );
        }
    }

    function logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('userId')
        navigate("/login")
    }

    return{user, insertUser, LoginUser, logout}
}