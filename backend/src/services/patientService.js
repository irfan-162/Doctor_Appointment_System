const db = require("../config/db");

exports.fetchProfile = async (id) => {
  const info = await db.query(
    `
    SELECT *
    FROM patient
    WHERE patient_id = $1;
    `,
    [id]
  );
  //console.log(info.rows);
  const { patient_id, name, age, gender, phone, blood_group, email, password } =
    info.rows[0];

  return { patient_id, name, age, gender, phone, blood_group, email };
};
exports.fetchCardiologist = async () => {
  const result = await db.query(
    `
    SELECT doctor_id,name,phone,email,ROUND(consultation_fee, 0) AS consultation_fee
    FROM doctor
    WHERE specialization = $1;
    `,
    ["Cardiologist"]
  );
  //console.log(info.rows);
  //const {patient_id,name,age,gender,phone,blood_group,email,password} = info.rows[0];
  return result.rows;
};
exports.fetchOrthopedic = async () => {
  console.log("orthopedic in service")
  const result = await db.query(
    `
    SELECT doctor_id,name,phone,email,ROUND(consultation_fee, 0) AS consultation_fee
    FROM doctor
    WHERE specialization = $1;
    `,
    ["Orthopedic"]
  );
  //console.log(info.rows);
  //const {patient_id,name,age,gender,phone,blood_group,email,password} = info.rows[0];
  return result.rows;
};

exports.fetchGynecologist = async () => {
  console.log("gyno in service")
  const result = await db.query(
    `
    SELECT doctor_id,name,phone,email,ROUND(consultation_fee, 0) AS consultation_fee
    FROM doctor
    WHERE specialization = $1;
    `,
    ["Gynecologist"]
  );
  //console.log(info.rows);
  //const {patient_id,name,age,gender,phone,blood_group,email,password} = info.rows[0];
  return result.rows;
};

exports.fetchENT = async () => {
  console.log("gyno in service")
  const result = await db.query(
    `
    SELECT doctor_id,name,phone,email,ROUND(consultation_fee, 0) AS consultation_fee
    FROM doctor
    WHERE specialization = $1;
    `,
    ["ENT Specialist"]
  );
  //console.log(info.rows);
  //const {patient_id,name,age,gender,phone,blood_group,email,password} = info.rows[0];
  return result.rows;
};

exports.fetchDermatologist = async () => {
  console.log("fetchDermatologist in service")
  const result = await db.query(
    `
    SELECT doctor_id,name,phone,email,ROUND(consultation_fee, 0) AS consultation_fee
    FROM doctor
    WHERE specialization = $1;
    `,
    ["Dermatologist"]
  );
  //console.log(info.rows);
  //const {patient_id,name,age,gender,phone,blood_group,email,password} = info.rows[0];
  return result.rows;
};

exports.fetchPsychiatrist = async () => {
  console.log("fetchDermatologist in service")
  const result = await db.query(
    `
    SELECT doctor_id,name,phone,email,ROUND(consultation_fee, 0) AS consultation_fee
    FROM doctor
    WHERE specialization = $1;
    `,
    ["Psychiatrist"]
  );
  //console.log(info.rows);
  //const {patient_id,name,age,gender,phone,blood_group,email,password} = info.rows[0];
  return result.rows;
};

exports.fetchNeurologist = async () => {
  console.log("fetchNeuro in service")
  const result = await db.query(
    `
    SELECT doctor_id,name,phone,email,ROUND(consultation_fee, 0) AS consultation_fee
    FROM doctor
    WHERE specialization = $1;
    `,
    ["Neurologist"]
  );
  //console.log(info.rows);
  //const {patient_id,name,age,gender,phone,blood_group,email,password} = info.rows[0];
  return result.rows;
};

exports.fetchPediatrician = async () => {
  console.log("fetchNeuro in service")
  const result = await db.query(
    `
    SELECT doctor_id,name,phone,email,ROUND(consultation_fee, 0) AS consultation_fee
    FROM doctor
    WHERE specialization = $1;
    `,
    ["Pediatrician"]
  );
  //console.log(info.rows);
  //const {patient_id,name,age,gender,phone,blood_group,email,password} = info.rows[0];
  return result.rows;
};

exports.fetchMedicine  = async () => {
  console.log("fetchNeuro in service")
  const result = await db.query(
    `
    SELECT doctor_id,name,phone,email,ROUND(consultation_fee, 0) AS consultation_fee
    FROM doctor
    WHERE specialization = $1;
    `,
    ["Medicine"]
  );
  //console.log(info.rows);
  //const {patient_id,name,age,gender,phone,blood_group,email,password} = info.rows[0];
  return result.rows;
};

exports.fetchScheduleID = async (id,day) => {
  const result = await db.query(
    `
    SELECT schedule_id
    FROM schedule
    WHERE doctor_id=$1 AND day=$2;
    `,
    [id,day]
  );
  //console.log(info.rows);
  //const {patient_id,name,age,gender,phone,blood_group,email,password} = info.rows[0];
  return result.rows[0];
};
exports.fetchSchedule = async (id) => {
  const info = await db.query(
    `
SELECT 
  day,
  TO_CHAR(start_time, 'FMHH12:MI AM') AS start_time,
  TO_CHAR(end_time, 'FMHH12:MI AM') AS end_time
FROM schedule
WHERE doctor_id = $1;

    `,
    [id]
  );
  //console.log(info.rows);
  return info.rows;
};

