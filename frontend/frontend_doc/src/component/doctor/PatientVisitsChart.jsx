import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Dot,
} from "recharts";
import { useEffect , useState } from "react";


const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #8e8171",
      borderRadius: 4,
      padding: "8px 12px",
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 12,
      color: "#8e8171",
    }}>
      <div style={{ color: "#8e8171", fontSize: 10, marginBottom: 2 }}>{label}</div>
      <div>{payload[0].value} patients</div>
    </div>
  );
};

export default function PatientVisitsChart() {
  
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/doctor/weekly-visits", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("token")}`
          },
        });
  
        const text = await res.text();
        console.log("RAW RESPONSE:", text);
  
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
  
        const result = JSON.parse(text);
  
        console.log("Parsed result:", result);
  
        setData(Array.isArray(result) ? result : []);
  
      } catch (err) {
        console.error("Fetch error:", err.message);
        setData([]);
      }
    };
  
    load(); 
  }, []);


  return (
    <div style={{
      width: 500,
      height: 300,
      background: "#fff",
      border: "1px solid #8e8171",
      borderRadius: 6,
      padding: "20px 16px 12px",
      fontFamily: "'IBM Plex Sans', sans-serif",
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#8e8171",
          marginBottom: 2,
        }}>
          Weekly
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#8e8171" }}>
          Patient Visits Over Time
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={210}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fill: "#8e8171" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fill: "#8e8171" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#8e8171" }} />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#8e8171"
            strokeWidth={2}
            dot={<Dot r={3} fill="#8e8171" strokeWidth={0} />}
            activeDot={{ r: 5, fill: "#8e8171", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
