// PhoneOTP.jsx — Firebase Phone OTP for SUKUMARBEVERAGES
import { useState, useEffect, useRef } from "react";
import { auth } from "../utils/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

export default function PhoneOTP() {
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [step, setStep] = useState("input"); // "input" | "verify" | "done"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const recaptchaVerifierRef = useRef(null);
  const inputsRef = useRef([]);
  const timerRef = useRef(null);

  // ─── Setup invisible reCAPTCHA on mount ───────────────────────────────────
  useEffect(() => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
    return () => {
      // Cleanup on unmount
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  // ─── Countdown timer after OTP is sent ────────────────────────────────────
  const startTimer = () => {
    setTimer(30);
    setCanResend(false);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ─── STEP 1: Send OTP via SMS ──────────────────────────────────────────────
  const sendOTP = async () => {
    const fullPhone = countryCode + phone.replace(/\s/g, "");
    if (phone.length < 7) {
      setError("Please enter a valid phone number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPhoneNumber(
        auth,
        fullPhone,
        recaptchaVerifierRef.current
      );
      setConfirmationResult(result);
      setStep("verify");
      startTimer();
    } catch (err) {
      setError(err.message || "Failed to send OTP. Try again.");
      // Reset reCAPTCHA on error
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── STEP 2: Verify OTP entered by user ───────────────────────────────────
  const verifyOTP = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await confirmationResult.confirm(code);
      setStep("done");
      console.log("✅ Signed in user:", result.user);
      // TODO: Redirect to dashboard
      // navigate("/dashboard");
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── OTP input — auto-move focus to next box ──────────────────────────────
  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    sendOTP();
  };

  // ─── UI ───────────────────────────────────────────────────────────────────
  return (
    <div style={styles.container}>
      {/* Invisible reCAPTCHA anchor — required by Firebase */}
      <div id="recaptcha-container"></div>

      <div style={styles.card}>
        <div style={styles.icon}>📱</div>
        <h2 style={styles.title}>Phone Verification</h2>

        {/* STEP: Enter phone number */}
        {step === "input" && (
          <>
            <p style={styles.subtitle}>
              Enter your phone number to receive an OTP
            </p>
            <div style={styles.phoneRow}>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                style={styles.select}
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+49">🇩🇪 +49</option>
                <option value="+33">🇫🇷 +33</option>
                <option value="+81">🇯🇵 +81</option>
                <option value="+65">🇸🇬 +65</option>
                <option value="+971">🇦🇪 +971</option>
              </select>
              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendOTP()}
                style={{ ...styles.input, flex: 1 }}
              />
            </div>
            {error && <p style={styles.error}>{error}</p>}
            <button
              onClick={sendOTP}
              disabled={loading}
              style={styles.button}
            >
              {loading ? "Sending OTP..." : "Send OTP →"}
            </button>
          </>
        )}

        {/* STEP: Enter OTP */}
        {step === "verify" && (
          <>
            <p style={styles.subtitle}>
              Enter the 6-digit code sent to{" "}
              <strong>
                {countryCode} {phone}
              </strong>
            </p>
            <div style={styles.otpRow}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  style={styles.otpInput}
                  autoFocus={i === 0}
                />
              ))}
            </div>
            {error && <p style={styles.error}>{error}</p>}
            <button
              onClick={verifyOTP}
              disabled={loading}
              style={styles.button}
            >
              {loading ? "Verifying..." : "Verify OTP →"}
            </button>
            <button
              onClick={() => {
                setStep("input");
                setOtp(["", "", "", "", "", ""]);
                setError("");
              }}
              style={styles.secondaryButton}
            >
              ← Change number
            </button>
            <p style={styles.resend}>
              {canResend ? (
                <span
                  onClick={handleResend}
                  style={{ color: "#FF6B35", cursor: "pointer", fontWeight: 600 }}
                >
                  Resend OTP
                </span>
              ) : (
                <span style={{ color: "#999" }}>
                  Resend in {timer}s
                </span>
              )}
            </p>
          </>
        )}

        {/* STEP: Done */}
        {step === "done" && (
          <div style={styles.successBox}>
            <p style={{ fontSize: 18 }}>🎉 Phone verified!</p>
            <p style={{ marginTop: 8, fontSize: 13, color: "#555" }}>
              You are now signed in to SUKUMARBEVERAGES.
            </p>
          </div>
        )}
      </div>
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
  phoneRow: { display: "flex", gap: 8, marginBottom: 12 },
  select: {
    padding: "12px 8px",
    border: "1px solid #ddd",
    borderRadius: 10,
    fontSize: 14,
    background: "#fff",
    cursor: "pointer",
  },
  input: {
    padding: "12px 14px",
    fontSize: 15,
    border: "1px solid #ddd",
    borderRadius: 10,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    marginBottom: 12,
  },
  otpRow: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    marginBottom: 20,
  },
  otpInput: {
    width: 46,
    height: 52,
    textAlign: "center",
    fontSize: 22,
    fontWeight: 700,
    border: "1.5px solid #ddd",
    borderRadius: 10,
    outline: "none",
    background: "#fafafa",
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
    padding: "20px",
    textAlign: "center",
  },
  error: { color: "#e53e3e", fontSize: 13, marginBottom: 10 },
  resend: { fontSize: 13, marginTop: 14, color: "#999" },
};