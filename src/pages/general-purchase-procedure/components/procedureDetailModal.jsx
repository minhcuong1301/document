import { useMemo, useState } from "react"
import { Modal, Table, Button } from "antd"
import { formatCurrency } from "utils/helps"
import { DATE_FORMAT } from "utils/constants/config"
import moment from "moment"

const ProcedureDetailModal = ({ record, onCancel }) => {
  const [pagination, setPagination] = useState({
    page_num: 1,
    page_size: 10
  })

  const equipments = useMemo(() => {
    return record?.equipments || []
  }, [record])

  const columns = [
    {
      width: 80,
      align: "center",
      title: "STT",
      key: "stt",
      dataIndex: "stt",
      render: (_, r, i) => (i + 1) + (pagination.page_num - 1) * pagination.page_size 
    },
    {
      title: "Nội dung",
      dataIndex: "name",
      key: "name",
    },
    {
      width: 200,
      title: "Mục đích",
      dataIndex: "purpose",
      key: "purpose",
    },
    {
      width: 280,
      title: "Mô tả",
      dataIndex: "specifications",
      key: "specifications",
    },
    {
      width: 120,
      align: "center",
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      width: 100,
      align: "center",
      title: "Giá dự tính",
      dataIndex: "estimated_price",
      key: "estimated_price",
      render: v => v ? formatCurrency(v) : ""
    },
    {
      width: 120,
      align: "center",
      title: "Ngày cần",
      dataIndex: "day_need",
      key: "day_need",
      render: v => moment(v * 1000).format(DATE_FORMAT)
    }
  ]

  return (
    <Modal
      className="common-modal"
      style={{top: 10}}
      width={1200}
      title="Danh sách"
      footer={<Button onClick={onCancel} className="w-120">
        Thoát
      </Button>}
      open={true}
    >
      <Table 
        dataSource={equipments}
        columns={columns}
        rowKey={record => record?.id}
        pagination={{
          position: ["bottomCenter"],
          current: pagination.page_num,
          pageSize: pagination.page_size,
          total: equipments.length,
          onChange: (page_num, page_size) => {
            setPagination({ page_num, page_size })
          }
        }}
      />
    </Modal>
  )
}

export default ProcedureDetailModal