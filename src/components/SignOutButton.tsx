"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { FiLogOut, FiLoader } from "react-icons/fi";

export function SignOutButton({ className = "" }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ redirect: false });
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={className}
    >
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  );
}

export function SignOutIconButton({ className = "" }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ redirect: false });
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <FiLoader className="text-lg animate-spin" />
      ) : (
        <FiLogOut className="text-lg" />
      )}
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  );
}
