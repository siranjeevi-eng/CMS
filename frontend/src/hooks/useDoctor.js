
import { useEffect, useState } from "react";
import { getDoctor, AddDoctorAPI } from "../services/docService"


export default function useDocotor(){
    const [docErr,setDocErr] = useState(null)
    const [usr, setUsr] = useState([])
    
    const fetchDoctor = async function (){
            try{
                const response = await getDoctor()
                setUsr(response.data.doctors)
                
            }catch(err){
                setDocErr(err.message)
            }
        }

    
    useEffect(()=>{
        fetchDoctor()
    },[])

    const addDoctor = async function (data) {
        try
        {
            await AddDoctorAPI(data)
            fetchDoctor()
        }catch(err){
            setDocErr(err.response?.data?.message ||
                "Something went wrong")
        }
    }

    

    return { docErr, usr, addDoctor}

}