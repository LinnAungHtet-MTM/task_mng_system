import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Select,
  Table,
  Row,
  Col,
  Input,
  Space,
  Button,
  Modal,
  InputNumber,
} from "antd";
import {
  EyeOutlined,
  FileAddOutlined,
  PlusOutlined,
  DeleteOutlined,
  CloseCircleFilled,
  CheckCircleFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { employee, noti, report, task } from "../../services/httpServices";
import { commonConstants } from "../../constants/message";
import { socket } from "../../components/Noti/socket";
import "./CreateReport.css";

const CreateReport = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(1);
  const [requireError, setRequireError] = useState([]);
  const [admin, setAdmin] = useState("");
  const [feeling, setFeeling] = useState("");
  const [dialogMsg, setDialogMsg] = useState("");
  const [profile, setProfile] = useState("");
  const [hour, setHour] = useState(false);
  const [taskDatas, setTaskData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginUser, setLoginUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const employeeApi = await employee.getAll();
        const employeeList = employeeApi.data.data.map((employee) => employee);
        const taskApi = await task.getAll();
        const taskData = taskApi.data.data.map((task) => task);
        setLoading(false);
        setTaskData(taskData);
        setEmployeeData(employeeList);
      } catch (err) {
        if (err.code === "ERR_NETWORK") {
          showReport(true);
          setDialogMsg(commonConstants.Network_Err);
        }
      }
    };
    fetchApi();
  }, [showReport]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const { userId } = JSON.parse(user);
    employee.getById(userId).then((res) => {
      setLoginUser(res.data.data.employeeName),
        setProfile(res.data.data.profile);
    });
  }, []);

  const taskOption = taskDatas.map((task, index) => ({
    value: task._id,
    label: index + 1,
  }));

  const statusItem = [
    { value: "Open", label: "Open" },
    { value: "In progress", label: "In Progress" },
    { value: "Finished", label: "Finished" },
    { value: "Closed", label: "Closed" },
  ];

  const typeItem = [
    { value: "CD", label: "CD" },
    { value: "Test", label: "Test" },
    { value: "Review", label: "Review" },
    { value: "BugFix", label: "BugFix" },
    { value: "Learn", label: "Learn" },
    { value: "Meeting", label: "Meeting" },
  ];

  const employeeUser = employeeData.filter((data) => data.position === "0");

  const employeeOption = employeeUser.map((item) => ({
    value: item.employeeName,
    label: item.employeeName,
  }));

  const addBtn = () => {
    const newData = {
      key: count,
      id: `${count}`,
      title: ``,
      project: ``,
      percentage: ``,
      type: ``,
      status: ``,
      hr: ``,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const removeBtn = (key) => {
    const newData = dataSource.filter((data) => data.key !== key);
    setDataSource(newData);
  };

  const reportHandler = async (value, report) => {
    const dataRow = dataSource.find((row) => row.key === report.key);
    const findValue = taskDatas.find((task) => task._id === value);
    if (findValue) {
      dataRow.title = findValue.title;
      dataRow.project = findValue.project_name.projectName;
    }
    const newDataSource = dataSource.map((data) =>
      data.key === dataRow.key ? dataRow : data
    );
    setDataSource(newDataSource);
  };

  const handleInputChange = (value, field, key) => {
    const newData = [...dataSource];
    const target = newData.find((data) => data.key === key);
    if (target) {
      target[field] = value;
      setDataSource(newData);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: "5%",
    },
    {
      title: (
        <span>
          Task ID
          <span className="report-required">*</span>
        </span>
      ),
      dataIndex: "task_id",
      width: "8%",
      render: (_, record) => {
        return (
          <Form>
            <Form.Item
              name="task_id"
              validateStatus={getError(record, "task_id") ? "error" : "success"}
              help={getError(record, "task_id")}
            >
              <Select
                placeholder="Select Task ID"
                onChange={(e) => {
                  reportHandler(e, record);
                  handleInputChange(e, "task_id", record.key);
                  removeError(record.key, "task_id");
                }}
                style={{
                  width: 126,
                }}
                options={taskOption}
              />
            </Form.Item>
          </Form>
        );
      },
    },
    {
      title: "Task Title",
      dataIndex: "title",
      render: (_, record) => {
        return (
          <Form.Item>
            <Input disabled value={record.title ? record.title : ""} />
          </Form.Item>
        );
      },
    },
    {
      title: "Project",
      dataIndex: "project",
      render: (_, record) => {
        return (
          <Form.Item>
            <Input disabled value={record.project ? record.project : ""} />
          </Form.Item>
        );
      },
    },
    {
      title: (
        <span>
          Percentage
          <span className="report-required">*</span>
        </span>
      ),
      dataIndex: "percentage",
      render: (text, record) => {
        return (
          <Form>
            <Form.Item
              validateStatus={
                getError(record, "percentage") ? "error" : "success"
              }
              help={getError(record, "percentage")}
              name="percentage"
            >
              <InputNumber
                value={text}
                onChange={(value) => {
                  handleInputChange(value, "percentage", record.key);
                  removeError(record.key, "percentage");
                }}
                style={{
                  width: 156,
                }}
                addonAfter="%"
              />
            </Form.Item>
          </Form>
        );
      },
    },
    {
      title: (
        <span>
          Type
          <span className="report-required">*</span>
        </span>
      ),
      dataIndex: "type",
      render: (text, record) => {
        return (
          <Form>
            <Form.Item
              validateStatus={getError(record, "type") ? "error" : "success"}
              help={getError(record, "type")}
              name="type"
            >
              <Select
                placeholder="Types"
                onChange={(value) => {
                  handleInputChange(value, "type", record.key);
                  removeError(record.key, "type");
                }}
                value={text}
                style={{
                  width: 140,
                }}
                options={typeItem}
              />
            </Form.Item>
          </Form>
        );
      },
    },
    {
      title: (
        <span>
          Status
          <span className="report-required">*</span>
        </span>
      ),
      dataIndex: "status",
      render: (text, record) => {
        return (
          <Form>
            <Form.Item
              validateStatus={getError(record, "status") ? "error" : "success"}
              help={getError(record, "status")}
              name="status"
            >
              <Select
                placeholder="Status"
                value={text}
                style={{
                  width: 140,
                }}
                onChange={(value) => {
                  handleInputChange(value, "status", record.key);
                  removeError(record.key, "status");
                }}
                options={statusItem}
              />
            </Form.Item>
          </Form>
        );
      },
    },
    {
      title: (
        <span>
          Hour
          <span className="report-required">*</span>
        </span>
      ),
      dataIndex: "hr",
      render: (text, record) => {
        return (
          <Form>
            <Form.Item
              name="hr"
              validateStatus={getError(record, "hr") ? "error" : "success"}
              help={getError(record, "hr")}
            >
              <InputNumber
                value={text}
                onChange={(value) => {
                  handleInputChange(value, "hr", record.key);
                  removeError(record.key, "hr");
                }}
                addonAfter="hr"
              />
            </Form.Item>
          </Form>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => {
        return (
          <>
            <Space>
              <Button
                onClick={() => removeBtn(record.key)}
                type="primary"
                danger
                icon={<DeleteOutlined />}
              >
                Remove
              </Button>
            </Space>
          </>
        );
      },
    },
  ];

  const getError = (record, value) => {
    const error = requireError.find(
      (item) => item.key === record.key && item.field === value
    );
    return error ? error.message : "";
  };

  const removeError = (key, value) => {
    const error = requireError.find(
      (item) => item.key === key && item.field === value
    );
    if (error) {
      const findIndex = requireError.indexOf(error);
      if (findIndex > -1) {
        requireError.splice(findIndex, 1);
      }
    }
  };

  const reportBtn = async (data) => {
    let totalHour = 0;
    data.map((item) => {
      const hour = Number(item.hr);
      totalHour += hour;
    });
    const errorData = [];
    data.map((item) => {
      if (!item.task_id) {
        errorData.push({
          key: item.key,
          field: "task_id",
          message: commonConstants.Require_Task,
        });
      }
      if (!item.percentage) {
        errorData.push({
          key: item.key,
          field: "percentage",
          message: commonConstants.Require_Percentage,
        });
      }
      if (item.percentage < 0) {
        errorData.push({
          key: item.key,
          field: "percentage",
          message: commonConstants.Validate_Min_Percentage,
        });
      }
      if (item.percentage > 100) {
        errorData.push({
          key: item.key,
          field: "percentage",
          message: commonConstants.Validate_Max_Percentage,
        });
      }
      if (!item.type) {
        errorData.push({
          key: item.key,
          field: "type",
          message: commonConstants.Require_Type,
        });
      }
      if (!item.status) {
        errorData.push({
          key: item.key,
          field: "status",
          message: commonConstants.Require_Status,
        });
      }
      if (item.hr === "") {
        errorData.push({
          key: item.key,
          field: "hr",
          message: commonConstants.Require_Hour,
        });
      }
      if (!admin) {
        errorData.push({ key: item.key, field: "reportTo" });
      }
      if (item.hr < 0) {
        errorData.push({
          key: item.key,
          field: "hr",
          message: commonConstants.Validate_Min_Hr,
        });
      }
    });
    if (totalHour > 8) {
      setDialogMsg(commonConstants.Validate_TotalHr);
      setHour(true);
      setShowReport(true);
      return;
    }
    if (totalHour < 8) {
      setDialogMsg(commonConstants.TotalHr_fill);
      setHour(true);
      setShowReport(true);
      return;
    }
    if (totalHour === 8) {
      setHour(false);
    }
    if (dataSource.length === 0) {
      setDialogMsg(commonConstants.Report_created_fail);
    }
    if (dataSource.length > 0) {
      setDialogMsg(commonConstants.Report_created_success);
    }
    if (errorData.length > 0) {
      return setRequireError(errorData);
    }
    if (errorData.length === 0) {
      setShowReport(true);
    }
    const payload = dataSource.map((report) => {
      return {
        task_id: report.task_id,
        title: report.title,
        project: report.project,
        percentage: report.percentage,
        type: report.type,
        status: report.status,
        hr: report.hr,
        problem: feeling,
        report_to: admin,
        report_by: loginUser ? loginUser : "",
      };
    });
    report.add(payload).then(() => {
      const user = localStorage.getItem("user");
      const { userId } = JSON.parse(user);
      const data = payload.map((report) => {
        return {
          project: report.project,
          title: report.title,
          report_by: report.report_by,
          profile: profile,
          userId,
          reportToUserName: admin,
          // status: "report",
        };
      });
      noti.add(data);
      socket.emit("reportCreate", data);
    });
    setLoading(false);
  };

  return (
    <>
      <Form style={{ padding: "15px", marginTop: "30px", marginLeft: "20px" }}>
        <Row
          gutter={[16, 16]}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Col xl={8} lg={8} md={10} sm={12} xs={24}>
            <Form.Item
              name="reportTo"
              label={
                <span>
                  Report To
                  <span className="report-required">*</span>
                </span>
              }
              validateStatus={
                requireError.find((error) => error.field === "reportTo")
                  ? "error"
                  : ""
              }
              help={
                requireError.find((error) => error.field === "reportTo")
                  ? "Please select admin"
                  : ""
              }
            >
              <Select
                onChange={(e) => {
                  if (e) {
                    setAdmin(e);
                    removeError(e, "reportTo");
                  }
                }}
                placeholder="Select Admin"
                options={employeeOption}
              />
            </Form.Item>
          </Col>
          <Col xl={2} lg={4} md={4} sm={4} xs={24}>
            <Button
              onClick={addBtn}
              type="primary"
              block
              icon={<PlusOutlined />}
            >
              Add
            </Button>
          </Col>
        </Row>
      </Form>
      <div className="report-table">
        <Table
          style={{ margin: "20px 0", padding: "0 15px" }}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 1300 }}
        />
      </div>
      <Form style={{ padding: "0 15px" }}>
        <Col span={24}>
          <Form.Item name="problem">
            <Input.TextArea
              placeholder="problem/feeling"
              onChange={(e) => setFeeling(e.target.value)}
              style={{ width: 300, marginLeft: "20px", marginTop: "35px" }}
              rows={4}
            />
          </Form.Item>
        </Col>
        <Col span={24} className="btn-box">
          <Space
            size="middle"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Button
              type="primary"
              onClick={() => setModalOpen(true)}
              style={{ backgroundColor: "#21e6c1", color: "#fff" }}
              icon={<EyeOutlined />}
            >
              Preview
            </Button>
            <Modal
              title="Report Preview"
              open={modalOpen}
              width={450}
              onOk={() => setModalOpen(false)}
              onCancel={() => setModalOpen(false)}
              footer={[
                <Button key="OK" onClick={() => setModalOpen(false)}>
                  Close
                </Button>,
              ]}
            >
              <br />
              <p>
                Report To :
                <strong>{admin ? " " + admin : " No admin Selected"}</strong>
              </p>
              <p>
                Date :<strong> {dayjs(new Date()).format("YYYY-MM-DD")}</strong>
              </p>
              <p>
                Projects :
                {dataSource.map((data, index) => (
                  <span key={index}>
                    <strong> {data.project},</strong>
                  </span>
                ))}
              </p>
              <p>【実績】</p>
              {dataSource.map((data, index) => (
                <p key={index}>
                  <strong>{`${data.title},`}</strong>
                  <strong>{`<${data.percentage}%>,`}</strong>
                  <strong>{`<${data.type}>,`}</strong>
                  <strong>{`<${data.status}>,`}</strong>
                  <strong>{`<${data.hr}hr>`}</strong>
                </p>
              ))}
              <p>【実績】</p>
              <p>
                - <strong>{feeling ? feeling : "Nothing"}</strong>
              </p>
            </Modal>
            <Button
              onClick={() => reportBtn(dataSource)}
              type="primary"
              icon={<FileAddOutlined />}
            >
              Report
            </Button>
          </Space>
        </Col>
        <Modal
          title={
            <span style={{ fontSize: "25px" }}>
              {dataSource.length === 0 || hour ? "Error" : "Success"}
            </span>
          }
          open={showReport}
          onCancel={() => setShowReport(false)}
          onOk={() => setShowReport(false)}
          centered
          width={350}
          style={{ textAlign: "center" }}
          footer={[
            <Button
              key="OK"
              onClick={() => {
                setShowReport(false);
                dataSource.length === 0 || hour ? "" : navigate("/report/list");
              }}
            >
              OK
            </Button>,
          ]}
        >
          <div
            style={{
              textAlign: "center",
              fontSize: "30px",
              color: `${dataSource.length === 0 || hour ? "red" : "green"}`,
            }}
          >
            {dataSource.length === 0 || hour ? (
              <CloseCircleFilled />
            ) : (
              <CheckCircleFilled />
            )}
          </div>
          <p
            style={{
              textAlign: "center",
              color: `${dataSource.length === 0 || hour ? "red" : "green"}`,
            }}
          >
            {dialogMsg}
          </p>
        </Modal>
      </Form>
    </>
  );
};

export default CreateReport;
