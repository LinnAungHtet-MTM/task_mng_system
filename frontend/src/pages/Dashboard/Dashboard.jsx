/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  Table,
  Space,
  Button,
  Tag,
  Modal,
} from "antd";
import {
  UsergroupAddOutlined,
  FundProjectionScreenOutlined,
  OrderedListOutlined,
  MailOutlined,
  EditOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import jwt from "jwt-decode";
import { employee, project, report, task } from "../../services/httpServices";
import { appContext, verifyContext } from "../../constants/appContext";
import { commonConstants } from "../../constants/message";
import "./Dashboard.css";

const Dashboard = () => {
  const { setCurrentMenuItem } = useContext(appContext);
  const [filterData, setFilterData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { setVerifyPage } = useContext(verifyContext);

  const pageSize = 5;

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      align: "center",
      width: "2%",
      render: (_, __, index) => {
        const adjustedIndex = (currentPage - 1) * pageSize + index + 1;
        return adjustedIndex;
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      align: "center",
      width: "6%",
    },
    {
      title: "Description",
      dataIndex: "description",
      align: "center",
      width: "8%",
      key: 1,
    },
    {
      title: "Project Name",
      dataIndex: "project_name",
      align: "center",
      width: "8%",
      key: 2,
    },
    {
      title: "Assigned Employee",
      dataIndex: "assigned_employee",
      align: "center",
      width: "11%",
      key: 3,
    },
    {
      title: "Estimate Hour",
      dataIndex: "estimate_hour",
      align: "center",
      width: "4%",
      key: 4,
    },
    {
      title: "Actual Hour",
      dataIndex: "actual_hour",
      align: "center",
      width: "4%",
      key: 5,
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      key: 6,
      width: "5%",
      render: (status) => {
        let color = "";
        let statusText = "";
        if (status === "0") {
          color = "blue";
          statusText = "Open";
        } else if (status === "1") {
          color = "yellow";
          statusText = "In progress";
        } else if (status === "2") {
          color = "green";
          statusText = "Finished";
        } else if (status === "3") {
          color = "red";
          statusText = "Close";
        }
        return (
          <Tag style={{ minWidth: 70, textAlign: "center" }} color={color}>
            {statusText}
          </Tag>
        );
      },
    },
    {
      title: "Estimate Start Date",
      dataIndex: "estimate_start_date",
      align: "center",
      width: "8%",
      key: 7,
    },
    {
      title: "Estimate Finish Date",
      dataIndex: "estimate_finish_date",
      align: "center",
      width: "8%",
      key: 8,
    },
    {
      title: "Actual Start Date",
      dataIndex: "actual_start_date",
      align: "center",
      width: "8%",
      key: 9,
    },
    {
      title: "Actual Finish Date",
      dataIndex: "actual_finish_date",
      align: "center",
      width: "8%",
      key: 10,
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <Link to={`/task/edit/${record._id}`}>
          <Space>
            <Button type="primary" icon={<EditOutlined />}>
              Edit
            </Button>
          </Space>
        </Link>
      ),
    },
  ];

  const user = localStorage.getItem("user");
  const { token } = JSON.parse(user);
  const admin = jwt(token);

  useEffect(() => {
    setVerifyPage(false);
    employee.getAll().then((res) => setEmployeeData(res.data.data));
    project.getAll().then((res) => setProjectData(res.data.data));
    report.getAll().then((res) => setReportData(res.data.data));
    task
      .getAll()
      .then((res) => {
        if (admin.type === "0") {
          const tasks = res.data.data.map((task) => {
            return {
              ...task,
              key: task._id,
              project_name: task.project_name.projectName,
              assigned_employee: task.assigned_employee.employeeName,
              estimate_start_date: task.estimate_start_date
                ? task.estimate_start_date
                : "-",
              estimate_finish_date: task.estimate_finish_date
                ? task.estimate_finish_date
                : "-",
              actual_start_date: task.actual_start_date
                ? task.actual_start_date
                : "-",
              actual_finish_date: task.actual_finish_date
                ? task.actual_finish_date
                : "-",
            };
          });
          setLoading(false);
          setTaskData(tasks);
          setFilterData(tasks);
        } else {
          const tasks = res.data.data.filter(
            (data) => data.assigned_employee._id === admin.userId
          );
          const taskData = tasks.map((task) => {
            return {
              ...task,
              key: task._id,
              project_name: task.project_name.projectName,
              assigned_employee: task.assigned_employee.employeeName,
              estimate_start_date: task.estimate_start_date
                ? task.estimate_start_date
                : "-",
              estimate_finish_date: task.estimate_finish_date
                ? task.estimate_finish_date
                : "-",
              actual_start_date: task.actual_start_date
                ? task.actual_start_date
                : "-",
              actual_finish_date: task.actual_finish_date
                ? task.actual_finish_date
                : "-",
            };
          });
          setLoading(false);
          setTaskData(taskData);
          setFilterData(taskData);
        }
      })
      .catch((err) => {
        if (err.code === "ERR_NETWORK") {
          setOpen(true);
          setDialogMsg(commonConstants.Network_Err);
        }
      });
  }, []);

  const handleInput = (path) => {
    setCurrentMenuItem(path);
  };

  useEffect(() => {
    const filterStatus = taskData.filter((data) => data.status !== "3");
    setFilterData(filterStatus);
  }, [taskData]);

  return (
    <>
      <div className="dashboard">
        <Row style={{ padding: "15px" }} gutter={[16, 16]}>
          <Col span={24}>
            <Row gutter={[16, 16]} justify="center">
              {admin.type === "0" && (
                <>
                  <Col xl={6} lg={6} md={6} sm={12} xs={24}>
                    <Link
                      to="/employee/list"
                      onClick={() => handleInput("/employee/list")}
                    >
                      <Card className="card-box first-card">
                        <UsergroupAddOutlined className="card-icon" />
                        <p className="card-text">Employees</p>
                        <p style={{ fontSize: "18px" }}>
                          <Tag className="custom-tag">
                            {employeeData.length}
                          </Tag>
                        </p>
                      </Card>
                    </Link>
                  </Col>
                  <Col xl={6} lg={6} md={6} sm={12} xs={24}>
                    <Link
                      to="/project/list"
                      onClick={() => handleInput("/project/list")}
                    >
                      <Card className="card-box second-card">
                        <FundProjectionScreenOutlined className="card-icon" />
                        <p className="card-text">Projects</p>
                        <p style={{ fontSize: "18px" }}>
                          <Tag className="custom-tag">{projectData.length}</Tag>
                        </p>
                      </Card>
                    </Link>
                  </Col>
                </>
              )}
              <Col
                xl={admin.type === "0" ? 6 : 8}
                lg={admin.type === "0" ? 6 : 8}
                md={admin.type === "0" ? 6 : 12}
                sm={12}
                xs={24}
              >
                <Link to="/task/list" onClick={() => handleInput("/task/list")}>
                  <Card className="card-box third-card">
                    <OrderedListOutlined className="card-icon" />
                    <p className="card-text">Tasks</p>
                    <p style={{ fontSize: "18px", marginLeft: "10px" }}>
                      <Tag className="custom-tag">{taskData.length}</Tag>
                    </p>
                  </Card>
                </Link>
              </Col>
              <Col
                xl={admin.type === "0" ? 6 : 8}
                lg={admin.type === "0" ? 6 : 8}
                md={admin.type === "0" ? 6 : 12}
                sm={12}
                xs={24}
              >
                <Link
                  to="/report/list"
                  onClick={() => handleInput("/report/list")}
                >
                  <Card className="card-box fourth-card">
                    <MailOutlined className="card-icon" />
                    <p className="card-text">Report</p>
                    <p style={{ fontSize: "18px", marginLeft: "10px" }}>
                      <Tag className="custom-tag">{reportData.length}</Tag>
                    </p>
                  </Card>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
        <Col span={24} style={{ margin: "30px 0" }}>
          <Typography.Title level={3} align="center">
            Top Not Closed Task
          </Typography.Title>
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
            <Button key="back" onClick={() => setOpen(false)}>
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
        <Table
          style={{ padding: "15px" }}
          columns={columns}
          loading={loading}
          dataSource={filterData}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            onChange: (page) => setCurrentPage(page),
          }}
          scroll={{
            x: 1300,
          }}
        />
        <Col span={24} align="center" style={{ margin: "15px 0" }}>
          <Link to="/task/list">
            <Button
              type="primary"
              style={{ background: "var(--success-color)" }}
            >
              View More Tasks
            </Button>
          </Link>
        </Col>
      </div>
    </>
  );
};

export default Dashboard;
