import { useMemo, useState } from "react";
import { Modal, Table, Button } from "antd";
import { formatCurrency } from "utils/helps";
import { DATE_FORMAT } from "utils/constants/config";
import moment from "moment";

const ProcedureDetailModal = ({ record, onCancel }) => {
  const [pagination, setPagination] = useState({
    page_num: 1,
    page_size: 10,
  });
  console.log("record", record);
  const procedures = useMemo(() => {
    return record?.procedures || [];
  }, [record]);

  const columns = [
    {
      width: 80,
      align: "center",
      title: "STT",
      key: "stt",
      dataIndex: "stt",
      render: (_, r, i) =>
        i + 1 + (pagination.page_num - 1) * pagination.page_size,
    },
    {
      width: 140,

      title: "Người đề xuất",
      dataIndex: "created_by",
      key: "created_by",
    },
    {
      width: 160,

      title: "Thời gian bắt đầu",
      dataIndex: "time_start",
      key: "time_start",
    },
    {
      width: 160,

      title: "Thời gian kết thúc",
      dataIndex: "time_end",
      key: "time_end",
    },

    {
      width: 140,

      title: "Lí do",
      dataIndex: "reason",
      key: "reason",
      align: "center",
    },

    {
      width: 200,

      title: "Mô tả công việc cần làm",
      dataIndex: "job_description",
      key: "job_description",
      align: "center",
    },
  ];

  return (
    <Modal
      className="common-modal"
      style={{ top: 10 }}
      width={1200}
      title="Danh sách"
      footer={
        <Button onClick={onCancel} className="w-120">
          Thoát
        </Button>
      }
      open={true}
    >
      <Table
        dataSource={procedures}
        columns={columns}
        rowKey={(record) => record?.id}
        pagination={{
          position: ["bottomCenter"],
          current: pagination.page_num,
          pageSize: pagination.page_size,
          total: procedures.length,
          onChange: (page_num, page_size) => {
            setPagination({ page_num, page_size });
          },
        }}
      />
    </Modal>
  );
};

export default ProcedureDetailModal;
