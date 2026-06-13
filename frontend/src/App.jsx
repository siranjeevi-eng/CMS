import './App.css'
import './index.css'
import {Routes,Route} from 'react-router-dom'
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
  const {insertUser, LoginUser,logout, err} = useUser()
  const  {doctor, addDoctor, docErr} = useDocotor()

  return (
    <>
    
    <Routes>
 
      <Route path = "/" element={<Home/>}/>

      <Route path="signup" element={<Signup insertUser={insertUser} err={err}/>}/>

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
