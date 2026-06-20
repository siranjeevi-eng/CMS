import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { useState } from "react"

export default function Dashboard({ doctor, addDoctor, docErr, doctorCount, patientCount, patientsAddedToday, patientsAddedThisMonth }){
    
    const role = localStorage.getItem("role")
  
    const [search, setSearch] = useState("")

    const filterDoctor = doctor.filter((d)=>d.name.toLowerCase().includes(search.toLowerCase()))

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
            <div className="max-w-7xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
                <input
                    type="text"
                    placeholder="Search doctor..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md px-4 py-2 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex flex-wrap gap-4 mb-8">
                    {/* Total Doctors */}
                    <div className="w-56 bg-white rounded-xl shadow-sm border border-gray-200 p-3 flex flex-col items-center justify-center">
                        <p className="text-sm font-medium text-gray-500">
                            👨‍⚕️ Total Doctors
                        </p>
                        <h2 className="mt-1 text-4xl font-bold text-gray-900">
                            {doctorCount}
                        </h2>
                    </div>

                    {/* Total Patients */}
                    <div className="w-56 bg-white rounded-xl shadow-sm border border-gray-200 p-3 flex flex-col items-center justify-center">
                        <p className="text-sm font-medium text-gray-500">
                            🧑 Total Patients
                        </p>
                        <h2 className="mt-1 text-4xl font-bold text-gray-900">
                            {patientCount}
                        </h2>
                    </div>
                    {/* Patients Added Today */}
                    <div className="w-56 bg-white rounded-xl shadow-sm border border-gray-200 p-3 flex flex-col items-center justify-center">
                        <p className="text-sm font-medium text-gray-500">
                            🧑 Patients Added Today
                        </p>
                        <h2 className="mt-1 text-4xl font-bold text-gray-900">
                            {patientsAddedToday}
                        </h2>
                    </div>
                    {/* Patients Added this month */}
                    <div className="w-56 bg-white rounded-xl shadow-sm border border-gray-200 p-3 flex flex-col items-center justify-center">
                        <p className="text-sm font-medium text-gray-500">
                            🧑 Patients Added This Month
                        </p>
                        <h2 className="mt-1 text-4xl font-bold text-gray-900">
                            {patientsAddedThisMonth}
                        </h2>
                    </div>
                </div>
                {filterDoctor.length === 0 ? (
                    <p>No Doctors found...</p>
                ) : (<div className="grid lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-semibold mb-4">Doctors</h2>
                        <div className="grid md:grid-cols-2 mb-4 gap-4">
                            {filterDoctor.map((d) => (
                                <div key={d._id} className="bg-white p-3 rounded-lg shadow mb-4 hover:shadow-lg transition cursor-pointer">
                                    <Link

                                        to={`/doctor/${d._id}`}
                                        className="text-black-600 hover:text-gray-500"
                                    >
                                        <div>
                                            <h3 className="text-l font-semibold mb-3">
                                                Dr. {d.name}
                                            </h3>
                                        </div>
                                    </Link>
                                </div>
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