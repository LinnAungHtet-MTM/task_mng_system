import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Typography,
  Divider,
  Form,
  Input,
  Modal,
  DatePicker,
  Row,
  Col,
  Button,
  message,
  Spin,
} from "antd";
import {
  RollbackOutlined,
  SaveOutlined,
  FundProjectionScreenOutlined,
  EditOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { project } from "../../services/httpServices";
import { commonConstants } from "../../constants/message";
import "./ProjectCommon.css";

const CreateProject = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [gettingData, setGettingData] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");

  const { pathname } = useLocation();

  useEffect(() => {
    const getProjectData = async () => {
      if (id) {
        project
          .getById(id)
          .then((res) => {
            form.setFieldsValue({
              projectName: res.data.data.projectName,
              language: res.data.data.language,
              description: res.data.data.description,
              startDate: dayjs(res.data.data.startDate),
              endDate: dayjs(res.data.data.endDate),
            });
            setGettingData(false);
          })
          .catch((err) => {
            setGettingData(false);
            if (err.response.status === 500) {
              setOpen(true);
              setEditId(true);
              setDialogMsg(err.response.data.message);
            }
          });
      } else {
        form.resetFields();
      }
    };
    getProjectData();
  }, [id, form]);

  const endDateVaildate = ({ getFieldValue }) => ({
    validator(_, value) {
      return new Promise((resolve, reject) => {
        const startDate = dayjs(getFieldValue("startDate")).format(
          "YYYY-MM-DD"
        );
        const endDate = dayjs(value).format("YYYY-MM-DD");
        if (!endDate || !startDate) {
          resolve();
        } else if (startDate && endDate) {
          if (endDate < startDate) {
            reject(new Error(commonConstants.Date_Validate));
          }
        }
        resolve();
      });
    },
  });

  const submitHandler = (values) => {
    setLoading(true);
    const payload = {
      projectName: values.projectName,
      language: values.language,
      description: values.description,
      startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(values.endDate).format("YYYY-MM-DD"),
    };
    if (id) {
      setIsDisabled(true);
      project
        .edit(id, payload)
        .then(() => {
          setLoading(false);
          message.success("Project Updated Successfully");
          setIsDisabled(false);
          navigate("/project/list");
        })
        .catch((err) => {
          if (err.code === "ERR_NETWORK" || err.response.status === 500) {
            setOpen(true);
            setDialogMsg(commonConstants.Network_Err);
          }
        });
    } else {
      setIsDisabled(true);
      project
        .add(payload)
        .then(() => {
          setLoading(false);
          message.success("Project Created Successfully");
          setIsDisabled(false);
          navigate("/project/list");
        })
        .catch((err) => {
          if (err.code === "ERR_NETWORK") {
            setOpen(true);
            setDialogMsg(commonConstants.Network_Err);
          }
        });
    }
  };

  return (
    <div className="create-project">
      <Spin spinning={gettingData && !pathname.includes("add")}>
        <Typography.Title className="create-project-title" level={4}>
          {id ? (
            <span className="project-icon">
              <EditOutlined />
            </span>
          ) : (
            <span className="project-icon">
              <FundProjectionScreenOutlined />
            </span>
          )}
          {id ? "Update Project" : "New Project"}
        </Typography.Title>
        <Divider />
        <Form
          form={form}
          style={{ padding: "20px" }}
          labelAlign="left"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 17 }}
          onFinish={submitHandler}
        >
          <Form.Item
            label={
              <span>
                Project Name
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </span>
            }
            justify="space-between"
            name="projectName"
            rules={[
              { required: true, message: commonConstants.Require_Project_Name },
            ]}
          >
            <Input placeholder="Enter Project Name" />
          </Form.Item>
          <Form.Item
            label={
              <span>
                Language
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </span>
            }
            justify="space-between"
            name="language"
            rules={[
              {
                required: true,
                message: commonConstants.Require_Project_Language,
              },
            ]}
          >
            <Input placeholder="Enter Language" />
          </Form.Item>
          <Form.Item
            label={<span>Description</span>}
            justify="space-between"
            name="description"
          >
            <Input placeholder="Enter Description" />
          </Form.Item>
          <Form.Item
            label={
              <span>
                Start Date
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </span>
            }
            justify="space-between"
            name="startDate"
            rules={[
              {
                required: true,
                message: commonConstants.Require_Project_StartDate,
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} placeholder="yyyy-mm-dd" />
          </Form.Item>
          <Form.Item
            label={
              <span>
                End Date
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </span>
            }
            justify="space-between"
            name="endDate"
            rules={[
              {
                required: true,
                message: commonConstants.Require_Project_EndDate,
              },
              endDateVaildate,
            ]}
          >
            <DatePicker style={{ width: "100%" }} placeholder="yyyy-mm-dd" />
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
                  editId && navigate("/project/list");
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
          <Row justify="center" gutter={[16, 16]}>
            <Link to="/project/list">
              <Button type="primary" danger icon={<RollbackOutlined />}>
                Cancel
              </Button>
            </Link>
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
      </Spin>
    </div>
  );
};

export default CreateProject;
