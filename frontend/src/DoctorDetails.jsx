import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { showDoctorAPI, editDoctorAPI, deleteDoctorAPI } from "./services/docService";
import { useForm } from "react-hook-form"


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
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => { async function fetchDoctor() {
    try{
      const res = await showDoctorAPI(id)
      setDoc(res.data.doctor)

    }catch(err){
      console.error(err.message)
      setError(err.response?.data?.message)
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
      navigate('/dashboard')
    }catch(err){
      console.error(err.message)
      setError(err.response?.data?.message)
    }
  }

  async function onSubmit(data){
    try{
        const res = await editDoctorAPI(id, data)
        setDoc(res.data.doctor)
        setIsEditing(false)

        
    } catch (err) {
      console.error(err.message)
      setError(err.response?.data?.message)
    }

  }
  
  if (loading){
    return <p>Loading...</p>
  }

  if(error){
    return <p>{error}</p>
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
            <div className="bg-white rounded-xl px-6  shadow-md p-6">

              <h2 className="text-2xl font-semibold mb-6">
                Dr. {doc?.name}
              </h2>

              <div className="space-y-4">

                <div>
                  <p className="text-sm text-gray-500">
                    Specialization
                  </p>
                  <p className="font-medium">
                    {doc?.specialization}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Email
                  </p>
                  <p className="font-medium">
                    {doc?.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Experience
                  </p>
                  <p className="font-medium">
                    {doc?.experience} Years
                  </p>
                </div>

              </div>

            {role === 'admin' && (
              <div className="flex gap-3 mt-8">

                <button
                  onClick={handleEdit}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>

              </div>
              )}
              </div>
        </>
      )}
    </div>
  );
   
}
