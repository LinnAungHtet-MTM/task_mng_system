import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Divider,
  Typography,
  Form,
  Input,
  Upload,
  InputNumber,
  DatePicker,
  Select,
  Row,
  Col,
  Button,
  message,
  Modal,
  Checkbox,
  Spin,
} from "antd";
import {
  EditOutlined,
  FileDoneOutlined,
  UserAddOutlined,
  UserOutlined,
  PlusOutlined,
  RollbackOutlined,
  SaveOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import jwt from "jwt-decode";
import dayjs from "dayjs";
import { EmployeeNoti, employee } from "../../services/httpServices";
import { commonConstants } from "../../constants/message";
import "./EmployeeCommon.css";
import { socket } from "../../components/Noti/socket";

const EmployeeCommon = () => {
  const [locationUrl, setLocationUrl] = useState("");
  const [hideUpload, setHideUpload] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusError, setStatusError] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [gettingData, setGettingData] = useState(true);
  const [loginUserName, setLoginUserName] = useState("");
  const [profile, setProfile] = useState("");
  const [dialogMsg, setDialogMsg] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [editId, setEditId] = useState(false);
  const [userId, setUserId] = useState("");
  const [form] = Form.useForm();
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const selectPosition = [
    { value: "0", label: "Admin" },
    { value: "1", label: "Member" },
  ];

  const getData = useCallback(
    (id) => {
      if (id) {
        employee
          .getById(id)
          .then((res) => {
            form.setFieldsValue({
              employeeName: res.data.data.employeeName,
              email: res.data.data.email,
              profile: res.data.data.profile
                ? [
                    {
                      uid: "-1",
                      name: "image.png",
                      status: "done",
                      url: res.data.data.profile,
                    },
                  ]
                : "",
              address:
                res.data.data.address !== "undefined"
                  ? res.data.data.address
                  : "",
              phone:
                res.data.data.phone !== "undefined" ? res.data.data.phone : "",
              DOB:
                res.data.data.DOB !== "undefined"
                  ? dayjs(res.data.data.DOB)
                  : "",
              position: res.data.data.position,
            });
            setGettingData(false);
            setHideUpload(!hideUpload);
          })
          .catch((err) => {
            setGettingData(false);
            if (err.code === "ERR_NETWORK" || err.response.status === 500) {
              setOpen(true);
              setEditId(true);
              setDialogMsg(
                err.response.status === 500
                  ? err.response.data.message
                  : commonConstants.Network_Err
              );
            }
          });
      }
    },
    [form]
  );

  const user = localStorage.getItem("user");
  const { token } = JSON.parse(user);
  const position = jwt(token);

  useEffect(() => {
    if (user) {
      const { userId } = JSON.parse(user);
      employee.getById(userId).then((res) => {
        setLoginUserName(res.data.data.employeeName);
        setProfile(res.data.data.profile);
      });
    }
  }, [user]);

  useEffect(() => {
    if (location.pathname.includes("/add")) {
      setLocationUrl("add");
      form.resetFields();
    } else if (location.pathname.includes("/edit")) {
      setLocationUrl("edit");
      getData(id);
      setUserId(id);
    } else if (location.pathname.includes("/detail")) {
      setLocationUrl("detail");
      getData(id);
      setUserId(id);
    } else {
      setLocationUrl("profile");
      const user = localStorage.getItem("user");
      const loginUser = JSON.parse(user);
      getData(loginUser.userId);
      setUserId(loginUser.userId);
    }
  }, [location.pathname, id, getData, form]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleUpload = (info) => {
    const imgType = info.file.type;
    const checkType = imgType?.split("/");
    if (info.file.uid === "-1") {
      return;
    }
    if (
      checkType &&
      (checkType[1] === "png" ||
        checkType[1] === "jpg" ||
        checkType[1] === "jpeg")
    ) {
      setHideUpload(!hideUpload);
    } else {
      message.error(`${info.file.name} file upload Failed`);
      form.setFieldsValue({ profile: null });
      return;
    }
  };

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleProfileRemove = () => {
    setHideUpload(false);
    form.setFieldsValue({ profile: null });
  };

  const normalFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const submitHandler = async (values) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("employeeName", values.employeeName);
    formData.append("email", values.email);
    formData.append(
      "profile",
      values.profile?.length ? values.profile[0].url : null
    );
    formData.append("address", values.address || undefined);
    formData.append("phone", values.phone || undefined);
    formData.append("DOB", values.DOB ? dayjs(values.DOB) : undefined);
    formData.append("position", values.position);

    try {
      if (userId) {
        if (values.profile?.length && values.profile[0].url) {
          formData.set("profile", values.profile[0].url);
        } else if (values.profile?.length) {
          formData.set("profile", values.profile[0].originFileObj);
        }
        setIsDisabled(true);
        const loginUser = JSON.parse(user);
        await employee.edit(userId, formData);
        const data = {
          EmployeeName: values.employeeName,
          createdBy: loginUserName,
          profile: profile,
          type: "edited",
          status: "employee",
          userId: loginUser.userId,
        };
        {
          loginUser.userId !== userId && (await EmployeeNoti.add(data));
          socket.emit("editEmployee", data);
        }
        message.success("Employee Updated Successfully ");
        setIsDisabled(false);
        navigate(position.type === "0" ? "/employee/list" : "/profile");
      } else {
        setIsDisabled(true);
        const loginUser = JSON.parse(user);
        await employee.add(formData).then(() => {
          const data = {
            EmployeeName: values.employeeName,
            createdBy: loginUserName,
            profile: profile,
            type: "created",
            status: "employee",
            userId: loginUser.userId,
          };
          EmployeeNoti.add(data);
          socket.emit("createEmployee", data);
          message.success(commonConstants.Employee_Create);
          setIsDisabled(false);
          navigate("/employee/list");
        });
      }
    } catch (err) {
      if (err.code === "ERR_NETWORK" || err?.response?.status === 500) {
        setOpen(true);
        setDialogMsg(commonConstants.Network_Err);
      } else if (err?.response?.status === 400) {
        setOpen(true);
        setDialogMsg(commonConstants.Employee_Exist);
      }
    } finally {
      setLoading(false);
    }
  };

  const validateMaxNumber = (_, value) => {
    const MAX_LENGTH = 10;
    if (value && value.toString().length > MAX_LENGTH) {
      return Promise.reject(`Number should not exceed 11 digits`);
    }
    return Promise.resolve();
  };

  const disabledDate = (current) => {
    const previousYear = dayjs().subtract(1, "years");
    return current && current > previousYear;
  };

  return (
    <div className="employee-create">
      <Spin spinning={gettingData && locationUrl !== "add"}>
        <Typography.Title level={4} className="employee-title">
          {locationUrl === "add" && <UserAddOutlined />}
          {locationUrl === "add" && " New Employee"}
          {locationUrl === "edit" && <EditOutlined />}
          {locationUrl === "edit" && " Edit Employee"}
          {locationUrl === "detail" && <FileDoneOutlined />}
          {locationUrl === "detail" && " Employee Detail"}
          {locationUrl === "profile" && <UserOutlined />}
          {locationUrl === "profile" && " Employee Profile"}
        </Typography.Title>
        <Divider />
        <Form
          form={form}
          style={{ padding: "20px" }}
          labelAlign="left"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 17 }}
          onFinish={submitHandler}
          initialValues={{ position: "Member" }}
        >
          <Form.Item
            label={
              <span>
                Name
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </span>
            }
            justify="space-between"
            name="employeeName"
            rules={[
              {
                required: true,
                message: commonConstants.Require_Employee_Name,
              },
            ]}
          >
            <Input
              disabled={
                (locationUrl === "detail" || locationUrl === "profile") &&
                !isEdit
              }
            />
          </Form.Item>
          <Form.Item
            justify="space-between"
            name="email"
            label={
              <span>
                Email
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </span>
            }
            rules={[
              {
                required: true,
                message: commonConstants.Require_Employee_Email,
              },
              {
                type: "email",
                message: commonConstants.Validate_Email,
              },
            ]}
          >
            <Input
              onChange={() => setStatusError(false)}
              status={statusError ? "error" : ""}
              disabled={
                (locationUrl === "detail" || locationUrl === "profile") &&
                !isEdit
              }
            />
          </Form.Item>
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
                  editId && navigate("/employee/list");
                  setLoading(false);
                  setIsDisabled(false);
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
          <Form.Item
            name="profile"
            valuePropName="fileList"
            justify="space-between"
            label="Profile Photo"
            getValueFromEvent={normalFile}
          >
            <Upload
              disabled={
                (locationUrl === "detail" || locationUrl === "profile") &&
                !isEdit
              }
              accept=".jpg,.png,jpeg"
              listType="picture-card"
              maxCount="1"
              beforeUpload={() => false}
              onChange={handleUpload}
              onRemove={handleProfileRemove}
              onPreview={handlePreview}
            >
              {!hideUpload && (
                <div>
                  <div style={{ marginBottom: "8px" }}>{<PlusOutlined />}</div>
                  Upload
                </div>
              )}
            </Upload>
          </Form.Item>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img
              alt="image"
              style={{
                width: "100%",
              }}
              src={previewImage}
            />
          </Modal>
          <Form.Item name="address" justify="space-between" label="Address">
            <Input.TextArea
              disabled={
                (locationUrl === "detail" || locationUrl === "profile") &&
                !isEdit
              }
              rows={4}
            />
          </Form.Item>
          <Form.Item
            rules={[{ validator: validateMaxNumber }]}
            name="phone"
            justify="space-between"
            label="Phone"
          >
            <InputNumber
              disabled={
                (locationUrl === "detail" || locationUrl === "profile") &&
                !isEdit
              }
              style={{ width: "100%" }}
              min={0}
            />
          </Form.Item>
          <Form.Item name="DOB" justify="space-between" label="DOB">
            <DatePicker
              disabledDate={disabledDate}
              disabled={
                (locationUrl === "detail" || locationUrl === "profile") &&
                !isEdit
              }
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="position"
            justify="space-between"
            label={
              <span>
                Position
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </span>
            }
          >
            <Select
              placeholder="Member"
              disabled={
                ((locationUrl === "detail" || locationUrl === "profile") &&
                  !isEdit) ||
                position.type === "Member" ||
                position.type === "1"
              }
              options={selectPosition}
            />
          </Form.Item>

          <div style={{ display: "flex" }}>
            {locationUrl === "profile" && (
              <Link to="/change-password">ChangePassword?</Link>
            )}
            {locationUrl === "profile" && (
              <Checkbox
                onChange={(e) => setIsEdit(e.target.checked)}
                style={{ marginLeft: "auto", color: "#1677ff" }}
              >
                Is Edit?
              </Checkbox>
            )}
          </div>

          <Row justify="center" gutter={[16, 16]}>
            <Link to={position.type === "0" ? "/employee/list" : "/dashboard"}>
              <Button type="primary" danger icon={<RollbackOutlined />}>
                {locationUrl === "detail" ? "Back" : "Cancel"}
              </Button>
            </Link>
            {locationUrl !== "detail" && locationUrl !== "profile" && (
              <Col>
                <Button
                  disabled={isDisabled}
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  icon={
                    locationUrl === "edit" ? <EditOutlined /> : <SaveOutlined />
                  }
                >
                  {locationUrl === "edit" || locationUrl === "profile"
                    ? "Update"
                    : "Save"}
                </Button>
              </Col>
            )}

            {locationUrl === "profile" &&
              locationUrl !== "detail" &&
              isEdit && (
                <Col>
                  <Button
                    disabled={isDisabled}
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                  >
                    Save
                  </Button>
                </Col>
              )}

            {locationUrl === "profile" &&
              locationUrl !== "detail" &&
              !isEdit && (
                <Col>
                  <Button
                    loading={loading}
                    type="primary"
                    icon={<EditOutlined />}
                  >
                    Update
                  </Button>
                </Col>
              )}
          </Row>
        </Form>
      </Spin>
    </div>
  );
};

export default EmployeeCommon;
