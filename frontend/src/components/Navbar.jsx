import { Link } from "react-router-dom";
export default function Navbar({logout}){
    return (
        <nav className="bg-blue-900 shadow-md">
            <div className="max-w-8xl mx-auto px-6 py-4 flex justify-between items-center">

                <div className="flex gap-6 items-center">
                    <h1 className="text-white font-bold text-xl">
                        CMS
                    </h1>
                    <Link
                        to="/dashboard"
                        className="text-white hover:text-blue-600 font-medium"
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/patients"
                        className="text-white hover:text-blue-600 font-medium"
                    >
                        Patients
                    </Link>
                </div>

                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition cursor-pointer"
                >
                    Logout
                </button>

            </div>
        </nav>
    );
}