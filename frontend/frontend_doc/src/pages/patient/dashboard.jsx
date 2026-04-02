import './style.css';
import { useEffect } from 'react';
import { useState } from 'react';
import { FaUser, FaFileMedical, FaCreditCard } from "react-icons/fa";
import { MdDashboard, MdEventAvailable, MdAddCircle } from "react-icons/md";
import Profile from '../../component/patient/profile';
import Category from '../../component/patient/category';
import UpcomingApp from '../../component/patient/UpcomingApp';
import AppointmentsList from '../../component/patient/AppointmentsList';
import MedicalRec from '../../component/patient/MedicalRec';
import PaymentLists from '../../component/patient/PaymentLists';
import DoctorBrowser from '../../component/patient/DoctorBrowser';

export default function PatientDashboard (){

  const [patient, setPatient] = useState(null);
  useEffect(() => {
    fetch("http://localhost:3001/api/patient/profile?id=3")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setPatient(data);
      })
      .catch(err => console.log(err));
  }, []);
  const mouseOverHandler = (mList)=>{
    console.log(mList);
  }

  const [activeSection, setActiveSection] = useState("pFile");
  
  return(
    
<div className='container'>
  <div className="Menu">
    <h4 className='mHeader'><MdDashboard/> Dashboard</h4>
    <div
      className={`mList ${activeSection === "pFile" ? "active" : ""}`}
      onMouseOver={() => mouseOverHandler("pFile")}
      onClick={()=>{
        setActiveSection("pFile");
      }}
    >
      <FaUser className='icon'/> <p>Profile</p>
    </div>
    <div
      className={`mList ${activeSection === "upApp" ? "active" : ""}`}
      onMouseOver={() => mouseOverHandler("upApp")}
      onClick={()=>{
        setActiveSection("upApp");
      }}
    >
      <MdEventAvailable className='icon'/> <p>Upcoming Appointment</p>
    </div>
    <div
      className={`mList ${activeSection === "bApp" ? "active" : ""}`}
      onMouseOver={() => mouseOverHandler("bApp")}
      onClick={()=>{
        setActiveSection("bApp");
      }}
    >
      <MdAddCircle className='icon'/> <span> Book Appointment</span>
    </div>
    <div
      className={`mList ${activeSection === "medRec" ? "active" : ""}`}
      onMouseOver={() => mouseOverHandler("medRec")}
      onClick={()=>{
        setActiveSection("medRec");
      }}
    >
      <FaFileMedical className='icon'/> <p> Medical Records</p>
    </div>
    <div
      className={`mList ${activeSection === "bill" ? "active" : ""}`}
      onMouseOver={() => mouseOverHandler("bill")}
      onClick={()=>{
        setActiveSection("bill");
      }}
    >
      <FaCreditCard className='icon'/> <p> Bill & Payment</p>
    </div>
  </div>
  <div className="content">
    <div className="top">
      <div>
      <h2>Hello,<br/><div className='top-name'>{patient?.name}</div></h2>
      </div>
    </div>
    <div className="bottom">
     {(activeSection === "pFile") && <Profile/>}
     {(activeSection === "bApp") && <DoctorBrowser/>}
     {(activeSection === "upApp") && <AppointmentsList/>}
     {(activeSection === "medRec") && <MedicalRec/>}
     {(activeSection === "bill") && <PaymentLists/>}
    </div>
  </div>
</div>
    );
}