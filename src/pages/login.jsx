import React, { useState } from "react";
import { HiOutlineMail, HiLockClosed, HiUser } from "react-icons/hi";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState(""); // 🔥 added
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setStatus("");

    if (!email || !password) {
      setError("All fields are required.");
      setStatus("error");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      setStatus("error");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      if (!user.emailVerified) {
        setError("Please verify your email. Check spam folder.");
        setStatus("error");
        return;
      }

      // ✅ SUCCESS
      setError("Login Successful! Redirecting...");
      setStatus("success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      setStatus("error");

      switch (error.code) {
        case "auth/user-not-found":
          setError("No account found with this email");
          break;
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Try again later.");
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
        background: "#000",
      }}
    >
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 w-[400px] bg-[#232121] p-10 rounded-lg w-[]"
      >
        <h2 className="text-[#E50914] text-center text-2xl font-bold">
            {/* <HiUser className="text-[#E50914]" /> */}
          StreamBox Login
        </h2>

        {/* ALERT BOX */}
        {error && (
          <div
            className={`p-3 rounded-md text-sm flex justify-between items-center border transition-all
              ${
                status === "success"
                  ? "bg-[#002a00] border-green-500 text-green-400"
                  : "bg-[#2a0000] border-[#E50914] text-white"
              }`}
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => {
                setError("");
                setStatus("");
              }}
              className="font-bold hover:opacity-80"
            >
              ✕
            </button>
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

        <div className="relative">
          <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[320px] p-3 pl-10 rounded-sm border border-red-900 bg-transparent text-white outline-none focus:border-[#E50914]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`p-3 text-white font-bold rounded-md flex justify-center items-center gap-2
    ${
      loading
        ? "bg-gray-500 cursor-not-allowed"
        : "bg-[#E50914] hover:bg-red-700"
    }`}
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {loading ? "Logging In..." : "Login"}
        </button>

        <p
          className="mt-4 text-center text-gray-400 text-sm cursor-pointer hover:text-[#E50914]"
          onClick={() => navigate("/forgot-password")}
        >
          Forgotten password?
        </p>

        <p className="mt-4 text-center text-gray-400 text-sm">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#E50914] cursor-pointer hover:underline"
          >
            Create account
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
