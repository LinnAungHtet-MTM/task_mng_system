import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Space,
  Button,
  Modal,
  Input,
  Row,
  Col,
  Form,
  message,
} from "antd";
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  SearchOutlined,
  CloseOutlined,
  CloseCircleFilled,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  EmployeeNoti,
  employee,
  project,
  task,
} from "../../services/httpServices";
import { commonConstants } from "../../constants/message";
import "./ProjectList.css";
import { socket } from "../../components/Noti/socket";

const { confirm } = Modal;

const ProjectList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [projectLists, setProjectList] = useState([]);
  const [filterProject, setFilterProject] = useState([]);
  const [loginUserName, setLoginUserName] = useState("");
  const [profile, setProfile] = useState("");

  const user = localStorage.getItem("user");
  const { userId } = JSON.parse(user);

  useEffect(() => {
    if (user) {
      employee.getById(userId).then((res) => {
        setLoginUserName(res.data.data.employeeName);
        setProfile(res.data.data.profile);
      });
    }
  }, [userId, user]);

  useEffect(() => {
    const apiData = async () => {
      try {
        const projectList = await project.getAll();
        const projects = projectList.data.data.map((project, index) => {
          return {
            ...project,
            key: project._id,
            num: project._id.length + index - 23,
            description: project.description ? project.description : "-",
          };
        });
        setLoading(false);
        setFilterProject(projects);
        setProjectList(projects);
      } catch (err) {
        if (err.code === "ERR_NETWORK") {
          setOpen(true);
          setDialogMsg(commonConstants.Network_Err);
        }
      }
    };
    apiData();
  }, []);

  const columns = [
    {
      title: "ID",
      width: "5%",
      dataIndex: "num",
      align: "center",
      sorter: {
        compare: (a, b) => a.num - b.num,
      },
    },
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
      align: "center",
      sorter: {
        compare: (x, y) => x.projectName.localeCompare(y.projectName),
      },
    },
    {
      title: "Language",
      dataIndex: "language",
      align: "center",
      key: "1",
      sorter: {
        compare: (x, y) => x.language.localeCompare(y.language),
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      align: "center",
      key: "2",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      align: "center",
      key: "3",
      sorter: {
        compare: (x, y) => x.startDate.localeCompare(y.startDate),
      },
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      align: "center",
      key: "4",
      sorter: {
        compare: (x, y) => x.endDate.localeCompare(y.endDate),
      },
    },
    {
      title: "Action",
      key: "operation",
      align: "center",
      render: (_, record) => (
        <Space>
          <Link to={`/project/edit/${record._id}`}>
            <Button type="primary" icon={<EditOutlined />}>
              Edit
            </Button>
          </Link>
          <Button
            type="primary"
            onClick={() => showDeleteConfirm(record)}
            danger
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const showDeleteConfirm = (record) => {
    confirm({
      title: "Are you sure want to delete this task?",
      icon: <ExclamationCircleFilled />,
      centered: true,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        task.getAll().then((res) => {
          const taskData = res.data.data;
          const index = taskData.findIndex(
            (task) => task.project_name._id === record._id
          );
          if (index === -1) {
            project
              .delete(record._id)
              .then(() => {
                const newProjectData = projectLists.filter(
                  (data) => data._id !== record._id
                );
                const data = {
                  createdBy: loginUserName,
                  userId,
                  profile,
                  status: "project",
                  type: "deleted",
                  project: record.projectName,
                };
                EmployeeNoti.add(data);
                socket.emit("deleteProject", data);
                setLoading(false);
                message.success("Project Deleted Successfully");
                setProjectList(newProjectData);
                setFilterProject(newProjectData);
              })
              .catch((err) => {
                if (err.code === "ERR_NETWORK") {
                  setOpen(true);
                  setDialogMsg(commonConstants.Network_Err);
                }
              });
          } else {
            setOpen(true);
            setDialogMsg(commonConstants.Project_Not_Exist);
          }
        });
      },
    });
  };

  const onSearch = () => {
    const formValues = form.getFieldValue();
    const filterData = projectLists.filter((projectList) => {
      if (formValues.project && formValues.language) {
        return (
          projectList.projectName
            .toLowerCase()
            .includes(formValues.project.toLowerCase().trim()) &&
          projectList.language
            .toLowerCase()
            .includes(formValues.language.toLowerCase().trim())
        );
      } else if (formValues.project) {
        return projectList.projectName
          .toLowerCase()
          .includes(formValues.project.toLowerCase().trim());
      } else if (formValues.language) {
        return projectList.language
          .toLowerCase()
          .includes(formValues.language.toLowerCase().trim());
      }
      return true;
    });
    setFilterProject(filterData);
  };

  const onClear = () => {
    form.resetFields();
    setFilterProject(projectLists);
  };

  return (
    <>
      <Form onFinish={onSearch} form={form} className="projectlist-form">
        <Row align="top" gutter={16}>
          <Col xl={10} lg={10} md={24} sm={24} xs={24}>
            <Row gutter={16}>
              <Col xl={12} lg={12} md={12} sm={12} xs={24}>
                <Form.Item name="project">
                  <Input placeholder="Enter project name" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={12} xs={24}>
                <Form.Item name="language">
                  <Input placeholder="Enter language" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col xl={14} lg={14} md={24} sm={24} xs={24}>
            <Space align="center" wrap className="project-space">
              <Space size="middle">
                <Button
                  htmlType="submit"
                  type="primary"
                  icon={<SearchOutlined />}
                >
                  Search
                </Button>
                <Button
                  onClick={onClear}
                  type="primary"
                  icon={<CloseOutlined />}
                  danger
                >
                  Cancel
                </Button>
              </Space>
              <Link to="/project/add">
                <Button type="primary" ghost icon={<PlusOutlined />}>
                  New Project
                </Button>
              </Link>
            </Space>
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
        className="projectlist-table"
        columns={columns}
        dataSource={filterProject}
        loading={loading}
        scroll={{ x: 1300 }}
        pagination={{
          pageSize: 5,
        }}
      />
    </>
  );
};

export default ProjectList;
