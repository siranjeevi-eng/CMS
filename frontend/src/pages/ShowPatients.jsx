import {getPatientsAPI} from '../services/patientService'
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import {ChevronRight } from "lucide-react";


export default function ShowPatients(){
    const [patient, setPatient] = useState([])
    const [totalPatients, setTotalPatients] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [searchParams] = useSearchParams();

    const filter = searchParams.get("filter") || "";
    const status = searchParams.get("status") || "";
    const mine = searchParams.get("mine") || "";

    useEffect(() => {
        setPage(1);
    }, [search, filter]);

    useEffect(() => {
        async function fetchPatients() {
            try {
                const res = await getPatientsAPI(search, page, 10,filter, status,mine)
                setPatient(res.data.patients)
                setTotalPages(res.data.totalPages)
                setTotalPatients(res.data.totalPatients)
                setError("")

            } 
            catch (err) {
                console.error("Failed to fetch patients:", err);
                setError(err.response?.data?.message)
            }
            finally{
                setLoading(false)
            }
        }
        fetchPatients()
    }, [search,page,filter,status,mine]);


    if (loading) {
        return <p>Loading patients...</p>
    }

    return(
        <>
            <input
                type="text"
                placeholder={mine === "true" ? "Search my patient..." : "Search patient..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-xl px-4 py-2 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
        <div className="max-w-7xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold mb-8">
                    {mine === "true"
                        ? `My Patients (${totalPatients})`
                        : `Patients (${totalPatients})`}
                </h1>
                {error && (
                    <p className="text-red-500 mb-4">
                        {error}
                    </p>
                )}
                {patient.length === 0 ? (
                    <p>No patients found...</p>
                ) : (
                    
                        <div className="bg-white rounded-xl shadow overflow-hidden">

                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-100">
                                        <th className="text-left p-4">Name</th>
                                        <th className="text-left p-4">Doctor</th>
                                        <th className="text-left p-4">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {patient.map((p) => (
                                        <tr key={p._id} className="border-t">
                                            <td className="p-4">{p.patientInfo.name}</td>
                                            {p.medicalRecord.doctorAssigned?(

                                                <td className="p-4">{p.medicalRecord.doctorAssigned.name}</td>
                                                
                                            ):(                                                    
                                                <td className="p-4">Unassigned</td>
                                            )}
                                            <td className="p-4">
                                                <Link to={`/patient/${p._id}`}>
                                                    <span className="text-blue-600 font-medium hover:text-blue-700">
                                                        View →
                                                    </span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    
                )}
                <Link
                    to="/patient/add"
                    className="inline-block mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Add New Patient
                </Link>
                <div className="flex justify-center items-center gap-2 mt-6">

                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1 || page === 0}
                        className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => setPage(index + 1)}
                            className={`px-4 py-2 rounded ${page === index + 1
                                    ? "bg-blue-600 text-white"
                                    : "border hover:bg-gray-100"
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Next
                    </button>

                </div>
        </div>        
                
        </>
    )

}