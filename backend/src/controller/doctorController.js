const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();

const db = require('../config/db');
const doctorService = require('../services/doctorService');


exports.doctorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find doctor
    const result = await db.query(
      `SELECT *
       FROM doctor 
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const doctor = result.rows[0];

    // 2. Check password
    const isMatch = password == doctor.password ? true : false; // In production, use bcrypt.compare(password, doctor.password)

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // 3. Generate token
    const token = jwt.sign(
      {
        doctor_id: doctor.doctor_id,
        email: doctor.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4. Send token
    res.json({
      message: "Login successful",
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};



exports.getProfileInfo = async(req,res) =>{
  console.log("gettingProfileInfo in controller for doctor");
try {
    const result = await doctorService.fetchProfile(req.user.doctor_id);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
}
};

exports.editProfile = async(req,res) =>{
  console.log("updating profile");
try {
    const result = await doctorService.updateProfile(req,res);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to update profile infos"})
}
};

exports.getPatient = async(req,res) =>{
  console.log("gettingPatient in controller for doctor");
try {
    const result = await doctorService.fetchPatient(req.user.doctor_id);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
}
};

exports.getPatientInfo = async(req,res) =>{
  console.log("gettingPatientInfo in controller for doctor");
try {
    const result = await doctorService.fetchPatientInfo(req.user.doctor_id,req.query.appID);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
}
};

exports.createConsultation = async (req, res) => {
  console.log("creating consultation in controller for doctor");
  try {
    const payload = req.body;

    const result = await doctorService.createConsultationService(payload);

    res.status(200).json({
      message: "Consultation saved successfully",
      data: result
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to save consultation"
    });
  }
};