"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseAuth";
import { isAdminEmail } from "@/lib/constants";

export function useAuthGuard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const redirected = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email ?? "" });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Derived state — never setState inside an effect body (react-hooks v7
  // `set-state-in-effect` rule).
  const status = loading
    ? "loading"
    : !user
      ? "unauthenticated"
      : isAdminEmail(user.email)
        ? "authorized"
        : "unauthorized";

  useEffect(() => {
    if (loading || redirected.current) return;

    if (!user) {
      redirected.current = true;
      navigate("/admin/login", {
        replace: true,
        state: { reason: "signed-out" },
      });
      return;
    }

    if (!isAdminEmail(user.email)) {
      // Signed in as the wrong account: revoke the session, then bounce.
      redirected.current = true;
      signOut(auth).catch(() => {});
      navigate("/admin/login", {
        replace: true,
        state: { reason: "not-admin", email: user.email },
      });
    }
  }, [loading, user, navigate]);

  return { user, loading, status, isAdmin: status === "authorized" };
}
