import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientList.css";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("No token found, please login");
          return;
        }
  
        // --- API REQUEST (GET patients list) ---
        const res = await fetch(`http://localhost:3001/api/doctor/patients`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // send token
          },
        });
  
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
  
        const data = await res.json();
        setPatients(data);
        console.log("Loaded patients data:", data);
  
        await new Promise((r) => setTimeout(r, 500)); // optional delay
      } catch (err) {
        console.error("Failed to load patients:", err);
      } finally {
        setLoading(false);
      }
    };
  
    load();
  }, []);



  const goPresribe = (id) => navigate(`doctordashboard/DiagnosisForm/${id}`);

  return (
    <div className="pl-app">
      <div className="pl-header">
        <h1>Patient <span>List</span></h1>
        {!loading && (
          <span className="pl-count">{patients.length} patients</span>
        )}
      </div>

      <div className="pl-body">
        {loading && (
          <div className="pl-empty">Loading patients…</div>
        )}

        {!loading && patients.length === 0 && (
          <div className="pl-empty">No patients found.</div>
        )}

        {!loading && patients.length > 0 && (
          <table className="pl-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.id}>
                  <td className="td-name">{p.name}</td>
                  <td>
                    <span className={`gender-badge ${p.gender}`}>
                      {p.gender}
                    </span>
                  </td>
                  <td className="td-actions">
                    <div className="action-group">
                      <button
                        className="btn-prescribe"
                        onClick={() => goPresribe(p.id)}
                      >
                        Prescribe
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
