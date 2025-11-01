import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await signUp(email.trim(), password);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(mapAuthError(err?.code) || err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "8vh auto", background: "#fff", padding: 28, borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
      <h1 style={{ marginTop: 0 }}>Create account</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required style={inputStyle} />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" required minLength={6} style={inputStyle} />
        <label htmlFor="confirm">Confirm password</label>
        <input id="confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" required minLength={6} style={inputStyle} />
        <button type="submit" disabled={loading} style={btnStyle}>Sign up</button>
        {error && <p style={{ color: "#b91c1c", fontSize: 13 }}>{error}</p>}
      </form>
      <p style={{ fontSize: 13, color: "#666" }}>Already have an account? <Link to="/login">Sign in</Link></p>
    </div>
  );
}

const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1px solid #dcdfe4", borderRadius: 8, margin: "6px 0 12px" };
const btnStyle: React.CSSProperties = { width: "100%", marginTop: 4, padding: 12, background: "#10b981", color: "#fff", border: 0, borderRadius: 8, fontWeight: 600, cursor: "pointer" };

function mapAuthError(code?: string) {
  switch (code) {
    case "auth/email-already-in-use": return "Email already in use.";
    case "auth/invalid-email": return "Invalid email address.";
    case "auth/operation-not-allowed": return "Email/password accounts are not enabled.";
    case "auth/weak-password": return "Password is too weak (min 6 chars).";
    default: return undefined;
  }
}