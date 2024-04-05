import { SpinCustom } from "components";
import { Button, Checkbox, Col, DatePicker, Input, Layout, Row, Space, Table } from "antd";
import { useState } from "react";
import moment from "moment";
import { DATETIME_FORMAT } from "utils/constants/config";
const Bin = () => {
  const [spinning, setSpinning] = useState(false)
  const [openSelect, setOpenSelect] = useState(false)
  const [listSelect, setListSelect] = useState([])
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

  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      setListSelect([...listSelect, id]);
    } else {
      setListSelect(listSelect.filter((rowId) => rowId !== id));
    }
  };


  const columns = [
    {
      width: 5,
      dataIndex: "checkbox",
      hidden: false,
      render: (v, record, index) => (
        <Checkbox onChange={(e) => handleCheckboxChange(e, record.id)} />
      )
    },
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
      title: "ID",
      width: 50,
      dataIndex: "document_id",
      key: "document_id",
      align: "center",
    },
    {
      title: "icon",
      width: 70,
      dataIndex: "document_id",
      key: "document_id",
      align: "left",
    },
    {
      title: "Tên tài liệu ",
      width: 500,
      dataIndex: "document_name",
      key: "document_name",
      align: "left",
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

          />
        </div>
      </SpinCustom>



    </Layout>
  )
}

export default Bin