import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"


export default function Dashboard({logout, usr, addDoctor, showDoctor, docErr}){
    
    const {
        register, 
        handleSubmit, 
        formState:{errors}
        } = useForm()

        function onSubmit(data){
            addDoctor(data)
        }
    return(
        <>
        <h2>Dashboard</h2>
            <Link to="/patients">
                View Patients
            </Link>
            <h3>All Doctors:</h3>
        {usr.map((u)=>(
            <li key={u._id}>
                <Link to={`/doctor/${u._id}`}>
                    {u.name}
                </Link>
            </li>
        ))}

        <button onClick={logout}>Logout</button>
            {docErr && <p>{docErr}</p>}  
        <form onSubmit={handleSubmit(onSubmit)}>
             <input
                id="name"
                type="text"
                placeholder="Enter Doctor name"

                {...register("name",{
                required:"Doctor name is required"
                })}
                />

                {errors.name && 
                <p>{errors.email.message}</p>}

              <input 
                id="email"
                type="email"
                placeholder="Enter Doctor's email"
                
                {...register("email",{
                    required:"Doctor's email is required"
                })}
              />      
              {errors.email && <p>{errors.email.message}</p>}

              <input 
                id="specialization"
                type="text"
                placeholder="Enter the specialization"

                {...register("specialization",{
                    required:"Specialization is required"
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
                {...register("experience",{
                    required:"Experience is required"
                })}
              />


                <button type="submit">Add</button>
        </form>

        </>
    )
}