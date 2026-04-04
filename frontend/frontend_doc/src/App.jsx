import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import PatientDashboard from './pages/patient/dashboard';
import AppointmentModal from './component/patient/category/AppointmentModal';
import PrescriptionCard from './component/patient/PrescriptionCard';
import DoctorDashboard from './pages/doctor/dashboard';
import DoctorProfile from './component/doctor/DoctorProfile';
import HomePage from './pages/HomePage';
import PatientList from './component/doctor/PatientList';
import ScheduleManagement from './component/doctor/ScheduleManagement';
import DiagnosisForm from './component/doctor/DiagnosisForm';
import DoctorBrowser from './component/patient/DoctorBrowser';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Prescription from './component/patient/Prescription';
import BillList from './component/doctor/BillList';
function App() {
 return(
  <>

     <Routes>
     <Route path="/" element={<HomePage />} />
     <Route path="/doctordashboard" element={<DoctorDashboard />}>
          <Route path="PatientList" element={<PatientList />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="billing" element={<BillList/>} />
          <Route path="schedulemanagement" element={<ScheduleManagement />} />
          <Route path="PatientList/doctordashboard/DiagnosisForm/:appID" element={<DiagnosisForm />} />
        </Route>
      <Route path="/patientdashboard" element={<PatientDashboard/>}/>  
     </Routes>
     {/* <PatientDashboard/> */}
  </>
 
 );
}

export default App
