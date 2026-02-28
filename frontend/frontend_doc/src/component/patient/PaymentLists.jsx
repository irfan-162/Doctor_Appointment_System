import { useState } from "react";
import "./PaymentLists.css";
import { useEffect } from "react";

const paidPayments = [
  { doctor: "Dr. Sarah Mitchell", specialization: "Cardiologist", amount: 120, date: "2025-02-10" },
  { doctor: "Dr. James Patel", specialization: "Dermatologist", amount: 85, date: "2025-02-12" },
  { doctor: "Dr. Emily Chen", specialization: "Neurologist", amount: 200, date: "2025-02-14" },
  { doctor: "Dr. Robert Kim", specialization: "Orthopedic", amount: 150, date: "2025-02-15" },
  { doctor: "Dr. Laura Nguyen", specialization: "Pediatrician", amount: 95, date: "2025-02-17" },
  { doctor: "Dr. Alan Foster", specialization: "Psychiatrist", amount: 175, date: "2025-02-19" },
  { doctor: "Dr. Maria Santos", specialization: "Gynecologist", amount: 130, date: "2025-02-21" },
];

const pendingPayments = [
  { doctor: "Dr. Kevin Wright", specialization: "Urologist", amount: 110, date: "2025-02-22" },
  { doctor: "Dr. Nina Sharma", specialization: "Endocrinologist", amount: 160, date: "2025-02-23" },
  { doctor: "Dr. Thomas Reed", specialization: "Ophthalmologist", amount: 90, date: "2025-02-24" },
  { doctor: "Dr. Priya Kapoor", specialization: "Pulmonologist", amount: 145, date: "2025-02-25" },
  { doctor: "Dr. Chris Owens", specialization: "Gastroenterologist", amount: 180, date: "2025-02-26" },
];

const PaymentRow = ({ doctor, specialization, amount, date, status }) => (
  <div className="payment-row">
    <div className="row-info">
      <div className="doctor-name">{doctor}</div>
      <div className="specialization">{specialization}</div>
    </div>
    <div className="row-meta">
      <div className={`amount ${status}`}>৳{amount}</div>
      <div className="date">{date}</div>
    </div>
  </div>
);

const PaymentList = ({ title, data, status, accent }) => (
  <div className="payment-card">
    <div className="payment-card-header">
      <div className="payment-card-header-left">
        <span className="status-dot" style={{ background: accent }} />
        <span className="card-title">{title}</span>
      </div>
      <span className="count-badge" style={{ background: accent + "18", color: accent }}>
        {data.length}
      </span>
    </div>
    <div className="payment-scroll">
      {data.map((item, i) => (
        <PaymentRow key={i} {...item} status={status} />
      ))}
    </div>
  </div>
);

export default function PaymentDashboard() {
  const[pendingPayments,setPendingPayments] = useState([]);
  const[paidPayments,setPaidPayments] = useState([]);

  useEffect(()=>{
    const fetchPendingList = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/patient/billPending?patID=3`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setPendingPayments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        console.log('Ok');
      }
    };
    const fetchPaidList = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/patient/billPaid?patID=3`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setPaidPayments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        console.log('Ok');
      }
    };
    fetchPendingList();
    fetchPaidList();
  },[])

  return (
    <div className="payment-dashboard">
      <h2>Payments</h2>
      <div className="payment-lists-wrapper">
        <PaymentList title="Paid" data={paidPayments} status="paid" accent="#16a34a" />
        <PaymentList title="Pending" data={pendingPayments} status="pending" accent="#d97706" />
      </div>
    </div>
  );
}
