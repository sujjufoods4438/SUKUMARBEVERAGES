// FirebaseAuth.jsx — Tab switcher for Email and Phone OTP
import { useState } from "react";
import EmailOTP from "./EmailOTP";
import PhoneOTP from "./PhoneOTP";

export default function FirebaseAuth() {
  const [tab, setTab] = useState("phone"); // "phone" | "email"

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Tab switcher */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          padding: "1.5rem",
          background: "#fff",
          borderBottom: "1px solid #eee",
        }}
      >
        <button
          onClick={() => setTab("phone")}
          style={{
            padding: "8px 20px",
            borderRadius: 20,
            border: "none",
            background: tab === "phone" ? "#FF6B35" : "#f0f0f0",
            color: tab === "phone" ? "#fff" : "#333",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          📱 Phone OTP
        </button>
        <button
          onClick={() => setTab("email")}
          style={{
            padding: "8px 20px",
            borderRadius: 20,
            border: "none",
            background: tab === "email" ? "#FF6B35" : "#f0f0f0",
            color: tab === "email" ? "#fff" : "#333",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ✉️ Email OTP
        </button>
      </div>

      {/* Render active OTP component */}
      {tab === "phone" ? <PhoneOTP /> : <EmailOTP />}
    </div>
  );
}