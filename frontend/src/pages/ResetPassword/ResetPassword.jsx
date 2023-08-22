import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Form, Input, Button, Col, message, Modal } from "antd";
import { CloseCircleFilled, LockOutlined } from "@ant-design/icons";
import { commonConstants } from "../../constants/message";
import useAuth from "../../hooks/useAuth";
import "./ResetPassword.css";

const { Title } = Typography;

const ResetPassword = () => {
  const { resetPasswordApi } = useAuth();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (value) => {
    setLoading(true);
    resetPasswordApi(id, value)
      .then((res) => {
        setLoading(false);
        message.success(res.data.message);
        navigate("/");
      })
      .catch((err) => {
        if (err.code === "ERR_NETWORK") {
          setOpen(true);
          setDialogMsg(commonConstants.Network_Err);
        }
      });
  };

  const validateConfirmPassword = ({ getFieldValue }) => ({
    validator(_, confirmPassword) {
      return new Promise((resolve, reject) => {
        const newPassword = getFieldValue("newPassword");
        if (newPassword && confirmPassword) {
          if (newPassword !== confirmPassword) {
            reject(new Error(commonConstants.Check_ConfirmPassword));
          } else {
            resolve();
          }
        }
      });
    },
  });

  return (
    <>
      <Form className="reset-password-form" onFinish={handleSubmit}>
        <Title level={3} className="reset-password-title">
          Reset Password
        </Title>
        <Col>
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: commonConstants.Validate_NewPassword },
              {
                pattern: commonConstants.Password_Regex,
                message: commonConstants.Validate_Password,
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your new password"
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: commonConstants.Validate_ConfirmPassword,
              },
              validateConfirmPassword,
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your confirm password"
            />
          </Form.Item>
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
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button loading={loading} block type="primary" htmlType="submit">
            Change
          </Button>
        </div>
      </Form>
    </>
  );
};

export default ResetPassword;
