
import { useForm } from "react-hook-form";
// import { useState } from "react";


export default function Signup({insertUser, err}){
    


const {
 register,
 handleSubmit,
 formState:{errors}
} = useForm();

async function onSubmit(data){
 await insertUser(data);
}

return(
<>     
    {err && <p>{err}</p>}   
<form onSubmit={handleSubmit(onSubmit)}>

{/* NAME */}
<div>

<label htmlFor="name">Name</label>

<input
id="name"
type="text"
placeholder="Enter your name"

{...register("name",{
 required:"Name is required",
 minLength:{
  value:3,
  message:"Name must be at least 3 characters"
 }
})}
/>

{errors.name && 
<p>{errors.name.message}</p>
}

</div>


{/* EMAIL */}
<div>

<label htmlFor="email">Email</label>

<input
id="email"
type="email"
placeholder="Enter your email"

{...register("email",{
 required:"Email is required"
})}
/>

{errors.email && 
<p>{errors.email.message}</p>
}

</div>


{/* PASSWORD */}
<div>

<label htmlFor="password">Password</label>

<input
id="password"
type="password"
placeholder="Enter password"

{...register("password",{
 required:"Password is required",
 minLength:{
  value:6,
  message:"Password must be at least 6 characters"
 }
})}
/>

{errors.password && 
<p>{errors.password.message}</p>
}

</div>

<div>
    <select {...register("role", {required:true})}>

    <option value="doctor">Doctor</option>
    <option value="admin">Admin</option>

</select>
</div>

<button type="submit">
Submit
</button>

</form>
    </>
)
}