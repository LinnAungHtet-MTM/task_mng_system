import { authClient } from "./apiClient";

class LoginService {
  login(payload) {
    return authClient.post("/login", payload);
  }

  changePassword(payload) {
    return authClient.post("/change-password", payload);
  }

  forgetPassword(payload) {
    return authClient.post("/forget-password", payload);
  }

  resetPassword(id, payload) {
    return authClient.post("/reset-password/" + id, payload);
  }

  verify(token) {
    return authClient.post("/verify/" + token);
  }
}

const loginService = new LoginService();

export default loginService;
