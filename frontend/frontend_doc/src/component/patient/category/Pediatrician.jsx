import { useEffect, useState } from "react";
import AppointmentModal from "./AppointmentModal"
export default function Pediatrician(){
  
  // const names = [{name :'Dr.McCafein', id : 1},{name :'Dr. Masud', id: 2},{name :'Dr. Sakil', id: 3},{name :'Dr. Biriyani', id: 4}];

  // const days = [{day : 'Monday', start_time : '6:00pm', end_time : '9:00pm'},{day : 'Thursday', start_time : '5:00pm', end_time : '10:00pm'},{day : 'Monday', start_time : '6:00pm', end_time : '9:00pm'},{day : 'Monday', start_time : '6:00pm', end_time : '9:00pm'},{day : 'Monday', start_time : '6:00pm', end_time : '9:00pm'},{day : 'Monday', start_time : '6:00pm', end_time : '9:00pm'},{day : 'Monday', start_time : '6:00pm', end_time : '9:00pm'}];
  const [names,setNames] = useState([]);
  const [days,setDays] = useState([]);
  const [isSchedule,setschedule] = useState(true);
  const [isAppointment,setAppointment] = useState(false);
  const [selectedDoctor,setSelectedDoctor] = useState({name : "SELECT A DOCTOR",email : "",phone : "",fee : "",id : ""})
  useEffect(() => {
    fetch("http://localhost:3001/api/patient/pediatrician")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setNames(data);
      })
      .catch(err => console.log(err));
  }, []);

  const onClickHandler = async (doctor) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/patient/schedule?id=${doctor.doctor_id}`
      );
      const data = await res.json();
      setschedule(true);       
      setAppointment(false);
      setDays(data);   
      setSelectedDoctor({
        name: doctor.name,
        email: doctor.email,
        phone: "Phone: " + doctor.phone,
        fee : "Fee : " + doctor.consultation_fee + " Taka", 
        id : doctor.doctor_id
      });
    } catch (err) {
      console.log(err);
    }
  };
  const appointmenthandler = async()=>{
    setschedule(!isSchedule);
    setAppointment(!isAppointment);
  }
  
  return (
    <div className="cContainer">
      <div className="specialist">
        <h4>Pediatrician:</h4>
        <div className="doctors">
          {names.map((doctor) => (
            <div
            className={`docList ${selectedDoctor.name === doctor.name ? "active2" : ""}`}
              key={doctor.doctor_id}
              onClick={()=> onClickHandler(doctor)}
            >
              <p>{doctor.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="schedule">
        
          <div className="name-email">
             <h2>{selectedDoctor.name}</h2>
             <p>{selectedDoctor.email}</p>
             <p>{selectedDoctor.phone}</p>
             <p>{selectedDoctor.fee}</p>
             {(days.length > 0) && <div className="bookBtn" onClick={appointmenthandler}>Appointment</div>}
          </div>
         {isSchedule &&( <div className="time">
          {days.map((day) => (
            <div className="day" key={day.day}>
              <h3>{day.day}</h3>
              <p>
                {day.start_time} To {day.end_time}
              </p>
           </div>
          ))}
        </div>)}
        {isAppointment && <AppointmentModal schedule={days} doctor={selectedDoctor} />}
      </div>
    </div>
  );
}