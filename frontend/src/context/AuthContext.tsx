import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ApiError } from "../api/client";
import {
  getMe,
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
} from "../api/auth";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

type AuthStatus = "loading" | "authenticated" | "anonymous";

interface AuthContextValue {
  user: AuthResponse | null;
  status: AuthStatus;
  login: (body: LoginRequest) => Promise<void>;
  register: (body: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Auth state for the UI only — the JWT lives in an HttpOnly cookie (invisible to JS).
// The backend re-verifies every request; this never gates real authorization.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  // Restore the session on mount: the cookie survives a page refresh, the JS state does not.
  useEffect(() => {
    // Guard against setState after unmount (incl. StrictMode's double-invoked effect).
    let active = true;

    getMe()
      .then((me) => {
        if (!active) return;
        setUser(me);
        setStatus("authenticated");
      })
      .catch((err) => {
        if (!active) return;
        // 401 simply means "not logged in"; surface anything else.
        if (!(err instanceof ApiError && err.status === 401)) {
          console.error("Nie udało się odtworzyć sesji:", err);
        }
        setUser(null);
        setStatus("anonymous");
      });

    return () => {
      active = false;
    };
  }, []);

  async function login(body: LoginRequest) {
    const me = await loginApi(body);
    setUser(me);
    setStatus("authenticated");
  }

  async function register(body: RegisterRequest) {
    // Registration does not log the user in (backend sets no cookie), so no state change.
    await registerApi(body);
  }

  async function logout() {
    await logoutApi();
    setUser(null);
    setStatus("anonymous");
  }

  const value: AuthContextValue = { user, status, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth musi być użyty wewnątrz <AuthProvider>");
  }
  return ctx;
}
