import { useState } from 'react'
import { Button, Layout, Space, Table } from "antd"
import { SpinCustom } from "components"
import AddDevicesProcess from './components/addLeaveProcessModal'
const Devices
 = () => {
  const [spinning, setSpinning] = useState(false)
  const [addDevicesProcess, setAddDevicesModal] = useState(false)

  const columns = [
    {
      fixed: 'left',
      width: 60,
      title: "STT",
      dataIndex: "index",
      key: "index",
      // render: (text, record, index) => (
      //     <div >{index + 1 + ((pageNum - 1) * pageSize)}</div>
      // ),
    },
    {
      fixed: 'left',
      width: 60,
      title: "Mã số",
      dataIndex: "id",
      key: "id",
      
    },
    {
      title: "Tên thiết bị",
      dataIndex: "name",
      key: "name",
      // render: (text) => (
      //     <div>{text}</div>
      // ),
      align: "center"
    },
    {
      title: "Thông số, đặc điểm",
      dataIndex: "discribe",
      key: "discribe",
      // render: (text) => (
      //     <div>{text}</div>
      // ),
      align: "center"
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 150,
      align: "center"
    },
    {
      title: "Giá dự tính",
      dataIndex: "price",
      key: "price",
      render: (text) => (
        <Space>{text}</Space>
      ),
      align: "center"
    },
    {
      title: "Ngày cần",
      dataIndex: "day_needed",
      key: "day_needed",
      render: (text) => (
        <Space>{text}</Space>
      ),
      align: "center"
    },
  ]
  return (
    <Layout className='common-layout'>
      <SpinCustom spinning={spinning}>
        <div className='common-layout--header'>
          <Button onClick={() => setAddDevicesModal(true)}>
            Đề xuất thiết bị
          </Button>
        </div>

        <div className='common-layout--content'>
          <Table
            width="100%"
            // dataSource={tableData}
            // rowKey={(r) => r.id}
            columns={columns}
            pagination={false}
            scroll={{
              x: 1024
            }}
          />
        </div>

        <div className='common-layout--footer'>
          App Footer
        </div>
      </SpinCustom>
      <>
        {addDevicesProcess && <AddDevicesProcess
          onClose={() => {
            setAddDevicesModal(false)
          }}
        // setTableData={setTableData}

        />}
      </>
    </Layout>
  )
}

export default Devices

