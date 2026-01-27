import { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  getAllUsers,
  toggleUserStatus,
  deleteUser,
} from "../../services/adminService";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  /* 🔒 Frontend role protection */
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data.users || []);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Enable / Disable user
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

  // Delete user
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

  return (
    <div style={{ padding: "24px" }}>
      <h1>Admin Dashboard</h1>

      <section style={{ marginTop: "24px" }}>
        <h2>System Users</h2>

        {loading && <p>Loading users...</p>}

        {!loading && users.length === 0 && (
          <p>No users found.</p>
        )}

        {!loading &&
          users.map((u) => (
            <div
              key={u._id}
              style={{
                padding: "12px",
                marginTop: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                background: "#fff",
              }}
            >
              <p><strong>Name:</strong> {u.name}</p>
              <p><strong>Email:</strong> {u.email}</p>
              <p><strong>Role:</strong> {u.role}</p>
              <p>
                <strong>Status:</strong>{" "}
                {u.isActive ? "Active" : "Disabled"}
              </p>

              <button
                onClick={() => handleToggleStatus(u._id)}
                style={{
                  marginRight: "10px",
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                {u.isActive ? "Disable" : "Enable"}
              </button>

              <button
                onClick={() => handleDeleteUser(u._id)}
                style={{
                  padding: "6px 12px",
                  color: "red",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))}
      </section>
    </div>
  );
}
