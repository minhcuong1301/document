import { SpinCustom } from "components";
import { Button, Col, DatePicker, Input, Layout, Row, Space, Table } from "antd";
import { useState } from "react";
import moment from "moment";
import { DATETIME_FORMAT } from "utils/constants/config";
const Bin = () => {
  const [spinning, setSpinning] = useState(false)
  const [listFile, setListFile] = useState([{
    name: "Tài liệu 1",
    time_create: 1712289945,
    department_name: "Nguyễn Văn A",
    day: 1712289990,
    user_delete: "Nguyễn Văn A"



  }])

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
      title: "Tên",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Ngày tạo ",
      dataIndex: "time_create",
      key: "name",
      align: "center",
      render: (r, v) => {
        return moment(v.time_create * 1000).format(DATETIME_FORMAT)
      }
    },
    {
      title: "Nguời tạo",
      dataIndex: "department_name",
      key: "department_name",
      align: "center",
    },
    {
      title: "Ngày xóa ",
      dataIndex: "day",
      key: "name",
      align: "center",
      render: (r, v) => {
        return moment(v.time_create * 1000).format(DATETIME_FORMAT)
      }
    },
    {
      title: "Nguời xóa",
      dataIndex: "user_delete",
      key: "department_name",
      align: "center",
    },
    {
      title: "Hành động",
      dataIndex: "phone",
      key: "phone",
      align: "center",
      render: (v, r) => {
        return (
          <Space>
            <Button
              type="primary"
              className="ant-btn-primary">
              Khôi phục
            </Button>
            <Button type="primary"
              className="ant-btn-cancel">
              Xóa
            </Button>
          </Space>
        )
      }
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
            dataSource={listFile}
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

export default Bin