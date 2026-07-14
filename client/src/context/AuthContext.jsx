import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // On app load, check if we already have a token and fetch the user's profile
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const res = await API.get("/auth/profile");
          setUser(res.data);
        } catch (error) {
          // Token invalid/expired — clear it
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser(res.data);
  };

  const register = async (name, email, password) => {
    const res = await API.post("/auth/register", { name, email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser(res.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook so components can just call useAuth() instead of useContext(AuthContext)
export const useAuth = () => useContext(AuthContext);