
import { useEffect, useState } from "react";
import axios from "axios";
import { getDoctor, AddDoctorAPI, dashboardAPI } from "../services/docService"
import type { DoctorBody } from "../services/docService";
import toast from "react-hot-toast";


export default function useDocotor(){
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
            if (axios.isAxiosError(err)) {
                toast.error(
                    err.response?.data?.message || "Something went wrong"
                );
            } else {
                toast.error("Something went wrong");
            }
        }    }

    useEffect(()=>{
        fetchDashboard()
    },[])

    const addDoctor = async function (data: DoctorBody) {
        try
        {
            await AddDoctorAPI(data)
            fetchDoctor()
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

    

    return { doctor, addDoctor, doctorCount, patientCount, patientsAddedToday, patientsAddedThisMonth, underTreatmentPatients, recoveredPatients, dischargedPatients}

}