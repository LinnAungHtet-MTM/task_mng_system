import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Result } from "antd";
import loginService from "../../services/loginService";
import { verifyContext } from "../../constants/appContext";

const VerifyAccount = () => {
  const navigate = useNavigate();
  const [useParams] = useSearchParams();
  const { setVerifyPage } = useContext(verifyContext);
  const token = useParams.get("token");

  useEffect(() => {
    setVerifyPage(true);
    loginService.verify(token);
  }, [token]);

  return (
    <>
      <Result
        status="success"
        title="Account Verification Successfully!"
        extra={[
          <Button type="primary" key="redirect" onClick={() => navigate("/")}>
            Go to Login Page
          </Button>,
        ]}
      />
    </>
  );
};

export default VerifyAccount;
