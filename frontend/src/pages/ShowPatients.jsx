import {getPatientsAPI} from '../services/patientService'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


export default function ShowPatients(){
    const [patient, setPatient] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchPatients() {
            try {
                const res = await getPatientsAPI()
                setPatient(res.data.patients)
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

    }, []);


    if (loading) {
        return <p>Loading patients...</p>
    }

    return(
        <>
        
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h2 className="text-3xl font-bold mb-6">
                Patients
            </h2>
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
                                    <tr className="bg-gray-100">
                                        <th className="text-left p-4">Name</th>
                                        <th className="text-left p-4">Doctor</th>
                                        <th className="text-left p-4">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {patient.map((p) => (
                                        <tr key={p._id} className="border-t">
                                            <td className="p-4">{p.patientInfo.name}</td>
                                            <td className="p-4">{p.medicalRecord.doctorAssigned.name}</td>
                                            <td className="p-4">
                                                <Link to={`/patient/${p._id}`}>
                                                    View
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
        </div>        
                
        </>
    )

}