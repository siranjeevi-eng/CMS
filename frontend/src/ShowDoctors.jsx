import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { useState } from "react"

import { UserRound, Smile, Hospital, ChevronRight } from "lucide-react";

export default function ShowDoctors({doctor, addDoctor, docErr, doctorCount}){

    const role = localStorage.getItem("role")


    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    function onSubmit(data) {
        addDoctor(data)
    }

    const [search, setSearch] = useState("")
    const filterDoctor = doctor.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))

    const avatarColors = [
        "bg-blue-100 text-blue-700",
        "bg-green-100 text-green-700",
        "bg-purple-100 text-purple-700",
        "bg-pink-100 text-pink-700",
        "bg-orange-100 text-orange-700",
        "bg-cyan-100 text-cyan-700",
        "bg-indigo-100 text-indigo-700",
    ];
    return(
        <>
            <div className="max-w-7xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold mb-8">All Docotrs({doctorCount})</h1>
                <input
                    type="text"
                    placeholder="Search doctor..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md px-4 py-2 mb-8 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {filterDoctor.length === 0 ? (
                    <p>No Doctors found...</p>
                ) : (
                <div
                    className={`grid gap-8 ${role === "admin"
                            ? "lg:grid-cols-3"
                            : "grid-cols-1"
                        }`}>
                            <div
                                className={
                                    role === "admin"
                                        ? "lg:col-span-2"
                                        : ""
                                }>

                                <div
                                    className={`grid mb-4 gap-4 ${role === "admin"
                                            ? "md:grid-cols-2"
                                            : "md:grid-cols-3"
                                        }`}
                                >
                            {filterDoctor.map((d, index) => (
                                <Link
                                    key={d._id}
                                    to={`/doctor/${d._id}`}
                                    className="block"
                                >
                                    <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-gray-100">

                                        <div className="flex items-center justify-between">

                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`w-12 h-12 rounded-full font-bold flex items-center justify-center text-lg ${avatarColors[index % avatarColors.length]
                                                        }`}
                                                >
                                                    {d.name.charAt(0).toUpperCase()}
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Dr. {d.name}
                                                    </h3>

                                                    <span className="inline-block mt-2 px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded-full">
                                                        {d.specialization}
                                                    </span>
                                                </div>

                                            </div>

                                            <ChevronRight className="w-5 h-5 text-gray-400" />

                                        </div>

                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    {docErr && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {docErr}
                        </div>
                    )}
                    {role === "admin" && (
                        <form onSubmit={handleSubmit(onSubmit)}
                            className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4 mt-8"
                        >
                            <h2 className="text-xl font-semibold mb-4">Add Doctor</h2>
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


                            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                                type="submit">Add</button>
                        </form>)}
                </div>)}


            </div>
        </>
    )
    
}