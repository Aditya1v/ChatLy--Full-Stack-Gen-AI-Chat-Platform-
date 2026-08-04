import { useEffect, useState } from "react";
import { AuthContext } from "./auth-store";
import { api } from "../services/apiClient";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    api
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setCheckingSession(false));
  }, []);

  const register = async ({ name, email, password }) => {
    setAuthError("");
    try {
      const newUser = await api.register({ name, email, password });
      setUser(newUser);
      return true;
    } catch (err) {
      setAuthError(err.message);
      return false;
    }
  };

  const login = async ({ email, password }) => {
    setAuthError("");
    try {
      const loggedIn = await api.login({ email, password });
      setUser(loggedIn);
      return true;
    } catch (err) {
      setAuthError(err.message);
      return false;
    }
  };

  const logout = async () => {
    await api.logout().catch(() => {});
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, checkingSession, authError, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
