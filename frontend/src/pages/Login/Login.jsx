import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Typography, Button, Col, message, Modal } from "antd";
import {
  UserOutlined,
  LockOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import { commonConstants } from "../../constants/message";
import useAuth from "../../hooks/useAuth";
import "./Login.css";
const { Title } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const { loginApi } = useAuth();
  const navigate = useNavigate();

  const onFinish = (payload) => {
    setLoading(true);
    loginApi(payload)
      .then(() => {
        message.success("Login Successfully");
        setLoading(false);
        navigate("/dashboard");
      })
      .catch((err) => {
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 404)
        ) {
          setOpen(true);
          setDialogMsg(err.response.data.message);
          setLoading(false);
        } else if (err.code === "ERR_NETWORK") {
          setOpen(true);
          setDialogMsg(commonConstants.Network_Err);
        }
      });
  };

  return (
    <>
      <Form onFinish={onFinish} form={form} className="login-form">
        <Title level={3} className="login-title">
          Login To Your Account
        </Title>
        <Col>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: commonConstants.Require_Email },
              {
                type: "email",
                message: commonConstants.Validate_Email,
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter your email" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: commonConstants.Require_Password },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
            />
          </Form.Item>
        </Col>
        <Col style={{ display: "flex", justifyContent: "end" }}>
          <Link to="/forget-password">Forget Password?</Link>
        </Col>
        <Modal
          centered
          width={350}
          open={open}
          title="Error"
          className="employee-errorbox"
          style={{ textAlign: "center" }}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          footer={[
            <Button
              key="back"
              onClick={() => {
                setOpen(false);
                setLoading(false);
              }}
            >
              OK
            </Button>,
          ]}
        >
          <div
            style={{
              fontSize: "30px",
              color: "red",
            }}
          >
            <CloseCircleFilled />
          </div>
          <p
            style={{
              color: "red",
            }}
          >
            {dialogMsg}
          </p>
        </Modal>
        <div style={{ marginTop: "20px" }}>
          <Button loading={loading} type="primary" block htmlType="submit">
            Login
          </Button>
        </div>
      </Form>
    </>
  );
};

export default Login;
