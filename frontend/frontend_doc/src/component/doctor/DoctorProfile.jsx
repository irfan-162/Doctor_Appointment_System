import { useEffect, useState } from "react";
import { MdEdit, MdSend } from "react-icons/md";

export default function Profile() {
  const [patient, setPatient] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [errors, setErrors] = useState({});

  const genderOptions = ["Cardiologist", "Orthopedic", "Medicine"];

  // Fetch patient data
  useEffect(() => {
    fetch("http://localhost:3001/api/doctor/profile?id=2")
      .then((res) => res.json())
      .then((data) => {
        setPatient(data);
        setFieldValues({
          name: data.name,
          specialization: data.gender,
          phone: data.phone,
          email: data.email,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  // Validate input
  const validateField = (field, value) => {
    let error = "";
    if (field === "phone") {
      if (!/^\d{11}$/.test(value)) error = "Phone must be exactly 11 digits";
    } else if (field === "email") {
      if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value))
        error = "Invalid email format";
    } else if (field === "age") {
      if (isNaN(value) || value <= 0) error = "Invalid age";
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const handleChange = (field, value) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleEditClick = (field) => {
    setEditingField(field);
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

    const handleSendClick = async (field) => {
      const updatedValue = fieldValues[field];
    
      if (!validateField(field, updatedValue)) return; // Don't send invalid data
    
      try {
        const res = await fetch("http://localhost:3001/api/doctor/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: 2,           
            field: field,    
            value: updatedValue,
          }),
        });
    
        const data = await res.json();
    
        if (res.ok) {
          // Update local state only if backend update succeeded
          setPatient((prev) => ({ ...prev, [field]: updatedValue }));
          setEditingField(null);
          console.log("Update successful:", data);
        } else {
          console.log("Update failed:", data.message);
          alert("Update failed: " + data.message);
        }
      } catch (err) {
        console.error("Error updating field:", err);
        alert("Error updating field. Please try again.");
      }
    };
    


  const fields = [
    { label: "Name", key: "name", type: "text" },
    { label: "Specialization", key: "specialization", type: "select", options: genderOptions },
    { label: "Phone", key: "phone", type: "text" },
    { label: "Email", key: "email", type: "email" },
    { label: "Fee", key: "consultation_fee", type: "text" },
  ];

  return (
    <div className="profile">
      <div className="profileDetails">
        {fields.map((field) => (
          <div className="formGroup" key={field.key}>
            <label>{field.label}</label>
            <div className="formBox">
              {editingField === field.key ? (
                field.type === "select" ? (
                  <select
                    className="formBoxText"
                    value={fieldValues[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  >
                    <option value="">Select</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="formBoxText"
                    type={field.type === "age" ? "number" : field.type}
                    value={fieldValues[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                )
              ) : (
                <span className="formBoxText">{patient?.[field.key]}</span>
              )}

              <div
                className="update"
                onClick={() =>
                  editingField === field.key
                    ? handleSendClick(field.key)
                    : handleEditClick(field.key)
                }
              >
                {editingField === field.key ? (
                  <MdSend
                    size={18}
                    style={{
                      cursor: errors[field.key] ? "not-allowed" : "pointer",
                      color: errors[field.key] ? "gray" : "green",
                    }}
                  />
                ) : (
                  <MdEdit size={18} style={{ cursor: "pointer" }} />
                )}
              </div>
            </div>

            {errors[field.key] && (
              <p style={{ color: "red", fontSize: "12px", margin: "2px 0 0" }}>
                {errors[field.key]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
