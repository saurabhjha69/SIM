import { createContext, useState, useEffect,type ReactNode } from "react";
import API from "../../api/axios";
import { getToken,clearToken } from "../../utils/storage";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (data: any) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login : async () =>{},
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data);
    } catch {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (getToken()) fetchProfile();
    else setLoading(false);
  }, []);

  const login = async (data: any) => {
    const res = await API.post("/auth/login", data);
    // console.log("data")
    localStorage.setItem("token", res.data.token);
    await fetchProfile();
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
