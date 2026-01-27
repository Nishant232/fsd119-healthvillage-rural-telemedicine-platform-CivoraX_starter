import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on refresh with error handling
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        setUser(parsed.user);
        setToken(parsed.token);
        localStorage.setItem("token", parsed.token); // Ensure token is available separately
      }
    } catch (error) {
      console.error("Failed to restore auth session:", error);
      // Clear corrupted data
      try {
        localStorage.removeItem("auth");
        localStorage.removeItem("token");
      } catch (cleanupError) {
        console.error("Failed to clean up localStorage:", cleanupError);
      }
    } finally {
      // CRITICAL: Always set loading to false, even if there's an error
      setLoading(false);
    }
  }, []);

  const login = (data) => {
    setUser(data.user);
    setToken(data.token);
    try {
      localStorage.setItem("auth", JSON.stringify(data));
      localStorage.setItem("token", data.token); // Store token separately for Axios interceptors
    } catch (error) {
      console.error("Failed to save auth to localStorage:", error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem("auth");
      localStorage.removeItem("token"); // Clean up separate token storage
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          color: '#666',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <div>Loading...</div>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

