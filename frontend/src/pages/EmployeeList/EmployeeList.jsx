import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Form,
  Row,
  Col,
  Input,
  Space,
  Button,
  Table,
  Modal,
  Image,
  message,
  Tag,
} from "antd";
import {
  SearchOutlined,
  CloseOutlined,
  UserAddOutlined,
  DeleteOutlined,
  FileDoneOutlined,
  ExclamationCircleFilled,
  CloseCircleFilled,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { EmployeeNoti, employee, task } from "../../services/httpServices";
import { commonConstants } from "../../constants/message";
import "./EmployeeList.css";
import { socket } from "../../components/Noti/socket";

const { confirm } = Modal;
const visible = false;

const EmployeeList = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [employeeListData, setEmployeeListData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginUserName, setLoginUserName] = useState("");
  const [profile, setProfile] = useState("");

  const user = localStorage.getItem("user");
  const loginUser = JSON.parse(user);

  useEffect(() => {
    const { userId } = JSON.parse(user);
    if (user) {
      employee.getById(userId).then((res) => {
        setLoginUserName(res.data.data.employeeName);
        setProfile(res.data.data.profile);
      });
    }
  }, [user]);

  const columns = [
    {
      title: "ID",
      dataIndex: "num",
      align: "center",
      sorter: {
        compare: (a, b) => a.num - b.num,
      },
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      align: "center",
      sorter: {
        compare: (a, b) => a.employeeName.localeCompare(b.employeeName),
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
    },
    {
      title: "Profile",
      dataIndex: "profile",
      align: "center",
      render: (profile) => {
        return (
          <Image
            style={{ borderRadius: "5px", objectFit: "cover" }}
            preview={visible}
            width={60}
            height={60}
            src={profile}
          />
        );
      },
    },
    {
      title: "Address",
      dataIndex: "address",
      align: "center",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      align: "center",
    },
    {
      title: "Position",
      dataIndex: "position",
      align: "center",
    },
    {
      title: "Date of Birth",
      dataIndex: "DOB",
      align: "center",
      sorter: {
        compare: (a, b) => a.DOB.localeCompare(b.localeCompare),
      },
    },
    {
      title: "Verified",
      dataIndex: "verified",
      align: "center",
      render: (verified) => {
        switch (verified) {
          case true:
            return (
              <Tag
                color="green"
                style={{ minWidth: 80, textAlign: "center", padding: 3 }}
              >
                Verified
              </Tag>
            );
          case false:
            return (
              <Tag
                color="red"
                style={{ minWidth: 80, textAlign: "center", padding: 3 }}
              >
                Not Verified
              </Tag>
            );
        }
      },
    },
    {
      title: "Action",
      align: "center",
      render: (_, record) => {
        return (
          <Space>
            <Link to={`/employee/detail/${record._id}`}>
              <Button
                style={{ background: "var(--success-color)" }}
                icon={<FileDoneOutlined />}
                type="primary"
              >
                Detail
              </Button>
            </Link>
            <Link
              to={
                record.position === "Admin" && record._id !== loginUser.userId
                  ? ""
                  : `/employee/edit/${record._id}`
              }
            >
              <Button
                disabled={
                  record.position === "Admin" && record._id !== loginUser.userId
                }
                icon={<EditOutlined />}
                type="primary"
              >
                Edit
              </Button>
            </Link>
            <Button
              onClick={() => showDeleteConfirm(record)}
              icon={<DeleteOutlined />}
              type="primary"
              danger
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    employee
      .getAll()
      .then((res) => {
        const employeeData = res.data.data.map((data, index) => {
          return {
            ...data,
            key: data._id,
            num: data._id.length + index - 23,
            address: data.address !== "undefined" ? data.address : "-",
            phone: data.phone !== "undefined" ? data.phone : "-",
            DOB:
              data.DOB !== "undefined"
                ? dayjs(data.DOB).format("YYYY-MM-DD")
                : "-",
            position: data.position === "0" ? "Admin" : "Member",
          };
        });
        setLoading(false);
        setFilterData(employeeData);
        setEmployeeListData(employeeData);
      })
      .catch((err) => {
        if (err.code === "ERR_NETWORK") {
          setOpen(true);
          setDialogMsg(commonConstants.Network_Err);
        }
      });
  }, []);

  const showDeleteConfirm = (record) => {
    confirm({
      title: "Are you sure want to delete this employee?",
      centered: true,
      icon: <ExclamationCircleFilled />,
      content: "This action cannot be undone!",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        task.getAll().then((res) => {
          const taskData = res.data.data;
          const index = taskData.findIndex(
            (task) => task.assigned_employee._id === record._id
          );
          if (index === -1) {
            employee
              .delete(record._id)
              .then(() => {
                const employeeData = employeeListData.filter(
                  (data) => data._id !== record._id
                );
                const data = {
                  EmployeeName: record.employeeName,
                  createdBy: loginUserName,
                  profile: profile,
                  type: "deleted",
                  status: "employee",
                  userId: loginUser.userId,
                };
                EmployeeNoti.add(data);
                socket.emit("deleteEmployee", data);
                message.success("Employee Deleted Successfully");
                setLoading(false);
                setFilterData(employeeData);
                setEmployeeListData(employeeData);
              })
              .catch((err) => {
                if (err.code === "ERR_NETWORK") {
                  setOpen(true);
                  setDialogMsg(commonConstants.Network_Err);
                }
              });
          } else {
            setOpen(true);
            setDialogMsg(commonConstants.Employee_Not_Exist);
          }
        });
      },
    });
  };

  const onSearch = () => {
    const formValues = form.getFieldValue();
    const findData = employeeListData.filter((data) => {
      if (formValues.employeeEmail && formValues.employeeName) {
        return (
          data.email
            .toLowerCase()
            .includes(formValues.employeeEmail.toLowerCase().trim()) &&
          data.employeeName
            .toLowerCase()
            .includes(formValues.employeeName.toLowerCase().trim())
        );
      } else if (formValues.employeeEmail) {
        return data.email
          .toLowerCase()
          .includes(formValues.employeeEmail.toLowerCase().trim());
      } else if (formValues.employeeName) {
        return data.employeeName
          .toLowerCase()
          .includes(formValues.employeeName.toLowerCase().trim());
      }
      return true;
    });
    setFilterData(findData);
  };

  const onClear = () => {
    form.resetFields();
    setFilterData(employeeListData);
  };

  return (
    <>
      <Form onFinish={onSearch} form={form} className="employee-form">
        <Row gutter={16}>
          <Col xl={10} lg={10} md={24} sm={24} xs={24}>
            <Row gutter={16}>
              <Col xl={12} lg={12} md={12} sm={12} xs={24}>
                <Form.Item name="employeeName">
                  <Input placeholder="Employee Name" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={12} xs={24}>
                <Form.Item name="employeeEmail">
                  <Input placeholder="Employee Email" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col xl={14} lg={14} md={24} sm={24} xs={24}>
            <Space
              style={{ display: "flex", justifyContent: "space-between" }}
              wrap
              align="center"
            >
              <Space size="middle">
                <Button
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  type="primary"
                >
                  Search
                </Button>
                <Button
                  onClick={onClear}
                  icon={<CloseOutlined />}
                  type="primary"
                  danger
                >
                  Cancel
                </Button>
              </Space>
              <Link to="/employee/add">
                <Button type="primary" ghost icon={<UserAddOutlined />}>
                  New Employee
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
        className="employee-table"
        columns={columns}
        dataSource={filterData}
        loading={loading}
        pagination={{
          pageSize: 5,
        }}
        scroll={{ x: 1200 }}
      />
    </>
  );
};

export default EmployeeList;
