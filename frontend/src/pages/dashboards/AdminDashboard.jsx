import { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  fetchAuditLogs,
} from "../../services/adminService";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import AdminCharts from "../../components/admin/AdminCharts";
import { exportToCSV } from "../../utils/csvExport";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  /* 🔒 Frontend role protection */
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);

  /* 🔍 Filter & Pagination States */
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5;

  /* 👥 Fetch users */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data.users || []);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  /* 🧾 Fetch audit logs */
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await fetchAuditLogs();
        setLogs(data.logs || []);
      } catch (error) {
        console.error("Failed to fetch audit logs", error);
      } finally {
        setLoadingLogs(false);
      }
    };

    fetchLogs();
  }, []);

  /* 🔁 Toggle user status */
  const handleToggleStatus = async (id) => {
    try {
      await toggleUserStatus(id);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, isActive: !u.isActive } : u
        )
      );
    } catch (error) {
      console.error("Failed to update user status", error);
    }
  };

  /* ❌ Delete user */
  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  /* 📊 Derived Data - Filtered & Paginated */
  const filteredUsers = users.filter((u) => {
    const matchesRole =
      roleFilter === "all" ? true : u.role === roleFilter;

    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    return matchesRole && matchesSearch;
  });

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* 📥 Export Handlers */
  const handleExportUsers = () => {
    const rows = users.map((u) => ({
      Name: u.name,
      Email: u.email,
      Role: u.role,
      Status: u.isActive ? "Active" : "Disabled",
    }));

    exportToCSV("users-report.csv", rows);
  };

  const handleExportLogs = () => {
    const rows = logs.map((l) => ({
      Actor: l.actor?.name || "Unknown",
      Role: l.role,
      Action: l.action,
      Target: l.targetType,
      Date: new Date(l.createdAt).toLocaleString(),
    }));

    exportToCSV("audit-logs.csv", rows);
  };

  return (
    <div style={containerStyle}>
      <h1 style={pageTitle}>Admin Dashboard</h1>

      {/* SYSTEM STATS */}
      <div style={statsGrid}>
        <div style={statCard}>
          <p style={statLabel}>Total Users</p>
          <p style={statValue}>{users.length}</p>
        </div>
        <div style={statCard}>
          <p style={statLabel}>Patients</p>
          <p style={statValue}>
            {users.filter((u) => u.role === "patient").length}
          </p>
        </div>
        <div style={statCard}>
          <p style={statLabel}>Doctors</p>
          <p style={statValue}>
            {users.filter((u) => u.role === "doctor").length}
          </p>
        </div>
        <div style={statCard}>
          <p style={statLabel}>Admins</p>
          <p style={statValue}>
            {users.filter((u) => u.role === "admin").length}
          </p>
        </div>
      </div>

      {/* SYSTEM ANALYTICS */}
      <Card title="System Analytics">
        {loadingUsers ? (
          <p>Loading analytics…</p>
        ) : (
          <AdminCharts users={users} />
        )}
      </Card>

      {/* USER FILTERS */}
      <Card title="User Filters">
        <div style={filtersContainer}>
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={inputStyle}
          />

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            style={inputStyle}
          >
            <option value="all">All roles</option>
            <option value="patient">Patients</option>
            <option value="doctor">Doctors</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </Card>

      {/* USERS */}
      <Card>
        <div style={sectionHeader}>
          <h2 style={sectionTitle}>System Users</h2>
          <Button
            variant="secondary"
            onClick={handleExportUsers}
            disabled={users.length === 0}
          >
            Export Users (CSV)
          </Button>
        </div>
        {loadingUsers && <p>Loading users…</p>}
        {!loadingUsers && users.length === 0 && (
          <p style={emptyState}>No users found in the system</p>
        )}
        {!loadingUsers && users.length > 0 && paginatedUsers.length === 0 && (
          <p style={emptyState}>No matching users found</p>
        )}

        {!loadingUsers && paginatedUsers.length > 0 && (
          <>
            <div style={userGrid}>
              {paginatedUsers.map((u) => (
                <div key={u._id} style={userCard}>
                  <div style={userHeader}>
                    <div>
                      <p style={userName}>{u.name}</p>
                      <p style={userEmail}>{u.email}</p>
                    </div>
                    <Badge
                      text={u.role}
                      color={getRoleBadgeColor(u.role)}
                    />
                  </div>

                  <div style={userMeta}>
                    <Badge
                      text={u.isActive ? "Active" : "Disabled"}
                      color={
                        u.isActive
                          ? { bg: "#d1fae5", text: "#065f46" }
                          : { bg: "#fee2e2", text: "#991b1b" }
                      }
                    />
                  </div>

                  <div style={userActions}>
                    <Button
                      variant="secondary"
                      onClick={() => handleToggleStatus(u._id)}
                    >
                      {u.isActive ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteUser(u._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div style={paginationContainer}>
              <Button
                variant="secondary"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>

              <span style={pageInfo}>
                Page {page} of {totalPages || 1}
              </span>

              <Button
                variant="secondary"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </Card>

      {/* AUDIT LOGS */}
      <Card>
        <div style={sectionHeader}>
          <h2 style={sectionTitle}>Audit Logs</h2>
          <Button
            variant="secondary"
            onClick={handleExportLogs}
            disabled={logs.length === 0}
          >
            Export Audit Logs (CSV)
          </Button>
        </div>
        {loadingLogs && <p>Loading audit logs…</p>}
        {!loadingLogs && logs.length === 0 && (
          <p style={emptyState}>No audit logs recorded yet</p>
        )}

        {!loadingLogs && logs.length > 0 && (
          <div style={logList}>
            {logs.map((log) => (
              <div key={log._id} style={logItem}>
                <div style={logHeader}>
                  <p style={logActor}>
                    <strong>{log.actor?.name}</strong>
                    <Badge
                      text={log.role}
                      color={getRoleBadgeColor(log.role)}
                    />
                  </p>
                  <small style={logTime}>
                    {new Date(log.createdAt).toLocaleString()}
                  </small>
                </div>
                <p style={logAction}>{log.action}</p>
                <small style={logMeta}>Target: {log.targetType}</small>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ---------- Helper Functions ---------- */

function getRoleBadgeColor(role) {
  const colors = {
    admin: { bg: "#fef3c7", text: "#92400e" },
    doctor: { bg: "#dbeafe", text: "#1e40af" },
    patient: { bg: "#e0e7ff", text: "#3730a3" },
  };
  return colors[role] || { bg: "#f3f4f6", text: "#374151" };
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

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "16px",
  marginBottom: "24px",
};

const statCard = {
  padding: "20px",
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  textAlign: "center",
};

const statLabel = {
  fontSize: "14px",
  color: "#6b7280",
  marginBottom: "8px",
};

const statValue = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#111827",
};

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
  flexWrap: "wrap",
  gap: "12px",
};

const sectionTitle = {
  fontSize: "18px",
  fontWeight: "600",
  margin: 0,
};


const userGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "16px",
};

const userCard = {
  padding: "16px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  backgroundColor: "#fafafa",
};

const userHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "12px",
};

const userName = {
  fontWeight: "600",
  marginBottom: "4px",
};

const userEmail = {
  fontSize: "14px",
  color: "#6b7280",
};

const userMeta = {
  marginBottom: "12px",
};

const userActions = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const logList = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const logItem = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
};

const logHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px",
};

const logActor = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  margin: 0,
};

const logTime = {
  color: "#9ca3af",
  fontSize: "12px",
};

const logAction = {
  fontWeight: "500",
  marginBottom: "4px",
};

const logMeta = {
  color: "#6b7280",
  fontSize: "12px",
};

const emptyState = {
  color: "#6b7280",
  fontStyle: "italic",
};

/* ---------- Filter & Pagination Styles ---------- */

const filtersContainer = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const inputStyle = {
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  minWidth: "200px",
  flex: "1",
};

const paginationContainer = {
  marginTop: "16px",
  display: "flex",
  gap: "12px",
  alignItems: "center",
  justifyContent: "center",
};

const pageInfo = {
  fontSize: "14px",
  color: "#6b7280",
  fontWeight: "500",
};
