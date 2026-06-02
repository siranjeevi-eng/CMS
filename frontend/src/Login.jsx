import { useForm } from "react-hook-form"



export default function Login({LoginUser}){
    
    const {
    register,
    handleSubmit,
    formState:{errors}
    } = useForm()

    async function onSubmit(data){
        await LoginUser(data)
    }

    return(
        <>
        <form onSubmit={handleSubmit(onSubmit)}>
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

            <button type="submit">Login</button>
        </form>
        </>
    )
}