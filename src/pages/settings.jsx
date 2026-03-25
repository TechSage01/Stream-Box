import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FiUser, FiPlayCircle, FiBell, FiShield, FiCreditCard, 
  FiArrowLeft, FiEdit2, FiLogOut, FiMonitor, FiDownload
} from "react-icons/fi";
import avatar from "../assets/avatar.jpg";
import {
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("Account");
  const [uid, setUid] = useState("");

  const DEFAULT_NOTIFICATIONS = {
    newArrivals: true,
    recommendations: true,
    promotions: false,
  };

  // Authentication and Profile States
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [hoverProfile, setHoverProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);

  // States for interactiveness
  const [autoplayNext, setAutoplayNext] = useState(true);
  const [autoplayPreviews, setAutoplayPreviews] = useState(true);
  const [videoQuality, setVideoQuality] = useState("Auto (Recommended)");
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [securityOption, setSecurityOption] = useState({ twoFactor: false });

  const profileRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName || "User");
        setNewName(user.displayName || "User");
        setUserEmail(user.email || "");
        setNewEmail(user.email || "");
        
        if (user.metadata?.creationTime) {
          const date = new Date(user.metadata.creationTime);
          const formattedDate = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          setCreationDate(formattedDate);
        }

        const savedPhone = localStorage.getItem(`phone_${user.uid}`) || user.phoneNumber || "";
        setPhoneNumber(savedPhone);
        setNewPhoneNumber(savedPhone);
        setUid(user.uid);

        const savedNotifications = localStorage.getItem(`notifications_${user.uid}`);
        if (savedNotifications) {
          try {
            setNotifications(JSON.parse(savedNotifications));
          } catch {
            setNotifications(DEFAULT_NOTIFICATIONS);
          }
        } else {
          setNotifications(DEFAULT_NOTIFICATIONS);
        }
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) return;
    localStorage.setItem(`notifications_${uid}`, JSON.stringify(notifications));
  }, [uid, notifications]);

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;
    try {
      await updateProfile(auth.currentUser, { displayName: newName });
      setUsername(newName);
      setIsEditingName(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleUpdateEmail = async () => {
    if (!auth.currentUser) return;
    try {
      await updateEmail(auth.currentUser, newEmail);
      setUserEmail(newEmail);
      setIsEditingEmail(false);
      alert("Email updated successfully.");
    } catch (error) {
      console.error("Error updating email:", error);
      if (error.code === 'auth/requires-recent-login') {
        alert("For security reasons, please log out and log back in to change your email.");
      } else {
        alert("Failed to update email: " + error.message);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected image:", file);
    }
  };

  const handleUpdatePassword = async () => {
    if (!auth.currentUser || !auth.currentUser.email) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields.");
      return;
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      alert(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    setPasswordLoading(true);
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );

      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);

      alert("Password updated successfully.");
      setIsEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.code === "auth/wrong-password") {
        alert("Current password is incorrect.");
      } else if (error.code === "auth/requires-recent-login") {
        alert("Please log out and log in again, then retry.");
      } else {
        alert("Failed to update password: " + error.message);
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleUpdatePhoneNumber = async () => {
    if (!auth.currentUser) return;

    if (!newPhoneNumber.trim()) {
      alert("Please enter a phone number.");
      return;
    }

    if (!PHONE_REGEX.test(newPhoneNumber.trim())) {
      alert("Invalid phone number format. Use format like +2348012345678");
      return;
    }

    setPhoneLoading(true);
    try {
      const normalized = newPhoneNumber.trim();
      localStorage.setItem(`phone_${auth.currentUser.uid}`, normalized);
      setPhoneNumber(normalized);
      setNewPhoneNumber(normalized);
      setIsEditingPhone(false);
      alert("Phone number updated successfully.");
    } catch (error) {
      console.error("Error updating phone number:", error);
      alert("Failed to update phone number.");
    } finally {
      setPhoneLoading(false);
    }
  };

  const tabs = [
    { name: "Account", icon: FiUser },
    { name: "Playback & Preferences", icon: FiPlayCircle },
    { name: "Subscription", icon: FiCreditCard },
    { name: "Notifications", icon: FiBell },
    { name: "Privacy & Security", icon: FiShield },
  ];

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const enableAllNotifications = () => {
    setNotifications({
      newArrivals: true,
      recommendations: true,
      promotions: true,
    });
  };

  const disableAllNotifications = () => {
    setNotifications({
      newArrivals: false,
      recommendations: false,
      promotions: false,
    });
  };

  // Keep these if not already defined (used elsewhere in your file)
  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}_\-+=<>?/\\|.,:;'"`~]).{8,}$/;
  const PHONE_REGEX = /^\+[1-9]\d{7,14}$/;

  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const [devices, setDevices] = useState([]);
  const [securityLoading, setSecurityLoading] = useState(false);

  const getCurrentDevice = () => ({
    id: `dev_${btoa(`${navigator.userAgent}|${navigator.platform}`).slice(0, 24)}`,
    name: `${navigator.platform} - ${navigator.userAgent.includes("Chrome") ? "Chrome" : "Browser"}`,
    lastActive: new Date().toISOString(),
    current: true,
  });

  const loadDevices = (uid) => {
    const key = `devices_${uid}`;
    const saved = JSON.parse(localStorage.getItem(key) || "[]");
    const current = getCurrentDevice();

    const withoutCurrent = saved.filter((d) => d.id !== current.id);
    const next = [current, ...withoutCurrent].slice(0, 10);

    localStorage.setItem(key, JSON.stringify(next));
    setDevices(next);
  };

  const handleToggleTwoFactor = () => {
    setSecurityOption((prev) => ({ ...prev, twoFactor: !prev.twoFactor }));
  };

  const handleOpenDevices = () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    loadDevices(uid);
    setShowDevicesModal(true);
  };

  const handleRemoveDevice = (deviceId) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const key = `devices_${uid}`;
    const next = devices.filter((d) => d.id !== deviceId || d.current);
    setDevices(next);
    localStorage.setItem(key, JSON.stringify(next));
  };

  const handleDownloadData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile: {
        username,
        userEmail,
        creationDate,
        phoneNumber,
      },
      preferences: {
        autoplayNext,
        autoplayPreviews,
        videoQuality,
        notifications,
        securityOption,
      },
      devices,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "streambox-account-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSignOutAllDevices = async () => {
    if (!auth.currentUser) return;
    setSecurityLoading(true);
    try {
      // Client-only fallback: clears local tracked sessions and signs out current device.
      localStorage.removeItem(`devices_${auth.currentUser.uid}`);
      await signOut(auth);
      window.location.href = "/login";
    } catch (e) {
      console.error(e);
      alert("Failed to sign out.");
    } finally {
      setSecurityLoading(false);
    }
  };

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (uid) loadDevices(uid);
  }, [auth.currentUser]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans selection:bg-red-500/30">
      
      {/* Custom Top Navigation for Settings */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white">
            <FiArrowLeft className="text-xl" />
          </Link>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-800">
            StreamBox Settings
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="relative"
            onMouseEnter={() => setHoverProfile('top')}
            onMouseLeave={() => setHoverProfile(null)}
          >
            <img 
              src={avatar} 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover shadow-lg cursor-pointer hover:ring-2 ring-red-500 ring-offset-2 ring-offset-[#0a0a0a] transition-all" 
              onClick={() => setShowProfileModal(true)}
              ref={profileRef}
            />
            {hoverProfile === 'top' && (
              <div className="absolute right-0 mt-2 w-max bg-black text-white px-3 py-1 rounded-md shadow-lg text-sm whitespace-nowrap z-50">
                Hi, {username || "User"}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Settings Content Area */}
      <div className="max-w-[1400px] mx-auto p-4 md:p-8 lg:px-12 pt-8"> 
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 text-left">
          
          {/* Settings Sidebar Navigation */}
          <div className="w-full lg:w-80 shrink-0">
            <nav className="flex flex-col gap-1.5 p-3 bg-gray-900/40 border border-gray-800 rounded-2xl shadow-xl backdrop-blur-sm sticky top-28">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.name;
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 w-full text-left ${
                      isActive
                        ? "bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-900/20 translate-x-1"
                        : "text-gray-400 hover:bg-gray-800/80 hover:text-gray-100"
                    }`}
                  >
                    <Icon className={`text-xl ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span className="font-semibold text-[15px]">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Dynamic Settings Content */}
          <div className="flex-1 bg-gray-900/20 border border-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-md min-h-[600px]">
            
            {/* Account Settings */}
            {activeTab === "Account" && (
              <div className="space-y-8 animate-fade-in w-full">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Account Details</h2>
                  <p className="text-gray-400 mt-1">Manage your personal information and password.</p>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center gap-6 p-6 bg-gray-800/20 rounded-2xl border border-gray-800/50">
                  <div className="relative group cursor-pointer inline-block shrink-0" onClick={() => setShowProfileModal(true)}>
                    <img src={avatar} alt="Profile" className="w-28 h-28 rounded-full object-cover shadow-lg transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiEdit2 className="text-white text-2xl" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    {isEditingName ? (
                      <input 
                        type="text" 
                        className="text-2xl font-bold bg-gray-900 text-white border border-gray-700 rounded px-2 py-1 mb-1 w-full max-w-xs focus:ring-2 focus:ring-red-500 outline-none transition-all" 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)} 
                        autoFocus
                      />
                    ) : (
                      <h3 className="text-2xl font-bold text-white truncate">{username || "User"}</h3>
                    )}
                    <p className="text-gray-400 mt-1">StreamBox Premium Member</p>
                    <p className="text-xs text-gray-500 mt-0.5">Member since {creationDate || "..."}</p>
                  </div>
                  
                  {isEditingName ? (
                    <div className="flex gap-2 whitespace-nowrap md:ml-auto mt-4 md:mt-0">
                      <button onClick={handleUpdateProfile} className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all shadow-sm">
                        Save
                      </button>
                      <button onClick={() => { setIsEditingName(false); setNewName(username); }} className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-all shadow-sm border border-gray-700">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setIsEditingName(true)} className="whitespace-nowrap md:ml-auto mt-4 md:mt-0 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-all shadow-sm border border-gray-700 flex items-center justify-center gap-2 cursor-pointer">
                      <FiEdit2 /> Edit Profile
                    </button>
                  )}
                </div>
                
                <div className="grid gap-4 mt-8">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gray-800/30 p-5 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-400 mb-1 font-medium">Email Address</p>
                      {isEditingEmail ? (
                        <input 
                          type="email" 
                          className="text-lg font-semibold bg-gray-900 text-white border border-gray-700 rounded px-2 py-1 w-full max-w-xs focus:ring-2 focus:ring-red-500 outline-none transition-all" 
                          value={newEmail} 
                          onChange={(e) => setNewEmail(e.target.value)} 
                          autoFocus
                        />
                      ) : (
                        <p className="font-semibold text-lg text-gray-200 truncate">{userEmail || "No email provided"}</p>
                      )}
                    </div>
                    {isEditingEmail ? (
                      <div className="flex gap-2">
                        <button onClick={handleUpdateEmail} className="shrink-0 text-green-400 hover:text-green-300 font-medium transition-colors bg-green-400/10 px-4 py-2 rounded-lg cursor-pointer">Save</button>
                        <button onClick={() => { setIsEditingEmail(false); setNewEmail(userEmail); }} className="shrink-0 text-gray-400 hover:text-gray-300 font-medium transition-colors bg-gray-400/10 px-4 py-2 rounded-lg cursor-pointer">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setIsEditingEmail(true)} className="shrink-0 text-red-400 hover:text-red-300 font-medium transition-colors bg-red-400/10 px-4 py-2 rounded-lg cursor-pointer">Change Email</button>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gray-800/30 p-5 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors">
                    <div>
                      <p className="text-sm text-gray-400 mb-1 font-medium">Password</p>
                      {!isEditingPassword ? (
                        <p className="font-semibold text-xl text-gray-200 tracking-widest">••••••••••••</p>
                      ) : (
                        <div className="grid gap-2 w-full max-w-md">
                          <input
                            type="password"
                            placeholder="Current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="bg-gray-900 text-white border border-gray-700 rounded px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                            autoComplete="current-password"
                          />
                          <input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="bg-gray-900 text-white border border-gray-700 rounded px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                            autoComplete="new-password"
                          />
                          <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="bg-gray-900 text-white border border-gray-700 rounded px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                            autoComplete="new-password"
                          />
                        </div>
                      )}
                    </div>
                    {!isEditingPassword ? (
                      <button
                        onClick={() => setIsEditingPassword(true)}
                        className="shrink-0 text-red-400 hover:text-red-300 font-medium transition-colors bg-red-400/10 px-4 py-2 rounded-lg cursor-pointer"
                      >
                        Update Password
                      </button>
                    ) : (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={handleUpdatePassword}
                          disabled={passwordLoading}
                          className="text-green-400 hover:text-green-300 font-medium transition-colors bg-green-400/10 px-4 py-2 rounded-lg disabled:opacity-60 cursor-pointer"
                        >
                          {passwordLoading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingPassword(false);
                            setCurrentPassword("");
                            setNewPassword("");
                            setConfirmPassword("");
                          }}
                          disabled={passwordLoading}
                          className="text-gray-400 hover:text-gray-300 font-medium transition-colors bg-gray-400/10 px-4 py-2 rounded-lg disabled:opacity-60 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gray-800/30 p-5 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-400 mb-1 font-medium">Phone Number</p>
                      {isEditingPhone ? (
                        <input
                          type="tel"
                          className="text-lg font-semibold bg-gray-900 text-white border border-gray-700 rounded px-2 py-1 w-full max-w-xs focus:ring-2 focus:ring-red-500 outline-none transition-all cursor-pointer"
                          placeholder="+2347057934332"
                          value={newPhoneNumber}
                          onChange={(e) => setNewPhoneNumber(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <p className="font-semibold text-lg text-gray-200 truncate">
                          {phoneNumber || "No phone number added"}
                        </p>
                      )}
                    </div>

                    {isEditingPhone ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdatePhoneNumber}
                          disabled={phoneLoading}
                          className="shrink-0 text-green-400 hover:text-green-300 font-medium transition-colors bg-green-400/10 px-4 py-2 rounded-lg disabled:opacity-60 cursor-pointer"
                        >
                          {phoneLoading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingPhone(false);
                            setNewPhoneNumber(phoneNumber);
                          }}
                          disabled={phoneLoading}
                          className="shrink-0 text-gray-400 hover:text-gray-300 font-medium transition-colors bg-gray-400/10 px-4 py-2 rounded-lg disabled:opacity-60 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditingPhone(true)}
                        className="shrink-0 text-red-400 hover:text-red-300 font-medium transition-colors bg-red-400/10 px-4 py-2 rounded-lg cursor-pointer"
                      >
                        Edit Phone
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Playback Settings */}
            {activeTab === "Playback & Preferences" && (
              <div className="space-y-8 animate-fade-in w-full">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Playback Settings</h2>
                  <p className="text-gray-400 mt-1">Control your viewing experience and data usage.</p>
                </div>
                
                <div className="space-y-4">
                  {/* Autoplay Next Episode Toggle */}
                  <div className="flex items-center justify-between gap-4 p-5 bg-gray-800/30 border border-gray-800 rounded-2xl hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => setAutoplayNext(!autoplayNext)}>
                    <div className="pr-4">
                      <h4 className="font-semibold text-lg text-gray-200">Autoplay next episode</h4>
                      <p className="text-sm text-gray-400 mt-1">Automatically play the next episode in a series seamlessly.</p>
                    </div>
                    <div className={`shrink-0 w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${autoplayNext ? 'bg-red-600' : 'bg-gray-700'}`}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${autoplayNext ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                  </div>

                  {/* Autoplay Previews Toggle */}
                  <div className="flex items-center justify-between gap-4 p-5 bg-gray-800/30 border border-gray-800 rounded-2xl hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => setAutoplayPreviews(!autoplayPreviews)}>
                    <div className="pr-4">
                      <h4 className="font-semibold text-lg text-gray-200">Autoplay previews</h4>
                      <p className="text-sm text-gray-400 mt-1">Autoplay trailers and teasers while browsing on all devices.</p>
                    </div>
                    <div className={`shrink-0 w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${autoplayPreviews ? 'bg-red-600' : 'bg-gray-700'}`}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${autoplayPreviews ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-800/30 border border-gray-800 rounded-2xl mt-6 max-w-2xl">
                  <h4 className="font-semibold text-lg text-gray-200 mb-2">Default Video Quality</h4>
                  <p className="text-sm text-gray-400 mb-5">Adjusting video quality may affect local data usage.</p>
                  
                  <select 
                    value={videoQuality}
                    onChange={(e) => setVideoQuality(e.target.value)}
                    className="bg-gray-900 border border-gray-700 text-white text-base rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 block w-full p-4 cursor-pointer outline-none transition-all"
                  >
                    <option value="Auto (Recommended)">Auto (Recommended)</option>
                    <option value="Data Saver">Data Saver (Low: 480p)</option>
                    <option value="Standard">Standard Definition (720p)</option>
                    <option value="High Definition">High Definition (1080p)</option>
                    <option value="Ultra HD">Ultra HD (4K HDR)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Subscription Settings */}
            {activeTab === "Subscription" && (
              <div className="space-y-8 animate-fade-in w-full">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Plan Details</h2>
                  <p className="text-gray-400 mt-1">Manage your current billing and subscription plan.</p>
                </div>
                
                <div className="bg-gradient-to-br from-red-600 via-red-900 to-[#2a0000] rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700 ease-out pointer-events-none">
                    <FiCreditCard className="w-64 h-64 text-white" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-4xl font-black text-white tracking-tight">Premium 4K</h3>
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold border border-white/30 tracking-wider shadow-sm">
                            PRO
                          </span>
                        </div>
                        <p className="text-red-100 font-medium text-lg">Best video quality in 4K+HDR</p>
                      </div>
                      <span className="px-4 py-1.5 bg-green-500/20 text-green-300 rounded-full text-sm font-bold border border-green-500/30 tracking-wide uppercase shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Active
                      </span>
                    </div>
                    
                    <ul className="space-y-4 text-white/90 mb-10 list-none font-medium text-base md:text-lg">
                      <li className="flex items-center gap-3"><span className="shrink-0 w-6 h-6 rounded-full bg-red-500/40 flex items-center justify-center text-sm">✓</span> 4 screens at the same time</li>
                      <li className="flex items-center gap-3"><span className="shrink-0 w-6 h-6 rounded-full bg-red-500/40 flex items-center justify-center text-sm">✓</span> Unlimited ad-free movies & TV shows</li>
                      <li className="flex items-center gap-3"><span className="shrink-0 w-6 h-6 rounded-full bg-red-500/40 flex items-center justify-center text-sm">✓</span> Download on 4 supported devices</li>
                    </ul>
                    
                    <div className="flex items-end gap-2">
                      <p className="text-5xl font-black text-white drop-shadow-md">$19.99</p>
                      <p className="text-xl font-medium text-red-100 mb-1">/ month</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-4">
                  <button className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-all shadow-lg text-lg">
                    Change Plan
                  </button>
                  <button className="px-8 py-4 bg-transparent border-2 border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500 rounded-xl font-bold transition-all text-lg">
                    Cancel Subscription
                  </button>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "Notifications" && (
              <div className="space-y-8 animate-fade-in w-full">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Notification Preferences</h2>
                  <p className="text-gray-400 mt-1">Choose what updates you want to receive via email and push.</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={enableAllNotifications}
                    className="px-4 py-2 rounded-lg bg-green-500/10 text-green-400 hover:text-green-300 font-medium"
                  >
                    Enable All
                  </button>
                  <button
                    onClick={disableAllNotifications}
                    className="px-4 py-2 rounded-lg bg-gray-500/10 text-gray-300 hover:text-white font-medium"
                  >
                    Disable All
                  </button>
                </div>

                <div className="bg-gray-800/30 rounded-2xl border border-gray-800 overflow-hidden divide-y divide-gray-800">
                  {([
                    { key: 'newArrivals', title: 'New Arrivals', desc: 'Get updates on the newest movies and TV shows.'},
                    { key: 'recommendations', title: 'Personalized Recommendations', desc: 'Receive suggestions based on your watch history.'},
                    { key: 'promotions', title: 'Special Offers & Promotions', desc: 'Updates on subscription discounts and events.'}
                  ]).map((item) => (
                    <div 
                      key={item.key} 
                      className="flex items-center justify-between p-6 hover:bg-gray-800/50 transition-colors cursor-pointer group"
                      onClick={() => toggleNotification(item.key)}
                    >
                      <div className="pr-4">
                        <h4 className="font-semibold text-lg text-gray-200 group-hover:text-white transition-colors">{item.title}</h4>
                        <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                      </div>
                      
                      <div className={`shrink-0 w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${notifications[item.key] ? 'bg-red-600' : 'bg-gray-700'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${notifications[item.key] ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            )}

            {/* Privacy & Security Settings */}
            {activeTab === "Privacy & Security" && (
              <div className="space-y-8 animate-fade-in w-full">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Security Settings</h2>
                  <p className="text-gray-400 mt-1">Manage your account security and devices.</p>
                </div>
                
                <div className="space-y-4">
                  {/* 2FA Toggle */}
                  <div
                    className="flex items-center justify-between p-5 bg-gray-800/30 rounded-2xl border border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer group"
                    onClick={handleToggleTwoFactor}
                  >
                    <div className="flex items-center gap-4 pr-2 border-box">
                      <div className="shrink-0 p-3 bg-gray-900 rounded-lg text-gray-400 group-hover:text-white transition-all">
                        <FiShield className="text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-gray-200 group-hover:text-white transition-colors">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-400">Add an extra layer of security to your account.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${securityOption.twoFactor ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                        {securityOption.twoFactor ? 'ON' : 'OFF'}
                      </span>
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out hidden sm:block ${securityOption.twoFactor ? 'bg-green-500' : 'bg-gray-700'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${securityOption.twoFactor ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleOpenDevices}
                    className="w-full flex justify-between items-center p-5 bg-gray-800/30 rounded-2xl border border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 p-3 bg-gray-900 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                        <FiMonitor className="text-xl" />
                      </div>
                      <div>
                        <span className="block font-semibold text-lg text-gray-200 group-hover:text-white transition-colors mb-0.5">Manage Devices</span>
                        <span className="block text-sm text-gray-400">View and manage devices logged into your account.</span>
                      </div>
                    </div>
                    <span className="shrink-0 px-3 py-1 bg-blue-900/30 text-blue-400 rounded-md text-sm border border-blue-800/50 font-medium">
                      {devices.length} Active
                    </span>
                  </button>

                  <button
                    onClick={handleDownloadData}
                    className="w-full flex justify-between items-center p-5 bg-gray-800/30 rounded-2xl border border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 p-3 bg-gray-900 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                        <FiDownload className="text-xl" />
                      </div>
                      <div>
                        <span className="block font-semibold text-lg text-gray-200 group-hover:text-white transition-colors mb-0.5">Download your data</span>
                        <span className="block text-sm text-gray-400">Get a copy of your viewing history and preferences.</span>
                      </div>
                    </div>
                    <span className="shrink-0 text-gray-500 group-hover:text-white font-bold text-xl transition-colors">&rarr;</span>
                  </button>
                </div>

                <div className="pt-8 mt-8 border-t border-gray-800">
                  <button
                    onClick={handleSignOutAllDevices}
                    disabled={securityLoading}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-red-900/20 text-red-500 border border-red-900/50 hover:bg-red-600 hover:text-white hover:border-red-600 rounded-xl font-bold transition-all shadow-sm w-full md:w-auto text-lg disabled:opacity-60"
                  >
                    <FiLogOut /> {securityLoading ? "Signing out..." : "Sign out of all devices"}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
        {/* HIDDEN FILE INPUT */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {/* PROFILE PICTURE MODAL */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center px-4">
            <div className="bg-white p-6 rounded-xl text-center max-w-sm w-full shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800">
                Change Profile Picture?
              </h3>

              <p className="text-sm text-gray-600 mt-2">
                Do you want to update your profile picture?
              </p>

              <div className="mt-5 flex gap-3 justify-center">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md font-semibold"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    fileInputRef.current.click();
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-semibold"
                >
                  Yes, Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {showDevicesModal && (
          <div className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center px-4">
            <div className="w-full max-w-xl bg-[#121212] border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Active Devices</h3>
                <button
                  onClick={() => setShowDevicesModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                {devices.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between bg-gray-900/60 border border-gray-800 rounded-lg p-3"
                  >
                    <div>
                      <p className="text-white font-medium">
                        {d.name} {d.current ? "(Current)" : ""}
                      </p>
                      <p className="text-xs text-gray-400">
                        Last active: {new Date(d.lastActive).toLocaleString()}
                      </p>
                    </div>
                    {!d.current && (
                      <button
                        onClick={() => handleRemoveDevice(d.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;