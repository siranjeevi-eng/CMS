import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { showDoctorAPI, editDoctorAPI, deleteDoctorAPI } from "./services/docService";
import { useForm } from "react-hook-form"


export default function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
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
    reset(doc);
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
    <div>
      {isEditing ? (
        // EDIT MODE (full form)
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Edit Doctor</h2>
          <input
            id="name"
            type="text"
            placeholder="Enter Doctor name"

            {...register("name", {
              required: "Doctor name is required"
            })}
          />

          {errors.name &&
            <p>{errors.email.message}</p>}

          <input
            id="email"
            type="email"
            placeholder="Enter Doctor's email"

            {...register("email", {
              required: "Doctor's email is required"
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}

          <input
            id="specialization"
            type="text"
            placeholder="Enter the specialization"

            {...register("specialization", {
              required: "Specialization is required"
            })}
          />
          {errors.specialization &&
            <p>
              {errors.specialization.message}
            </p>}

          <input
            id="experience"
            type="number"
            placeholder="Experience"
            min={0}
            {...register("experience", {
              required: "Experience is required"
            })}
          />

          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        // VIEW MODE
        <>
          <h2>{doc?.name}</h2>

          <ul>
            <li>{doc?.specialization}</li>
            <li>{doc?.email}</li>
            <li>{doc?.experience}</li>
          </ul>

          <button onClick={handleEdit}>Edit</button>
          <button onClick={() => handleDelete(id)}>Delete</button>
        </>
      )}
    </div>
  );
   
}
