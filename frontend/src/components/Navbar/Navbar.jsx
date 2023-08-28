import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Menu,
  Button,
  Drawer,
  Empty,
  Popover,
  Badge,
  Image,
  Modal,
} from "antd";
import {
  BellOutlined,
  CloseCircleFilled,
  CloseOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import jwt from "jwt-decode";
import {
  EmployeeNoti,
  employee,
  noti,
  taskNoti,
} from "../../services/httpServices";
import { socket } from "../Noti/socket";
import { commonConstants } from "../../constants/message";
import useAuth from "../../hooks/useAuth";
import { menuItems } from "../../constants/navitem";
import logo from "/img/logo.png";
import { appContext, verifyContext } from "../../constants/appContext";
import "./Navbar.css";

const Navbar = () => {
  const { currentMenuItem, setCurrentMenuItem } = useContext(appContext);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginProfile, setLoginProfile] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
  const [notiData, setNotiData] = useState("");
  const [notiCount, setNotiCount] = useState(null);
  const [dialogMsg, setDialogMsg] = useState("");
  const { logoutApi } = useAuth();
  const location = useLocation();

  const user = localStorage.getItem("user");
  const { verifyPage } = useContext(verifyContext);

  useEffect(() => {
    if (user) {
      const { userId } = JSON.parse(user);
      employee.getById(userId).then((res) => {
        setLoginUser(res.data.data.employeeName);
        setLoginProfile(res.data.data.profile);
      });
    }
  }, [user, location]);

  const filterMenu = menuItems.filter((data) => data.position === "Member");

  useEffect(() => {
    if (user) {
      const loggedUser = JSON.parse(user);
      const admin = jwt(loggedUser.token);
      if (admin.type === "1" || admin.type === "Member") {
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }
    }
  }, [user]);

  useEffect(() => {
    setCurrentMenuItem(location.pathname);
  }, [location.pathname, setCurrentMenuItem]);

  const fetchReportNoti = async () => {
    if (user) {
      try {
        const loggedUser = JSON.parse(user);
        const userLogin = await employee.getById(loggedUser.userId);
        const res = await noti.getAll();
        const notifications = res.data.data;

        const filterData = notifications.filter(
          (data) =>
            data.userId !== loggedUser.userId &&
            data.reportToUserName === userLogin.data.data.employeeName &&
            data.unread !== "false"
        );
        return filterData;
      } catch (error) {
        setDialogMsg(commonConstants.Network_Err);
      }
    }
  };

  const fetchTaskNoti = async () => {
    if (user) {
      try {
        const loggedUser = JSON.parse(user);
        const userType = jwt(loggedUser.token);
        const res = await taskNoti.getAll();
        const notifications = res.data.data;

        const filterData = notifications.filter(
          (data) =>
            data.userId !== loggedUser.userId &&
            (data.assignEmployeeId === loggedUser.userId ||
              userType.type === "0") &&
            !data.read.includes(loggedUser.userId)
        );

        return filterData;
      } catch (error) {
        setDialogMsg(commonConstants.Network_Err);
      }
    }
  };

  const fetchEmployeeNoti = async () => {
    if (user) {
      try {
        const loggedUser = JSON.parse(user);
        const userType = jwt(loggedUser.token);
        const res = await EmployeeNoti.getAll();
        const notifications = res.data.data;
        const filterData = notifications.filter(
          (data) =>
            data.userId !== loggedUser.userId &&
            userType.type === "0" &&
            !data.read.includes(loggedUser.userId)
        );
        return filterData;
      } catch (error) {
        setDialogMsg(commonConstants.Network_Err);
      }
    }
  };

  useEffect(() => {
    const updateNotificationData = async () => {
      const reportNotiData = await fetchReportNoti();
      const taskNotiData = await fetchTaskNoti();
      const employeeNotiData = await fetchEmployeeNoti();
      const combinedNotiData = [
        ...reportNotiData,
        ...taskNotiData,
        ...employeeNotiData,
      ];
      setNotiData(combinedNotiData);
      setNotiCount(combinedNotiData.length);
    };

    const handleReportCreate = async () => {
      await updateNotificationData();
    };

    const handleTaskCreate = async () => {
      await updateNotificationData();
    };

    const handleEmployeeCreate = async () => {
      await updateNotificationData();
    };

    socket.on("reportCreate", handleReportCreate);
    socket.on("taskCreate", handleTaskCreate);
    socket.on("taskUpdate", handleTaskCreate);
    socket.on("employeeCreated", handleEmployeeCreate);
    socket.on("employeeEdit", handleEmployeeCreate);
    socket.on("employeeDelete", handleEmployeeCreate);
    socket.on("projectCreate", handleEmployeeCreate);
    socket.on("projectEdit", handleEmployeeCreate);
    socket.on("projectDelete", handleEmployeeCreate);

    return () => {
      socket.off("reportCreate", handleReportCreate);
      socket.off("taskCreate", handleTaskCreate);
      socket.off("taskUpdate", handleTaskCreate);
      socket.off("employeeCreated", handleEmployeeCreate);
      socket.off("employeeEdit", handleEmployeeCreate);
      socket.off("employeeDelete", handleEmployeeCreate);
      socket.off("projectCreate", handleEmployeeCreate);
      socket.off("projectEdit", handleEmployeeCreate);
      socket.off("projectDelete", handleEmployeeCreate);
    };
  }, []);

  useEffect(() => {
    if (user) {
      try {
        const loggedUser = JSON.parse(user);
        const userType = jwt(loggedUser.token);

        Promise.all([taskNoti.getAll(), noti.getAll(), EmployeeNoti.getAll()])
          .then(([taskNotiResponse, notiResponse, employeeNotiResponse]) => {
            const taskNotiData = taskNotiResponse.data.data;
            const notiData = notiResponse.data.data;
            const employeeNotiData = employeeNotiResponse.data.data;

            const filterTaskData = taskNotiData.filter(
              (data) =>
                data.userId !== loggedUser.userId &&
                (data.assignEmployeeId === loggedUser.userId ||
                  userType.type === "0") &&
                !data.read.includes(loggedUser.userId)
            );

            const filterNotiData = notiData.filter(
              (data) =>
                data.userId !== loggedUser.userId &&
                data.reportToUserName === loginUser &&
                data.unread !== "false"
            );

            const filterEmployeeData = employeeNotiData.filter(
              (data) =>
                data.userId !== loggedUser.userId &&
                userType.type === "0" &&
                !data.read.includes(loggedUser.userId)
            );

            setNotiData([
              ...filterTaskData,
              ...filterNotiData,
              ...filterEmployeeData,
            ]);
            setNotiCount(
              filterTaskData.length +
                filterNotiData.length +
                filterEmployeeData.length
            );
          })
          .catch(() => {
            setDialogMsg(commonConstants.Network_Err);
          });
      } catch (error) {
        setDialogMsg(commonConstants.Network_Err);
      }
    }
  }, [loginUser, user]);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const closeIconStyle = {
    position: "absolute",
    top: "21px",
    right: "12px",
  };

  const onclickNotification = (id, notification) => {
    const userLogged = JSON.parse(user);
    setNotiData((prevNotiData) =>
      prevNotiData.filter((noti) => noti._id !== id)
    );
    const payload = {
      unread: false,
    };
    if (notification.status === "task") {
      return taskNoti.edit(id, { read: userLogged.userId });
    } else if (notification.status === "employee") {
      return EmployeeNoti.edit(id, { read: userLogged.userId });
    } else if (notification.status === "project") {
      return EmployeeNoti.edit(id, { read: userLogged.userId });
    } else {
      return noti.edit(id, payload);
    }
  };

  const handleClick = (id, notification) => {
    onclickNotification(id, notification);
  };

  const notificationTypeText = (notification) => {
    if (notification.status === "task") {
      return notification.taskCreated;
    } else if (notification.status === "employee") {
      return notification.createdBy;
    } else if (notification.status === "project") {
      return notification.createdBy;
    } else {
      return notification.report_by;
    }
  };

  const notificationActionText = (notification) => {
    if (notification.status === "task") {
      return "created task title";
    } else if (notification.status === "employee") {
      return `${notification.type} new employee`;
    } else if (notification.status === "project") {
      return `${notification.type} new project`;
    } else {
      return "reported on";
    }
  };

  const notificationMainText = (notification) => {
    if (notification.status === "task") {
      return notification.title;
    } else if (notification.status === "employee") {
      return notification.EmployeeName;
    } else if (notification.status === "project") {
      return notification.project;
    } else {
      return notification.project;
    }
  };

  const content = (
    <div className="popover-content">
      {notiData && notiData.length > 0 ? (
        notiData.map((notification) => (
          <div
            onClick={() => handleClick(notification._id, notification)}
            className={`noti-line noti-bg`}
            key={notification._id}
          >
            <div className="notification-box">
              <Image
                className="noti-image"
                preview={false}
                src={notification.profile}
              />
              <div className="noti-span">
                <span className="noti-name">
                  <i>{notificationTypeText(notification)}</i>
                </span>{" "}
                {notificationActionText(notification)}
                <span className="noti-project">
                  {" "}
                  {notificationMainText(notification)}
                </span>{" "}
                {notification.status !== "task" &&
                notification.status !== "employee" &&
                notification.status !== "project"
                  ? "and"
                  : ""}{" "}
                <span className="noti-title">
                  {notification.status !== "task" &&
                  notification.status !== "employee" &&
                  notification.status !== "project"
                    ? notification.title
                    : ""}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <Empty description="No Notifications" />
      )}
    </div>
  );

  const onClick = (e) => {
    setCurrentMenuItem(e.key);
    setOpen(false);
    navigate(e.key);
  };
  const navigate = useNavigate();

  return (
    <>
      {localStorage.getItem("user") && !verifyPage ? (
        <Row
          justify="space-between"
          align="middle"
          style={{ padding: "18px", backgroundColor: "#fff" }}
        >
          <Col xs={16} sm={12} md={8} lg={3}>
            <Link className="icon-text" to="/dashboard">
              <img src={logo} width={40} alt="" />
              Task Management System
            </Link>
          </Col>
          <Col xs={0} sm={0} md={10} lg={14}>
            <Menu
              className="menu_items"
              onClick={onClick}
              selectedKeys={[currentMenuItem]}
              mode="horizontal"
              items={isAdmin ? menuItems : filterMenu}
            />
          </Col>
          <Col xs={8} sm={12} md={6} lg={6}>
            <div className="nav_btn_gps">
              <div className="admin_profile_btn">
                <Button onClick={() => navigate("/profile")}>
                  <p className="truncate">{loginUser}</p>
                </Button>
              </div>
              <div className="noti_btn">
                <Popover content={content} trigger="click">
                  <Badge count={notiCount}>
                    <Button
                      onClick={() => setNotiCount(null)}
                      icon={<BellOutlined />}
                    />
                  </Badge>
                </Popover>
              </div>
              <div className="logout-btn">
                <Button onClick={logoutApi} icon={<LogoutOutlined />}>
                  Log Out
                </Button>
              </div>

              <div>
                <Button onClick={showDrawer} className="hamburger_menu">
                  <MenuOutlined />
                </Button>
              </div>
            </div>
          </Col>

          <Drawer
            width={320}
            className="drawer-btn"
            title="Task Management System"
            placement="right"
            closable={true}
            onClose={onClose}
            closeIcon={<CloseOutlined style={closeIconStyle} />}
            open={open}
          >
            <div
              className="admin-profile"
              onClick={() => {
                navigate("/profile"), setOpen(false);
              }}
            >
              <Image
                preview={false}
                className="login-profile"
                src={loginProfile ? loginProfile : ""}
              />
              <span
                style={{
                  marginLeft: "20px",
                  fontSize: "17px",
                  cursor: "pointer",
                }}
              >
                {loginUser}
              </span>
            </div>
            <Menu
              onClick={onClick}
              selectedKeys={[currentMenuItem]}
              mode="inline"
              items={isAdmin ? menuItems : filterMenu}
              style={{ width: "100%" }}
            />
            <Button
              onClick={() => {
                logoutApi(), setOpen(false);
              }}
              block
              style={{ marginTop: ".8rem" }}
            >
              <LogoutOutlined /> Log out
            </Button>
          </Drawer>
          <Modal
            centered
            width={350}
            open={modalOpen}
            title="Error"
            className="employee-errorbox"
            style={{ textAlign: "center" }}
            onOk={() => setModalOpen(false)}
            onCancel={() => setModalOpen(false)}
            footer={[
              <Button
                key="back"
                onClick={() => {
                  setModalOpen(false);
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
        </Row>
      ) : (
        <Row
          justify="space-between"
          align="middle"
          style={{ padding: "18px", backgroundColor: "#fff" }}
        >
          <Col xs={12} sm={12} md={12} lg={12}>
            <Link to="/" style={{ color: "#08979c", fontWeight: "bold" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src={logo} width={40} alt="" />
                Task Management System
              </div>
            </Link>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Navbar;
