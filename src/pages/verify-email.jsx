import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  applyActionCode,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [networkWarning, setNetworkWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate();

  // Always use your live Firebase Hosting URL here
  const verificationRedirectUrl =
    import.meta.env.VITE_EMAIL_REDIRECT_URL ||
    "https://streambox-f3b5e.web.app/verify-email";

  // Apply verification code from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const oobCode = params.get("oobCode");

    const applyVerification = async () => {
      if (mode !== "verifyEmail" || !oobCode) return;

      try {
        await applyActionCode(auth, oobCode);
        setMessage("Email verified successfully! Redirecting...");
        // Reload user if logged in
        if (auth.currentUser) await auth.currentUser.reload();
        // Remove query params from URL
        window.history.replaceState({}, document.title, "/verify-email");
        setTimeout(() => navigate("/dashboard"), 3000);
      } catch (err) {
        setError(
          "This verification link is invalid or has expired. Please resend a new verification email."
        );
      }
    };

    applyVerification();
  }, [navigate]);

  // Check periodically if logged-in user's email is verified
  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (!user) return;
      await user.reload();
      if (user.emailVerified) navigate("/dashboard");
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate]);

  // Check network reachability
  useEffect(() => {
    const checkReachability = async () => {
      const urls = [
        "https://streambox-f3b5e.firebaseapp.com/__/auth/handler",
        "https://streambox-f3b5e.web.app/__/auth/handler",
      ];

      const probe = async (url) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 7000);
        try {
          await fetch(url, { method: "GET", mode: "no-cors", signal: controller.signal });
          return true;
        } catch {
          return false;
        } finally {
          clearTimeout(timeout);
        }
      };

      const results = await Promise.all(urls.map((url) => probe(url)));
      if (!results.some(Boolean)) {
        setNetworkWarning(
          "Network block detected. Try mobile hotspot, disable VPN/proxy, or allow firebaseapp.com/web.app in firewall."
        );
      } else {
        setNetworkWarning("");
      }
    };

    checkReachability();
  }, []);

  // Resend verification email
  const handleResendVerification = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError("No user logged in. Please login again.");
      return;
    }

    try {
      setResendLoading(true);
      setError("");
      setMessage("");

      const actionCodeSettings = {
        url: verificationRedirectUrl,
        handleCodeInApp: true, // MUST be true
      };

      await sendEmailVerification(user, actionCodeSettings);
      setMessage("Verification email sent! Check inbox or spam folder.");
    } catch (err) {
      setError("Failed to resend verification email. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  // Logout user
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

        <div
          style={{
            background: "#232121ff",
            padding: "30px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>📧</div>

          <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
            We've sent a verification link to your email address.
            <br />
            Please check your inbox (and spam folder) and click the link to verify your account.
          </p>

          {networkWarning && (
            <div
              style={{
                backgroundColor: "#2a1a00",
                border: "1px solid #ffb020",
                color: "#fff",
                padding: "12px",
                borderRadius: "6px",
                fontSize: "13px",
                marginBottom: "20px",
                textAlign: "left",
              }}
            >
              {networkWarning}
            </div>
          )}

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
              }}
            >
              {error}
            </div>
          )}

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
              }}
            >
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
              }}
            >
              {loading ? "Logging out..." : "Back to Login"}
            </button>
          </div>
        </div>
        <p style={{ fontSize: "12px", color: "#666" }}>
          Didn't receive the email? Check your spam folder or click "Resend Verification Email"
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;