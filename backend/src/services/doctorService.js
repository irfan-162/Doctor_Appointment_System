const db = require("../config/db");

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

exports.updateProfile = async (req,res) => {
  const { id, field, value } = req.body;

  if (!id || !field) return res.status(400).json({ message: "Invalid request" });

  try {
    await db.query(
      `UPDATE doctor SET ${field} = $1 WHERE doctor_id = $2`,
      [value, id]
    );
    res.json({ message: "doctor updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
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
  console.log('this test '+appointmentId );
  try {
    await db.query("BEGIN");

    // 1. Insert Medical Record
    const recordResult = await db.query(
      `INSERT INTO medical_record (appointment_id, diagnosis, notes)
       VALUES ($1, $2, $3)
       RETURNING record_id`,
      [appointmentId, diagnosis, notes]
    );

    const recordId = recordResult.rows[0].record_id;

    // 2. Insert Medicines
    for (let med of medicines) {
      await db.query(
        `INSERT INTO prescription (record_id, medicine_name, dosage, duration)
         VALUES ($1, $2, $3, $4)`,
        [recordId, med.name, med.dosage, med.duration]
      );
    }

    // 3. Insert Treatments
    for (let t of treatments) {
      await db.query(
        `INSERT INTO treatment (record_id, treatment_name)
         VALUES ($1, $2)`,
        [recordId, t.name]
      );
    }

    // 4. Update Appointment Status
    await db.query(
      `UPDATE appointment
       SET status = 'Completed'
       WHERE appointment_id = $1`,
      [appointmentId]
    );
    await db.query(`
      UPDATE appointment
      SET status = 'Done'
      WHERE appointment_id = $1;
      `
      [appointmentId]
    );
    await db.query("COMMIT");

    return { recordId };

  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
};