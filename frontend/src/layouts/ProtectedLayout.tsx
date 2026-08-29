import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import useUser from "../hooks/useUser";
import useDoctor from '../hooks/useDoctor'

export default function ProtectedLayout() {
    const { logout } = useUser();
    const { 
    doctor, 
    addDoctor,
    doctorCount, 
    patientCount, 
    patientsAddedToday, 
    patientsAddedThisMonth,
    underTreatmentPatients,
    recoveredPatients,
    dischargedPatients
  } = useDoctor()

    return (
            <>
            <Navbar logout={logout} />
            <main className="max-w-7xl mx-auto px-6 py-8">
                <Outlet context={{
                    doctor,
                    addDoctor,
                    doctorCount,
                    patientCount,
                    patientsAddedToday,
                    patientsAddedThisMonth,
                    underTreatmentPatients,
                    recoveredPatients,
                    dischargedPatients
                }} />

            </main>
        </>
    );
}