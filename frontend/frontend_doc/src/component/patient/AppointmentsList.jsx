import React, { useEffect, useState } from "react";
import "./AppointmentsList.css";

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch appointments on component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/patient/upcoming-appointment',
          {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
          }
        ); // adjust endpoint if needed
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Cancel appointment
  const handleCancel = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );
    if (!confirmCancel) return;

    try {
      await fetch(`http://localhost:3001/api/patient/appointments/${id}`, {///api/patient/appointments/:id
        method: "DELETE",
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });

      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
    } catch (error) {
      console.error("Cancel failed:", error);
    }
  };

  return (
    <div className="appointments-container">
      <h2 className="title">Upcoming Appointments</h2>

      {loading ? (
        <div className="status">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="status">No upcoming appointments.</div>
      ) : (
        <div className="appointments-table">
          {/* Header */}
          <div className="table-header">
            <span>Doctor</span>
            <span>Specialist</span>
            <span>Date</span>
            <span>Time</span>
            <span>Day</span>
            <span></span>
          </div>

          {/* Scrollable Body */}
          <div className="table-body">
            {appointments.map((appt) => (
              <div className="table-row" key={appt.id}>
                <span>{appt.doctor_name}</span>
                <span>{appt.specialization}</span>
                <span>{appt.appointment_date}</span>
                <span>{appt.appointment_time}</span>
                <span>{appt.day}</span>

                <button
                  className="cancel-btn"
                  onClick={() => handleCancel(appt.id)}
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
