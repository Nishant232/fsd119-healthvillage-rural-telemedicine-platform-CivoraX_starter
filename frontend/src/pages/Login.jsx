import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logos/logo.svg";
import "./auth.css";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { redirectToRoleDashboard } from "../utils/roleRedirect";


export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      login(data);

      console.log(`✅ Login successful for ${data.user.role}:`, data.user);

      // Use centralized role-based redirection
      redirectToRoleDashboard(data.user.role, navigate);

    } catch (err) {
      console.error("❌ Login failed:", err);

      // Display specific error message from backend
      const errorMessage = err.response?.data?.message
        || "Invalid email or password";

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
          <h2>Welcome to Civora Nexus</h2>
          <p>
            Your comprehensive healthcare management platform. Connect with
            healthcare professionals and manage your health journey seamlessly.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="auth-right-panel">
        <div className="auth-form-container">
          {/* Logo */}
          <div className="auth-logo">
            <img src={logo} alt="Civora Nexus" />
          </div>

          {/* Title */}
          <h1 className="auth-title">Login to Your Account</h1>
          <p className="auth-subtitle">
            Enter your credentials to access your account
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            Don't have an account?{" "}
            <Link to="/register">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
