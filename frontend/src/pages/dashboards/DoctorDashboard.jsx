import { useEffect, useState } from "react";
import { getDoctorAppointments } from "../../services/doctorService";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await getDoctorAppointments();
        setAppointments(data.appointments || []);
      } catch (error) {
        console.error("Failed to load doctor appointments", error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  if (loading) {
    return <p style={{ padding: "32px" }}>Loading your schedule…</p>;
  }

  const todayAppointments = appointments.filter(
    (a) => a.status === "upcoming"
  );

  return (
    <div style={containerStyle}>
      <h1 style={pageTitle}>Doctor Dashboard</h1>

      {/* TODAY'S QUEUE */}
      <Card title="Today's Appointments">
        {todayAppointments.length === 0 ? (
          <p style={emptyState}>No upcoming consultations scheduled for today</p>
        ) : (
          <div style={gridContainer}>
            {todayAppointments.map((appt) => (
              <div key={appt._id} style={appointmentCard}>
                <div style={appointmentHeader}>
                  <p style={patientName}>
                    {appt.patient?.name || "—"}
                  </p>
                  <Badge
                    text={appt.status}
                    color={{
                      bg: "#dbeafe",
                      text: "#1e40af",
                    }}
                  />
                </div>

                <div style={appointmentDetails}>
                  <p>
                    <strong>Time:</strong>{" "}
                    {new Date(appt.appointmentDate).toLocaleTimeString()}
                  </p>
                  <p>
                    <strong>Reason:</strong>{" "}
                    {appt.reason || "General consultation"}
                  </p>
                </div>

                <div style={appointmentActions}>
                  <Button variant="primary">
                    Start Consultation
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* PENDING TASKS */}
      <Card title="Pending Tasks">
        <ul style={taskList}>
          <li>Complete consultation notes</li>
          <li>Write prescriptions</li>
          <li>Update patient EHR</li>
        </ul>
      </Card>

      {/* QUICK ACTIONS */}
      <Card title="Quick Actions">
        <ul style={taskList}>
          <li>View appointment history</li>
          <li>Search patient records</li>
          <li>Check prescriptions issued</li>
        </ul>
      </Card>
    </div>
  );
}

/* ---------- Responsive Styles ---------- */

const containerStyle = {
  padding: "32px 16px",
  maxWidth: "1200px",
  margin: "0 auto",
};

const pageTitle = {
  marginBottom: "24px",
  fontSize: "28px",
  fontWeight: "600",
};

const gridContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "16px",
};

const appointmentCard = {
  padding: "16px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  backgroundColor: "#fafafa",
};

const appointmentHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
};

const patientName = {
  fontSize: "16px",
  fontWeight: "600",
  margin: 0,
};

const appointmentDetails = {
  marginBottom: "12px",
  color: "#6b7280",
  lineHeight: "1.6",
};

const appointmentActions = {
  marginTop: "12px",
};

const emptyState = {
  color: "#6b7280",
  fontStyle: "italic",
};

const taskList = {
  paddingLeft: "20px",
  lineHeight: "1.8",
};
