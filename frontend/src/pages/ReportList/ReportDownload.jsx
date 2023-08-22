import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { saveAs } from "file-saver";
import { utils, write } from "xlsx";
import PropTypes from "prop-types";

const ReportDownload = ({ datas }) => {
  const downloadFile = () => {
    const downloadData = datas.map((data, index) => ({
      "Report ID": index + 1,
      Date: data.created_at,
      Description:
        "ReportTo - " +
        data.report_to +
        "," +
        " projectName - " +
        data.task_id.project_name.projectName +
        "," +
        " Title - " +
        data.task_id.title +
        ` <${data.percentage}% > <${data.status}> <${data.type}> <${data.hr}hr> ` +
        ` ${data.problem ? data.problem : "Nothing"}`,
      "Report To": data.report_to,
      "Report By": data.report_by,
    }));

    // Create a new workbook and set the worksheet data
    const workbook = utils.book_new();
    const worksheet = utils.json_to_sheet(downloadData);
    utils.book_append_sheet(workbook, worksheet, "sheet1");

    // Generate the Excel file
    const buffer = write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Report List" + ".xlsx");
  };

  return (
    <>
      <Button
        onClick={downloadFile}
        type="primary"
        htmlType="submit"
        icon={<DownloadOutlined />}
        style={{ backgroundColor: "var(--success-color)", color: "#fff" }}
      >
        Download
      </Button>
    </>
  );
};

ReportDownload.propTypes = {
  datas: PropTypes.array,
};

export default ReportDownload;
