import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { HiOutlineMail, HiLockClosed, HiUser } from "react-icons/hi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          setError("No account found with this email");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/too-many-requests":
          setError("Too many requests. Try again later.");
          break;
        default:
          setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(../assets/streambox background.jpg)`,
        backgroundSize: "cover",
        background: "#000",
      }}
    >
      <form
        onSubmit={handleResetPassword}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          width: "400px",
          background: "#232121ff",
          padding: "40px",
          borderRadius: "10px",
        }}
      >
        <h2 style={{ color: "#E50914", textAlign: "center", fontSize: "24px" }}>
          Reset Password
        </h2>
        <p style={{ color: "#aaa", textAlign: "center", fontSize: "14px" }}>
          Enter your email address and we'll send you a link to reset your
          password.
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
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        <div className="relative">
          <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            placeholder="email@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[320px] p-3 pl-10 rounded-sm border border-red-900 bg-transparent text-white outline-none focus:border-[#E50914]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px",
            backgroundColor: loading ? "gray" : "#E50914",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            border: "none",
            borderRadius: "5px",
            opacity: loading ? 0.7 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {loading && (
            <div
              style={{
                width: "20px",
                height: "20px",
                border: "2px solid #fff",
                borderTop: "2px solid #E50914",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
          )}
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* BACK TO LOGIN LINK */}
        <p
          style={{
            marginTop: "15px",
            textAlign: "center",
            color: "#aaa",
            fontSize: "14px",
          }}
        >
          Remember your password?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#E50914", cursor: "pointer" }}
          >
            Back to login
          </span>
        </p>
      </form>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
