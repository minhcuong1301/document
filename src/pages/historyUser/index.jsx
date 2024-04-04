import { SpinCustom } from "components"
import { Breadcrumb, Button, Col, DatePicker, Input, Layout, Row, Space, Table } from "antd"

import { useEffect, useState } from "react"
import { actionGetListHistory } from './action';

const History = () => {
  const [spinning, setSpinning] = useState(false)
  const [listHistory, setListHistory] = useState([])
  const [name, setName] = useState()
  const pagination = {
    pageNum: 1,
    pageSize: 10,
  };

  const columns = [
    {
      fixed: "left",
      width: 60,
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (v, record, index) => (
        <Space>
          {index + 1 + (pagination.pageNum - 1) * pagination.pageSize}
        </Space>
      ),
    },
    {
      title: "ID tài liệu",
      dataIndex: "document_id",
      key: "document_id",
      align: "center",
    },
    {
      title: "Tên tài liệu ",
      dataIndex: "document_name",
      key: "document_name",
      align: "center",
    },

    {
      title: "Người sửa",
      dataIndex: "user_name",
      key: "user_name",
      align: "center",
    },
    {
      title: "Hành động",
      dataIndex: "action_name",
      key: "action_name",
      align: "center",
    },
  ];

  const handleGetHistory = async () => {
    setSpinning(true)
    try {
      const params = {
        name,
        action: null
      }
      const { data, status } = await actionGetListHistory(params)
      if (status === 200) {
        setListHistory(data?.history)
      }

    } catch (err) {
      console.log(err)
    }
    setSpinning(false)
  }

  useEffect(() => {
    handleGetHistory()
  }, [name])

  return (
    <Layout className="common-layout document-page">
      <SpinCustom spinning={spinning}>
        <div className="common-layout--header">
          <Row className="filler" gutter={[8, 8]}>

            <Col className="filler--item">
              <Input.Search
                onSearch={(v) => {
                  setName(v);
                }}
                placeholder="Nhập tên ..."
                allowClear
              />
            </Col>


          </Row>
        </div>
        <div className="common-layout--content">
          <Row className="filler" gutter={[8, 8]}>
            <Col>
              <Button
                className="w-full"
                type="primary">
                Chọn
              </Button>
            </Col>
          </Row>


          <Table
            width="100%"
            dataSource={listHistory}
            rowKey={(r) => r.id}
            columns={columns}
          // pagination={{
          //   pageSize: pagination.pageSize,
          //   current: pagination.current,
          //   onChange: handleChangePage,
          // }}
          // scroll={{ x: 1024 }}
          />
        </div>
      </SpinCustom>



    </Layout>
  )
}

export default History