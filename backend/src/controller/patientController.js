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

exports.getCardiologist = async (req,res)=>{
  console.log("gettingCardiologis in controller");
try {
    const result = await patientService.fetchCardiologist();
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
  
}
};
exports.getOrthopedic = async (req,res)=>{
  console.log("orthopedic controller");
try {
    const result = await patientService.fetchOrthopedic();
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
  
}
};
exports.getGynecologist = async (req,res)=>{
  console.log("gyneo controller");
try {
    const result = await patientService.fetchGynecologist();
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
  
}
};

exports.getENT = async (req,res)=>{
  console.log("ENT controller");
try {
    const result = await patientService.fetchENT();
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
  
}
};

exports.getDermatologist = async (req,res)=>{
  console.log("dermato in controller");
try {
    const result = await patientService.fetchDermatologist();
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch dermato infos"})
  
}
};

exports.getPsychiatrist  = async (req,res)=>{
  console.log("psy in controller");
try {
    const result = await patientService.fetchPsychiatrist();
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch dermato infos"})
  
}
};

exports.getNeurologist  = async (req,res)=>{
  console.log("nero in controller");
try {
    const result = await patientService.fetchNeurologist();
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch dermato infos"})
  
}
};

exports.getPediatrician = async (req,res)=>{
  console.log("ped in controller");
try {
    const result = await patientService.fetchPediatrician();
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch dermato infos"})
  
}
};

exports.getMedicine = async (req,res)=>{
  console.log("medicine in controller");
try {
    const result = await patientService.fetchMedicine();
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch dermato infos"})
  
}
};

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