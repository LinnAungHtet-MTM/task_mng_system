import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { saveAs } from "file-saver";
import { utils, write } from "xlsx";
import PropTypes from "prop-types";

const TaskDownload = ({ datas }) => {
  const downloadFile = () => {
    const downloadData = datas.map((data, index) => ({
      "Task ID": index + 1,
      Title: data.title,
      Description: data.description,
      "Project Name": data.project_name,
      "Assigned Employee": data.assigned_employee,
      "Estimate Hour": data.estimate_hour,
      "Actual Hour": data.actual_hour,
      Status: getStatusLabel(data.status),
      "Estimate Start Date": data.estimate_start_date,
      "Estimate Finish Date": data.estimate_finish_date,
      "Actual Start Date": data.actual_start_date,
      "Actual Finish Date": data.actual_finish_date,
    }));

    function getStatusLabel(status) {
      let statusString = "";
      if (status === "0") {
        statusString = "Open";
      } else if (status === "1") {
        statusString = "In Progress";
      } else if (status === "2") {
        statusString = "Finished";
      } else if (status === "3") {
        statusString = "Close";
      }
      return statusString;
    }

    // Create a new workbook and set the worksheet data
    const workbook = utils.book_new();
    const worksheet = utils.json_to_sheet(downloadData);
    utils.book_append_sheet(workbook, worksheet, "sheet 1");

    // Generate the Excel file
    const buffer = write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Task List" + ".xlsx");
  };

  return (
    <>
      <Button
        onClick={downloadFile}
        type="primary"
        icon={<DownloadOutlined />}
        style={{ backgroundColor: "var(--success-color)", color: "#fff" }}
      >
        Download
      </Button>
    </>
  );
};

TaskDownload.propTypes = {
  datas: PropTypes.array,
};

export default TaskDownload;
