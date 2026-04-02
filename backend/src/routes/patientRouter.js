const express = require('express');
const patientRouter = express.Router();

const patientController = require('../controller/patientController');

patientRouter.get('/profile',patientController.getProfileInfo);
patientRouter.post('/update',patientController.editProfile);

//get category
patientRouter.get('/specializations',patientController.getSpecializations);
patientRouter.get('/doctorList',patientController.getDoctorList);
patientRouter.get('/doctorSchedule',patientController.getDocSchedule);
patientRouter.post('/bookAppointment',patientController.AppointmentBooking);


//get-appointment
patientRouter.get('/upcoming-appointment',patientController.getAppointment);
patientRouter.get('/recordlist',patientController.getRecordList);
//for precriptioncard
patientRouter.get('/medicines',patientController.getMedicinelist);
patientRouter.get('/medrec',patientController.getMedrec);
patientRouter.get('/recdoc',patientController.getRecdoc);
patientRouter.get('/treatment',patientController.getTreatment);

patientRouter.get('/billPending',patientController.getBillPending);
patientRouter.get('/billPaid',patientController.getBillPaid);




//delete appointment
patientRouter.delete("/appointments/:id", patientController.deleteAppointment);



patientRouter.get('/schedule',patientController.getSchedule);
patientRouter.get('/scheduleID',patientController.getScheduleID);
patientRouter.post('/bookAppointment',patientController.AppointmentBooking);


module.exports = patientRouter; 