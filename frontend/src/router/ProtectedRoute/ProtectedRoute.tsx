import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../../context/AuthContext/AuthContext";

export default function ProtectedRoute({ children }: any) {
  const auth = useContext(AuthContext);
  if (!auth?.user && !auth?.loading) return <Navigate to="/login" replace />;
  return children;
}
