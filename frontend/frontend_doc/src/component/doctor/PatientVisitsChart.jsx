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
      border: "1px solid #e0e0e0",
      borderRadius: 4,
      padding: "8px 12px",
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 12,
      color: "#1a1a1a",
    }}>
      <div style={{ color: "#aaa", fontSize: 10, marginBottom: 2 }}>{label}</div>
      <div>{payload[0].value} patients</div>
    </div>
  );
};

export default function PatientVisitsChart() {
  
  const [data,setData] = useState([]);


  useEffect(() => {
    const load = async () => {
      const res  = await fetch("http://localhost:3001/api/doctor/weekly-visits",{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });
      const data = await res.json();
      const text = await res.text();
console.log("RESPONSE:", text);
      setData(data);
      console.log(data);
    };

    load();
  }, []);


  return (
    <div style={{
      width: 500,
      height: 300,
      background: "#fff",
      border: "1px solid #e0e0e0",
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
          color: "#aaa",
          marginBottom: 2,
        }}>
          Weekly
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a" }}>
          Patient Visits Over Time
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={210}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fill: "#bbb" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fill: "#bbb" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e0e0e0" }} />
          <Line
            type="monotone"
            dataKey="visits"
            stroke="#1a1a1a"
            strokeWidth={2}
            dot={<Dot r={3} fill="#1a1a1a" strokeWidth={0} />}
            activeDot={{ r: 5, fill: "#1a1a1a", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
