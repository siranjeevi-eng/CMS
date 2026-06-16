import './App.css'
import './index.css'
import {Routes,Route} from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import Signup from './Signup'
import Login from './Login'
import Home from './Home'
import Dashboard from './Dashboard'
import Layout from './layouts/layout'
import useUser from './hooks/useUser'
import useDocotor from './hooks/useDoctor'
import DoctorDetails from './DoctorDetails'
import ShowPatients from './pages/ShowPatients'
import PatientDetails from './pages/PatientDetails'
import AddPatient from './pages/AddPatient'
import ProtectedRoute from './ProtectedRoute'
import ProtectedLayout from "./layouts/ProtectedLayout";

import NotFound from './NotFound'


function App() {
  const {insertUser, LoginUser,logout} = useUser()
  const  {doctor, addDoctor, docErr} = useDocotor()

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            className: "bg-green-50 border border-green-500 text-green-700",
          },
          error: {
            className: "bg-red-50 border border-red-500 text-red-700",
          },
        }}
      />
    <Routes>
 
      <Route path = "/" element={<Home/>}/>

      <Route path="signup" element={<Signup insertUser={insertUser}/>}/>

      <Route path="login" element={<Login LoginUser={LoginUser}/>}/>


        <Route
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={
              <Dashboard
                doctor={doctor}
                addDoctor={addDoctor}
                docErr={docErr}
              />
            }
          />

          <Route
            path="/doctor/:id"
            element={<DoctorDetails />}
          />

          <Route
            path="/patients"
            element={<ShowPatients />}
          />

          <Route
            path="/patient/:patientId"
            element={<PatientDetails 
            doctor = {doctor}
            />}
          />

          <Route
            path="/patient/add"
            element={
            <AddPatient
            doctor = {doctor} 
            />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
    </Routes>
      
  </>  
    
  )
}

export default App
