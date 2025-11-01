import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    async signIn(email: string, password: string): Promise<void> {
      await signInWithEmailAndPassword(auth, email, password);
    },
    async signUp(email: string, password: string): Promise<void> {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      try { await updateProfile(cred.user, { displayName: email.split("@")[0] }); } catch {}
      await setDoc(
        doc(db, "users", cred.user.uid),
        {
          uid: cred.user.uid,
          email,
          displayName: cred.user.displayName ?? email.split("@")[0],
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    },
    async signOut() {
      await fbSignOut(auth);
    },
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
