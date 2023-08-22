import { useNavigate } from "react-router-dom";
import loginService from "../services/loginService";

const useAuth = () => {
  const navigate = useNavigate();

  const loginApi = (payload) => {
    return loginService.login(payload).then((res) => {
      const user = {
        token: res.data.token,
        userId: res.data.userId,
      };
      localStorage.setItem("user", JSON.stringify(user));
    });
  };

  const logoutApi = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const forgetPasswordApi = (payload) => {
    return loginService.forgetPassword(payload);
  };

  const resetPasswordApi = (id, payload) => {
    return loginService.resetPassword(id, payload);
  };

  const changePasswordApi = (payload) => {
    return loginService.changePassword(payload);
  };
  return {
    loginApi,
    logoutApi,
    changePasswordApi,
    forgetPasswordApi,
    resetPasswordApi,
  };
};

export default useAuth;
