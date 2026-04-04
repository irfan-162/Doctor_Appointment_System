const express = require('express');
const doctorRouter = express.Router();

const doctorController = require('../controller/doctorController');
const verifyToken = require('../routes/Auth').verifyToken;

//loign
doctorRouter.post('/login', doctorController.doctorLogin);
//signup
doctorRouter.post("/signup", doctorController.signup);

//profile - section
doctorRouter.get('/profile',verifyToken,doctorController.getProfileInfo);
doctorRouter.post('/update',verifyToken,doctorController.editProfile);
doctorRouter.get("/weekly-visits", verifyToken, doctorController.getWeeklyVisits);

//prescribe-section
doctorRouter.get('/patients',verifyToken,doctorController.getPatient);
doctorRouter.get('/patientinfo',verifyToken,doctorController.getPatientInfo);
doctorRouter.post("/consultation",verifyToken,doctorController.createConsultation);

//schedule-section
doctorRouter.get('/schedule',verifyToken,doctorController.getSchedule);
doctorRouter.post("/postschedule",verifyToken,doctorController.postSchedule);
doctorRouter.delete("/schedule/:id", verifyToken, doctorController.deleteSchedule);

//bill
doctorRouter.get('/billList',verifyToken,doctorController.getBillList);
doctorRouter.get('/payCheck',verifyToken,doctorController.upPayCheck);





module.exports = doctorRouter; 