exports.updateProfile = async (req,res) => {
  const { id, field, value } = req.body;

  if (!id || !field) return res.status(400).json({ message: "Invalid request" });

  try {
    await db.query(
      `UPDATE patient SET ${field} = $1 WHERE patient_id = $2`,
      [value, id]
    );
    res.json({ message: "Patient updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.postAppointment = async (req, res) => {
  const { appointment_date, appointment_time, status, doctor_id, patient_id, schedule_id } = req.body;

  try {
    const result = await db.query(
      `
      INSERT INTO appointment (appointment_date, appointment_time, status, doctor_id, patient_id, schedule_id)
      SELECT $1, $2, $3, $4, $5, $6
      WHERE NOT EXISTS (
          SELECT 1
          FROM appointment
          WHERE doctor_id = $4
            AND appointment_date = $1
            AND appointment_time = $2
      )
      RETURNING *;
      `,
      [appointment_date, appointment_time, status, doctor_id, patient_id, schedule_id]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Appointment already exists for this doctor at this time" });
    }

    res.status(201).json({ message: "Appointment created successfully", appointment: result.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.fetchAppointment = async (id) => {
  const info = await db.query(
    `
SELECT 
    a.appointment_id AS id,
    d.name AS doctor_name,
    d.specialization,
    TO_CHAR(a.appointment_date, 'DD/MM/YYYY') AS appointment_date,
    TO_CHAR(a.appointment_time, 'HH12:MIAM') AS appointment_time,
    s.day
FROM doctor d
JOIN appointment a 
    ON d.doctor_id = a.doctor_id
JOIN schedule s 
    ON a.schedule_id = s.schedule_id
WHERE a.patient_id = $1
  AND a.appointment_date >= CURRENT_DATE
ORDER BY a.appointment_date, a.appointment_time;

    `,
    [id]
  );
  console.log(info.rows);
  return info.rows;
};

exports.fetchRecordList = async(id) =>{

  const info = await db.query(
    `
    SELECT 
    a.appointment_id as aID,
    mr.record_id AS id,
    d.name AS name,
    mr.diagnosis AS diagnosis,
    TO_CHAR(a.appointment_date, 'DD/MM/YYYY') AS appointment_date
FROM appointment a
JOIN medical_record mr
ON a.appointment_id = mr.appointment_id
JOIN doctor d
ON a.doctor_id = d.doctor_id
WHERE a.patient_id = $1
    `,
    [id]
  );
  console.log(info.rows);
  return info.rows;

}

exports.fetchMedicinelist = async(id) =>{

  const info = await db.query(
    `
SELECT medicine_name as name,duration,dosage as frequency
FROM medical_record mr JOIN prescription pr
ON mr.record_id = pr.record_id
WHERE mr.appointment_id = $1
    `,
    [id]
  );
  console.log(info.rows);
  return info.rows;

}

exports.fetchTreatment = async(id) =>{

  const info = await db.query(
    `
SELECT tr.treatment_name as name,tr.description as description
FROM medical_record mr JOIN treatment tr
ON mr.record_id = tr.record_id
WHERE mr.appointment_id = $1
    `,
    [id]
  );
  console.log(info.rows);
  return info.rows;

}

exports.fetchMedrec = async(id) =>{
  console.log('fetching...')
    const info = await db.query(
      `
  SELECT TO_CHAR(m.appointment_date,'DD Month YYYY') as date,mr.diagnosis as name,mr.notes as notes
  FROM appointment m JOIN medical_record mr
  ON m.appointment_id = mr.appointment_id
  WHERE mr.appointment_id = $1
      `,
      [id]
    );
  console.log(info.rows[0]);
  return info.rows[0];
}

exports.fetchRecdoc = async(id) =>{
  console.log('fetching...')
    const info = await db.query(
      `
  SELECT dr.name as name,dr.specialization as specialty,dr.email as email,dr.phone as phone
  FROM appointment m JOIN doctor dr
  ON m.doctor_id = dr.doctor_id
  WHERE m.appointment_id = $1
      `,
      [id]
    );
  console.log(info.rows[0]);
  return info.rows[0];
}

exports.fetchBillPending = async(id) =>{
  console.log('fetching...')
    const info = await db.query(
      `
      SELECT dr.name as doctor,dr.specialization as specialization,b.amount as amount,TO_CHAR(b.bill_date, 'DD-MM-YYYY') as date
      FROM doctor dr JOIN appointment a
      ON dr.doctor_id = a.doctor_id
      JOIN bill b
      ON a.appointment_id = b.appointment_id
      WHERE a.patient_id = $1 AND b.payment_status = 'pending'
      `,
      [id]
    );
  console.log(info.rows);
  return info.rows;
}

exports.fetchBillPaid = async(id) =>{
  console.log('fetching...')
    const info = await db.query(
      `
      SELECT dr.name as doctor,dr.specialization as specialization,b.amount as amount,TO_CHAR(b.bill_date, 'DD-MM-YYYY') as date
      FROM doctor dr JOIN appointment a
      ON dr.doctor_id = a.doctor_id
      JOIN bill b
      ON a.appointment_id = b.appointment_id
      WHERE a.patient_id = $1 AND b.payment_status = 'paid'
      `,
      [id]
    );
  console.log(info.rows);
  return info.rows;
}

exports.deleteAppointment = async (id) => {
  try {
    const result = await db.query(
      "DELETE FROM appointment WHERE appointment_id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) return null;

    return result.rows[0]; 
  } catch (error) {
    throw error;
  }
};