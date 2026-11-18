import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api, { setAccessToken, setUnauthorizedHandler } from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(async (callApi = false) => {
    try {
      if (callApi) {
        await api.post("/api/auth/logout");
      }
    } catch (error) {
      // Ignore logout API errors and still clear local auth state.
    }

    setAccessToken("");
    setUser(null);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post("/api/auth/register", payload);
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await clearSession(true);
  }, [clearSession]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession(false);
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [clearSession]);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const { data } = await api.post("/api/auth/refresh");
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch (error) {
        setAccessToken("");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, []);

  const value = useMemo(
    () => ({
      user,
      accessToken: !!user,
      loading,
      login,
      register,
      logout,
      setUser,
    }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
