import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { motion } from "framer-motion";

export default function Navbar() {
  const auth = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    auth?.logout();
    navigate("/login");
  };

  if (!auth?.user) return null;

  return (
    <motion.nav
      className="w-full bg-night border-b border-white/10 backdrop-blur flex items-center justify-between px-6 py-3 sticky top-0 z-40"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex gap-[4vw]">
        <div className="wrapper flex items-center gap-2">

          <div className="w-8 h-8 rounded-full bg-gradientApp" />
          <span className="font-semibold text-white">Simple Web App</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-white/80">
          <Link
            to="/dashboard"
            className={
              location.pathname === "/dashboard"
                ? "text-coral font-semibold"
                : "hover:text-white"
            }
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className={
              location.pathname === "/profile"
                ? "text-coral font-semibold"
                : "hover:text-white"
            }
          >
            Profile
          </Link>

        </div>
      </div>

      <button
        onClick={logout}
        className="px-5 py-2 text-coral rounded-lg border border-coral hover:bg-black/10"
      >
        Logout
      </button>
    </motion.nav>
  );
}
