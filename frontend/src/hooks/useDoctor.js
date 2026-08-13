
import { useEffect, useState } from "react";
import { getDoctor, AddDoctorAPI, dashboardAPI } from "../services/docService"


export default function useDocotor(){
    const [docErr,setDocErr] = useState(null);
    const [doctor, setDoctor] = useState([]);
    const [doctorCount, setDcotorCount] = useState(0);
    const [patientCount, setPatientCount] = useState(0);
    const [patientsAddedToday, setPatientsAddedToday] = useState(0);
    const [patientsAddedThisMonth, setPatientsAddedThisMonth] = useState(0);
    const [underTreatmentPatients, setUnderTreatmentPatients] = useState(0);
    const [recoveredPatients, setRecoveredPatients] = useState(0);
    const [dischargedPatients, setDischargedPatients] = useState(0);


    const fetchDoctor = async function (){
            try{
                const response = await getDoctor()
                setDoctor(response.data.doctors);
            }catch(err){
                setDocErr(err.message)
            }
        }

    
    useEffect(()=>{
        fetchDoctor()
    },[])

    const fetchDashboard = async function () {
        try{
            const response = await dashboardAPI()
            console.log(response)
            setDcotorCount(response.data.totalDoctors);
            setPatientCount(response.data.totalPatients);
            setPatientsAddedToday(response.data.patientsAddedToday);
            setPatientsAddedThisMonth(response.data.patientsAddedThisMonth);
            setUnderTreatmentPatients(response.data.underTreatmentPatients);
            setRecoveredPatients(response.data.recoveredPatients);
            setDischargedPatients(response.data.dischargedPatients);
        }
        catch (err) {
            setDocErr(err.message)
        }
    }

    useEffect(()=>{
        fetchDashboard()
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

    

    return { docErr, doctor, addDoctor, doctorCount, patientCount, patientsAddedToday, patientsAddedThisMonth, underTreatmentPatients, recoveredPatients, dischargedPatients}

}