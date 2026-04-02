import { useState, useEffect, useMemo } from "react";
import "./DoctorBrowser.css";

/* ═══════════════════════════════════════
   DUMMY DATA  (ERD-aligned field names)
   DOCTOR:   DoctorID, Name, Specialization, Phone, Email, fee
   SCHEDULE: ScheduleID, DoctorID, Day, Start_Time, End_Time
═══════════════════════════════════════ */
const CATEGORIES = [
  { Specialization: "Cardiology",        icon: "🫀" },
  { Specialization: "Neurology",         icon: "🧠" },
  { Specialization: "Dermatology",       icon: "🩺" },
  { Specialization: "Orthopedic",        icon: "🦴" },
  { Specialization: "Pediatrics",        icon: "👶" },
  { Specialization: "General Physician", icon: "🏥" },
];

const DOCTORS = [
  {
    DoctorID: 1, Specialization: "Cardiology",
    Name: "Dr. Karim Hossain", Email: "karim@clinic.com",
    Phone: "+880 1711-000001", fee: 800,
    schedules: [
      { ScheduleID: 1, DoctorID: 1, Day: "Mon", Start_Time: "09:00", End_Time: "12:00" },
      { ScheduleID: 2, DoctorID: 1, Day: "Wed", Start_Time: "14:00", End_Time: "17:00" },
      { ScheduleID: 3, DoctorID: 1, Day: "Fri", Start_Time: "10:00", End_Time: "13:00" },
    ],
  },
  {
    DoctorID: 2, Specialization: "Cardiology",
    Name: "Dr. Nusrat Jahan", Email: "nusrat@clinic.com",
    Phone: "+880 1711-000002", fee: 1000,
    schedules: [
      { ScheduleID: 4, DoctorID: 2, Day: "Tue", Start_Time: "10:00", End_Time: "13:00" },
      { ScheduleID: 5, DoctorID: 2, Day: "Thu", Start_Time: "15:00", End_Time: "18:00" },
    ],
  },
  {
    DoctorID: 3, Specialization: "Cardiology",
    Name: "Dr. Rahim Uddin", Email: "rahim@clinic.com",
    Phone: "+880 1711-000003", fee: 700,
    schedules: [
      { ScheduleID: 6, DoctorID: 3, Day: "Mon", Start_Time: "14:00", End_Time: "17:00" },
      { ScheduleID: 7, DoctorID: 3, Day: "Sat", Start_Time: "09:00", End_Time: "12:00" },
    ],
  },
  {
    DoctorID: 4, Specialization: "Neurology",
    Name: "Dr. Sumaiya Akter", Email: "sumaiya@clinic.com",
    Phone: "+880 1711-000004", fee: 1200,
    schedules: [
      { ScheduleID: 8,  DoctorID: 4, Day: "Sun", Start_Time: "10:00", End_Time: "13:00" },
      { ScheduleID: 9,  DoctorID: 4, Day: "Tue", Start_Time: "14:00", End_Time: "17:00" },
    ],
  },
  {
    DoctorID: 5, Specialization: "Neurology",
    Name: "Dr. Tanvir Ahmed", Email: "tanvir@clinic.com",
    Phone: "+880 1711-000005", fee: 900,
    schedules: [
      { ScheduleID: 10, DoctorID: 5, Day: "Mon", Start_Time: "08:00", End_Time: "11:00" },
      { ScheduleID: 11, DoctorID: 5, Day: "Thu", Start_Time: "13:00", End_Time: "16:00" },
    ],
  },
  {
    DoctorID: 6, Specialization: "Dermatology",
    Name: "Dr. Farhana Islam", Email: "farhana@clinic.com",
    Phone: "+880 1711-000006", fee: 600,
    schedules: [
      { ScheduleID: 12, DoctorID: 6, Day: "Wed", Start_Time: "09:00", End_Time: "12:00" },
      { ScheduleID: 13, DoctorID: 6, Day: "Sat", Start_Time: "14:00", End_Time: "17:00" },
    ],
  },
  {
    DoctorID: 7, Specialization: "Orthopedic",
    Name: "Dr. Mahbub Alam", Email: "mahbub@clinic.com",
    Phone: "+880 1711-000007", fee: 850,
    schedules: [
      { ScheduleID: 14, DoctorID: 7, Day: "Mon", Start_Time: "10:00", End_Time: "13:00" },
      { ScheduleID: 15, DoctorID: 7, Day: "Wed", Start_Time: "15:00", End_Time: "18:00" },
      { ScheduleID: 16, DoctorID: 7, Day: "Fri", Start_Time: "09:00", End_Time: "12:00" },
    ],
  },
  {
    DoctorID: 8, Specialization: "Pediatrics",
    Name: "Dr. Roksana Begum", Email: "roksana@clinic.com",
    Phone: "+880 1711-000008", fee: 500,
    schedules: [
      { ScheduleID: 17, DoctorID: 8, Day: "Sun", Start_Time: "09:00", End_Time: "12:00" },
      { ScheduleID: 18, DoctorID: 8, Day: "Tue", Start_Time: "13:00", End_Time: "16:00" },
    ],
  },
  {
    DoctorID: 9, Specialization: "General Physician",
    Name: "Dr. Shafiqul Islam", Email: "shafiqul@clinic.com",
    Phone: "+880 1711-000009", fee: 400,
    schedules: [
      { ScheduleID: 19, DoctorID: 9, Day: "Mon", Start_Time: "08:00", End_Time: "14:00" },
      { ScheduleID: 20, DoctorID: 9, Day: "Wed", Start_Time: "08:00", End_Time: "14:00" },
      { ScheduleID: 21, DoctorID: 9, Day: "Fri", Start_Time: "08:00", End_Time: "14:00" },
    ],
  },
];

