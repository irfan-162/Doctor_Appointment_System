import React, { useState, useEffect } from "react";
import "./Scheduler.css";

const AppointmentScheduler = ({ schedule ,doctor}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  // Convert "6:00 PM" → Date object
  const convertToDate = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");

    hours = parseInt(hours);
    minutes = parseInt(minutes);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  useEffect(() => {
    if (!selectedDate || !schedule || schedule.length === 0) {
      setAvailableSlots([]);
      return;
    }

    const selectedDayName = new Date(selectedDate).toLocaleDateString(
      "en-US",
      { weekday: "long" }
    );

    const daySchedule = schedule.find(
      (d) => d.day === selectedDayName
    );

    if (!daySchedule) {
      setAvailableSlots([]);
      return;
    }

    const start = convertToDate(daySchedule.start_time);
    const end = convertToDate(daySchedule.end_time);

    const slots = [];
    const current = new Date(start);

    while (current < end) {
      slots.push(
        current.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
      current.setMinutes(current.getMinutes() + 30);
    }

    setAvailableSlots(slots);
  }, [selectedDate, schedule]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime("");
  };
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };
  
  const bookHandler = async()=>{
    let sData;
    alert(`Confirmed for ${selectedDate} at ${selectedTime}`);
    console.log("Date is booked");
    console.log(doctor);
    const selectedDay = getDayName(selectedDate);
    console.log(selectedDay); 
    try {
      const res = await fetch(
        `http://localhost:3001/api/patient/scheduleID?docID=${doctor.id}&day=${selectedDay}`
      );
     sData = await res.json();
      console.log("schedule_id",data.schedule_id);
    } catch (err) {
      console.log(err);
    }
    try {
      const res = await fetch("http://localhost:3001/api/patient/bookAppointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointment_date: selectedDate,           
          appointment_time: selectedTime,
          status: "Pending",
          doctor_id: doctor.id,
          patient_id: 3,
          schedule_id: sData.schedule_id
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        console.log("Appointment succesfully booked : ", data);
      } else {
        console.log("Book failed:", data.message);
        alert("Book failed: " + data.message);
      }
    } catch (err) {
      console.error("Error Booking field:", err);
      alert("Error Booking field. Please try again.");
    }
  }
  return (
    <div className="scheduler-container">
      <div className="scheduler-card">
        <h3>Schedule Visit</h3>

        <label className="label">Date</label>
        <input
          type="date"
          className="input-field"
          min={today}
          onChange={handleDateChange}
        />

        <label className="label">Available Slots</label>
        <select
          className="input-field"
          disabled={availableSlots.length === 0}
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          {availableSlots.length > 0 ? (
            <>
              <option value="">Select a time</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </>
          ) : (
            <option>No slots available</option>
          )}
        </select>

        <button
          className="submit-btn"
          disabled={!selectedTime}
          onClick={bookHandler}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default AppointmentScheduler;
