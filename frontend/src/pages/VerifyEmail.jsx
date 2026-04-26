// VerifyEmail.jsx — Handle email link verification
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

export default function VerifyEmail() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmailLink = async () => {
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
          console.log("✅ Signed in user:", result.user);
          // Redirect to dashboard
          navigate("/dashboard");
        } else {
          alert("Invalid or expired sign-in link.");
          navigate("/firebase-auth");
        }
      } catch (err) {
        console.error("Verification failed:", err);
        alert("Verification failed. Try again.");
        navigate("/firebase-auth");
      }
    };

    verifyEmailLink();
  }, [navigate]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "#f5f5f5",
      fontFamily: "system-ui, sans-serif",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        padding: "2rem",
        textAlign: "center",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✉️</div>
        <h2>Verifying your email...</h2>
        <p>Please wait while we verify your email link.</p>
      </div>
    </div>
  );
}