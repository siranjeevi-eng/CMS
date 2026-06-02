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

import NotFound from './NotFound'


function App() {
  const {insertUser, LoginUser,logout, err} = useUser()
  const  {usr, addDoctor, docErr} = useDocotor()

  return (
    <>
    
    <Routes>
      <Route path="/" element={<Layout/>}>
 
      <Route index element={<Home/>}/>

      <Route path="signup" element={<Signup insertUser={insertUser} err={err}/>}/>

      <Route path="login" element={<Login LoginUser={LoginUser}/>}/>


    </Route>

    <Route path="/dashboard" element = {<ProtectedRoute>
      <Dashboard usr = {usr} addDoctor = {addDoctor} docErr = {docErr} logout={logout}/>
    </ProtectedRoute>}/>
    <Route
          path="/doctor/:id"
          element={
            <ProtectedRoute>
              <DoctorDetails />
            </ProtectedRoute>
          }
        />

    <Route 
          path="/patients" 
          element={
          <ProtectedRoute>
            <ShowPatients/>
          </ProtectedRoute>
        }
      />
        
    <Route
          path="/patient/:id"
          element={
            <ProtectedRoute>
              <PatientDetails />
            </ProtectedRoute>
          }
        />  

    <Route
          path="/patient/add"
          element={
            <ProtectedRoute>
              <AddPatient />
            </ProtectedRoute>
          }
        />  
        <Route path="*" element={<NotFound />} />
    </Routes>
      
  </>  
    
  )
}

export default App
