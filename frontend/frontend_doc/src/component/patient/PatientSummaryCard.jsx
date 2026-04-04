import { useEffect, useState } from "react";

const fmtDate = (d) => d
  ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  : "—";

export default function PatientSummaryCard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // --- API REQUEST (GET /api/patient/:id/summary) ---
        // Calls SELECT * FROM get_patient_summary(:patientId) on backend.
        const res  = await fetch(`http://localhost:3001/api/patient/summary`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        });
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Failed to load patient summary:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cardStyle = {
    background: "var(--color-background-primary, #fff)",
    border: "0.5px solid var(--color-border-tertiary, #e0e0e0)",
    borderRadius: "12px",
    padding: "1rem 1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    fontFamily: "inherit",
    width: "400px",
    height:"300px",
  };

  const metricStyle = {
    background: "var(--color-background-secondary, #f7f7f5)",
    borderRadius: "8px",
    padding: "10px 12px",
  };

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 12px",
    background: "var(--color-background-secondary, #f7f7f5)",
    borderRadius: "8px",
  };

  return (
    <div style={cardStyle}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary, #888)" }}>
          Patient summary
        </span>
      </div>

      {loading ? (
        <span style={{ fontSize: 12, color: "var(--color-text-tertiary, #bbb)", fontFamily: "monospace" }}>
          Loading…
        </span>
      ) : !summary ? (
        <span style={{ fontSize: 12, color: "var(--color-text-tertiary, #bbb)" }}>No data.</span>
      ) : (
        <>
          {/* total_visits + total_medicines */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={metricStyle}>
              <p style={{ fontSize: 22, fontWeight: 500, margin: 0, lineHeight: 1, color: "var(--color-text-primary, #1a1a1a)" }}>
                {summary.total_visits}
              </p>
              <p style={{ fontSize: 12, color: "var(--color-text-secondary, #888)", margin: "4px 0 0" }}>
                Total visits
              </p>
            </div>
            <div style={metricStyle}>
              <p style={{ fontSize: 22, fontWeight: 500, margin: 0, lineHeight: 1, color: "var(--color-text-primary, #1a1a1a)" }}>
                {summary.total_medicines}
              </p>
              <p style={{ fontSize: 12, color: "var(--color-text-secondary, #888)", margin: "4px 0 0" }}>
                Medicines given
              </p>
            </div>
          </div>

          {/* last_visit */}
          <div style={rowStyle}>
            <span style={{ fontSize: 12, color: "var(--color-text-secondary, #888)" }}>Last visit</span>
            <span style={{ fontSize: 12, fontWeight: 500, fontFamily: "monospace", color: "var(--color-text-primary, #1a1a1a)" }}>
              {fmtDate(summary.last_visit)}
            </span>
          </div>

          {/* common_diagnosis */}
          <div style={{ borderTop: "0.5px solid var(--color-border-tertiary, #e0e0e0)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 11, color: "var(--color-text-tertiary, #bbb)" }}>
              Most common diagnosis
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, color: "var(--color-text-primary, #1a1a1a)" }}>
              {summary.common_diagnosis ?? "—"}
            </span>
          </div>
        </>
      )}

    </div>
  );
}