/* ═══════════════════════════════════════
   HELPERS
═══════════════════════════════════════ */
const DAY_NAMES   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTH_NAMES = ["January","February","March","April","May","June",
                     "July","August","September","October","November","December"];

const fmt12 = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2,"0")} ${h < 12 ? "AM" : "PM"}`;
};

// Generate 30-min slots between Start_Time and End_Time
const genSlots = (Start_Time, End_Time) => {
  const slots = [];
  let [h, m] = Start_Time.split(":").map(Number);
  const [eh, em] = End_Time.split(":").map(Number);
  while (h * 60 + m < eh * 60 + em) {
    slots.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`);
    m += 30;
    if (m >= 60) { h += 1; m -= 60; }
  }
  return slots;
};

const buildCalendar = (year, month) => {
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
};

/* ═══════════════════════════════════════
   CALENDAR
═══════════════════════════════════════ */
function Calendar({ schedules, selectedDate, onSelect }) {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });

  // Set of scheduled Day names e.g. {"Mon","Wed","Fri"}
  const scheduleDays = useMemo(() =>
    new Set(schedules.map(s => s.day)), [schedules]);

  const cells = buildCalendar(view.year, view.month);

  const prevMonth = () => setView(v => {
    const d = new Date(v.year, v.month - 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const nextMonth = () => setView(v => {
    const d = new Date(v.year, v.month + 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  return (
    <div>
      <div className="cal-header">
        <button className="cal-nav" onClick={prevMonth}>‹</button>
        <span className="cal-month">{MONTH_NAMES[view.month]} {view.year}</span>
        <button className="cal-nav" onClick={nextMonth}>›</button>
      </div>
      <div className="cal-grid">
        {DAY_NAMES.map(d => (
          <div key={d} className="cal-dow">{d.slice(0,2)}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} className="cal-day empty" />;
          const date    = new Date(view.year, view.month, day);
          const dayName = DAY_NAMES[date.getDay()];
          const isAvail = scheduleDays.has(dayName) && date >= new Date(today.toDateString());
          const isSel   = selectedDate &&
            selectedDate.getDate()     === day &&
            selectedDate.getMonth()    === view.month &&
            selectedDate.getFullYear() === view.year;
          const isToday = today.getDate()     === day &&
                          today.getMonth()    === view.month &&
                          today.getFullYear() === view.year;
          return (
            <div
              key={day}
              className={`cal-day ${isAvail ? "available" : ""} ${isSel ? "selected" : ""} ${isToday && !isSel ? "today" : ""}`}
              onClick={() => isAvail && onSelect(date)}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   DOCTOR DETAIL + BOOKING
═══════════════════════════════════════ */
function DoctorDetail({ doctor }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [dropOpen,     setDropOpen]     = useState(false);
  const [booking,      setBooking]      = useState(false);

  // Find the matching SCHEDULE row for the selected date
  // Used to get ScheduleID for APPOINTMENT.ScheduleID FK
  const matchedSchedule = useMemo(() => {
    if (!selectedDate) return null;
    const dayName = DAY_NAMES[selectedDate.getDay()];
    return doctor.schedules.find(s => s.day === dayName) || null;
  }, [selectedDate, doctor.schedules]);

  const availableSlots = useMemo(() => {
    if (!matchedSchedule) return [];
    return genSlots(matchedSchedule.start_time, matchedSchedule.end_time);
  }, [matchedSchedule]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setDropOpen(false);
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedSlot || !matchedSchedule) return;
    setBooking(true);
    try {
      // APPOINTMENT fields from ERD:
      //   AppointmentID (PK, auto), Appointment_Date, Appointment_Time,
      //   Status, DoctorID (FK), PatientID (FK), ScheduleID (FK)

      // --- API REQUEST (POST /api/appointments) ---
      const res = await fetch("http://localhost:3001/api/patient/bookAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
         
          // token carries PatientID — extracted server-side from JWT
        },
        body: JSON.stringify({
          patient_id:        3,                      // from session (mocked as 3 here)
          doctor_id:         doctor.doctor_id,           // FK → DOCTOR.DoctorID
          schedule_id:       matchedSchedule.schedule_id, // FK → SCHEDULE.ScheduleID
          appointment_date: selectedDate.toISOString().split("T")[0], // "YYYY-MM-DD"
          appointment_time: selectedSlot,              // "HH:MM" (30-min slot)
          status:           "Pending",
        }),
      });
      if (!res.ok) throw new Error("Booking failed.");
      const { AppointmentID } = await res.json();

      // Mock — remove when API is connected
      await new Promise(r => setTimeout(r, 500));
      alert(`Booked!\nDate: ${selectedDate.toDateString()}\nTime: ${fmt12(selectedSlot)}`);
      setSelectedDate(null);
      setSelectedSlot(null);
    } catch (err) {
      alert("Booking failed. Please try again.");
      console.error(err);
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="detail-wrap">

      {/* LEFT — Doctor Info (DOCTOR + SCHEDULE tables) */}
      <div className="detail-left">
        <div className="detail-card">
          <div>
            {/* DOCTOR.Name */}
            <div className="detail-name">{doctor.name}</div>
            {/* DOCTOR.Specialization */}
            <div className="detail-spec">{doctor.specialization}</div>
          </div>
          <hr className="detail-divider" />
          <div className="detail-row">
            <span className="detail-label">Email</span>
            {/* DOCTOR.Email */}
            <span className="detail-value">{doctor.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Phone</span>
            {/* DOCTOR.Phone */}
            <span className="detail-value">{doctor.phone}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Consultation Fee</span>
            {/* DOCTOR.fee */}
            <span className="detail-fee">৳ {doctor.fee}</span>
          </div>
        </div>

        {/* SCHEDULE rows linked by DOCTOR.DoctorID = SCHEDULE.DoctorID */}
        <div className="detail-card">
          <div className="sec-label" style={{ marginBottom: 6 }}>Schedule</div>
          <div className="schedule-list">
            {doctor.schedules.map(s => (
              <div className="schedule-slot" key={s.schedule_id}>
                {/* SCHEDULE.Day */}
                <span className="slot-day">{s.day}</span>
                {/* SCHEDULE.Start_Time → SCHEDULE.End_Time */}
                <span className="slot-time">{fmt12(s.start_time)} – {fmt12(s.end_time)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — Booking panel */}
      <div className="detail-right">
        <div className="booking-card">
          <div className="booking-title">Book Appointment</div>

          {/* Calendar — highlights dates matching SCHEDULE.Day values */}
          <Calendar
            schedules={doctor.schedules}
            selectedDate={selectedDate}
            onSelect={handleDateSelect}
          />

          {/* Time slot dropdown — slots derived from matched SCHEDULE.Start_Time / End_Time */}
          {selectedDate && (
            <div style={{ marginTop: 18 }}>
              <div className="sec-label" style={{ marginBottom: 8 }}>
                Time Slot — {selectedDate.toDateString()}
              </div>
              {availableSlots.length === 0 ? (
                <div className="no-slots">No slots available.</div>
              ) : (
                <div className="slot-dropdown">
                  <button
                    className={`slot-trigger ${dropOpen ? "open" : ""}`}
                    onClick={() => setDropOpen(o => !o)}
                  >
                    {selectedSlot
                      ? <span>{fmt12(selectedSlot)}</span>
                      : <span className="slot-trigger-placeholder">Select a time slot…</span>
                    }
                    <span className="slot-arrow">▼</span>
                  </button>

                  {dropOpen && (
                    <div className="slot-list">
                      {/* Each slot = one 30-min APPOINTMENT.Appointment_Time value */}
                      {availableSlots.map(slot => (
                        <div
                          key={slot}
                          className={`slot-option ${selectedSlot === slot ? "selected" : ""}`}
                          onClick={() => { setSelectedSlot(slot); setDropOpen(false); }}
                        >
                          {fmt12(slot)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {!selectedDate && (
            <div className="pick-hint" style={{ marginTop: 14 }}>
              ↑ Highlighted dates match doctor's schedule
            </div>
          )}

          <button
            className="book-btn"
            disabled={!selectedDate || !selectedSlot || booking}
            onClick={handleBook}
            style={{ marginTop: 20 }}
          >
            {booking ? "Booking…" : "Book Appointment"}
          </button>
        </div>
      </div>

    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function DoctorBrowser() {
  const [view,       setView]       = useState("categories");
  const [category,   setCategory]   = useState(null);
  const [doctor,     setDoctor]     = useState(null);
  const [categories, setCategories] = useState(CATEGORIES); // starts with dummy data
  const [doctorList, setDoctorList] = useState([]);

  // --- API REQUEST (GET /api/doctors/specializations) ---
  // Returns distinct DOCTOR.Specialization values with doctor count.
  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch("http://localhost:3001/api/patient/specializations");
        const data = await res.json();
        // expected: [{ Specialization: "Cardiology", count: 3 }, ...]
        setCategories(data);
      } catch (err) {
        console.error("Failed to load specializations:", err);
        // falls back to dummy CATEGORIES already set as default state
      }
    };
    load();
  }, []);

  // --- API REQUEST (GET /api/doctors?Specialization=:name) ---
  // Returns doctors filtered by DOCTOR.Specialization.
  useEffect(() => {
    if (!category) return;
    const load = async () => {
      try {
        const params = new URLSearchParams({ specialization: category.specialization });
        const res    = await fetch(`http://localhost:3001/api/patient/doctorList?${params}`);
        const data   = await res.json();
        // expected: [{ DoctorID, Name, fee }, ...]
        setDoctorList(data);
      } catch (err) {
        console.error("Failed to load doctors:", err);
      }
    };
    load();
  }, [category]);


  // --- API REQUEST (GET /api/doctors/:DoctorID) ---
  // Returns full DOCTOR row joined with SCHEDULE rows.
   const loadDoctor = async (DoctorID) => {
    try {
      const res  = await fetch(`http://localhost:3001/api/patient/doctorSchedule?id=${DoctorID}`);
      const data = await res.json();
      // expected: {
      //   DoctorID, Name, Specialization, Phone, Email, fee,
      //   schedules: [{ ScheduleID, DoctorID, Day, Start_Time, End_Time }, ...]
      // }
      setDoctor(data);
      setView("doctor");
    } catch (err) {
      console.error("Failed to load doctor:", err);
    }
  };



  const countFor = (spec) =>
    categories.find(c => c.specialization === spec)?.count
    ?? DOCTORS.filter(d => d.specialization === spec).length;

  const selectCategory = (cat) => { setCategory(cat); setDoctorList([]); setView("doctors"); };

  const goBack = () => {
    if (view === "doctor")       { setDoctor(null);   setView("doctors");    }
    else if (view === "doctors") { setCategory(null); setDoctorList([]); setView("categories"); }
  };

  const crumb = () => {
    if (view === "categories") return null;
    if (view === "doctors")    return <><span>{category.specialization}</span></>;
    return <><span>{category.specialization}</span> › <span>{doctor.name}</span></>;
  };

  return (
    <div className="db-app">
      <div className="db-header">
        {view !== "categories" && (
          <button className="back-btn" onClick={goBack}>← Back</button>
        )}
        <h1>Find a <span>Doctor</span></h1>
        {view !== "categories" && (
          <div className="breadcrumb">{crumb()}</div>
        )}
      </div>

      <div className="db-body">

        {/* CATEGORIES — grouped by DOCTOR.Specialization */}
        {view === "categories" && (
          <>
            <div className="sec-label">Departments</div>
            <div className="category-grid">
              {categories.map(cat => (
                <div key={cat.specialization} className="cat-card" onClick={() => selectCategory(cat)}>
                  <div className="cat-name">{cat.specialization}</div>
                  <div className="cat-count">{countFor(cat.specialization)} doctors</div>
                </div>
              ))}
            </div>
          </>
        )}

        {view === "doctors" && (
          <>
            <div className="sec-label">{category.specialization} — {doctorList.length} doctors</div>
            <div className="doctor-list">
              {doctorList.map(doc => (
                <div key={doc.doctorid} className="doc-row" onClick={() => loadDoctor(doc.doctorid)}>
                  <span className="doc-row-name">{doc.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span className="doc-row-fee">৳ {doc.fee}</span>
                    <span className="doc-row-arrow">›</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* DOCTOR DETAIL + BOOKING */}
        {view === "doctor" && doctor && (
          <DoctorDetail doctor={doctor} />
        )}

      </div>
    </div>
  );
}