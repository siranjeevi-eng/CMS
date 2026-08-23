import { Link } from "react-router-dom";


export default function Home() {
    return (
        <div className="min-h-screen bg-slate-100">
            <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
                <h1 className="mb-4 text-5xl font-bold">
                    Clinic Management System
                </h1>

                <p className="mb-8 max-w-2xl text-lg text-slate-600">
                    Manage patients, doctors and medical records efficiently.
                </p>

                <div className="flex gap-4">
                    <Link
                        to="/signup"
                        className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                    >
                        Get Started
                    </Link>

                    <Link
                        to="/login"
                        className="rounded-lg border border-blue-600 px-6 py-3 text-blue-600 hover:bg-blue-50"
                    >
                        Login
                    </Link>
                </div>
            </section>

            <section className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="mb-2 text-xl font-semibold">Patients</h3>
                    <p className="text-slate-600">
                        Manage patient records efficiently.
                    </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="mb-2 text-xl font-semibold">Doctors</h3>
                    <p className="text-slate-600">
                        Assign doctors and track treatments.
                    </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="mb-2 text-xl font-semibold">Medical Records</h3>
                    <p className="text-slate-600">
                        Store admission and treatment details.
                    </p>
                </div>
            </section>
        </div>
    );
}