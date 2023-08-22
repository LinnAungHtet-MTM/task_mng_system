import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Form, Input, Button, Col, message, Modal } from "antd";
import {
  UserOutlined,
  LockOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import { employee } from "../../services/httpServices";
import { commonConstants } from "../../constants/message";
import useAuth from "../../hooks/useAuth";
import "./ChangePassword.css";

const { Title } = Typography;

const ChangePassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");

  const { changePasswordApi } = useAuth();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const { userId } = JSON.parse(user);
      employee.getById(userId).then((res) => {
        form.setFieldsValue({
          email: res.data.data.email,
        });
      });
    }
  }, [form]);

  const onFinish = (payload) => {
    setLoading(true);
    changePasswordApi(payload)
      .then(() => {
        message.success("Changed Password Successfully");
        setLoading(false);
        navigate("/dashboard");
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          setOpen(true);
          setDialogMsg(err.response.data.message);
          setLoading(false);
        } else if (err.code === "ERR_NETWORK") {
          setLoading(false);
          setOpen(true);
          setDialogMsg(commonConstants.Network_Err);
        }
      });
  };

  const validateNewPassword = ({ getFieldValue }) => ({
    validator(_, newPassword) {
      return new Promise((resolve, reject) => {
        const oldPassword = getFieldValue("oldPassword");
        if (newPassword && oldPassword) {
          if (newPassword === oldPassword) {
            reject(new Error(commonConstants.Check_OldPassword));
          }
          resolve();
        } else {
          resolve();
        }
      });
    },
  });

  const validateConfirmPassword = ({ getFieldValue }) => ({
    validator(_, confirmPassword) {
      return new Promise((resolve, reject) => {
        const newPassword = getFieldValue("newPassword");
        if (newPassword && confirmPassword) {
          if (newPassword !== confirmPassword) {
            reject(new Error(commonConstants.Check_ConfirmPassword));
          }
          resolve();
        } else {
          resolve();
        }
      });
    },
  });

  return (
    <>
      <Form form={form} onFinish={onFinish} className="change-password-form">
        <Title level={3} className="change-password-title">
          Change Password
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
            <Input
              disabled
              prefix={<UserOutlined />}
              placeholder="Enter your email address"
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="oldPassword"
            rules={[
              { required: true, message: commonConstants.Validate_OldPassword },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your old password"
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: commonConstants.Validate_NewPassword },
              {
                pattern: commonConstants.Password_Regex,
                message: commonConstants.Validate_Password,
              },
              validateNewPassword,
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
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button loading={loading} block type="primary" htmlType="submit">
            Change
          </Button>
        </div>
      </Form>
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
    </>
  );
};

export default ChangePassword;
