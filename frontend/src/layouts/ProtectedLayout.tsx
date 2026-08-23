import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import useUser from "../hooks/useUser";

export default function ProtectedLayout() {
    const { logout } = useUser();

    return (
            <>
            <Navbar logout={logout} />
            <main className="max-w-7xl mx-auto px-6 py-8">
            <Outlet />

            </main>
        </>
    );
}