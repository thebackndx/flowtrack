import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api/axios";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.get("/auth/me"); // you need this endpoint
        setIsAuth(true);
      } catch (e) {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <p className="p-4">Checking auth...</p>;

  if (!isAuth) return <Navigate to="/login" />;

  return children;
}