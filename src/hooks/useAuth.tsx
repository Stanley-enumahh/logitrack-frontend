import { createContext, useContext, useState, type ReactNode } from "react";
import { login as loginApi, decodeToken, type LoginPayload } from "../api/auth";

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
  username: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
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

  const logout = () => {
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
