import { useState } from "react";
import "./ScheduleManagement.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const fmt = (t) => {
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  return `${hr % 12 || 12}:${m} ${hr < 12 ? "AM" : "PM"}`;
};

export default function ScheduleManagement() {
  const [day, setDay] = useState("Mon");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);

  const handleAdd = async () => {
    if (!start || !end) { setError("Fill in both times."); return; }
    if (start >= end)   { setError("Start must be before end."); return; }
    setError("");

    const newEntry = { id: Date.now(), day, start, end };

    // --- API REQUEST (POST) ---
    // try {
    //   const res = await fetch("/api/schedule", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ day, start, end }),
    //   });
    //   const data = await res.json();
    //   newEntry.id = data.id; // use server-generated id
    // } catch (err) {
    //   setError("Failed to save entry.");
    //   return;
    // }

    setItems(prev => [...prev, newEntry]);
  };

  const handleDelete = async (id) => {
    // --- API REQUEST (DELETE) ---
    // try {
    //   await fetch(`/api/schedule/${id}`, {
    //     method: "DELETE",
    //   });
    // } catch (err) {
    //   console.error("Failed to delete entry:", err);
    //   return;
    // }

    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Schedule <span>Management</span></h1>
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

          <button className="add-btn" onClick={handleAdd}>+ Add</button>
        </div>

        {/* RIGHT */}
        <div className="right">
          <div className="section-label">Schedule</div>

          {items.length === 0 ? (
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
