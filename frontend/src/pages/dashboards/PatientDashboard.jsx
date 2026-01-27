import { useEffect, useState } from "react";
import {
  getPatientAppointments,
  getPatientPrescriptions,
  getPatientEHRs,
} from "../../services/patientService";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [ehrs, setEhrs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [a, p, e] = await Promise.all([
          getPatientAppointments(),
          getPatientPrescriptions(),
          getPatientEHRs(),
        ]);

        setAppointments(a.data || []);
        setPrescriptions(p.data || []);
        setEhrs(e.data || []);
      } catch (error) {
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Patient Dashboard</h1>

      <section>
        <h2>Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          appointments.map((a) => (
            <div key={a._id}>{a.status}</div>
          ))
        )}
      </section>

      <section>
        <h2>Prescriptions</h2>
        {prescriptions.length === 0 ? (
          <p>No prescriptions found.</p>
        ) : (
          prescriptions.map((p) => (
            <div key={p._id}>{p.medication}</div>
          ))
        )}
      </section>

      <section>
        <h2>Health Records</h2>
        {ehrs.length === 0 ? (
          <p>No EHR records found.</p>
        ) : (
          ehrs.map((e) => (
            <div key={e._id}>{e.diagnosis}</div>
          ))
        )}
      </section>
    </div>
  );
}
