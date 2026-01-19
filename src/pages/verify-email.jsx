import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification, signOut } from "firebase/auth";

const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and email is verified
    const checkEmailVerification = () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      if (user.emailVerified) {
        navigate("/dashboard");
        return;
      }
    };

    // Check immediately
    checkEmailVerification();

    // Set up interval to check every 3 seconds
    const interval = setInterval(checkEmailVerification, 3000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleResendVerification = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError("No user found. Please log in again.");
      return;
    }

    try {
      setResendLoading(true);
      setError("");
      setMessage("");

      await sendEmailVerification(user);
      setMessage("Verification email sent! Please check your inbox and spam folder.");
    } catch (err) {
      setError("Failed to send verification email. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      setError("Failed to log out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: "400px", width: "100%" }}>
        <h2 style={{ color: "#E50914", marginBottom: "20px" }}>Verify Your Email</h2>

        <div style={{
          background: "#232121ff",
          padding: "30px",
          borderRadius: "10px",
          marginBottom: "20px"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>📧</div>

          <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
            We've sent a verification link to your email address.
            <br />
            Please check your inbox (and spam folder) and click the link to verify your account.
          </p>

          <p style={{ fontSize: "14px", color: "#aaa", marginBottom: "30px" }}>
            Once verified, you'll be automatically redirected to your dashboard.
          </p>

          {/* ERROR BOX */}
          {error && (
            <div
              style={{
                backgroundColor: "#2a0000",
                border: "1px solid #E50914",
                color: "#fff",
                padding: "12px",
                borderRadius: "6px",
                fontSize: "14px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError("")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#E50914",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {message && (
            <div
              style={{
                backgroundColor: "#002a00",
                border: "1px solid #00E509",
                color: "#fff",
                padding: "12px",
                borderRadius: "6px",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              {message}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              onClick={handleResendVerification}
              disabled={resendLoading}
              style={{
                padding: "12px",
                backgroundColor: resendLoading ? "gray" : "#E50914",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: resendLoading ? "not-allowed" : "pointer",
                border: "none",
                borderRadius: "5px",
                opacity: resendLoading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              {resendLoading && (
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #fff',
                  borderTop: '2px solid #E50914',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              )}
              {resendLoading ? "Sending..." : "Resend Verification Email"}
            </button>

            <button
              onClick={handleLogout}
              disabled={loading}
              style={{
                padding: "12px",
                backgroundColor: "transparent",
                color: "#aaa",
                fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                border: "1px solid #333",
                borderRadius: "5px",
                opacity: loading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              {loading && (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #aaa',
                  borderTop: '2px solid #E50914',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              )}
              {loading ? "Logging out..." : "Back to Login"}
            </button>
          </div>
        </div>

        <p style={{ fontSize: "12px", color: "#666" }}>
          Didn't receive the email? Check your spam folder or click "Resend Verification Email"
        </p>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;
