export default function Card({ title, children }) {
  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      {title && <h2 style={{ marginBottom: "12px" }}>{title}</h2>}
      {children}
    </section>
  );
}
