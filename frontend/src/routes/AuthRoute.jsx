import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthRoute = () => {
  const user = localStorage.getItem("user");
  const { pathname } = useLocation();

  if (user && pathname === "/") {
    return <Navigate to="/dashboard" />;
  }
  return <Outlet />;
};

export default AuthRoute;
