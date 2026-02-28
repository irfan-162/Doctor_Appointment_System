import React, { useEffect, useState } from "react";

import "./MedicalRec.css";
import PrescriptionCard from "./PrescriptionCard";

const MedicalRec = () => {
  const [appointments, setAppointments] = useState([]);
  const [isList,setisList] = useState(true);
  const [isPres,setisPres] = useState(false);
  const [apptID,setapptID] = useState('');


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/patient/recordlist?patientID=3");
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleDetails = (appointment) => {
    console.log("Appointment Details:", appointment);
    setapptID(appointment.aid)
    setisList(false);
    setisPres(true);
    // later you can navigate or open modal here
  };

  function ListView (){
    return (
      
      <div>
        <h2 className="appointments-title">Records:</h2>
      <div className="appointments-list">
        {appointments.length === 0 ? (
          <p className="empty-message">No appointments found.</p>
        ) : (
          appointments.map((item) => (
            <div key={item.id} className="appointment-card">
              <div className="appointment-info">
                <p><span>Doctor:</span> {item.name}</p>
                <p><span>Diagnosis:</span> {item.diagnosis}</p>
                <p>
                  <span>Date:</span>{" "}
                  {item.appointment_date}
                </p>
              </div>

              <button
                className="details-btn"
                onClick={() => handleDetails(item)}
              >
                Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
    );
  }

  return (
    <div className="appointments-container">
      {isList && <ListView/>}
      {isPres && <PrescriptionCard apptID={apptID}/>}
    </div>
    
    
  );
};

export default MedicalRec;