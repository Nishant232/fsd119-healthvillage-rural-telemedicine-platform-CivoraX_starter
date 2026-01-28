export default function Badge({ text, color }) {
  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        background: color.bg,
        color: color.text,
      }}
    >
      {text}
    </span>
  );
}
