import { useState,useEffect } from "react";
import "./PrescriptionCard.css";

const prescriptionData = {
  date: "February 25, 2026",
  diagnosis: "Acute Bacterial Sinusitis",
  notes:
    "Patient presents with persistent nasal congestion, facial pressure, and purulent discharge lasting over 10 days. Mild fever reported. Follow-up in 2 weeks if symptoms persist.",
  doctor: {
    name: "Dr. Ariana Vasquez",
    specialty: "ENT Specialist",
    phone: "+1 (617) 294-0031",
    email: "a.vasquez@medicore.health",
  },
  medicines: [
    { name: "Amoxicillin-Clavulanate", dosage: "875 mg / 125 mg", duration: "10 days", frequency: "Twice daily" },
    { name: "Fluticasone Nasal Spray", dosage: "50 mcg / spray", duration: "30 days", frequency: "2 sprays each nostril daily" },
    { name: "Cetirizine HCl", dosage: "10 mg", duration: "14 days", frequency: "Once daily (evening)" },
    { name: "Pseudoephedrine", dosage: "60 mg", duration: "5 days", frequency: "Every 4–6 hours as needed" },
    { name: "Saline Nasal Rinse", dosage: "240 ml per session", duration: "Ongoing", frequency: "Twice daily" },
    { name: "Ibuprofen", dosage: "400 mg", duration: "7 days", frequency: "Every 6 hours with food" },
  ],
  treatments: [
    { name: "Nasal Irrigation Therapy", description: "Daily saline rinse using a neti pot to flush out mucus and allergens from the nasal passages." },
    { name: "Steam Inhalation", description: "10-minute steam sessions twice daily to relieve congestion and soften mucus buildup." },
    { name: "Warm Compress", description: "Apply warm compress to the face over sinuses for 10 minutes, three times a day to reduce facial pain." },
  ],
};

function DiagnosisCard({date, diagnosis, notes}) {
  return (
    <div className="card">
      <div className="card-label">Diagnosis</div>
      <div className="diag-date">{date}</div>
      <div className="diag-name">{diagnosis}</div>
      <div className="diag-notes">{notes}</div>
    </div>
  );
}

function DoctorCard({ doctor }) {

  return (
    <div className="card">
      <div className="card-label">Attending Physician</div>
      <div className="doc-name">{doctor.name}</div>
      <div className="doc-specialty">{doctor.specialty}</div>
      <div className="doc-contact">
        <div className="doc-contact-row">
          <span className="contact-icon">📞</span>
          {doctor.phone}
        </div>
        <div className="doc-contact-row">
          <span className="contact-icon">✉️</span>
          {doctor.email}
        </div>
      </div>
    </div>
  );
}

function MedicineCard({ medicines }) {
  return (
    <div className="card med-card">
      <div className="card-label">Prescribed Medicines</div>
      {(medicines.length === 0) && 
      <div className="doc-name">Please pay the bill</div>
      }
      <div className="med-scroll">
        {medicines.map((med, i) => (
          <div className="med-row" key={i}>
            <div>
              <div className="med-name">{med.name}</div>
              <div className="med-freq">{med.frequency}</div>
            </div>
            {/* <span className="med-chip secondary">{med.dosage}</span> */}
            <span className="med-chip">{med.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TreatmentCard({ treatments }) {
  return (
    <div className="card treat-card">
      <div className="card-label">Treatment Plan</div>
      {treatments.length === 0 ? (
        <div className="no-treatment">No treatment required</div>
      ) : (
        <div className="treat-list">
          {treatments.map((t, i) => (
            <div className="treat-item" key={i}>
              <div className="treat-name">
                <span className="treat-dot" />
                {t.name}
              </div>
              {t.description && (
                <div className="treat-desc">{t.description}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PrescriptionCard({apptID}) {
  const { date, diagnnosis, notes, doctsor, medicineo, treatmentss } =
    prescriptionData;
  const[medicines,setMedicines] = useState([]);
  const[treatments,setTreatment] = useState([]);
  const[diagnosis,setdiagnosis] = useState({});
  const[doctor,setDoctor] = useState({});



  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/patient/medicines?apptID=${apptID}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setMedicines(data);
      } catch (err) {
        setError(err.message);
      } finally {
        console.log('Ok');
      }
    };
    
    const fetchTreatment = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/patient/treatment?apptID=${apptID}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setTreatment(data);
      } catch (err) {
        setError(err.message);
      } finally {
        console.log('Ok');
      }
    };

    const fetchDiagnosis = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/patient/medrec?apptID=${apptID}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setdiagnosis(data);
      } catch (err) {
        setError(err.message);
      } finally {
        console.log('Ok');
      }
    };
    const fetchDoctor = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/patient/recdoc?apptID=${apptID}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setDoctor(data);
      } catch (err) {
        setError(err.message);
      } finally {
        console.log('Ok');
      }
    };
    if (apptID) {
      fetchMedicines();
      fetchDiagnosis();
      fetchDoctor();
      fetchTreatment();
    }
  }, []); 
  return (
    <div className="rx-shell">

      <div className="rx-grid">
        <DiagnosisCard date={diagnosis.date} diagnosis={diagnosis.name} notes={diagnosis.notes} />
        <DoctorCard doctor={doctor} />

        <div className="rx-bottom-row">
          <MedicineCard medicines={medicines} />
          <TreatmentCard treatments={treatments} />
        </div>
      </div>
    </div>
  );
}