import { useEffect, useState, useRef } from "react"
import { actionSaveFeedback, actionHandleReview } from "../actions"
import { SpinCustom } from "components"
import {
  Modal, Form, Row, Col,
  Button, Input,
  message, Select,
} from "antd"

import BM06 from "./BM06";
import { actionGetUsers } from 'pages/home/actions';
import dayjs from "dayjs";
import DatePickerCustom from "components/datePickerCustom";
const { TextArea } = Input;

const FeedBackModal = ({ onCancel, openFeedBack, setDataTb, interviewId, page_num, page_size }) => {
  const [form] = Form.useForm()
  const [spinning, setSpinning] = useState(false)
  const [users, setUsers] = useState([])
  const bm06Ref = useRef()

  const handleAddFeedBack = async () => {
    const text = await bm06Ref.current.handleSave();
    // console.log(text);
   
    form.validateFields().then(async (values) => {
      setSpinning(true)
      const req_data = {
        ...values,
        form_review: text,
        status: 1,
        interview_time: (parseInt(values.interview_time)) / 1000,
        salary: null,
        start_working: null,
        description: values?.description || " ",
        interview_action: 1,
      }

      const { data, status } = await actionHandleReview(openFeedBack?.id, req_data,{tab:1})
      if (status === 200) {
        message.success(data?.message)
        setDataTb(data?.list_interview)
        onCancel()
      }

    })
      .catch(err => console.log(err))
      .finally(() => setSpinning(false));
  }

  const handleGetUser = async () => {
    setSpinning(true)
    try {
      const { data, status } = await actionGetUsers()

      if (status === 200) {
        setUsers(data)
      }
    } catch (error) {
      console.log(error)
    }
    setSpinning(false)
  }

  const handleSetTimeStart = (v) => {
    form.setFieldValue('interview_time', v)
  }

  const handleDisabledDate = (currentDate) => {
    return currentDate <= dayjs().startOf("day");
  }

  useEffect(() => {
    handleGetUser()
  }, [])
  return (
    <Modal
      className="common-modal"
      style={{ top: 10 }}
      open={true}
      title="Đánh giá phỏng vấn "
      width={1200}
      footer={<Row justify="center" gutter={[8, 0]}>
        <Col>
          <Button className="w-120" onClick={onCancel}>Thoát</Button>
        </Col>

        <Col>
          <Button className="w-120"
            onClick={() => {

              handleAddFeedBack();
            }}
            type="primary"
          >
            Đánh giá
          </Button>
        </Col>
        {/* <Col>
          <Button className="w-120 "
            onClick={handleSaveFeedback}
            type="primary" danger

          >
            Lưu
          </Button>
        </Col> */}
      </Row>}
    >
      <SpinCustom spinning={spinning}>
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item name="interviewer"
                rules={[
                  { required: true, message: "Vui lòng chọn người phỏng vấn " }
                ]}
                label="Người tham gia phỏng vấn vòng 2"
              >

                <Select
                  className='w-full'
                  placeholder="Người tham gia phỏng vấn vòng 2"
                  showSearch
                  allowClear
                  mode="multiple"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    `${option.children}`.toLocaleLowerCase().includes(input.toLocaleLowerCase())
                  }
                >
                  {users.map((e) =>
                    <Select.Option key={e?.id} value={e.id}>
                      {e?.name}
                    </Select.Option>
                  )}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item name="interview_time"
                rules={[
                  { required: true, message: "Vui lòng chọn thời gian phỏng vấn vòng 2" }
                ]}
                label="Thời gian phỏng vấn vòng 2"
              >
                <Row gutter={[4, 0]}>
                  <Col className="w-full">
                    <DatePickerCustom
                      setDatetime={handleSetTimeStart}
                      disabled={handleDisabledDate}
                    />
                  </Col>
                </Row>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item name="description"
                label="Mô tả:"
              >
                <TextArea rows={2} placeholder="Mô tả" />
              </Form.Item>
            </Col>

            <Col md={24} xs={24}>
              <Form.Item name="form_review"
              >
                <BM06 ref={bm06Ref}
                  openFeedBack={openFeedBack}
                />

              </Form.Item>
            </Col>

          </Row>
        </Form>
      </SpinCustom>
    </Modal>
  )
}

export default FeedBackModal
