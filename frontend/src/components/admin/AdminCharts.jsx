import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#dc2626"];

export default function AdminCharts({ users }) {
  const roleCounts = [
    { name: "Patients", value: users.filter(u => u.role === "patient").length },
    { name: "Doctors", value: users.filter(u => u.role === "doctor").length },
    { name: "Admins", value: users.filter(u => u.role === "admin").length },
  ];

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      
      {/* Pie Chart */}
      <div>
        <h3>User Role Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={roleCounts}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
            >
              {roleCounts.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div>
        <h3>User Overview</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={roleCounts}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
