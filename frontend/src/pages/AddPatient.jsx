import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { addPatientAPI } from "../services/patientService"
import { useState } from "react"

export default function AddPatient({doctor}){
   
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

            {error && 
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
            </div>}
        <form onSubmit={handleSubmit(onSubmit)}
         className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4 mt-8"
        >
                <h1 className="text-xl font-semibold mb-4">Add Patient</h1>
                <input
                    id="patientInfo.name"
                    type="text"
                    placeholder="Patient name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                    {...register("patientInfo.name", {
                        required: "Patient name is required"
                    })}
                />
                {errors.patientInfo?.name && (
                    <p className="text-red-500 text-sm">{errors.patientInfo.name.message}</p>
                    )}
                <input
                    id="patientInfo.email"
                    type="text"
                    placeholder="Patient email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                    {...register("patientInfo.email", {
                        required: "Patient email is required"
                    })}
                />
                {errors.patientInfo?.email && (
                    <p className="text-red-500 text-sm">{errors.patientInfo.email.message}</p>
                )}
                <input
                    id="patientInfo.phone"
                    type="text"
                    placeholder="Patient mobile number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                    {...register("patientInfo.phone", {
                        required: "Patient mobile number is required"
                    })}
                />
                {errors.patientInfo?.phone && (
                    <p className="text-red-500 text-sm">{errors.patientInfo.phone.message}</p>
                )}
                <input
                    id="patientInfo.age"
                    type="number"
                    placeholder="Patient age"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                    {...register("patientInfo.age", {
                        required: "Patient age is required",
                        min: {
                            value: 1,
                            message: "Age must be greater than 0"
                        }
                    })}
                />
                {errors.patientInfo?.age && (
                    <p className="text-red-500 text-sm">{errors.patientInfo.age.message}</p>
                )}
              
                <select
                    id="patientInfo.gender"
                    type="text"
                    placeholder="Patient gender"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                    {...register("patientInfo.gender", {
                        required: "Patient gender is required"
                    })}
                >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                {errors.patientInfo?.gender && (
                    <p className="text-red-500 text-sm">{errors.patientInfo.gender.message}</p>
                )}
                <input
                    id="medicalRecord.disease"
                    type="text"
                    placeholder="Enter disease"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                    {...register("medicalRecord.disease", {
                        required: "Patient disease is required"
                    })}
                />
                {errors.medicalRecord?.disease && (
                    <p className="text-red-500 text-sm">{errors.medicalRecord.disease.message}</p>
                )}

                <input
                    id="medicalRecord.treatment"
                    type="text"
                    placeholder="Enter treatment"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                    {...register("medicalRecord.treatment", {
                        required: "Patient treatment is required"
                    })}
                />
                {errors.medicalRecord?.treatment && (
                    <p className="text-red-500 text-sm">{errors.medicalRecord.treatment.message}</p>
                )}

                <select
                    {...register("medicalRecord.doctorAssigned")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                    {doctor.map((d) => (
                        <option
                            key={d._id}
                            value={d._id}
                        >
                            Dr. {d.name}
                        </option>
                    ))}
                </select>
                {errors.medicalRecord?.doctorAssigned && (
                    <p className="text-red-500 text-sm">{errors.medicalRecord.doctorAssigned.message}</p>
                )}

                <input
                    id="medicalRecord.admissionDate"
                    type="date"
                    placeholder="Enter treatment"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                    {...register("medicalRecord.admissionDate", {
                        required: "Patient admission date is required"
                    })}
                />
                {errors.medicalRecord?.admissionDate && (
                    <p className="text-red-500 text-sm">{errors.medicalRecord.admissionDate.message}</p>
                )}

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    type="submit">Add</button>
        </form>
    </>
    )
}