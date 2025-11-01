import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(mapAuthError(err?.code) || err?.message || "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen py-24 px-6 bg-gradient-to-b from-blue-50 via-green-50 to-teal-50 flex items-center">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white">
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">Welcome back</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">Sign in to NeuraMed</h1>
            <p className="text-slate-600 mt-2">Continue your mindful journey</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-slate-700 font-medium mb-1">Email</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required className="w-full px-4 py-3 rounded-2xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50" />
            </div>
            <div>
              <label htmlFor="password" className="block text-slate-700 font-medium mb-1">Password</label>
              <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required minLength={6} className="w-full px-4 py-3 rounded-2xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full py-3 font-semibold disabled:opacity-60">Login</button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">No account? <Link to="/signup" className="text-emerald-700 font-semibold hover:underline">Create one</Link></p>
        </div>
      </div>
    </section>
  );
}

function mapAuthError(code?: string) {
  switch (code) {
    case "auth/invalid-email": return "Invalid email address.";
    case "auth/user-disabled": return "Account disabled.";
    case "auth/user-not-found": return "No user found with this email.";
    case "auth/wrong-password": return "Incorrect password.";
    default: return undefined;
  }
}