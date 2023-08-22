import { Outlet } from "react-router-dom";
import jwt from "jwt-decode";

const AdminRoute = () => {
  const user = localStorage.getItem("user");
  const { token } = JSON.parse(user);
  const admin = jwt(token);
  if (admin.type !== "0") {
    throw new Error("You are not authorized");
  }
  return <Outlet />;
};

export default AdminRoute;
