import { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";

import "./DiagnosisForm.css";

const FREQUENCIES = ["Once daily", "Twice daily", "3x daily", "4x daily", "Every 8h"];

const mkMed = () => ({ id: Date.now() + Math.random(), name: "", dosage: "Once daily", duration: "" });
const mkTreat = () => ({ id: Date.now() + Math.random(), name: "", description: "" });

export default function DiagnosisForm() {
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);

  const [diagnosis,   setDiagnosis]   = useState("");
  const [notes,       setNotes]       = useState("");
  const [medicines,   setMedicines]   = useState([mkMed()]);
  const [treatments,  setTreatments]  = useState([mkTreat()]);
  const { appID } = useParams();
  const token = sessionStorage.getItem("token");
  console.log(appID);

  /* ── Load current appointment ── */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
       
        const res  = await fetch(`http://localhost:3001/api/doctor/patientinfo?appID=${appID}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
        );
        const data = await res.json();
        setAppointment(data);


        await new Promise(r => setTimeout(r, 600));

      } catch (err) {
        console.error("Failed to load appointment:", err);
        setAppointment(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* ── Save handler ── */
  const handleSave = async () => {
    setSaving(true);
    const payload = {
      appointmentId: appID,
      diagnosis,
      notes,
      medicines: medicines.filter(m => m.name.trim()),
      treatments: treatments.filter(t => t.name.trim()),
    };
    console.log(payload.treatments);
    try {
      // --- API REQUEST (POST save diagnosis) 
      const res = await fetch("http://localhost:3001/api/doctor/consultation", {
        method: "POST",
        headers: {
           "Content-Type": "application/json" ,
           "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");

      console.log("Saving payload:", payload); 
      await new Promise(r => setTimeout(r, 500)); // mock delay
      alert("Saved successfully.");
      navigate("/doctordashboard/PatientList");
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Medicine helpers ── */
  const updateMed = (id, field, value) =>
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  const removeMed = (id) =>
    setMedicines(prev => prev.filter(m => m.id !== id));

  /* ── Treatment helpers ── */
  const updateTreat = (id, field, value) =>
    setTreatments(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  const removeTreat = (id) =>
    setTreatments(prev => prev.filter(t => t.id !== id));

  /* ── Render ── */
  return (
    <div className="dx-app">
      <div className="dx-header">
        <h1>Consultation <span>Form</span></h1>
        <button className="save-btn" onClick={handleSave} disabled={saving || loading}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {loading && <div className="dx-state">Loading appointment…</div>}

      {!loading && !appointment && (
        <div className="dx-state">No active appointment found.</div>
      )}

      {!loading && appointment && (
        <div className="dx-body">

          {/* ── LEFT — Appointment Info ── */}
          <div className="dx-left">
            <div className="apt-card">

              <hr className="apt-divider" />
              <div className="apt-row">
                <span className="apt-label">Patient</span>
                <span className="apt-value">{appointment.patient}</span>
              </div>
              <div className="apt-row">
                <span className="apt-label">Age / Gender</span>
                <span className="apt-value">{appointment.age} · {appointment.gender}</span>
              </div>
              <hr className="apt-divider" />
              <div className="apt-row">
                <span className="apt-label">Date</span>
                <span className="apt-value">{appointment.date}</span>
              </div>
              <div className="apt-row">
                <span className="apt-label">Time</span>
                <span className="apt-value">{appointment.time}</span>
              </div>
              <hr className="apt-divider" />
              <div className="apt-row">
                <span className="apt-label">Status</span>
                <span className="status-badge">{appointment.status}</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT — Form ── */}
          <div className="dx-right">

            {/* Diagnosis */}
            <div className="dx-section">
              <div className="section-title">Diagnosis</div>
              <textarea
                placeholder="Enter diagnosis…"
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
                rows={3}
              />
            </div>

            {/* Notes */}
            <div className="dx-section">
              <div className="section-title">Notes</div>
              <textarea
                placeholder="Clinical notes, observations…"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Medicines */}
            <div className="dx-section">
              <div className="section-title">Prescription</div>

              {medicines.length > 0 && (
                <div className="col-labels medicine-labels">
                  <span className="col-label">Medicine name</span>
                  <span className="col-label">Frequency</span>
                  <span className="col-label">Duration</span>
                  <span />
                </div>
              )}

              <div className="medicine-list">
                {medicines.map(med => (
                  <div className="medicine-row" key={med.id}>
                    <input
                      type="text"
                      placeholder="e.g. Paracetamol 500mg"
                      value={med.name}
                      onChange={e => updateMed(med.id, "name", e.target.value)}
                    />
                    <select
                      value={med.frequency}
                      onChange={e => updateMed(med.id, "frequency", e.target.value)}
                    >
                      {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                    </select>
                    <input
                      type="text"
                      placeholder="e.g. 5 days"
                      value={med.duration}
                      onChange={e => updateMed(med.id, "duration", e.target.value)}
                    />
                    <button className="rm-btn" onClick={() => removeMed(med.id)}>×</button>
                  </div>
                ))}
              </div>

              <button className="add-row-btn" onClick={() => setMedicines(p => [...p, mkMed()])}>
                + Add medicine
              </button>
            </div>

            {/* Treatments */}
            <div className="dx-section">
              <div className="section-title">Treatments</div>

              {treatments.length > 0 && (
                <div className="col-labels treatment-labels">
                  <span className="col-label">Treatment name</span>
                  <span className="col-label">Description</span>
                  <span />
                </div>
              )}

              <div className="treatment-list">
                {treatments.map(tr => (
                  <div className="treatment-row" key={tr.id}>
                    <input
                      type="text"
                      placeholder="e.g. Physical therapy"
                      value={tr.name}
                      onChange={e => updateTreat(tr.id, "name", e.target.value)}
                    />
                    <textarea
                      placeholder="Describe the treatment…"
                      value={tr.description}
                      rows={2}
                      onChange={e => updateTreat(tr.id, "description", e.target.value)}
                    />
                    <button className="rm-btn" onClick={() => removeTreat(tr.id)}>×</button>
                  </div>
                ))}
              </div>

              <button className="add-row-btn" onClick={() => setTreatments(p => [...p, mkTreat()])}>
                + Add treatment
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
