import './style.css'
import { useEffect, useState } from 'react'
import { NavLink, Routes, Route,Link , Outlet } from "react-router-dom"
import { MdEvent } from "react-icons/md";
import { FaUser, FaFileMedical, FaCreditCard } from "react-icons/fa"
import { MdDashboard, MdEventAvailable, MdAddCircle } from "react-icons/md"

import Profile from '../../component/patient/profile'
import DiagnosisForm from '../../component/doctor/DiagnosisForm'
import MedicalRec from '../../component/patient/MedicalRec'
import PaymentLists from '../../component/patient/PaymentLists'
import DoctorProfile from '../../component/doctor/DoctorProfile'
import ScheduleManagement from '../../component/doctor/ScheduleManagement'
import PatientList from '../../component/doctor/PatientList'

export default function DoctortDashboard(){
  

  const [doctor, setDoctor] = useState(" ")
  const token = localStorage.getItem("token")
  useEffect(()=>{
    fetch("http://localhost:3001/api/doctor/profile",{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setDoctor(data);
      })
      .catch(err => console.log(err))
  }, [])

  return(

<div className='container'>

  <div className="Menu">

    <h4 className='mHeader'>
      <MdDashboard/> Dashboard
    </h4>

    <NavLink to="profile" className="mList">
      <FaUser className='icon'/> 
      <p>Profile</p>
    </NavLink>

    <Link to="schedulemanagement" className="mList">
      <MdEvent className='icon'/> 
      <p>Schedule Management</p>
    </Link>

    <NavLink to="PatientList" className="mList">
      <MdAddCircle className='icon'/> 
      <span>Patient Management</span>
    </NavLink>

    <NavLink to="records" className="mList">
      <FaFileMedical className='icon'/> 
      <p>Medical Records</p>
    </NavLink>

    <NavLink to="billing" className="mList">
      <FaCreditCard className='icon'/> 
      <p>Bill & Payment</p>
    </NavLink>

  </div>

  {/* Content Section */}
  <div className="content">

    <div className="top">
      <h2>
        Hello,<br/>
        <div className='top-name'>{doctor?.name}</div>
      </h2>
    </div>

    <div className="bottom">
          {/* Nested pages render here */}
          <Outlet /> 
        </div>

  </div>

</div>

  )
}
