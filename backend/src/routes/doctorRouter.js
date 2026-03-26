const express = require('express');
const doctorRouter = express.Router();

const doctorController = require('../controller/doctorController');

//profile - section
doctorRouter.get('/profile',doctorController.getProfileInfo);
doctorRouter.post('/update',doctorController.editProfile);

//prescribe-section
doctorRouter.get('/patients',doctorController.getPatient);
doctorRouter.get('/patientinfo',doctorController.getPatientInfo);
doctorRouter.post("/consultation",doctorController.createConsultation);



module.exports = doctorRouter; 