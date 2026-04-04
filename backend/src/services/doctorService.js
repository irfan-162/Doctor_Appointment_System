const db = require("../config/db");
const jwt = require("jsonwebtoken");

exports.signup = async (doctorData) => {
  const {
    name,
    email,
    phone,
    specialization,
    consultation_fee,
    password,
  } = doctorData;

  // check duplicate email
  const existing = await db.query(
    "SELECT * FROM doctor WHERE email = $1",
    [email]
  );

  if (existing.rows.length > 0) {
    throw new Error("EMAIL_EXISTS");
  }

  const result = await db.query(
    `
    INSERT INTO doctor 
    (name, email, phone, specialization, consultation_fee, password)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING doctor_id, name, email
    `,
    [name, email, phone, specialization, consultation_fee, password]
  );

  const doctor = result.rows[0];

  // generate token
  const token = jwt.sign(
    { id: doctor.id, email: doctor.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    doctor,
  };
};

exports.fetchProfile = async (id) => {
  const info = await db.query(
    `
    SELECT name,specialization,phone,email,consultation_fee
    FROM doctor
    WHERE doctor_id = $1;
    `,
    [id]
  );
  //console.log(info.rows);

  return info.rows[0];
};



exports.fetchSchedule = async (id) => {
  const info = await db.query(
    `
SELECT schedule_id as id,start_time as start , end_time as end , day
FROM schedule
where doctor_id = $1
    `,
    [id]
  );
  console.log(info.rows);
  return info.rows;
};

exports.updateProfile = async (req,res) => {
  const {field, value } = req.body;

  if (!field) return res.status(400).json({ message: "Invalid request" });
  const doctorId = req.user.doctor_id;
  try {
    await db.query(
      `UPDATE doctor SET ${field} = $1 WHERE doctor_id = $2`,
      [value, doctorId]
    );
    res.json({ message: "doctor updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addSchedule = async (req,res) => {
  const { day, start, end } = req.body;
  const docID = req.user.doctor_id;
  console.log(day, start, end, docID);
  try {

    await db.query(
      `INSERT INTO SCHEDULE(doctor_id, day, start_time, end_time) 
      VALUES ($1, $2, $3, $4)`,
      [docID, day, start, end]
    );
    res.status(200)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.fetchBillList = async (id) => {
  const info = await db.query(
    `
    SELECT p."name" AS Name,a.appointment_id as id, b.amount as amount
    FROM appointment a
    JOIN patient p
    ON a.patient_id = p.patient_id
    JOIN bill b
    ON a.appointment_id = b.appointment_id
    WHERE a.doctor_id = $1 and b.payment_status = 'Pending'
    `,
    [id]
  );
  //console.log(info.rows);

  return info.rows;
};

exports.fetchPatient = async (id) => {
  const info = await db.query(
    `
    SELECT p."name" AS Name,p.gender as Gender,a.appointment_id as id
    FROM appointment a
    JOIN patient p
    ON a.patient_id = p.patient_id
    WHERE a.doctor_id = $1 and a.status = 'Pending'
    `,
    [id]
  );
  //console.log(info.rows);

  return info.rows;
};

exports.postPayCheck = async (appID) => {
  try {
    await db.query(
      `CALL CompleteBillByAppointment($1)`,
      [appID]
    );
    return { message: "Payment status updated successfully" };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

exports.fetchPatientInfo = async (docID,appID) => {
  const info = await db.query(
    `
SELECT 
    p.name AS patient,
    p.age AS age,
    p.gender AS gender,
    TO_CHAR(a.appointment_date, 'DD FMMonth YYYY') AS date,
    TO_CHAR(a.appointment_time, 'HH:MI AM') AS time,
    a.status AS status
FROM patient p 
JOIN appointment a
ON p.patient_id = a.patient_id
WHERE a.doctor_id = $1 AND a.appointment_id = $2
    `,
    [docID,appID]
  );
  //console.log(info.rows);

  return info.rows[0];
};

exports.createConsultationService = async (payload) => {
  const { appointmentId, diagnosis, notes, medicines, treatments } = payload;
  try {
    await db.query("BEGIN");

    //Insert Medical Record
    const recordResult = await db.query(
      `INSERT INTO medical_record (appointment_id, diagnosis, notes)
       VALUES ($1, $2, $3)
       RETURNING record_id`,
      [appointmentId, diagnosis, notes]
    );

    const recordId = recordResult.rows[0].record_id;

    //Insert Medicines
    for (let med of medicines) {
      await db.query(
        `INSERT INTO prescription (record_id, medicine_name, dosage, duration)
         VALUES ($1, $2, $3, $4)`,
        [recordId, med.name, med.dosage, med.duration]
      );
    }

    //  Insert Treatments
    console.log(treatments)
    for (let t of treatments) {
      await db.query(
        `INSERT INTO treatment (record_id, treatment_name,description )
         VALUES ($1, $2 ,$3)`,
        [recordId, t.name ,t.description]
      );
    }

    //Update Appointment Status
    await db.query(
      `UPDATE appointment
       SET status = 'Completed'
       WHERE appointment_id = $1`,
      [appointmentId]
    );

    await db.query("COMMIT");

    return { recordId };

  } catch (err) {
    await db.query("ROLLBACK");
    throw err;
  }
};
