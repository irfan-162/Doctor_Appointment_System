import "./Prescription.css";

/* ═══════════════════════════════════════
   DUMMY DATA  (ERD-aligned field names)
   MEDICAL_RECORD: RecordID, Diagnosis, Notes, AppointmentID
   PRESCRIPTION:   PrescriptionID, Medicine_Name, Dosage, Duration, RecordID
   TREATMENT:      TreatmentID, Treatment_Name, Description, Cost, RecordID
   DOCTOR:         DoctorID, Name, Specialization, Email, Phone
   APPOINTMENT:    AppointmentID, Appointment_Date
═══════════════════════════════════════ */
const PRESCRIPTION_DATA = {
  record: {
    RecordID:     1,
    Diagnosis:    "Hypertensive Heart Disease with Stage 2 Hypertension",
    Notes:        "Patient presents with persistent elevated blood pressure over 160/100 mmHg. Advised strict sodium restriction, regular aerobic exercise, and weight management. Follow-up in 4 weeks for BP monitoring. Avoid NSAIDs.",
    AppointmentID: 101,
    Appointment_Date: "2026-03-19",
  },
  doctor: {
    DoctorID:       1,
    Name:           "Dr. Karim Hossain",
    Specialization: "Cardiologist",
    Email:          "karim@clinic.com",
    Phone:          "+880 1711-000001",
  },
  medicines: [
    { PrescriptionID: 1, Medicine_Name: "Amlodipine 5mg",      Dosage: "1+0+0",   Duration: "30 days" },
    { PrescriptionID: 2, Medicine_Name: "Losartan 50mg",       Dosage: "0+0+1",   Duration: "30 days" },
    { PrescriptionID: 3, Medicine_Name: "Hydrochlorothiazide", Dosage: "1+0+0",   Duration: "14 days" },
    { PrescriptionID: 4, Medicine_Name: "Aspirin 75mg",        Dosage: "0+1+0",   Duration: "30 days" },
    { PrescriptionID: 5, Medicine_Name: "Atorvastatin 20mg",   Dosage: "0+0+1",   Duration: "30 days" },
    { PrescriptionID: 6, Medicine_Name: "Metoprolol 25mg",     Dosage: "1+0+1",   Duration: "30 days" },
  ],
  treatments: [
    { TreatmentID: 1, Treatment_Name: "BP Monitoring",        Description: "Daily blood pressure monitoring, morning and evening readings. Record in a logbook.", Cost: 0    },
    { TreatmentID: 2, Treatment_Name: "Cardiac Rehab",        Description: "Supervised aerobic exercise 3 times per week, 30 minutes per session.",              Cost: 2000 },
    { TreatmentID: 3, Treatment_Name: "Dietary Counseling",   Description: "DASH diet plan consultation with a certified dietitian. Restrict sodium to 1.5g/day.", Cost: 500  },
    { TreatmentID: 4, Treatment_Name: "Echocardiography",     Description: "2D Echo to assess cardiac function and chamber dimensions. Repeat in 3 months.",      Cost: 3500 },
  ],
};

// --- API REQUEST (GET /api/prescription/:RecordID) ---
// useEffect(() => {
//   const load = async () => {
//     try {
//       const res  = await fetch(`/api/prescription/${RecordID}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       const data = await res.json();
//       // expected: {
//       //   record:     { RecordID, Diagnosis, Notes, AppointmentID, Appointment_Date },
//       //   doctor:     { DoctorID, Name, Specialization, Email, Phone },
//       //   medicines:  [{ PrescriptionID, Medicine_Name, Dosage, Duration }, ...],
//       //   treatments: [{ TreatmentID, Treatment_Name, Description, Cost }, ...],
//       // }
//       setData(data);
//     } catch (err) {
//       console.error("Failed to load prescription:", err);
//     }
//   };
//   load();
// }, [RecordID]);

const fmt = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};

export default function Prescription() {
  const { record, doctor, medicines, treatments } = PRESCRIPTION_DATA;

  return (
    <div className="rx-app">
      <div className="rx-body">

        {/* TOP ROW: Diagnosis + Doctor */}
        <div className="rx-top">

          {/* CARD 1 — Diagnosis */}
          <div className="rx-card">
            <div className="card-label">Diagnosis</div>
            <div className="diag-name">{record.Diagnosis}</div>
            <div className="diag-date">{fmt(record.Appointment_Date)}</div>
            <hr className="diag-divider" />
            <div className="diag-note-label">Doctor's Notes</div>
            <div className="diag-note">{record.Notes}</div>
          </div>

          {/* CARD 2 — Doctor Info */}
          <div className="rx-card">
            <div className="card-label">Prescribed By</div>
            <div>
              <div className="doc-name">{doctor.Name}</div>
              <div className="doc-spec">{doctor.Specialization}</div>
            </div>
            <hr className="diag-divider" />
            <div className="doc-info-row">
              <span className="doc-info-label">Email</span>
              <span className="doc-info-value">{doctor.Email}</span>
            </div>
            <div className="doc-info-row">
              <span className="doc-info-label">Phone</span>
              <span className="doc-info-value">{doctor.Phone}</span>
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
                  {/* PRESCRIPTION.Medicine_Name */}
                  <div className="med-name">{med.Medicine_Name}</div>
                  <div className="med-meta">
                    {/* PRESCRIPTION.Dosage */}
                    <div className="med-tag">Dosage <span>{med.Dosage}</span></div>
                    {/* PRESCRIPTION.Duration */}
                    <div className="med-tag">Duration <span>{med.Duration}</span></div>
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
                  {/* TREATMENT.Treatment_Name */}
                  <div className="treat-name">{tr.Treatment_Name}</div>
                  {/* TREATMENT.Description */}
                  <div className="treat-desc">{tr.Description}</div>
                  {/* TREATMENT.Cost */}
                  {tr.Cost > 0 && (
                    <div className="treat-cost">৳ {tr.Cost.toLocaleString()}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
