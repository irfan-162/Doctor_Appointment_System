import "./Prescription.css";
import { useEffect, useState } from "react";
/* ═══════════════════════════════════════
   DUMMY DATA  (ERD-aligned field names)
   MEDICAL_RECORD: RecordID, Diagnosis, Notes, AppointmentID
   PRESCRIPTION:   PrescriptionID, Medicine_Name, Dosage, Duration, RecordID
   TREATMENT:      TreatmentID, Treatment_Name, Description, Cost, RecordID
   DOCTOR:         DoctorID, Name, Specialization, Email, Phone
   APPOINTMENT:    AppointmentID, Appointment_Date
═══════════════════════════════════════ */

const fmt = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};

export default function Prescription({setisList,setisPres,apptID}) {
  const [PRESCRIPTION_DATA,setData] = useState({
    record: {},
    doctor: {},
    medicines: [],
    treatments: []
  });

  // --- API REQUEST (GET /api/prescription/:RecordID) ---
  useEffect(() => {
    console.log("Loading prescription for appointment ID:", apptID);
    const load = async () => {
      try {
        const res  = await fetch(`http://localhost:3001/api/patient/prescription?appID=${apptID}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setData(data);
      } catch (err) {
        console.error("Failed to load prescription:", err);
      }
    };
    load();
  }, []);

  const { record, doctor, medicines, treatments } = PRESCRIPTION_DATA;
  console.log(treatments);
  return (
    <div className="rx-app">
      <div className="rx-body">
        <button className="back-btn" onClick={()=>{setisList(true); setisPres(false)}}>Back</button>
        {/* TOP ROW: Diagnosis + Doctor */}
        <div className="rx-top">

          {/* CARD 1 — Diagnosis */}
          <div className="rx-card">
            <div className="card-label">Diagnosis</div>
            <div className="diag-name">{record?.name}</div>
            <div className="diag-date">{fmt(record?.date)}</div>
            <hr className="diag-divider" />
            <div className="diag-note-label">Doctor's Notes</div>
            <div className="diag-note">{record?.notes}</div>
          </div>

          {/* CARD 2 — Doctor Info */}
          <div className="rx-card">
            <div className="card-label">Prescribed By</div>
            <div>
              <div className="doc-name">{doctor?.name}</div>
              <div className="doc-spec">{doctor?.specialty}</div>
            </div>
            <hr className="diag-divider" />
            <div className="doc-info-row">
              <span className="doc-info-label">Email</span>
              <span className="doc-info-value">{doctor?.email}</span>
            </div>
            <div className="doc-info-row">
              <span className="doc-info-label">Phone</span>
              <span className="doc-info-value">{doctor?.phone}</span>
            </div>
          </div>

        </div>

        {/* BOTTOM ROW: Medicine List + Treatment List */}
        <div className="rx-bottom">

          {/* CARD 3 — Medicine List (scrollable) */}
          <div className="rx-card-scroll">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <div className="card-label">Medicines</div>
              <div className="count-badge">{medicines.length} items</div>
            </div>

            <div className="list-scroll">
              {medicines.length === 0 ? (
                <div className="list-empty">No medicines prescribed.</div>
              ) : medicines.map(med => (
                <div className="med-item" key={med.PrescriptionID}>
                  <div className="med-name">{med.name}</div>
                  <div className="med-meta">
                    <div className="med-tag">Dosage <span>{med.frequency}</span></div>
                    <div className="med-tag">Duration <span>{med.duration}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 4 — Treatment List (scrollable) */}
          <div className="rx-card-scroll">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <div className="card-label">Treatments</div>
              <div className="count-badge">{treatments.length} items</div>
            </div>

            <div className="list-scroll">
              {treatments.length === 0 ? (
                <div className="list-empty">No treatments prescribed.</div>
              ) : treatments.map(tr => (
                <div className="treat-item" key={tr.TreatmentID}>
                  <div className="treat-name">{tr.name}</div>
                  <div className="treat-desc">{tr.description}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}