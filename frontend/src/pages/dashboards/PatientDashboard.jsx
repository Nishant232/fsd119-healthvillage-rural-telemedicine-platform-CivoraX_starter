import { useEffect, useState } from "react";
import {
  getPatientAppointments,
  getPatientPrescriptions,
  getPatientEHRs,
} from "../../services/patientService";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [ehrs, setEhrs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [a, p, e] = await Promise.all([
          getPatientAppointments(),
          getPatientPrescriptions(),
          getPatientEHRs(),
        ]);

        setAppointments(a.data || []);
        setPrescriptions(p.data || []);
        setEhrs(e.data || []);
      } catch (err) {
        console.error("Patient dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <p style={{ padding: "32px" }}>Loading your health dashboard…</p>;
  }

  const nextAppointment = appointments.find(
    (a) => a.status === "upcoming"
  );

  return (
    <div style={containerStyle}>
      <h1 style={pageTitle}>Patient Dashboard</h1>

      {/* NEXT APPOINTMENT */}
      <Card title="Next Appointment">
        {nextAppointment ? (
          <div>
            <p>
              <strong>Doctor:</strong>{" "}
              {nextAppointment.doctor?.name || "—"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(
                nextAppointment.appointmentDate
              ).toLocaleString()}
            </p>
            <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <strong>Status:</strong>
              <Badge
                text={nextAppointment.status}
                color={{
                  bg: "#dbeafe",
                  text: "#1e40af",
                }}
              />
            </p>
          </div>
        ) : (
          <p style={emptyState}>No upcoming appointments scheduled</p>
        )}
      </Card>

      {/* PRESCRIPTIONS */}
      <Card title="Active Prescriptions">
        {prescriptions.length === 0 ? (
          <p style={emptyState}>No active prescriptions at this time</p>
        ) : (
          <div style={gridContainer}>
            {prescriptions.map((p) => (
              <div key={p._id} style={itemCard}>
                <p style={itemTitle}>{p.medication}</p>
                <p style={itemDetail}>
                  {p.dosage} — {p.duration}
                </p>
                <small style={itemMeta}>
                  Prescribed by Dr. {p.doctor?.name || "—"}
                </small>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* HEALTH RECORDS */}
      <Card title="Recent Health Records">
        {ehrs.length === 0 ? (
          <p style={emptyState}>No health records available yet</p>
        ) : (
          <div style={gridContainer}>
            {ehrs.slice(0, 3).map((e) => (
              <div key={e._id} style={itemCard}>
                <p style={itemTitle}>Diagnosis: {e.diagnosis}</p>
                <p style={itemDetail}>
                  {new Date(e.createdAt).toLocaleDateString()}
                </p>
                <small style={itemMeta}>
                  Doctor: {e.doctor?.name || "—"}
                </small>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* QUICK ACTIONS */}
      <Card title="Quick Actions">
        <ul style={actionList}>
          <li>Book a new appointment</li>
          <li>View appointment history</li>
          <li>Download prescriptions</li>
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
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "16px",
};

const itemCard = {
  padding: "16px",
  border: "1px solid #f3f4f6",
  borderRadius: "6px",
  backgroundColor: "#fafafa",
};

const itemTitle = {
  fontWeight: "600",
  marginBottom: "8px",
};

const itemDetail = {
  color: "#6b7280",
  marginBottom: "4px",
};

const itemMeta = {
  color: "#9ca3af",
  fontSize: "12px",
};

const emptyState = {
  color: "#6b7280",
  fontStyle: "italic",
};

const actionList = {
  paddingLeft: "20px",
  lineHeight: "1.8",
};
