import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Form,
  Row,
  Col,
  DatePicker,
  Input,
  Space,
  Button,
  Table,
  Modal,
} from "antd";
import {
  CloseOutlined,
  SearchOutlined,
  PlusOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { report } from "../../services/httpServices";
import ReportDownload from "./ReportDownload";
import { commonConstants } from "../../constants/message";
import "./ReportList.css";

const ReportList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [reportLists, setReportLists] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState(false);
  const [reportFilter, setReportFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  const columns = [
    {
      title: "Report ID",
      dataIndex: "_id",
      width: "8%",
      render: (_, __, index) => {
        const adjustedIndex = (currentPage - 1) * pageSize + index + 1;
        return adjustedIndex;
      },
    },
    {
      title: "Date",
      dataIndex: "created_at",
      sorter: {
        compare: (a, b) => a.created_at.localeCompare(b.created_at),
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (_, record) => (
        <span>
          <p>ReportTo : {record.report_to}</p>
          <p>
            Project : {record.task_id.project_name.projectName} <br />
            【実績】
          </p>
          <p>
            -{record.task_id.title}, &lt;{record.percentage} %&gt;, &lt;
            {record.status}&gt;, &lt;{record.type}&gt;, &lt;{record.hr} hr&gt;
            <br /> 【所感】
          </p>
          <p>-{record.problem ? record.problem : "Nothing"}</p>
        </span>
      ),
    },
    {
      title: "Report To",
      dataIndex: "report_to",
    },
    {
      title: "Report By",
      dataIndex: "report_by",
    },
  ];

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const reportApi = await report.getAll();
        const reportData = reportApi.data.data.map((report) => {
          return {
            ...report,
            key: report._id,
            created_at: dayjs(report.created_at).format("YYYY-MM-DD"),
          };
        });
        setLoading(false);
        setReportLists(reportData);
        setReportFilter(reportData);
      } catch (err) {
        if (err.code === "ERR_NETWORK") {
          setOpen(true);
          setDialogMsg(commonConstants.Network_Err);
        }
      }
    };
    fetchApi();
  }, []);

  const onSearch = () => {
    const formValues = form.getFieldValue();
    const filterData = reportLists.filter((report) => {
      if (formValues.date && formValues.reportedBy && formValues.reportedTo) {
        return (
          dayjs(report.created_at).format("YYYY-MM-DD") ===
            dayjs(formValues.date).format("YYYY-MM-DD") &&
          report.report_by
            .toLowerCase()
            .includes(formValues.reportedBy.toLowerCase()) &&
          report.report_to
            .toLowerCase()
            .includes(formValues.reportedTo.toLowerCase())
        );
      } else if (formValues.date && formValues.reportedBy) {
        return (
          dayjs(report.created_at).format("YYYY-MM-DD") ===
            dayjs(formValues.date).format("YYYY-MM-DD") &&
          report.report_by
            .toLowerCase()
            .includes(formValues.reportedBy.toLowerCase())
        );
      } else if (formValues.date && formValues.reportedTo) {
        return (
          dayjs(report.created_at).format("YYYY-MM-DD") ===
            dayjs(formValues.date).format("YYYY-MM-DD") &&
          report.report_to
            .toLowerCase()
            .includes(formValues.reportedTo.toLowerCase())
        );
      } else if (formValues.reportedBy && formValues.reportedTo) {
        return (
          report.report_by
            .toLowerCase()
            .includes(formValues.reportedBy.toLowerCase()) &&
          report.report_to
            .toLowerCase()
            .includes(formValues.reportedTo.toLowerCase())
        );
      } else if (formValues.date) {
        return (
          dayjs(report.created_at).format("YYYY-MM-DD") ===
          dayjs(formValues.date).format("YYYY-MM-DD")
        );
      } else if (formValues.reportedBy) {
        return report.report_by
          .toLowerCase()
          .includes(formValues.reportedBy.toLowerCase());
      } else if (formValues.reportedTo) {
        return report.report_to
          .toLowerCase()
          .includes(formValues.reportedTo.toLowerCase());
      }
      return true;
    });
    setReportFilter(filterData);
  };

  const onClear = () => {
    form.resetFields();
    setReportFilter(reportLists);
  };

  return (
    <>
      <Form onFinish={onSearch} form={form} className="report-list-form">
        <Row align="top" gutter={16}>
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <Row gutter={16}>
              <Col xl={8} lg={8} md={8} sm={8} xs={24}>
                <Form.Item name="date">
                  <DatePicker style={{ width: "100%" }} placeholder="Date" />
                </Form.Item>
              </Col>
              <Col xl={8} lg={8} md={8} sm={8} xs={24}>
                <Form.Item name="reportedBy">
                  <Input placeholder="Reported By" />
                </Form.Item>
              </Col>
              <Col xl={8} lg={8} md={8} sm={8} xs={24}>
                <Form.Item name="reportedTo">
                  <Input placeholder="Reported To" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <Space align="center" wrap className="report-space">
              <Space size="middle">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                >
                  Search
                </Button>
                <Button
                  onClick={onClear}
                  type="primary"
                  danger
                  icon={<CloseOutlined />}
                >
                  Cancel
                </Button>
              </Space>
              <Space>
                <ReportDownload datas={reportFilter} />
                <Link to="/report/add">
                  <Button type="primary" ghost icon={<PlusOutlined />}>
                    New Report
                  </Button>
                </Link>
              </Space>
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
          <Button
            key="back"
            onClick={() => {
              setOpen(false);
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
      <Table
        style={{ padding: "15px" }}
        className="report-table"
        columns={columns}
        loading={loading}
        dataSource={reportFilter}
        scroll={{
          x: 1300,
        }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          onChange: (page) => setCurrentPage(page),
        }}
      />
    </>
  );
};

export default ReportList;
