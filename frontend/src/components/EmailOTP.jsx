// EmailOTP.jsx — Firebase Email OTP for SUKUMARBEVERAGES
import { useState } from "react";
import { auth } from "../utils/firebase";
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";

// ✅ Change this to your actual domain when deploying
const ACTION_CODE_SETTINGS = {
  url: window.location.origin + "/verify-email",
  handleCodeInApp: true,
};

export default function EmailOTP() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("input"); // "input" | "sent" | "done" | "error"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ─── STEP 1: Send OTP link to email ───────────────────────────────────────
  const sendOTP = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendSignInLinkToEmail(auth, email, ACTION_CODE_SETTINGS);
      // Save email in localStorage so we can use it on the verify page
      localStorage.setItem("emailForSignIn", email);
      setStep("sent");
    } catch (err) {
      setError(err.message || "Failed to send email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── STEP 2: Verify the magic link (call this on your /verify-email page) ─
  // This function should run automatically when the user lands on the verify page
  const verifyEmailLink = async () => {
    setLoading(true);
    setError("");
    try {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        const savedEmail =
          localStorage.getItem("emailForSignIn") ||
          window.prompt("Please enter your email to confirm:");

        const result = await signInWithEmailLink(
          auth,
          savedEmail,
          window.location.href
        );
        localStorage.removeItem("emailForSignIn");
        setStep("done");
        console.log("✅ Signed in user:", result.user);
        // TODO: Redirect user to your dashboard or home page
        // navigate("/dashboard");
      } else {
        setError("Invalid or expired sign-in link.");
      }
    } catch (err) {
      setError(err.message || "Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── UI ───────────────────────────────────────────────────────────────────
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>✉️</div>
        <h2 style={styles.title}>Email Verification</h2>

        {/* STEP: Input email */}
        {step === "input" && (
          <>
            <p style={styles.subtitle}>
              Enter your email to receive a sign-in link
            </p>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendOTP()}
              style={styles.input}
            />
            {error && <p style={styles.error}>{error}</p>}
            <button
              onClick={sendOTP}
              disabled={loading}
              style={styles.button}
            >
              {loading ? "Sending..." : "Send Sign-in Link →"}
            </button>
          </>
        )}

        {/* STEP: Email sent */}
        {step === "sent" && (
          <>
            <div style={styles.successBox}>
              <p>
                ✅ Link sent to <strong>{email}</strong>
              </p>
              <p style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
                Check your inbox and click the link to sign in. The link
                expires in 1 hour.
              </p>
            </div>
            <button
              onClick={() => setStep("input")}
              style={styles.secondaryButton}
            >
              ← Use different email
            </button>
            <button onClick={sendOTP} style={styles.secondaryButton}>
              Resend link
            </button>
          </>
        )}

        {/* STEP: Verified (on /verify-email page) */}
        {step === "done" && (
          <div style={styles.successBox}>
            <p>🎉 You're signed in successfully!</p>
          </div>
        )}

        {/* STEP: Error */}
        {step === "error" && (
          <>
            <p style={styles.error}>{error}</p>
            <button
              onClick={() => setStep("input")}
              style={styles.secondaryButton}
            >
              Try again
            </button>
          </>
        )}
      </div>

      {/* ── HOW TO USE on /verify-email route ─────────────────────────────── */}
      {/*
        On your /verify-email page component, call verifyEmailLink() inside useEffect:

        import { useEffect } from "react";

        useEffect(() => {
          verifyEmailLink();
        }, []);
      */}
    </div>
  );
}

// ─── Inline styles ────────────────────────────────────────────────────────────
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f5f5f5",
    fontFamily: "system-ui, sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "2rem",
    width: "100%",
    maxWidth: 400,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  icon: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 600, margin: "0 0 8px" },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 20 },
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: 15,
    border: "1px solid #ddd",
    borderRadius: 10,
    marginBottom: 12,
    boxSizing: "border-box",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#FF6B35",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryButton: {
    width: "100%",
    padding: "10px",
    background: "transparent",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: 10,
    fontSize: 14,
    cursor: "pointer",
    marginTop: 8,
  },
  successBox: {
    background: "#f0fdf4",
    border: "1px solid #86efac",
    borderRadius: 10,
    padding: "16px",
    marginBottom: 16,
    textAlign: "left",
    fontSize: 14,
  },
  error: { color: "#e53e3e", fontSize: 13, marginBottom: 10 },
};