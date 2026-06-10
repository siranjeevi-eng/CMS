
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";


export default function Signup({insertUser, err}){
    


const {
 register,
 handleSubmit,
 formState:{errors}
} = useForm();

async function onSubmit(data){
 await insertUser(data);
}

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">

            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

                <h1 className="mb-2 text-center text-3xl font-bold">
                    Create Account
                </h1>

                <p className="mb-6 text-center text-slate-500">
                    Sign up to access the Clinic Management System
                </p>

                {err && (
                    <p className="mb-4 rounded bg-red-100 p-2 text-red-600">
                        {err}
                    </p>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div>
                        <label htmlFor="name" className="mb-1 block font-medium">
                            Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("name")}
                        />

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="mb-1 block font-medium">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("email")}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1 block font-medium">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("password")}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            Role
                        </label>

                        <select
                            className="w-full rounded-lg border px-3 py-2"
                            {...register("role")}
                        >
                            <option value="doctor">Doctor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
               

                    
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
                    >
                        Create Account
                    </button>

                    <p className="text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-blue-600 hover:underline"
                        >
                            Login
                        </Link>
                    </p>


                </form>
            </div>

        </div>
    );
}