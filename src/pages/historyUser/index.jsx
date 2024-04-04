import { SpinCustom } from "components"
import { Breadcrumb, Button, Col, DatePicker, Input, Layout, Row, Space, Table } from "antd"

import { useState } from "react"


const History = () => {
  const [spinning, setSpinning] = useState(false)

  const columns = [
    {
      fixed: "left",
      width: 60,
      title: "STT",
      dataIndex: "id",
      key: "id",
      // render: (v, record, index) => (
      //   <Space>
      //     {/* {index + 1 + (pagination.pageNum - 1) * pagination.pageSize} */}
      //   </Space>
      // ),
    },
    {
      title: "id tài liệu",
      dataIndex: "user_code",
      key: "user_code",
      align: "center",
    },
    {
      title: "Tên tài liệu ",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Thời gian tạo",
      dataIndex: "department_name",
      key: "department_name",
      align: "center",
    },
    {
      title: "Thời gian sửa",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: "Người sửa",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Hành động",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
  ];

  return (
    <Layout className="common-layout document-page">
      <SpinCustom spinning={spinning}>
        <div className="common-layout--header">
          <Row className="filler" gutter={[8, 8]}>
            <Col span={24}>
              <Button
                className="exit-home"
                onClick={() => window.navigatePage("home-navigate")}
              >
                Thoát
              </Button>
            </Col>

            <Col>
              <Row gutter={[8, 0]}>
                <Col className="align--center">
                  <span>Từ:</span>
                </Col>
                <Col>
                  <DatePicker
                  // defaultValue={dateStart}
                  // onChange={(v) => {
                  //   setDateStart(v);
                  // }}
                  // allowClear
                  // format={DATE_FORMAT}
                  />
                </Col>
              </Row>
            </Col>

            <Col>
              <Row gutter={[8, 0]}>
                <Col className="align--center">
                  <span>Đến:</span>
                </Col>
                <Col>
                  <DatePicker
                  // defaultValue={dateEnd}
                  // onChange={(v) => {
                  //   setDateEnd(v);
                  // }}
                  // allowClear
                  // format={DATE_FORMAT}
                  />
                </Col>
              </Row>
            </Col>

            <Col className="filler--item">
              <Input.Search
                // onSearch={(v) => {
                //   setName(v);
                // }}
                placeholder="Nhập tên ..."
              // allowClear
              />
            </Col>


          </Row>
        </div>
        <div className="common-layout--content">
          <Table
            width="100%"
            // dataSource={user}
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