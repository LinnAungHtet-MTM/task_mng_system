import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Divider,
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Button,
  Select,
  InputNumber,
  message,
  Modal,
  Spin,
} from "antd";
import {
  RollbackOutlined,
  SaveOutlined,
  EditOutlined,
  OrderedListOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import jwt from "jwt-decode";
import { employee, project, task, taskNoti } from "../../services/httpServices";
import { commonConstants } from "../../constants/message";
import "./CommonTask.css";
import { socket } from "../../components/Noti/socket";

const CommonTask = () => {
  const [selectProject, setSelectProject] = useState(null);
  const [selectEmployee, setSelectEmployee] = useState(null);
  const [open, setOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [editId, setEditId] = useState(false);
  const [taskCreate, setTaskCreate] = useState("");
  const [profile, setProfile] = useState("");
  const [gettingData, setGettingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { pathname } = useLocation();

  const user = localStorage.getItem("user");
  const loginUser = JSON.parse(user);
  const userType = jwt(loginUser.token);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const { userId } = JSON.parse(user);
    employee.getById(userId).then((res) => {
      setProfile(res.data.data.profile);
      setTaskCreate(res.data.data.employeeName);
    });
  }, []);

  useEffect(() => {
    if (id) {
      task
        .getById(id)
        .then((res) => {
          form.setFieldsValue({
            project_name: res.data.data.project_name._id,
            assigned_employee: res.data.data.assigned_employee._id,
            title: res.data.data.title,
            description: res.data.data.description,
            estimate_hour: res.data.data.estimate_hour,
            actual_hour: res.data.data.actual_hour,
            status: res.data.data.status,
            estimate_start_date: res.data.data.estimate_start_date
              ? dayjs(res.data.data.estimate_start_date)
              : null,
            estimate_finish_date: res.data.data.estimate_finish_date
              ? dayjs(res.data.data.estimate_finish_date)
              : null,
            actual_start_date: res.data.data.actual_start_date
              ? dayjs(res.data.data.actual_start_date)
              : null,
            actual_finish_date: res.data.data.actual_finish_date
              ? dayjs(res.data.data.actual_finish_date)
              : null,
          });
          setGettingData(false);
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
    } else {
      form.resetFields();
    }
    const fetchData = async () => {
      try {
        const projectApi = await project.getAll();
        const employeeApi = await employee.getAll();
        setSelectProject(
          projectApi.data.data.map((project) => ({
            value: project._id,
            label: project.projectName,
          }))
        );
        setSelectEmployee(
          employeeApi.data.data.map((employee) => ({
            value: employee._id,
            label: employee.employeeName,
          }))
        );
      } catch (err) {
        if (err.code === "ERR_NETWORK") {
          setOpen(true);
          setDialogMsg(commonConstants.Network_Err);
        }
      }
    };
    fetchData();
  }, [form, id]);

  const endDateVaildate =
    (date) =>
    ({ getFieldValue }) => ({
      validator(_, value) {
        return new Promise((resolve, reject) => {
          const dates = getFieldValue(date);
          const startDate = dayjs(dates).format("YYYY-MM-DD");
          const endDate = dayjs(value).format("YYYY-MM-DD");
          if (!endDate || !startDate) {
            resolve();
          } else if (startDate && endDate) {
            if (endDate < startDate) {
              reject(new Error(commonConstants.Date_Validate));
            } else {
              resolve();
            }
          }
        });
      },
    });

  const handleSubmit = (values) => {
    setLoading(true);
    const payload = {
      ...values,
      estimate_start_date: values.estimate_start_date
        ? dayjs(values.estimate_start_date).format("YYYY-MM-DD")
        : null,
      estimate_finish_date: values.estimate_finish_date
        ? dayjs(values.estimate_finish_date).format("YYYY-MM-DD")
        : null,
      actual_start_date: values.actual_start_date
        ? dayjs(values.actual_start_date).format("YYYY-MM-DD")
        : null,
      actual_finish_date: values.actual_finish_date
        ? dayjs(values.actual_finish_date).format("YYYY-MM-DD")
        : null,
    };
    if (id) {
      setIsDisabled(true);
      task
        .edit(id, payload)
        .then(() => {
          const user = localStorage.getItem("user");
          const { userId } = JSON.parse(user);
          const data = {
            title: payload.title,
            assignEmployeeId: payload.assigned_employee,
            taskCreated: taskCreate ? taskCreate : "",
            profile,
            userId,
          };
          taskNoti.add(data);
          socket.emit("taskUpdate", data);
          setLoading(false);
          message.success("Task Updated Successfully");
          setIsDisabled(false);
          navigate("/task/list");
        })
        .catch((err) => {
          if (err.code === "ERR_NETWORK") {
            setOpen(true);
            setDialogMsg(commonConstants.Network_Err);
          }
        });
    } else {
      setIsDisabled(true);
      task
        .add(payload)
        .then(() => {
          const user = localStorage.getItem("user");
          const { userId } = JSON.parse(user);
          const data = {
            title: payload.title,
            assignEmployeeId: payload.assigned_employee,
            taskCreated: taskCreate ? taskCreate : "",
            profile,
            userId,
          };
          taskNoti.add(data);
          socket.emit("taskCreate", data);
          setLoading(false);
          message.success("Task Created Successfully");
          setIsDisabled(false);
          navigate("/task/list");
        })
        .catch((err) => {
          if (err.code === "ERR_NETWORK") {
            setOpen(true);
            setDialogMsg(commonConstants.Network_Err);
          }
        });
    }
  };

  const selectOption = [
    { value: "0", label: "Opened" },
    { value: "1", label: "In progress" },
    { value: "2", label: "Finished" },
    {
      value: "3",
      label: "Closed",
      disabled: userType.type === "Member" || userType.type === "1",
    },
  ];

  return (
    <>
      <div className="create-task">
        <Spin spinning={gettingData && !pathname.includes("add")}>
          <Typography.Title className="task-title" level={4}>
            {id ? <EditOutlined /> : <OrderedListOutlined />}
            {id ? " Task Edit" : " New Task"}
          </Typography.Title>
          <Divider />
          <Form
            form={form}
            initialValues={{ status: "Opened" }}
            style={{ padding: "20px" }}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  label={
                    <span>
                      Project
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                    </span>
                  }
                  justify="space-between"
                  name="project_name"
                  rules={[
                    {
                      required: true,
                      message: commonConstants.Require_Task_Project,
                    },
                  ]}
                >
                  <Select
                    disabled={
                      (userType.type === "Member" || userType.type === "1") &&
                      id
                    }
                    style={{ width: "100%" }}
                    placeholder="Select project"
                    options={selectProject}
                  />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  label={
                    <span>
                      Assign Employee
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                    </span>
                  }
                  justify="space-between"
                  name="assigned_employee"
                  rules={[
                    {
                      required: true,
                      message: commonConstants.Require_Task_employee,
                    },
                  ]}
                >
                  <Select
                    disabled={
                      (userType.type === "Member" || userType.type === "1") &&
                      id
                    }
                    options={selectEmployee}
                    placeholder="Select Employee"
                  />
                </Form.Item>
              </Col>
              <Col
                xl={id ? 12 : 24}
                lg={id ? 12 : 24}
                md={id ? 12 : 24}
                sm={24}
                xs={24}
              >
                <Form.Item
                  label={
                    <span>
                      Title
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                    </span>
                  }
                  justify="space-between"
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: commonConstants.Require_Task_Title,
                    },
                  ]}
                >
                  <Input
                    disabled={
                      (userType.type === "Member" || userType.type === "1") &&
                      id
                    }
                    style={{ width: "100%" }}
                    placeholder="Enter title"
                  />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                {id && (
                  <Form.Item
                    label={
                      <span>
                        Status
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                      </span>
                    }
                    justify="space-between"
                    name="status"
                    rules={[
                      {
                        required: true,
                        message: commonConstants.Require_Task_Status,
                      },
                    ]}
                  >
                    <Select options={selectOption} />
                  </Form.Item>
                )}
              </Col>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <Form.Item
                  label={
                    <span>
                      Description
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                    </span>
                  }
                  justify="space-between"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: commonConstants.Require_Task_description,
                    },
                  ]}
                >
                  <Input.TextArea
                    disabled={
                      (userType.type === "Member" || userType.type === "1") &&
                      id
                    }
                    placeholder="Enter Description"
                  />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                {id && (
                  <Form.Item
                    label={
                      <span>
                        Actual Hour
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          *
                        </span>
                      </span>
                    }
                    justify="space-between"
                    name="actual_hour"
                    rules={[
                      {
                        required: true,
                        message: commonConstants.Require_actual_hr,
                      },
                      {
                        pattern: commonConstants.Hour_Regex,
                        message: commonConstants.Validate_Hour,
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="Actual hour"
                    />
                  </Form.Item>
                )}
              </Col>
              <Col
                xl={id ? 12 : 24}
                lg={id ? 12 : 24}
                md={id ? 12 : 24}
                sm={24}
                xs={24}
              >
                <Form.Item
                  label={
                    <span>
                      Estimate Hour
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                    </span>
                  }
                  justify="space-between"
                  name="estimate_hour"
                  rules={[
                    {
                      required: true,
                      message: commonConstants.Require_estimate_hr,
                    },
                    {
                      pattern: commonConstants.Hour_Regex,
                      message: commonConstants.Validate_Hour,
                    },
                  ]}
                >
                  <InputNumber
                    disabled={
                      (userType.type === "Member" || userType.type === "1") &&
                      id
                    }
                    style={{ width: "100%" }}
                    placeholder="Estimate hour"
                  />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  label={<span>Estimate Start</span>}
                  justify="space-between"
                  name="estimate_start_date"
                >
                  <DatePicker
                    disabled={
                      (userType.type === "Member" || userType.type === "1") &&
                      id
                    }
                    style={{ width: "100%" }}
                    placeholder="yyyy-mm-dd"
                  />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  dependencies={["estimate_start_date"]}
                  label={<span>Estimate Finish</span>}
                  justify="space-between"
                  name="estimate_finish_date"
                  rules={[endDateVaildate("estimate_start_date")]}
                >
                  <DatePicker
                    disabled={
                      (userType.type === "Member" || userType.type === "1") &&
                      id
                    }
                    style={{ width: "100%" }}
                    placeholder="yyyy-mm-dd"
                  />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                {id && (
                  <Form.Item
                    label={<span>Actual Start</span>}
                    justify="space-between"
                    name="actual_start_date"
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder="yyyy-mm-dd"
                    />
                  </Form.Item>
                )}
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                {id && (
                  <Form.Item
                    label={<span>Actual Finish</span>}
                    justify="space-between"
                    name="actual_finish_date"
                    rules={[endDateVaildate("actual_start_date")]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder="yyyy-mm-dd"
                    />
                  </Form.Item>
                )}
              </Col>
            </Row>
            <Row justify={"center"} gutter={[16, 16]}>
              <Col>
                <Button
                  onClick={() => navigate("/task/list")}
                  type="primary"
                  danger
                  icon={<RollbackOutlined />}
                >
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button
                  disabled={isDisabled}
                  type="primary"
                  loading={loading}
                  htmlType="submit"
                  icon={<SaveOutlined />}
                >
                  {id ? "Update" : "Save"}
                </Button>
              </Col>
            </Row>
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
                  editId && navigate("/task/list");
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
        </Spin>
      </div>
    </>
  );
};

export default CommonTask;
