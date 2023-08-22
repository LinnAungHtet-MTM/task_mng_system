import { useState } from "react";
import { Form, Input, Button, Typography, message, Modal } from "antd";
import { CloseCircleFilled, UserOutlined } from "@ant-design/icons";
import { commonConstants } from "../../constants/message";
import useAuth from "../../hooks/useAuth";
import "./ForgetPassword.css";

const { Title } = Typography;

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const { forgetPasswordApi } = useAuth();
  const [open, setOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");

  const handleSubmit = (values) => {
    setLoading(true);
    forgetPasswordApi(values)
      .then((res) => {
        setLoading(false);
        message.success(res.data.message);
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
      <Form className="forget-form" onFinish={handleSubmit}>
        <Title className="forget-title" level={3}>
          Forget Password
        </Title>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
              className="forget-input"
              prefix={<UserOutlined />}
              placeholder="Enter your email address"
            />
          </Form.Item>
          <Button
            loading={loading}
            className="forget-btn"
            htmlType="submit"
            type="primary"
          >
            Send
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

export default ForgetPassword;
