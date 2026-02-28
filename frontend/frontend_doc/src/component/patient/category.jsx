import { useState } from "react";
import {
  MdFavorite,
  MdAccessibility,
  MdPregnantWoman,
  MdHearing,
  MdFace,
  MdPsychology,
  MdMemory,
  MdChildCare,
  MdLocalHospital
} from "react-icons/md";

import Cardiologist from "./category/Cardiologist";
import Orthopedic from "./category/Orthopedic";
import Gynecologist from "./category/Gynecologist";
import ENT from "./category/ENT";
import Dermatologist from "./category/Dermatologist";
import  Psychiatrist  from "./category/Psychiatrist";
import  Neurologist  from "./category/Neurologist";
import  Pediatrician  from "./category/Pediatrician";
import  Medicine  from "./category/Medicine";



export default function Category() {
  const [activeSection, setActiveSection] = useState("category");

  return (
    <div className="bApp">

      {activeSection === "category" && (
        <div className="category">

          <div
            className="catItem"
            onClick={() => setActiveSection("Cardiologist")}
          >
            <MdFavorite /> Cardiologist
          </div>

          <div
            className="catItem"
            onClick={() => setActiveSection("Orthopedic")}
          >
            <MdAccessibility /> Orthopedic
          </div>

          <div
            className="catItem"
            onClick={() => setActiveSection("Gynecologist")}
          >
            <MdPregnantWoman /> Gynecologist
          </div>

          <div
            className="catItem"
            onClick={() => setActiveSection("ENT")}
          >
            <MdHearing /> ENT
          </div>

          <div
            className="catItem"
            onClick={() => setActiveSection("Dermatologist")}
          >
            <MdFace /> Dermatologist
          </div>

          <div
            className="catItem"
            onClick={() => setActiveSection("Psychiatrist")}
          >
            <MdPsychology /> Psychiatrist
          </div>

          <div
            className="catItem"
            onClick={() => setActiveSection("Neurologist")}
          >
            <MdMemory /> Neurologist
          </div>

          <div
            className="catItem"
            onClick={() => setActiveSection("Pediatrician")}
          >
            <MdChildCare /> Pediatrician
          </div>

          <div
            className="catItem"
            onClick={() => setActiveSection("Medicine")}
          >
            <MdLocalHospital /> Medicine
          </div>

        </div>
      )}

      {activeSection === "Cardiologist" && <Cardiologist />}
      {activeSection === "Orthopedic" && <Orthopedic />}
      {activeSection === "Gynecologist" && <Gynecologist/>}
      {activeSection === "ENT" && <ENT/>}
      {activeSection === "Dermatologist" && <Dermatologist/>}
      {activeSection === "Psychiatrist" && <Psychiatrist/>}
      {activeSection === "Neurologist" && <Neurologist/>}
      {activeSection === "Pediatrician" && <Pediatrician/>}
      {activeSection === "Medicine" && <Medicine/>}


      
    </div>
  );
}
  