import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const BLOOD_GROUPS    = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];
const SPECIALIZATIONS = [
  "Medicine", "Cardiologist", "Dermatologist",
  "Neurologist", "Orthopedic", "Pediatrician",
  "Psychiatrist", "Gynecologist", "ENT",
];

/* ── Login Form (same for both roles) ── */
function LoginForm({ role }) {
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [form,    setForm]    = useState({ email: "", password: "" });

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handle = async () => {
    setError("");
    setLoading(true);
    try {
      // --- API REQUEST (POST login) ---
      const res = await fetch(`http://localhost:3001/api/${role}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      if (!res.ok) throw new Error("Invalid credentials.");
      const data = await res.json();
      sessionStorage.setItem("token", data.token);
      navigate(role === "doctor" ? "/doctordashboard/profile" : "/patientdashboard");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="field">
        <label>Email</label>
        <input type="text" placeholder="you@example.com" value={form.email} onChange={set("email")} />
      </div>
      <div className="field">
        <label>Password</label>
        <input type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
      </div>
      {error && <div className="form-error">{error}</div>}
      <button className="submit-btn" disabled={loading} onClick={handle}>
        {loading ? "Please wait…" : "Log In"}
      </button>
    </div>
  );
}

/* ── Doctor Signup Form ── */
function DoctorSignupForm() {
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [form,    setForm]    = useState({
    name: "", email: "", phone: "",
    specialization: SPECIALIZATIONS[0],
    consultation_fee: "", password: "",
  });

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handle = async () => {
    setError("");
    setLoading(true);
    try {
      // --- API REQUEST (POST doctor signup) ---
      const res = await fetch("http://localhost:3001/api/doctor/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:             form.name,
          email:            form.email,
          phone:            form.phone,
          specialization:   form.specialization,
          consultation_fee: Number(form.consultation_fee),
          password:         form.password,
        }),
      });
      if (!res.ok) throw new Error("Signup failed. Email may already be in use.");
      const data = await res.json();
      sessionStorage.setItem("token", data.token);

      navigate("/");
    } catch (err) {
      setError(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="field">
        <label>Full Name</label>
        <input type="text" placeholder="Dr. Karim Hossain" value={form.name} onChange={set("name")} />
      </div>
      <div className="field">
        <label>Email</label>
        <input type="text" placeholder="you@example.com" value={form.email} onChange={set("email")} />
      </div>
      <div className="field">
        <label>Phone</label>
        <input type="text" placeholder="+880 1XXX-XXXXXX" value={form.phone} onChange={set("phone")} />
      </div>
      <div className="field">
        <label>Specialization</label>
        <select value={form.specialization} onChange={set("specialization")}>
          {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="field">
        <label>Consultation Fee (BDT)</label>
        <input type="number" placeholder="e.g. 800" min="0" value={form.consultation_fee} onChange={set("consultation_fee")} />
      </div>
      <div className="field">
        <label>Password</label>
        <input type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
      </div>
      {error && <div className="form-error">{error}</div>}
      <button className="submit-btn" disabled={loading} onClick={handle}>
        {loading ? "Please wait…" : "Sign Up"}
      </button>
    </div>
  );
}

/* ── Patient Signup Form ── */
function PatientSignupForm() {
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [form,    setForm]    = useState({
    name: "", age: "", gender: "Male",
    blood_group: BLOOD_GROUPS[0],
    phone: "", email: "", password: "",
  });

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handle = async () => {
    setError("");
    setLoading(true);
    try {
      // --- API REQUEST (POST patient signup) ---
      const res = await fetch("http://localhost:3001/api/patient/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:        form.name,
          age:         Number(form.age),
          gender:      form.gender,
          blood_group: form.blood_group,
          phone:       form.phone,
          email:       form.email,
          password:    form.password,
        }),
      });
      if (!res.ok) throw new Error("Signup failed. Email may already be in use.");
      const data = await res.json();
      sessionStorage.setItem("token", data.token);


      navigate("/");
    } catch (err) {
      setError(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="field">
        <label>Full Name</label>
        <input type="text" placeholder="Rafi Uddin" value={form.name} onChange={set("name")} />
      </div>
      <div className="two-col">
        <div className="field">
          <label>Age</label>
          <input type="number" placeholder="e.g. 30" min="0" value={form.age} onChange={set("age")} />
        </div>
        <div className="field">
          <label>Gender</label>
          <select value={form.gender} onChange={set("gender")}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label>Blood Group</label>
        <select value={form.blood_group} onChange={set("blood_group")}>
          {BLOOD_GROUPS.map((b) => <option key={b}>{b}</option>)}
        </select>
      </div>
      <div className="field">
        <label>Phone</label>
        <input type="text" placeholder="+880 1XXX-XXXXXX" value={form.phone} onChange={set("phone")} />
      </div>
      <div className="field">
        <label>Email</label>
        <input type="text" placeholder="you@example.com" value={form.email} onChange={set("email")} />
      </div>
      <div className="field">
        <label>Password</label>
        <input type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
      </div>
      {error && <div className="form-error">{error}</div>}
      <button className="submit-btn" disabled={loading} onClick={handle}>
        {loading ? "Please wait…" : "Sign Up"}
      </button>
    </div>
  );
}

/* ── Auth Card ── */
function AuthCard({ role }) {
  const [tab, setTab] = useState("login");

  const labels = {
    doctor:  { title: "Doctor Portal",  sub: "Manage patients & consultations" },
    patient: { title: "Patient Portal", sub: "View records & appointments"      },
  };

  const { title, sub } = labels[role];

  const renderForm = () => {
    if (tab === "login")   return <LoginForm role={role} />;
    if (role === "doctor") return <DoctorSignupForm />;
    return <PatientSignupForm />;
  };

  return (
    <div className="auth-card">
      <div className="auth-card-header">
        <h2>{title}</h2>
        <p>{sub}</p>
      </div>

      <div className="auth-tabs">
        <button className={`tab-btn ${tab === "login"  ? "active" : ""}`} onClick={() => setTab("login")}>
          Log In
        </button>
        <button className={`tab-btn ${tab === "signup" ? "active" : ""}`} onClick={() => setTab("signup")}>
          Sign Up
        </button>
      </div>

      <div className="auth-scroll">
        {renderForm()}
      </div>
    </div>
  );
}

/* ── Home Page ── */
export default function HomePage() {
  const [role, setRole] = useState(null);

  return (
    <div className="home-app">
      <div className="home-header">
        <h1>DOCTOR APPOINTMENT <span>SYSTEM</span></h1>
      </div>

      <div className="home-body">
        <div className="role-select">
          <span className="role-label">Continue as</span>

          <div className="role-buttons">
            <button
              className={`role-btn ${role === "doctor"  ? "active" : "inactive"}`}
              onClick={() => setRole("doctor")}
            >
              Doctor
            </button>
            <button
              className={`role-btn ${role === "patient" ? "active" : "inactive"}`}
              onClick={() => setRole("patient")}
            >
              Patient
            </button>
          </div>

          {role && <AuthCard key={role} role={role} />}
        </div>
      </div>
    </div>
  );
}