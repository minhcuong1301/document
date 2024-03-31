import { useState, useEffect } from "react";
import { Modal, Button, Steps } from "antd";
import moment from "moment";
import { DATETIME_FORMAT } from "utils/constants/config";

const { Step } = Steps;
const ProcedureProcessing = ({ record, onCancel }) => {
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const lastNonErrorApprovalIndex = record?.details.findIndex(
      (approval) => approval.status_code !== "CANCEL"
    );
    setCurrent(
      lastNonErrorApprovalIndex !== -1 ? lastNonErrorApprovalIndex : 0
    );
  }, [record.details]);

  return (
    <Modal
      open={true}
      closeIcon={false}
      title="Tình trạng"
      className="common-modal"
      width={350}
      footer={
        <Button className="w-120" onClick={onCancel}>
          Thoát
        </Button>
      }
    >
      <Steps current={current} direction="vertical" responsive={true}>
        {record?.details.map((approval, index) => (
          <Step
            key={index}
            title={approval?.approved_by_name}
            status={
              index === record?.details.length - 1
                ? approval?.status_code === "PENDING"
                  ? "wait"
                  : approval?.status_code === "CONFIRMED"
                  ? "process"
                  : "error"
                : "process"
            }
            description={
              <div>
                {approval.status_code === "CONFIRMED" &&
                  approval.time_update && (
                    <>
                      <p style={{ color: "rgb(135 135 135)" }}>
                        Thời gian duyệt:{" "}
                        {moment(approval.time_update * 1000).format(
                          DATETIME_FORMAT
                        )}
                      </p>
                      {approval.description && (
                        <p style={{ color: "rgb(135 135 135)" }}>
                          Ghi chú: {approval.description}
                        </p>
                      )}
                    </>
                  )}
                {approval.status_code === "CANCEL" && (
                  <p style={{ color: "red" }}>
                    Lý do từ chối: {approval.description}
                  </p>
                )}
              </div>
            }
          />
        ))}
      </Steps>
    </Modal>
  );
};

export default ProcedureProcessing;
