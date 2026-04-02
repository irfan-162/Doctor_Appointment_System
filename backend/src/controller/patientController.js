const patientService = require('../services/patientService');

exports.getProfileInfo = async(req,res) =>{
  console.log("gettingProfileInfo in controller");
try {
    const result = await patientService.fetchProfile(req.query.id);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
  
}
};

exports.getSpecializations = async(req,res) =>{
  console.log("getting specializations in controller");
  try {
      const result = await patientService.fetchSpecialization();
      res.status(200).json(result);
  } catch (error) {
    res.status(500).json({error : "Failed to fetch profile infos"})
    
  }
}

exports.getDoctorList = async(req,res) =>{
  console.log("getting doctor list in controller");
  console.log(req.query.specialization);
  try {
      const result = await patientService.fetchDoctorList(req.query.specialization);
      res.status(200).json(result);
  } catch (error) {
    res.status(500).json({error : "Failed to fetch doctorList infos"})
    
  }
}

exports.getDocSchedule = async(req,res) =>{
  console.log("getting  Doctor Schedule in controller");
  console.log(req.query.id);
  try {
      const result = await patientService.getDoctorWithSchedules(req.query.id);
      res.status(200).json(result);
  } catch (error) {
    res.status(500).json({error : "Failed to fetch doctor schedule infos"})
    
  }
}

exports.getSchedule = async(req,res) =>{
  console.log("gettingDoctor Schedule in controller");
try {
    const result = await patientService.fetchSchedule(req.query.id);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
  
}
};

exports.editProfile = async(req,res) =>{
  console.log("updating profile");
try {
    const result = await patientService.updateProfile(req,res);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
}
};

exports.getScheduleID = async(req,res) =>{
  console.log("getting schedule id");
try {
    const result = await patientService.fetchScheduleID(req.query.docID,req.query.day);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
  
}
};

exports.AppointmentBooking = async(req,res) =>{
  console.log("Appointment is booking...");
try {
    const result = await patientService.postAppointment(req,res);
    console.log(result);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
}
};

exports.getAppointment = async(req,res) =>{
  console.log("getting appointment");
try {
    const result = await patientService.fetchAppointment(req.query.patientID);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
  
}
};

exports.getPrescription = async(req,res) =>{
  console.log("getting appointment");
try {
    const result = await patientService.fetchPrescription(req.query.appID);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
  
}
};

exports.getRecordList = async(req,res) =>{
  console.log("getting record list");
try {
    const result = await patientService.fetchRecordList(req.query.patientID);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
  
}
};

exports.getMedicinelist = async(req,res) =>{
  console.log("getting medicine..");
try {
    const result = await patientService.fetchMedicinelist(req.query.apptID);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
  
}
};

exports.getMedrec = async(req,res) =>{
  console.log("getting medrec..");
try {
    const result = await patientService.fetchMedrec(req.query.apptID);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
  
}
};

exports.getRecdoc = async(req,res) =>{
  console.log("getting medrec..");
try {
    const result = await patientService.fetchRecdoc(req.query.apptID);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
  
}
};
exports.getTreatment = async(req,res) =>{
  console.log("getting treatment..");
try {
    const result = await patientService.fetchTreatment(req.query.apptID);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
  
}
};

exports.getBillPending = async(req,res) =>{
  console.log("getting treatment..");
try {
    const result = await patientService.fetchBillPending(req.query.patID);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
  
}
};

exports.getBillPaid = async(req,res) =>{
  console.log("getting treatment..");
try {
    const result = await patientService.fetchBillPaid(req.query.patID);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
  
}
};

exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Appointment ID is required" });

  try {
    const deleted = await patientService.deleteAppointment(id);

    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment cancelled", appointment: deleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};