export default function Button({ children, onClick, variant = "primary", type = "button", disabled = false }) {
    const baseStyle = {
        padding: "12px 20px",
        minHeight: "44px",
        border: "none",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "500",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        opacity: disabled ? 0.6 : 1,
    };

    const variants = {
        primary: {
            backgroundColor: "#2563eb",
            color: "#ffffff",
        },
        secondary: {
            backgroundColor: "#f3f4f6",
            color: "#374151",
            border: "1px solid #d1d5db",
        },
        danger: {
            backgroundColor: "#dc2626",
            color: "#ffffff",
        },
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={{ ...baseStyle, ...variants[variant] }}
        >
            {children}
        </button>
    );
}
