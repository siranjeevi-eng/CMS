
import { useEffect, useState } from "react";
import { getDoctor, AddDoctorAPI } from "../services/docService"


export default function useDocotor(){
    const [docErr,setDocErr] = useState(null);
    const [doctor, setDoctor] = useState([]);
    const [doctorCount, setDcotorCount] = useState(0);
    const [patientCount, setPatientCount] = useState(0);
    const [patientsAddedToday, setPatientsAddedToday] = useState(0);
    const [patientsAddedThisMonth, setPatientsAddedThisMonth] = useState(0);

    const fetchDoctor = async function (){
            try{
                const response = await getDoctor()
                setDoctor(response.data.doctors);
                setDcotorCount(response.data.totalDoctors);
                setPatientCount(response.data.totalPatients);
                setPatientsAddedToday(response.data.patientsAddedToday);
                setPatientsAddedThisMonth(response.data.patientsAddedThisMonth);
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

    

    return { docErr, doctor, addDoctor, doctorCount, patientCount, patientsAddedToday, patientsAddedThisMonth}

}