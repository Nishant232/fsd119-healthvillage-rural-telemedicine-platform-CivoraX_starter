const VALID_ROLES = ["patient", "doctor", "admin"];

/**
 * Validates registration input data
 */
const validateRegistrationInput = (data) => {
    const errors = [];

    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        errors.push("Name must be at least 2 characters long");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push("Please provide a valid email address");
    }

    // Password validation
    if (!data.password || data.password.length < 6) {
        errors.push("Password must be at least 6 characters long");
    }

    // Role validation
    if (!data.role || !VALID_ROLES.includes(data.role)) {
        errors.push(`Role must be one of: ${VALID_ROLES.join(", ")}`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validates if a role is valid
 */
const validateRole = (role) => {
    return VALID_ROLES.includes(role);
};

/**
 * Sanitizes user object for response (removes sensitive data)
 */
const sanitizeUserResponse = (user) => {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };
};

module.exports = {
    validateRegistrationInput,
    validateRole,
    sanitizeUserResponse,
    VALID_ROLES
};
