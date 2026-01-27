/**
 * Centralized role-based routing utility
 * Single source of truth for dashboard paths
 */

const ROLE_DASHBOARD_PATHS = {
    patient: "/patient",
    doctor: "/doctor",
    admin: "/admin"
};

/**
 * Get dashboard path for a given role
 * @param {string} role - User role (patient, doctor, admin)
 * @returns {string} Dashboard path
 */
export const getRoleDashboardPath = (role) => {
    const path = ROLE_DASHBOARD_PATHS[role?.toLowerCase()];

    if (!path) {
        console.warn(`Unknown role: ${role}. Redirecting to login.`);
        return "/";
    }

    return path;
};

/**
 * Navigate to role-specific dashboard
 * @param {string} role - User role
 * @param {function} navigate - React Router navigate function
 */
export const redirectToRoleDashboard = (role, navigate) => {
    const path = getRoleDashboardPath(role);
    navigate(path, { replace: true });
};

/**
 * Get all valid roles
 * @returns {string[]} Array of valid roles
 */
export const getValidRoles = () => {
    return Object.keys(ROLE_DASHBOARD_PATHS);
};
