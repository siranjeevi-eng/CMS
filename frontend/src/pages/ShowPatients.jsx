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
        
        {error && <p>{error}</p>}

        <div>
            <h2>All Patients</h2>
                {patient.length === 0 ? (
                    <p>No patients found.</p>
                ) : (
                    patient.map((p) => (
                        <li key={p._id}>
                            <Link to={`/patient/${p._id}`}>
                                {p.patientInfo.name}
                            </Link>
                        </li>
                    ))
                )}
        
        </div>        
                <Link to={'/patient/add'}> add new patient</Link>
        </>
    )

}