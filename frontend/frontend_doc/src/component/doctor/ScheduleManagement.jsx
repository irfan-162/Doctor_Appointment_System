import { useState, useEffect, useCallback } from "react";
import "./ScheduleManagement.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const fmt = (t) => {
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  return `${hr % 12 || 12}:${m} ${hr < 12 ? "AM" : "PM"}`;
};

export default function ScheduleManagement() {
  const [day,     setDay]     = useState("Mon");
  const [start,   setStart]   = useState("09:00");
  const [end,     setEnd]     = useState("10:00");
  const [error,   setError]   = useState("");
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding,  setAdding]  = useState(false);

  /* ── Fetch schedule list from backend ── */
  const fetchSchedule = useCallback(async () => {
    setLoading(true);
  
    try {
      const token = sessionStorage.getItem("token");
  
      if (!token) {
        throw new Error("No token found. Please login.");
      }
      const res = await fetch("http://localhost:3001/api/doctor/schedule", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
      });
  
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized (token expired)");
        }
        if (res.status === 404) {
          throw new Error("API not found");
        }
        throw new Error(`Failed to fetch: ${res.status}`);
      }
  
      const data = await res.json();
  
      if (!Array.isArray(data)) {
        throw new Error("Invalid schedule format");
      }
  
      setItems(data);
  
    } catch (err) {
      console.error("Failed to load schedule:", err.message);
    } finally {
      setLoading(false);
    }
    console.log("Fetched schedule items:", items);
  }, []);

  // Load on mount
  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  /* ── Add entry → reload list ── */
  const handleAdd = async () => {
    const token = sessionStorage.getItem("token");

    if (!start || !end) { setError("Fill in both times."); return; }
    if (start >= end)   { setError("Start must be before end."); return; }
    setError("");
    setAdding(true);
    try {
      // --- API REQUEST 
      const res = await fetch("http://localhost:3001/api/doctor/postschedule", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
         },
        body: JSON.stringify({ day, start, end }),
      });
      if (!res.ok) throw new Error("Failed to save entry.");
//
      await fetchSchedule();
    } catch (err) {
      setError("Failed to save entry.");
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
  
      const res = await fetch(
        `http://localhost:3001/api/doctor/schedule/${id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
  
      if (!res.ok) {
        throw new Error("Failed to delete schedule");
      }
  
      const data = await res.json();
      console.log("Deleted:", data);
        setItems(prev => prev.filter(item => item.schedule_id !== id));
  
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Schedule <span>Planner</span></h1>
      </div>

      <div className="body">
        {/* LEFT */}
        <div className="left">
          <div className="section-label">Add Entry</div>

          <div className="field-group">
            <div className="section-label">Day</div>
            <select value={day} onChange={e => setDay(e.target.value)}>
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div className="field-group">
            <div className="section-label">Time</div>
            <div className="time-row">
              <input type="time" value={start} onChange={e => setStart(e.target.value)} />
              <input type="time" value={end}   onChange={e => setEnd(e.target.value)}   />
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <button className="add-btn" onClick={handleAdd} disabled={adding}>
            {adding ? "Saving…" : "+ Add"}
          </button>
        </div>

        {/* RIGHT */}
        <div className="right">
          <div className="section-label">Schedule</div>

          {loading ? (
            <div className="empty">Loading…</div>
          ) : items.length === 0 ? (
            <div className="empty">No entries yet.</div>
          ) : (
            <>
              <div className="schedule-list">
                {items.map(item => (
                  <div className="schedule-item" key={item.id}>
                    <div className="item-left">
                      <span className="day-badge">{item.day}</span>
                      <span className="time-range">
                        {fmt(item.start)} — {fmt(item.end)}
                      </span>
                    </div>
                    <button className="del-btn" onClick={() => handleDelete(item.id)}>
                      delete
                    </button>
                  </div>
                ))}
              </div>
              <div className="count">
                {items.length} {items.length === 1 ? "entry" : "entries"}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}