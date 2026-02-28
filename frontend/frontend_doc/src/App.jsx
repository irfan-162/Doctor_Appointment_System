import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import PatientDashboard from './pages/patient/dashboard';
import AppointmentModal from './component/patient/category/AppointmentModal';
import PrescriptionCard from './component/patient/PrescriptionCard';

function App() {
 return(
  <PatientDashboard/>
 );
}

export default App
