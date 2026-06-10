import { useForm } from "react-hook-form"
import { Link } from "react-router-dom";


export default function Login({LoginUser}){
    
    const {
    register,
    handleSubmit,
    formState:{errors}
    } = useForm()

    async function onSubmit(data){
        await LoginUser(data)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">

            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

                <h1 className="mb-2 text-center text-3xl font-bold">
                    Login
                </h1>

                <p className="mb-6 text-center text-slate-500">
                    Welcome back to the Clinic Management System
                </p>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >

                    {/* EMAIL */}
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block font-medium"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("email", {
                                required: "Email is required"
                            })}
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1 block font-medium"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                        />

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700"
                    >
                        Login
                    </button>

                    <p className="text-center text-sm text-slate-600">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="font-medium text-blue-600 hover:underline"
                        >
                            Sign Up
                        </Link>
                    </p>

                </form>

            </div>

        </div>
    );
}