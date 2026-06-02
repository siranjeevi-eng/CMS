import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"

import { showOnePatientAPI, editPatientAPI, deletePatientAPI } from "../services/patientService"

export default function PatientDetails() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [patient, setPatient] = useState()
    const [isEditing, setIsEditing] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors }
    } = useForm()


    useEffect(() => {

        async function fetchPatient() {

            try {

                const res = await showOnePatientAPI(id)
                setPatient(res.data.patient)
                setError("")

            }
            catch (err) {
                console.error("Failed to fetch patient:", err);
                setError(err.response?.data?.message)
            }
            finally{
                setLoading(false)
            }
        }

        fetchPatient()
    }, [id])

    //handleEdit

    function handleEdit(){
        setIsEditing(true)
        reset({
            patientInfo: patient.patientInfo,
            medicalRecord: {
                ...patient.medicalRecord,

                admissionDate:
                    patient.medicalRecord.admissionDate
                        ?.split("T")[0]
            }
        })
    }

    async function onSubmit(data){
        try{
            const res = await editPatientAPI(id, data)
            setPatient(res.data.patient)
            setIsEditing(false)
            setError("")
    
            
        }catch(err){
            console.error("Failed to update the patient:", err);
            setError(err.response?.data?.message)
        }
    
      }
      
       async function handleDelete(id) {
       const confirmed = window.confirm(
               "Are you sure you want to delete this patient?"
           )
        
           if(!confirmed) 
           {
            return
        }
                try{
                  await deletePatientAPI(id)
                  alert('Patient data has been deleted successfully')
                  navigate('/patients')
                
            }
                catch(err){
                console.error("Failed to delete patient:", err);
                setError(err.response?.data?.message)
        }
           
      }

    if (loading) {
        return <p>Loading patient details...</p>
    }
    return (
        <>
        {error && <p>{error}</p>}
        {isEditing ?(
            <form onSubmit={handleSubmit(onSubmit)}>
                    <h2>Edit Patient Details</h2>
                    <input
                        id="patientInfo.name"
                        type="text"
                        placeholder="Patient name"

                        {...register("patientInfo.name", {
                            required: "Patient name is required"
                        })}
                    />
                    {errors.patientInfo?.name && (
                        <p>{errors.patientInfo.name.message}</p>
                    )}
                    <input
                        id="patientInfo.email"
                        type="text"
                        placeholder="Patient email"

                        {...register("patientInfo.email", {
                            required: "Patient email is required",
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: "Enter a valid email"
                            }
                        })}
                    />
                    {errors.patientInfo?.email && (
                        <p>{errors.patientInfo.email.message}</p>
                    )}
                    <input
                        id="patientInfo.phone"
                        type="text"
                        placeholder="Patient mobile number"

                        {...register("patientInfo.phone", {
                            required: "Patient mobile number is required"
                        })}
                    />
                    {errors.patientInfo?.phone && (
                        <p>{errors.patientInfo.phone.message}</p>
                    )}
                    <input
                        id="patientInfo.age"
                        type="number"
                        placeholder="Patient age"

                        {...register("patientInfo.age", {
                            required: "Patient age is required",
                            min: {
                                value: 1,
                                message: "Age must be greater than 0"
                            }
                        })}
                    />
                    {errors.patientInfo?.age && (
                        <p>{errors.patientInfo.age.message}</p>
                    )}
                    <input
                        id="patientInfo.gender"
                        type="text"
                        placeholder="Patient gender"

                        {...register("patientInfo.gender", {
                            required: "Patient gender is required"
                        })}
                    />
                    {errors.patientInfo?.gender && (
                        <p>{errors.patientInfo.gender.message}</p>
                    )}
                    <input
                        id="medicalRecord.disease"
                        type="text"
                        placeholder="Enter disease"

                        {...register("medicalRecord.disease", {
                            required: "Patient disease is required"
                        })}
                    />
                    {errors.medicalRecord?.disease && (
                        <p>{errors.medicalRecord.disease.message}</p>
                    )}

                    <input
                        id="medicalRecord.treatment"
                        type="text"
                        placeholder="Enter treatment"

                        {...register("medicalRecord.treatment", {
                            required: "Patient treatment is required"
                        })}
                    />
                    {errors.medicalRecord?.treatment && (
                        <p>{errors.medicalRecord.treatment.message}</p>
                    )}

                    <input
                        id="medicalRecord.doctorAssigned"
                        type="text"
                        placeholder="Enter Doctor Assigned"

                        {...register("medicalRecord.doctorAssigned", {
                            required: "Patient assigned doctor detail is required"
                        })}
                    />
                    {errors.medicalRecord?.doctorAssigned && (
                        <p>{errors.medicalRecord.doctorAssigned.message}</p>
                    )}

                    <input
                        id="medicalRecord.admissionDate"
                        type="date"
                        placeholder="Enter treatment"

                        {...register("medicalRecord.admissionDate", {
                            required: "Patient admission date is required"
                        })}
                    />
                    {errors.medicalRecord?.admissionDate && (
                        <p>{errors.medicalRecord.admissionDate.message}</p>
                    )}

                <button type="submit">Save</button>
                <button type="button" onClick={()=>{
                    setIsEditing(false)
                    setError("")
                    }}>Cancel</button>
            </form>
        ):(
            <>
                    <h2>Patient details</h2>
                    <h3>Name: {patient?.patientInfo?.name}</h3>
                    <p>Email: {patient?.patientInfo?.email}</p>
                    <p>Age: {patient?.patientInfo?.age}</p>
                    <p>Gender: {patient?.patientInfo?.gender}</p>
                    <p>Phone: {patient?.patientInfo?.phone}</p>
                    <p>Doctor Assigned: {patient?.medicalRecord?.doctorAssigned}</p>
                    <p>Disease: {patient?.medicalRecord?.disease}</p>
                    <p>Treatment: {patient?.medicalRecord?.treatment}</p>
                    <p>Admission Date: {
                        patient?.medicalRecord?.admissionDate
                            ?.split("T")[0]
                        }</p>

                    <button onClick = {handleEdit}>Edit</button>
                    <button onClick={() => { handleDelete(id) }}>Delete</button>
            </>
        )}
       </>
    )
}