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
import { HiOutlineMail, HiLockClosed, HiUser, HiPhone } from "react-icons/hi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Signup = () => {
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [strength, setStrength] = useState("");

  const navigate = useNavigate();
  const verificationRedirectUrl =
    import.meta.env.VITE_EMAIL_REDIRECT_URL ||
    `${window.location.origin}/verify-email`;

  // ================= REGEX =================
  const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  // Providers
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const twitterProvider = new TwitterAuthProvider();

  // Password Strength Check
  const checkStrength = (pwd) => {
    if (pwd.length < 6) return "Too Short";
    let score = 0;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[\W_]/.test(pwd)) score++;
    if (score <= 2) return "Weak";
    if (score === 3) return "Medium";
    return "Strong";
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // ================= VALIDATION =================
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (!usernameRegex.test(username)) {
      setError(
        "Username must be 3–15 characters and contain only letters, numbers, or underscore",
      );
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must contain at least 6 characters, including uppercase, lowercase, numbers, and special characters",
      );
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
        password,
      );

      await updateProfile(userCredential.user, {
        displayName: username,
      });

      const actionCodeSettings = {
        url: verificationRedirectUrl,
        handleCodeInApp: true,
      };

      await sendEmailVerification(userCredential.user, {
        ...actionCodeSettings,
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
        <h1
          style={{ color: "#E50914", textAlign: "center", fontSize: "24px" }}
          className="flex items-center justify-center gap-2"
        >
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

        {/* USERNAME */}
        <div className="relative">
          <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            className="w-[320px] p-3 pl-10 rounded-sm border-1 border-red-900 text-white bg-transparent"
          />
        </div>
        {/* PHONE NUMBER */}
        <div className="relative">
          <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError("");
            }}
            className="w-[320px] p-3 pl-10 rounded-sm border-1 border-red-900 text-white bg-transparent"
          />
        </div>

        {/* PHONE VALIDATION MESSAGE */}
        {phone && !phoneRegex.test(phone) && (
          <p
            style={{
              color: "red",
              fontSize: "12px",
              marginTop: "-10px",
            }}
          >
            Enter a valid phone number
          </p>
        )}

        {/* EMAIL */}
        <div className="relative">
          <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="w-[320px] p-3 pl-10 rounded-sm border-1 border-red-900 text-white bg-transparent"
          />
        </div>

        {/* PASSWORD */}
        <div className="relative flex items-center">
          <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setStrength(checkStrength(e.target.value));
              setError("");
            }}
            className="w-[320px] p-3 pl-10 rounded-sm border-1 border-red-900 text-white bg-transparent"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: "absolute", right: "10px", cursor: "pointer" }}
          >
            {showPassword ? (
              <AiFillEyeInvisible color="#aaa" />
            ) : (
              <AiFillEye color="#aaa" />
            )}
          </span>
        </div>
        {strength && (
          <p
            style={{
              color:
                strength === "Strong"
                  ? "lightgreen"
                  : strength === "Medium"
                    ? "orange"
                    : "red",
              fontSize: "12px",
              marginTop: "-10px",
            }}
          >
            Password Strength: {strength}
          </p>
        )}

        {/* CONFIRM PASSWORD */}
        <div className="relative flex items-center">
          <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
            className="w-[320px] p-3 pl-10 rounded-sm border-1 border-red-900 text-white bg-transparent"
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            style={{ position: "absolute", right: "10px", cursor: "pointer" }}
          >
            {showConfirm ? (
              <AiFillEyeInvisible color="#aaa" />
            ) : (
              <AiFillEye color="#aaa" />
            )}
          </span>
        </div>

        {/* PASSWORD MATCH MESSAGE */}
        {confirmPassword && (
          <p
            style={{
              color: confirmPassword === password ? "lightgreen" : "red",
              fontSize: "12px",
              marginTop: "-10px",
            }}
          >
            {confirmPassword === password
              ? "Passwords match ✔"
              : "Passwords do not match ❌"}
          </p>
        )}

        {/* SUBMIT BUTTON */}
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
            </button>
          </div>
        </div>

        {/* LOGIN LINK */}
        <p style={{ textAlign: "center", color: "#fff", marginTop: "10px" }}>
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
      </form>

      {/* SPINNER ANIMATION */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Signup;
