import { createContext, useContext, useState, type ReactNode } from "react";
import {
  login as loginApi,
  logout as logoutApi,
  decodeToken,
  type LoginPayload,
} from "../api/auth";

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
  username: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const existingToken = localStorage.getItem("access_token");
  const initialDecoded = existingToken ? decodeToken(existingToken) : null;

  const [role, setRole] = useState<string | null>(initialDecoded?.role ?? null);
  const [username, setUsername] = useState<string | null>(
    initialDecoded?.username ?? null,
  );

  const login = async (payload: LoginPayload) => {
    const { access, refresh } = await loginApi(payload);
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    const decoded = decodeToken(access);
    setRole(decoded.role);
    setUsername(decoded.username);
  };

  const logout = async () => {
    const refresh = localStorage.getItem("refresh_token");

    if (refresh) {
      try {
        await logoutApi(refresh);
      } catch {
        // Token may already be expired/invalid — proceed with local
        // cleanup regardless so the user isn't stuck "logged in" on the UI.
      }
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setRole(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!role, role, username, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
