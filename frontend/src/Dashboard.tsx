import { useForm } from "react-hook-form"
import { useState, useEffect } from "react";
import axios from "axios";
import { UserRound, Smile, Hospital, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"
import { getPatientsAPI } from "./services/patientService"
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

import type { Patient } from "./services/patientService";

interface DashboardProps {
    doctorCount: number;
    patientCount: number;
    patientsAddedToday: number;
    patientsAddedThisMonth: number;
    underTreatmentPatients: number;
    recoveredPatients: number;
    dischargedPatients: number;
}


export default function Dashboard({ 
    doctorCount, 
    patientCount, 
    patientsAddedToday, 
    patientsAddedThisMonth, 
    underTreatmentPatients, 
    recoveredPatients, 
    dischargedPatients
 }: DashboardProps){

    const navigate = useNavigate()
    const [patients, setPatients] = useState <Patient[]>([])
    const role = localStorage.getItem("role");

    useEffect(()=>{
        fetchPatients()
    },[])
    async function fetchPatients() {
        try{
            const res = await getPatientsAPI("",1,3,"","")
            setPatients(res.data.patients)
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


    return(
      <> 
            <div className="max-w-7xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                    {/* Total Doctors */}
                    <Link to="/doctors">
                        <div className="h-30 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center">
                            <p className="text-sm font-medium text-gray-500">
                                👨‍⚕️ Total Doctors
                            </p>

                            <h2 className="mt-3 text-4xl font-bold text-gray-900">
                                {doctorCount}
                            </h2>
                        </div>
                    </Link>

                    {/* Total Patients */}
                    <Link to="/patients">
                        <div className="h-30 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center">
                            <p className="text-sm font-medium text-gray-500">
                                🧑 Total Patients
                            </p>

                            <h2 className="mt-3 text-4xl font-bold text-gray-900">
                                {patientCount}
                            </h2>
                        </div>
                    </Link>

                    {/* Patients Added Today */}
                    <div
                        onClick={() => navigate("/patients?filter=today")}
                        className="h-30 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center"
                    >
                        <p className="text-sm font-medium text-gray-500">
                            🧑 Patients Added Today
                        </p>

                        <h2 className="mt-3 text-4xl font-bold text-gray-900">
                            {patientsAddedToday}
                        </h2>
                    </div>

                    {/* Patients Added This Month */}
                    <div
                        onClick={() => navigate("/patients?filter=month")}
                        className="h-30 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center"
                    >
                        <p className="text-sm font-medium text-gray-500">
                            🧑 Patients Added This Month
                        </p>

                        <h2 className="mt-3 text-4xl font-bold text-gray-900">
                            {patientsAddedThisMonth}
                        </h2>
                    </div>

                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Patient Status */}
                    <div className="bg-white rounded-2xl shadow-md p-6">

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Patient Status
                            </h2>

                            <button
                                onClick={() => navigate("/patients")}
                                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                            >
                                View All
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">

                            <div
                                onClick={() => navigate("/patients?status=under_treatment")}
                                className="flex justify-between items-center p-5 rounded-2xl bg-green-50 border border-green-100 cursor-pointer hover:bg-green-100 transition-all duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <Hospital className="w-6 h-6 text-green-600" />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-green-700">
                                            Under Treatment
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            Patients currently under treatment
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-bold text-green-600">
                                        {underTreatmentPatients}
                                    </span>

                                    <ChevronRight className="text-green-600" />
                                </div>
                            </div>

                            <div
                                onClick={() => navigate("/patients?status=recovered")}
                                className="flex justify-between items-center p-5 rounded-2xl bg-yellow-50 border border-yellow-100 cursor-pointer hover:bg-yellow-100 transition-all duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-yellow-100 p-3 rounded-full">
                                        <Smile className="w-6 h-6 text-yellow-600" />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-yellow-700">
                                            Recovered
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            Patients who have recovered
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-bold text-yellow-600">
                                        {recoveredPatients}
                                    </span>

                                    <ChevronRight className="text-yellow-600" />
                                </div>
                            </div>

                            <div
                                onClick={() => navigate("/patients?status=discharged")}
                                className="flex justify-between items-center p-5 rounded-2xl bg-blue-50 border border-blue-100 cursor-pointer hover:bg-blue-100 transition-all duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <UserRound className="w-6 h-6 text-blue-600" />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-blue-700">
                                            Discharged
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            Patients successfully discharged
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-bold text-blue-600">
                                        {dischargedPatients}
                                    </span>

                                    <ChevronRight className="text-blue-600" />
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Recent Patients */}

                    <div className="bg-white rounded-2xl shadow-md p-6">

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Recent Patients
                            </h2>

                            <button
                                onClick={() => navigate("/patients")}
                                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                            >
                                View All
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        <div className="divide-y divide-gray-100">

                            {patients.length === 0 ? (
                                <p className="text-gray-500 py-6 text-center">
                                    No patients found.
                                </p>
                            ) : (
                                patients.slice(0, 5).map((patient) => (
                                    <div
                                        key={patient._id}
                                        onClick={() => navigate(`/patient/${patient._id}`)}
                                        className="flex items-center justify-between py-4 hover:bg-gray-50 rounded-lg px-2 cursor-pointer transition"
                                    >
                                        <div className="flex items-center gap-4">

                                            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                                                {patient.patientInfo.name.charAt(0).toUpperCase()}
                                            </div>

                                            <div className="flex-1 ml-4">
                                                <h3 className="font-semibold text-gray-900">
                                                    {patient.patientInfo.name}
                                                </h3>

                                                <p className="text-sm text-gray-500">
                                                    Age: {patient.patientInfo.age} •{" "}
                                                    {patient.patientInfo.gender.charAt(0).toUpperCase() +
                                                        patient.patientInfo.gender.slice(1)}
                                                </p>

                                                <p className="text-xs text-gray-400 mt-1">
                                                    {formatDistanceToNow(new Date(patient.createdAt), {
                                                        addSuffix: true,
                                                    }).replace("about ", "")}
                                                </p>
                                            </div>
                                        </div>

                                        <ChevronRight className="text-gray-400" />
                                    </div>
                                ))
                            )}

                        </div>

                    </div>

                </div>
               
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-center mb-6">
                        Quick Actions
                    </h2>

                    <div className="flex flex-wrap justify-center gap-6">

                        <Link
                            to="/patient/add"
                            className="w-80 flex justify-between items-center p-5 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <UserRound className="w-6 h-6 text-blue-600" />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-blue-700">
                                        Add Patient
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Register a new patient
                                    </p>
                                </div>
                            </div>

                            <ChevronRight className="text-blue-600" />
                        </Link>

                        {role === "admin" && (
                            <Link
                                to="/doctors"
                                className="w-80 flex justify-between items-center p-5 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <Hospital className="w-6 h-6 text-green-600" />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-green-700">
                                            All Doctors
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            Show all available doctors
                                        </p>
                                    </div>
                                </div>

                                <ChevronRight className="text-green-600" />
                            </Link>
                        )}

                    </div>
                </div>

                </div>
                 
        </>
        
    )
}