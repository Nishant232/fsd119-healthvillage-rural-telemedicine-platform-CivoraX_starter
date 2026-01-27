import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logos/logo.svg";
import "./auth.css";
import { registerUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { redirectToRoleDashboard } from "../utils/roleRedirect";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Register user - backend now returns token
      const data = await registerUser(form);

      // Auto-login with returned token
      login(data);

      console.log(`✅ Registration successful for ${form.role}:`, data.user);

      // Redirect to role-specific dashboard
      redirectToRoleDashboard(data.user.role, navigate);

    } catch (err) {
      console.error("❌ Registration failed:", err);

      // Display specific error message from backend
      const errorMessage = err.response?.data?.message
        || err.response?.data?.errors?.join(", ")
        || "Registration failed. Please try again.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-container">
      {/* Left Panel - Branding */}
      <div className="auth-left-panel">
        <div>
          <h2>Join Civora Nexus</h2>
          <p>
            Create your account and start your journey towards better healthcare
            management. Connect with professionals and take control of your health.
          </p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="auth-right-panel">
        <div className="auth-form-container">
          {/* Logo */}
          <div className="auth-logo">
            <img src={logo} alt="Civora Nexus" />
          </div>

          {/* Title */}
          <h1 className="auth-title">Create Your Account</h1>
          <p className="auth-subtitle">
            Fill in your details to get started
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label htmlFor="role" className="form-label">
                I am a
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="form-select"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                padding: "12px",
                backgroundColor: "#fee",
                border: "1px solid #fcc",
                borderRadius: "8px",
                color: "#c33",
                fontSize: "14px",
                marginBottom: "16px"
              }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-button"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            Already have an account?{" "}
            <Link to="/">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
