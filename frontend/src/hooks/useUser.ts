import { useState } from "react";
import axios from "axios";
import type { SignupData, LoginData } from "../services/authService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addUser, loginUser } from "../services/authService";


export default function useUser(){
    const navigate = useNavigate()

    async function insertUser(data: SignupData){
        try{
            const response = await addUser(data)

            toast.success("User added successfully");

            localStorage.setItem("token", response.data.token)
            localStorage.setItem("role", response.data.user.role)
            localStorage.setItem("userId", response.data.user._id)

            navigate("/dashboard")

        } catch (err) {
            if (axios.isAxiosError(err)) {
                toast.error(
                    err.response?.data?.message || "Something went wrong"
                );
            } else {
                toast.error("Something went wrong");
            }
        }
    }
    async function LoginUser(data: LoginData){
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

        catch (err) {
            if (axios.isAxiosError(err)) {
                toast.error(
                    err.response?.data?.message || "Something went wrong"
                );
            } else {
                toast.error("Something went wrong");
            }
        }
    }

    function logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('userId')
        navigate("/login")
    }

    return{ insertUser, LoginUser, logout}
}