"use client";

import { useState, useRef } from "react";
import { FaUser, FaEnvelope, FaLock, FaCamera, FaKey, FaCheckCircle, FaTimes } from "react-icons/fa";

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

interface Props {
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string;
  unitName: string | null;
  positionName: string | null;
  createdAt: Date;
}

export default function ProfileClient({ name, email, avatarUrl, role, unitName, positionName, createdAt }: Props) {
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(name);
  const [savingName, setSavingName] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailStep, setEmailStep] = useState<"form" | "otp">("form");
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordOtp, setPasswordOtp] = useState("");
  const [passwordStep, setPasswordStep] = useState<"form" | "otp">("form");
  const [sendingPasswordOtp, setSendingPasswordOtp] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [error, setError] = useState("");

  function showMessage(ok: boolean, text: string) {
    setMessage({ ok, text });
    setTimeout(() => setMessage(null), 4000);
  }

  async function handleSaveName() {
    if (!newName.trim()) return;
    setSavingName(true);
    setError("");
    try {
      const { updateStaffProfileName } = await import("@/lib/actions");
      await updateStaffProfileName(newName.trim());
      showMessage(true, "Name updated successfully");
      setEditingName(false);
    } catch (e: any) {
      showMessage(false, e.message || "Failed to update name");
    } finally {
      setSavingName(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showMessage(false, "Image must be under 2MB"); return; }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSaveAvatar() {
    if (!avatarPreview) return;
    setSavingName(true);
    try {
      const { updateStaffProfileAvatar } = await import("@/lib/actions");
      await updateStaffProfileAvatar(avatarPreview);
      showMessage(true, "Profile photo updated");
      setAvatarFile(null);
    } catch (e: any) {
      showMessage(false, e.message || "Failed to update photo");
    } finally {
      setSavingName(false);
    }
  }

  async function handleSendEmailOtp() {
    if (!newEmail.trim() || !newEmail.includes("@")) { setError("Enter a valid email"); return; }
    setSendingEmailOtp(true);
    setError("");
    try {
      const { sendProfileChangeOtp } = await import("@/lib/actions");
      await sendProfileChangeOtp();
      setEmailStep("otp");
    } catch (e: any) {
      setError(e.message || "Failed to send OTP");
    } finally {
      setSendingEmailOtp(false);
    }
  }

  async function handleSaveEmail() {
    if (emailOtp.length !== 6) return;
    setSavingEmail(true);
    setError("");
    try {
      const { updateStaffEmail } = await import("@/lib/actions");
      await updateStaffEmail(newEmail.trim(), emailOtp);
      showMessage(true, "Email updated successfully");
      setShowEmailForm(false);
      setNewEmail("");
      setEmailOtp("");
      setEmailStep("form");
    } catch (e: any) {
      setError(e.message || "Failed to update email");
    } finally {
      setSavingEmail(false);
    }
  }

  async function handleSendPasswordOtp() {
    if (!currentPassword) { setError("Enter your current password"); return; }
    if (newPassword.length < 8) { setError("New password must be at least 8 characters"); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    setSendingPasswordOtp(true);
    setError("");
    try {
      const { sendProfileChangeOtp } = await import("@/lib/actions");
      await sendProfileChangeOtp();
      setPasswordStep("otp");
    } catch (e: any) {
      setError(e.message || "Failed to send OTP");
    } finally {
      setSendingPasswordOtp(false);
    }
  }

  async function handleSavePassword() {
    if (passwordOtp.length !== 6) return;
    setSavingPassword(true);
    setError("");
    try {
      const { updateStaffPassword } = await import("@/lib/actions");
      await updateStaffPassword(currentPassword, newPassword, passwordOtp);
      showMessage(true, "Password updated successfully");
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordOtp("");
      setPasswordStep("form");
    } catch (e: any) {
      setError(e.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>

      {message && (
        <div className={`rounded-2xl px-4 py-3 text-sm flex items-center gap-2 ${
          message.ok ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-600"
        }`}>
          {message.ok ? <FaCheckCircle className="shrink-0" /> : <FaTimes className="shrink-0" />}
          {message.text}
        </div>
      )}

      {/* Profile Photo */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Profile Photo</h2>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
            {avatarPreview ? (
              <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
            ) : avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <FaUser className="text-2xl text-gray-400" />
            )}
          </div>
          <div className="space-y-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 bg-[#007848] text-white text-sm font-semibold rounded-xl hover:bg-[#005f3a] transition cursor-pointer"
            >
              <FaCamera className="inline mr-1.5 text-xs" /> Choose Photo
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            {avatarPreview && (
              <button
                onClick={handleSaveAvatar}
                disabled={savingName}
                className="block px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition disabled:opacity-50 cursor-pointer"
              >
                {savingName ? "Saving..." : "Save Photo"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Name */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Full Name</h2>
        {editingName ? (
          <div className="flex gap-3">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#007848] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <button onClick={handleSaveName} disabled={savingName}
              className="px-4 py-2 bg-[#007848] text-white text-sm font-semibold rounded-xl hover:bg-[#005f3a] transition disabled:opacity-50 cursor-pointer"
            >{savingName ? "Saving..." : "Save"}</button>
            <button onClick={() => { setEditingName(false); setNewName(name); }}
              className="px-4 py-2 border-2 border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-100 transition cursor-pointer"
            >Cancel</button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{name}</p>
            <button onClick={() => setEditingName(true)}
              className="text-xs font-semibold text-[#007848] hover:text-[#005f3a] transition cursor-pointer"
            >Edit</button>
          </div>
        )}
      </section>

      {/* Account Info */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-3">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Account Information</h2>
        <Row icon={<FaEnvelope />} label="Email" value={email} />
        <Row icon={<FaKey />} label="Role" value={role === "super_admin" ? "Super Admin" : "Staff"} />
        {unitName && <Row icon={<FaUser />} label="Unit" value={unitName} />}
        {positionName && <Row icon={<FaUser />} label="Position" value={positionName} />}
        <Row icon={<FaUser />} label="Member since" value={formatDate(createdAt)} />
      </section>

      {/* Change Email */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">Change Email</h2>
          {!showEmailForm && (
            <button onClick={() => setShowEmailForm(true)}
              className="text-xs font-semibold text-[#007848] hover:text-[#005f3a] transition cursor-pointer"
            >Change</button>
          )}
        </div>
        {showEmailForm && (
          <div className="space-y-4">
            {error && <p className="text-sm text-red-600">{error}</p>}
            {emailStep === "form" ? (
              <>
                <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} type="email" placeholder="New email address"
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#007848] bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                <div className="flex gap-3">
                  <button onClick={handleSendEmailOtp} disabled={sendingEmailOtp}
                    className="px-4 py-2 bg-[#007848] text-white text-sm font-semibold rounded-xl hover:bg-[#005f3a] transition disabled:opacity-50 cursor-pointer"
                  >{sendingEmailOtp ? "Sending..." : "Send OTP"}</button>
                  <button onClick={() => { setShowEmailForm(false); setError(""); }}
                    className="px-4 py-2 border-2 border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-100 transition cursor-pointer"
                  >Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500">A verification code was sent to your current email. Enter it below.</p>
                <input value={emailOtp} onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} type="text" inputMode="numeric" maxLength={6} placeholder="000000"
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#007848] bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono tracking-widest text-center text-lg" />
                <div className="flex gap-3">
                  <button onClick={handleSaveEmail} disabled={savingEmail || emailOtp.length !== 6}
                    className="px-4 py-2 bg-[#007848] text-white text-sm font-semibold rounded-xl hover:bg-[#005f3a] transition disabled:opacity-50 cursor-pointer"
                  >{savingEmail ? "Verifying..." : "Verify & Update"}</button>
                  <button onClick={() => { setEmailStep("form"); setEmailOtp(""); setError(""); }}
                    className="px-4 py-2 border-2 border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-100 transition cursor-pointer"
                  >Back</button>
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* Change Password */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">Change Password</h2>
          {!showPasswordForm && (
            <button onClick={() => setShowPasswordForm(true)}
              className="text-xs font-semibold text-[#007848] hover:text-[#005f3a] transition cursor-pointer"
            >Change</button>
          )}
        </div>
        {showPasswordForm && (
          <div className="space-y-4">
            {error && <p className="text-sm text-red-600">{error}</p>}
            {passwordStep === "form" ? (
              <>
                <input value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type="password" placeholder="Current password"
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#007848] bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="New password (min. 8 characters)"
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#007848] bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm new password"
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#007848] bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                <div className="flex gap-3">
                  <button onClick={handleSendPasswordOtp} disabled={sendingPasswordOtp}
                    className="px-4 py-2 bg-[#007848] text-white text-sm font-semibold rounded-xl hover:bg-[#005f3a] transition disabled:opacity-50 cursor-pointer"
                  >{sendingPasswordOtp ? "Sending..." : "Send OTP"}</button>
                  <button onClick={() => { setShowPasswordForm(false); setError(""); }}
                    className="px-4 py-2 border-2 border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-100 transition cursor-pointer"
                  >Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500">A verification code was sent to your email. Enter it below.</p>
                <input value={passwordOtp} onChange={(e) => setPasswordOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} type="text" inputMode="numeric" maxLength={6} placeholder="000000"
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#007848] bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono tracking-widest text-center text-lg" />
                <div className="flex gap-3">
                  <button onClick={handleSavePassword} disabled={savingPassword || passwordOtp.length !== 6}
                    className="px-4 py-2 bg-[#007848] text-white text-sm font-semibold rounded-xl hover:bg-[#005f3a] transition disabled:opacity-50 cursor-pointer"
                  >{savingPassword ? "Verifying..." : "Verify & Update"}</button>
                  <button onClick={() => { setPasswordStep("form"); setPasswordOtp(""); setError(""); }}
                    className="px-4 py-2 border-2 border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-100 transition cursor-pointer"
                  >Back</button>
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="font-medium text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
