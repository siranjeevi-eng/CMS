import { useParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { showDoctorAPI, editDoctorAPI, deleteDoctorAPI } from "./services/docService";
import { useForm } from "react-hook-form"

import { UserRound, Smile, Hospital, ChevronRight } from "lucide-react";


export default function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const role = localStorage.getItem("role")

  const {
    handleSubmit,
    register,
    reset,
    formState: {errors}
  } = useForm()
  const [doc, setDoc] = useState()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => { async function fetchDoctor() {
    try{
      const res = await showDoctorAPI(id)
      setDoc(res.data.doctor)
      setPatients(res.data.patients)
    }catch(err){
      console.error('Unable to fetch the doctor details',err.message)
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }finally{
      setLoading(false)
    }
    
  }

    fetchDoctor()

  }, [id]);


  function handleEdit(){
    setIsEditing(true)
    reset({
      name: doc.name,
      email: doc.email,
      specialization: doc.specialization,
      experience: doc.experience,
    });
  }

  async function handleDelete(id){
    try{
      await deleteDoctorAPI(id)
      toast.success("Doctor deleted successfully");
      navigate('/dashboard')
    }catch(err){
      console.error(err.message)
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }

  async function onSubmit(data){
    try{
        const res = await editDoctorAPI(id, data)
        setDoc(res.data.doctor)
        setIsEditing(false)
      toast.success("Doctor details updated successfully");

        
    } catch (err) {
      console.error(err.message)
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }

  }
  
  if (loading){
    return <p>Loading...</p>
  }


  return(
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Doctor Details
      </h1>
      {isEditing ? (
        // EDIT MODE (full form)
        <form onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4 mt-8"
        >
          <h2 className="text-xl font-semibold mb-4">Edit Doctor Details</h2>
          <input
            id="name"
            type="text"
            placeholder="Enter Doctor name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

            {...register("name", {
              required: "Doctor name is required"
            })}
          />

          {errors.name &&
            <p className="text-red-500 text-sm">
              {errors.name.message}
            </p>}

          <input
            id="email"
            type="email"
            placeholder="Enter Doctor's email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("email", {
              required: "Doctor's email is required"
            })}
          />
          {errors.email &&
            <p className="text-red-500 text-sm">
              {errors.email.message}
            </p>}

          <input
            id="specialization"
            type="text"
            placeholder="Enter the specialization"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("specialization", {
              required: "Specialization is required"
            })}
          />
          {errors.specialization &&
            <p className="text-red-500 text-sm">
              {errors.specialization.message}
            </p>}

          <input
            id="experience"
            type="number"
            placeholder="Experience"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={0}
            {...register("experience", {
              required: "Experience is required"
            })}
          />
          {errors.experience &&
            <p className="text-red-500 text-sm">
              {errors.experience.message}
            </p>}


          <button type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Save
          </button>
          <button type="button" onClick={() => setIsEditing(false)}
          className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition"
            >
            Cancel
          </button>
        </form>) : (
        // VIEW MODE
          <>
            <div className="bg-white rounded-1xl shadow-md p-8">

              <div className="flex items-center gap-6">

                <div className="w-18 h-18 rounded-full bg-blue-100 text-blue-700 text-3xl font-bold flex items-center justify-center">
                  {doc?.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Dr. {doc?.name}
                  </h2>

                  <span className="inline-block mt-3 px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                    {doc?.specialization}
                  </span>
                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-8 mt-10">

                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Email
                  </p>

                  <p className="font-semibold text-gray-800">
                    {doc?.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Experience
                  </p>

                  <p className="font-semibold text-gray-800">
                    {doc?.experience} Years
                  </p>
                </div>

              </div>

              {role === "admin" && (
                <div className="flex gap-4 mt-10">

                  <button
                    onClick={handleEdit}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(id)}
                    className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>

                </div>
              )}

            </div>

            {/* Assigned Patients */}

            <div className="bg-white rounded-2xl shadow-md p-8 mt-8">

              <h2 className="text-xl font-bold mb-6">
                Assigned Patients ({patients.length})
              </h2>

              {patients.length === 0 ? (
                <p className="text-gray-500">
                  No patients assigned.
                </p>
              ) : (

                <div className="space-y-4">

                  {patients.map((patient) => (
                    <Link
                      key={patient._id}
                      to={`/patient/${patient._id}`}
                      className="flex justify-between items-center p-5 rounded-xl border border-gray-100 hover:bg-gray-50 hover:shadow-sm transition cursor-pointer"
                    >

                      <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                          {patient.patientInfo.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {patient.patientInfo.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            Age: {patient.patientInfo.age} • {patient.patientInfo.gender}
                          </p>
                        </div>

                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${patient.medicalRecord.status === "under_treatment"
                            ? "bg-green-100 text-green-700"
                            : patient.medicalRecord.status === "recovered"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                      >
                        {patient.medicalRecord.status.replace("_", " ")}
                      </span>

                    </Link>
                  ))}

                </div>
              )}

            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

              <h2 className="text-xl font-semibold text-center mb-6">
                Quick Actions
              </h2>

              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex flex-wrap justify-center gap-5">

                  <Link
                    to="/doctors"
                    className="px-6 py-3 rounded-xl bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition shadow-sm hover:shadow-md"
                  >
                    👨‍⚕️ View All Doctors
                  </Link>

                  <Link
                    to="/patient/add"
                    className="px-6 py-3 rounded-xl bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition shadow-sm hover:shadow-md"
                  >
                    ➕ Add Patient
                  </Link>

                  <Link
                    to="/dashboard"
                    className="px-6 py-3 rounded-xl bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition shadow-sm hover:shadow-md"
                  >
                    📊 Dashboard
                  </Link>

                </div>

              </div>

            </div>
          </>
      )}
    </div>
  );
   
}
