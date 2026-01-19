// src/components/Signup.jsx
import React, { useState } from "react";
import twitter from "../assets/twitter.png";
import goggle from "../assets/goggle.png";
import github from "../assets/github.png";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
// import { FaGithub } from "react-icons/fa";
import { HiOutlineMail, HiLockClosed, HiUser } from "react-icons/hi";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Providers
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const twitterProvider = new TwitterAuthProvider();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, {
        displayName: username, // 👈 username from signup form
      });

      await sendEmailVerification(userCredential.user, {
        url: "http://localhost:3002/signup", // or your signup success page
        handleCodeInApp: true,
      });
      navigate("/verify-email");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const socialBtnStyle = {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    border: "1px solid #333",
    background: "#ffffff90",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "114vh",
        background: "#111",
      }}
    >
      <form
        onSubmit={handleSignup}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          width: "400px",
          background: "#232020ff",
          padding: "40px",
          borderRadius: "10px",
        }}
      >
        <h1 style={{ color: "#E50914", textAlign: "center", fontSize: "24px" }} className="flex items-center justify-center gap-2">
          <HiUser className="text-[#E50914]" />
          StreamBox Sign Up
        </h1>

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

        <div className="relative">
          <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-[320px] p-3 pl-10 rounded-sm border-1 border-red-900 text-white bg-transparent"
          />
        </div>

        <div className="relative">
          <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[320px] p-3 pl-10 rounded-sm border-1 border-red-900 text-white bg-transparent"
          />
        </div>

        <div className="relative">
          <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[320px] p-3 pl-10 rounded-sm border-1 border-red-900 text-white bg-transparent"
          />
        </div>

        <div className="relative">
          <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-[320px] p-3 pl-10 rounded-sm border-1 border-red-900 text-white bg-transparent"
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
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        {/* SOCIAL LOGIN */}
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <p style={{ color: "#aaa", fontSize: "14px" }}>Or sign up with</p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "15px",
              marginTop: "10px",
            }}
          >
            <button
              type="button"
              onClick={() => handleSocialLogin(googleProvider)}
              style={socialBtnStyle}
            >
              <img src={goggle} alt="Google" width="22" />
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin(facebookProvider)}
              style={socialBtnStyle}
            >
              <img src={github} alt="Facebook" width="22" />
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin(twitterProvider)}
              style={socialBtnStyle}
            >
              <img src={twitter} alt="Twitter" width="22" />
             {/* <FaGithub color="white" /> */}
            </button>
          </div>
        </div>

        {/* LOGIN LINK */}
        <p
          style={{
            marginTop: "15px",
            textAlign: "center",
            color: "#aaa",
            fontSize: "14px",
          }}
        >
          <p style={{ color: "#fff", textAlign: "center", marginTop: "10px" }}>
            Already have an account?{" "}
            <span
              onClick={() => {
                setLoading(true);
                setTimeout(() => navigate("/login"), 500);
              }}
              style={{
                color: "#E50914",
                cursor: "pointer",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              Login here
            </span>
          </p>

          {loading && (
            <div
              style={{
                width: "12px",
                height: "12px",
                border: "1px solid #E50914",
                borderTop: "1px solid #fff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
          )}
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

const inputStyle = {
  padding: "12px",
  borderRadius: "5px",
  border: "none",
  fontSize: "16px",
};

export default Signup;
