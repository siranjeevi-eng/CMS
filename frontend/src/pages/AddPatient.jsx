import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { addPatientAPI } from "../services/patientService"
import { useState } from "react"

export default function AddPatient(){
   
    const navigate = useNavigate()
    const [error, setError] = useState("") 
    const {
        register,
        handleSubmit,
        formState:{errors}
    } = useForm()

    async function onSubmit(data) {
        try {
            await addPatientAPI(data)
            alert("Patient added successfully")
            navigate('/patients')
        } catch (err) {
            console.error("Failed to add patient:", err)
            setError(err.response?.data?.message)

        }
    }
    
    return(
    <>
    {error && <p>{error}</p>}
     <h2>Add New Patient</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                        required: "Patient email is required"
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

                <button type="submit">Add</button>
        </form>
    </>
    )
}