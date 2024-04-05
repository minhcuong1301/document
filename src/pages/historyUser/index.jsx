import { SpinCustom } from "components"
import { Button, Checkbox, Col, Input, Layout, Row, Space, Table, message } from "antd"

import { useEffect, useState } from "react"
import { actionGetListHistory, actionDeleteHistory } from './action';

const History = () => {
  const [spinning, setSpinning] = useState(false)
  const [listHistory, setListHistory] = useState([])
  const [name, setName] = useState()
  const [openSelect, setOpenSelect] = useState(false)
  const [listSelect, setListSelect] = useState([])
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
      fixed: "center",
      width: 2,
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
      width: 150,
      dataIndex: "document_id",
      key: "document_id",
      align: "center",
    },
    {
      title: "Tên tài liệu ",
      width: 500,
      dataIndex: "document_name",
      key: "document_name",
      align: "left",
    },
    {
      title: "Người sửa",
      dataIndex: "user_name",
      key: "user_name",
      align: "left",
    },
    {
      title: "Hành động",
      dataIndex: "action_name",
      key: "action_name",
      align: "center",
    },
  ].filter(item => { return openSelect ? item : item.dataIndex !== "checkbox" });

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

  const handleDeleteHistory = async () => {
    setSpinning(true)
    try {
      const { data, status } = await actionDeleteHistory({ list_his: listSelect });
      if (status === 200) {
        message.success(data?.message);
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
                type="primary"
                onClick={() => {
                  setOpenSelect(!openSelect)
                  openSelect && setListSelect([])
                }}>
                {!openSelect ? 'Chọn' : 'Bỏ chọn'}
              </Button>
            </Col>

            {listSelect.length > 0 && (<Col>
              <Button
                className="w-full"
                type="primary"
                onClick={handleDeleteHistory}>
                Xóa
              </Button>
            </Col>)}
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
          // scroll={{ x: 500 }}
          />
        </div>
      </SpinCustom>



    </Layout>
  )
}

export default History