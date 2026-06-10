import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 text-center">

            <h1 className="text-8xl font-bold text-blue-600">
                404
            </h1>

            <h2 className="mt-4 text-3xl font-semibold text-slate-800">
                Page Not Found
            </h2>

            <p className="mt-3 max-w-md text-slate-600">
                The page you're looking for doesn't exist or has been moved.
            </p>

            <Link
                to="/"
                className="mt-8 rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
            >
                Go Home
            </Link>

        </div>
    );
}