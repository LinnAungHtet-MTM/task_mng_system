/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  Input,
  Space,
  Button,
  Select,
  Table,
  Tag,
  Modal,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  CloseOutlined,
  CloseCircleFilled,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import TaskDownload from "./TaskDownload";
import { employee, project, task } from "../../services/httpServices";
import jwt from "jwt-decode";
import { commonConstants } from "../../constants/message";
import "./TaskList.css";

const TaskList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [taskList, setTaskList] = useState([]);
  const [filter, setFilter] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  const statusOption = [
    { value: "0", label: "Opened" },
    { value: "1", label: "In progress" },
    { value: "2", label: "Finished" },
    { value: "3", label: "Closed" },
    { value: "4", label: "All" },
  ];

  useEffect(() => {
    const taskApiData = async () => {
      try {
        const user = localStorage.getItem("user");
        const { token } = JSON.parse(user);
        const admin = jwt(token);
        const taskListApi = await task.getAll();
        const projectApi = await project.getAll();
        const employeeApi = await employee.getAll();
        if (admin.type === "0") {
          const taskData = taskListApi.data.data.map((task, index) => {
            return {
              ...task,
              key: task._id,
              num: task._id.length + index - 23,
              project_name: projectApi.data.data.filter(
                (project) => project._id === task.project_name._id
              )[0].projectName,
              assigned_employee: employeeApi.data.data.filter(
                (employee) => employee._id === task.assigned_employee._id
              )[0].employeeName,
              status: statusOption.find(
                (option) => option.value === task.status
              ).value,
              estimate_start_date: task.estimate_start_date
                ? dayjs(task.estimate_start_date).format("YYYY-MM-DD")
                : "-",
              estimate_finish_date: task.estimate_finish_date
                ? dayjs(task.estimate_finish_date).format("YYYY-MM-DD")
                : "-",
              actual_start_date: task.actual_start_date
                ? dayjs(task.actual_start_date).format("YYYY-MM-DD")
                : "-",
              actual_finish_date: task.actual_finish_date
                ? dayjs(task.actual_finish_date).format("YYYY-MM-DD")
                : "-",
            };
          });
          setTaskList(taskData);
          setFilter(taskData);
        } else {
          const memberTask = taskListApi.data.data.filter(
            (task) => task.assigned_employee._id === admin.userId
          );
          const taskData = memberTask.map((task, index) => {
            return {
              ...task,
              key: task._id,
              num: task._id.length + index - 23,
              project_name: projectApi.data.data.filter(
                (project) => project._id === task.project_name._id
              )[0].projectName,
              assigned_employee: employeeApi.data.data.filter(
                (employee) => employee._id === task.assigned_employee._id
              )[0].employeeName,
              status: statusOption.find(
                (option) => option.value === task.status
              ).value,
              estimate_start_date: task.estimate_start_date
                ? dayjs(task.estimate_start_date).format("YYYY-MM-DD")
                : "-",
              estimate_finish_date: task.estimate_finish_date
                ? dayjs(task.estimate_finish_date).format("YYYY-MM-DD")
                : "-",
              actual_start_date: task.actual_start_date
                ? dayjs(task.actual_start_date).format("YYYY-MM-DD")
                : "-",
              actual_finish_date: task.actual_finish_date
                ? dayjs(task.actual_finish_date).format("YYYY-MM-DD")
                : "-",
            };
          });
          setTaskList(taskData);
          setFilter(taskData);
        }
        setLoading(false);
      } catch (err) {
        if (err.code === "ERR_NETWORK") {
          setOpen(true);
          setDialogMsg(commonConstants.Network_Err);
        }
      }
    };
    taskApiData();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "num",
      align: "center",
      width: "3%",
      sorter: {
        compare: (x, y) => x.num - y.num,
      },
    },
    {
      title: "Title",
      width: 200,
      dataIndex: "title",
      align: "center",
      key: 2,
      sorter: {
        compare: (x, y) => x.title.localeCompare(y.title),
      },
    },
    {
      title: "Description",
      width: 200,
      align: "center",
      dataIndex: "description",
      key: 3,
    },
    {
      title: "Project Name",
      width: 200,
      align: "center",
      dataIndex: "project_name",
      key: 4,
      sorter: {
        compare: (x, y) => x.project_name.localeCompare(y.project_name),
      },
    },
    {
      title: "Assigned Employee",
      width: 200,
      align: "center",
      dataIndex: "assigned_employee",
      key: 5,
      sorter: {
        compare: (x, y) =>
          x.assigned_employee.localeCompare(y.assigned_employee),
      },
    },
    {
      title: "Estimate Hour",
      width: 200,
      align: "center",
      dataIndex: "estimate_hour",
      key: 6,
      sorter: {
        compare: (x, y) => x.estimate_hour - y.estimate_hour,
      },
    },
    {
      title: "Actual Hour",
      width: 200,
      align: "center",
      dataIndex: "actual_hour",
      key: 7,
      sorter: {
        compare: (x, y) => x.actual_hour - y.actual_hour,
      },
    },
    {
      title: "Status",
      width: 200,
      align: "center",
      dataIndex: "status",
      key: 8,
      sorter: {
        compare: (x, y) => x.status - y.status,
      },
      render: (status) => {
        let color = "";
        let statusText = "";
        if (status === "0") {
          color = "blue";
          statusText = "Open";
        } else if (status === "1") {
          color = "yellow";
          statusText = "In Progress";
        } else if (status === "2") {
          color = "green";
          statusText = "Finished";
        } else if (status === "3") {
          color = "red";
          statusText = "Close";
        }
        return (
          <Tag color={color} style={{ minWidth: 70, textAlign: "center" }}>
            {statusText}
          </Tag>
        );
      },
    },
    {
      title: "Estimate Start Date",
      width: 200,
      align: "center",
      dataIndex: "estimate_start_date",
      key: 9,
      sorter: {
        compare: (x, y) =>
          x.estimate_start_date.localeCompare(y.estimate_start_date),
      },
    },
    {
      title: "Estimate Finish Date",
      width: 200,
      align: "center",
      dataIndex: "estimate_finish_date",
      key: 10,
      sorter: {
        compare: (x, y) =>
          x.estimate_finish_date.localeCompare(y.estimate_finish_date),
      },
    },
    {
      title: "Actual Start Date",
      width: 200,
      align: "center",
      dataIndex: "actual_start_date",
      key: 11,
      sorter: {
        compare: (x, y) =>
          x.actual_start_date.localeCompare(y.actual_start_date),
      },
    },
    {
      title: "Actual Finish Date",
      width: 200,
      align: "center",
      dataIndex: "actual_finish_date",
      key: 12,
      sorter: {
        compare: (x, y) =>
          x.actual_finish_date.localeCompare(y.actual_finish_date),
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      width: 200,
      key: 13,
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/task/edit/${record._id}`}>
            <Button type="primary" icon={<EditOutlined />}>
              Edit
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  const onSearch = (values) => {
    const { title, project, assigned_member, status } = values;
    const lowerCaseTitle = title?.toLowerCase().trim();
    const lowerCaseProjectName = project?.toLowerCase().trim();
    const lowerCaseAssignedMember = assigned_member?.toLowerCase().trim();

    const filteredResult = taskList.filter((task) => {
      const matchesTitle =
        !title || task.title.toLowerCase().includes(lowerCaseTitle);
      const matchesProject =
        !project ||
        task.project_name.toLowerCase().includes(lowerCaseProjectName);
      const matchesAssignedMember =
        !assigned_member ||
        task.assigned_employee.toLowerCase().includes(lowerCaseAssignedMember);
      const matchesStatus =
        !status || task.status === status || status === "All" || status === "4";

      return (
        matchesTitle && matchesProject && matchesAssignedMember && matchesStatus
      );
    });

    setFilter(filteredResult);
  };

  const onClear = () => {
    setFilter(taskList);
    form.resetFields();
  };

  return (
    <>
      <Form
        initialValues={{ status: "All" }}
        onFinish={onSearch}
        form={form}
        className="task-list-form"
      >
        <Row align="top" gutter={16}>
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <Row gutter={16}>
              <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                <Form.Item name="title">
                  <Input placeholder="Title" />
                </Form.Item>
              </Col>
              <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                <Form.Item name="project">
                  <Input placeholder="Project" />
                </Form.Item>
              </Col>
              <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                <Form.Item name="assigned_member">
                  <Input placeholder="assign-employee" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <Space wrap className="task-space">
              <Space size="middle">
                <Button
                  htmlType="submit"
                  type="primary"
                  icon={<SearchOutlined />}
                >
                  Search
                </Button>
                <Button
                  type="primary"
                  danger
                  icon={<CloseOutlined />}
                  onClick={onClear}
                >
                  Cancel
                </Button>
              </Space>
              <Space size="middle">
                <TaskDownload datas={filter} />
                <Link to="/task/add">
                  <Button type="primary" ghost icon={<PlusOutlined />}>
                    New Task
                  </Button>
                </Link>
              </Space>
            </Space>
          </Col>
        </Row>
        <Space style={{ marginTop: "10px" }}>
          <Form.Item name="status" label="Status">
            <Select style={{ width: 150 }} options={statusOption} />
          </Form.Item>
        </Space>
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
        dataSource={filter}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          onChange: (page) => setCurrentPage(page),
        }}
        scroll={{
          x: 2300,
        }}
      />
    </>
  );
};

export default TaskList;
