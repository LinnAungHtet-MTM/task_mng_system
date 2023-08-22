import {
  UserAddOutlined,
  UsergroupAddOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  ReconciliationOutlined,
  IdcardOutlined,
  FundProjectionScreenOutlined,
  UserOutlined,
  ProfileOutlined,
  CarryOutOutlined,
  FolderAddOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

export const menuItems = [
  {
    label: "Dashboard",
    key: "/dashboard",
    icon: <BarChartOutlined />,
    desktop: "true",
    position: "Member",
  },
  {
    label: "Employee",
    icon: <UserOutlined />,
    desktop: "true",
    children: [
      {
        label: "New Employee",
        icon: <UserAddOutlined />,
        key: "/employee/add",
      },
      {
        label: "Employee Lists",
        icon: <UsergroupAddOutlined />,
        key: "/employee/list",
      },
    ],
  },
  {
    label: "Projects",
    key: "SubMenu",
    icon: <ProfileOutlined />,
    desktop: "true",
    children: [
      {
        label: "New Project",
        icon: <FolderAddOutlined />,
        key: "/project/add",
      },
      {
        label: "Project Lists",
        icon: <UnorderedListOutlined />,
        key: "/project/list",
      },
    ],
  },
  {
    label: "Tasks",
    desktop: "true",
    icon: <FundProjectionScreenOutlined />,
    position: "Member",
    children: [
      {
        label: "New Task",
        icon: <CarryOutOutlined />,
        key: "/task/add",
      },
      {
        label: "Task Lists",
        icon: <UnorderedListOutlined />,
        key: "/task/list",
      },
    ],
  },
  {
    label: "Reports",
    desktop: "true",
    icon: <IdcardOutlined />,
    position: "Member",
    children: [
      {
        label: "New Report",
        icon: <ReconciliationOutlined />,
        key: "/report/add",
      },
      {
        label: "Report Lists",
        icon: <ScheduleOutlined />,
        key: "/report/list",
      },
    ],
  },
];
