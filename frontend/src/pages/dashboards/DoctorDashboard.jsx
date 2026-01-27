import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getDoctorAppointments } from "../../services/doctorService";

export default function DoctorDashboard() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getDoctorAppointments();
        setAppointments(data.appointments || []);
      } catch (err) {
        console.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (user.role !== "doctor") {
    return <h2>Access denied</h2>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1>Doctor Dashboard</h1>

      <section style={{ marginTop: "24px" }}>
        <h2>Today's Appointments</h2>

        {loading && <p>Loading appointments...</p>}

        {!loading && appointments.length === 0 && (
          <p>No appointments scheduled.</p>
        )}

        {!loading &&
          appointments.map((appt) => (
            <div
              key={appt._id}
              style={{
                padding: "12px",
                marginTop: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
              }}
            >
              <p><strong>Patient:</strong> {appt.patient?.name}</p>
              <p><strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleString()}</p>
              <p><strong>Reason:</strong> {appt.reason}</p>
            </div>
          ))}
      </section>
    </div>
  );
}
