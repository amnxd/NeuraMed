import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function AuthNav() {
  const { user, loading, signOut } = useAuth();
  if (loading) return null;

  if (user) {
    const name = user.displayName || user.email || "User";
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 14 }}>Hi, {name}</span>
        <button onClick={signOut} style={btnSecondary}>Sign out</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Link to="/login" style={linkStyle}>Login</Link>
      <Link to="/signup" style={btnPrimary}>Sign up</Link>
    </div>
  );
}

const linkStyle: React.CSSProperties = { color: "#1f2937", textDecoration: "none", fontWeight: 500 };
const btnPrimary: React.CSSProperties = { background: "#3b82f6", color: "#fff", padding: "8px 12px", borderRadius: 8, textDecoration: "none", fontWeight: 600 };
const btnSecondary: React.CSSProperties = { background: "#e5e7eb", color: "#111827", padding: "6px 10px", borderRadius: 8, border: 0, fontWeight: 600, cursor: "pointer" };