import { useState,useRef, } from "react"
import { actionSaveFeedback, actionHandleReview } from "../actions"
import { SpinCustom } from "components"
import {
  Modal, Form, Row, Col,
  Button, InputNumber,
  message,Space,
  Input,
} from "antd"
import dayjs from "dayjs";
import DatePickerCustom from "components/datePickerCustom";
import BM06V2 from "./BM06_V2";
import { formatCurrency } from "utils/helps";

const FeedBackModalV2 = ({ onCancel, openFeedBackV2, setDataTb }) => {
  const bm06Ref = useRef()
  const [form] = Form.useForm()
  const [spinning, setSpinning] = useState(false)

  const setItemValue = (value) => {
    form.setFieldsValue({ "convert_salary": value });
  };

  const setEstimatedPriceFormatCurrency = (value) => {
    setItemValue(formatCurrency(value || 0))
  };

  const handleAddFeedBackV2 = async () => {
    const text = await bm06Ref.current.handleSave();
    setSpinning(true)
    form.validateFields().then(async (values) => {

      const req_data = {
        ...values,
        form_review: text,
        status: 1,
        interview_time: null,
        start_working: (parseInt(values.start_working)) / 1000,
        description: null,
        interview_action: null,
        interviewer: null,

      }
      if (openFeedBackV2?.status === 1) {
        req_data.interview_action = 1
      }
      if (openFeedBackV2?.status === 0) {
        req_data.interview_action = 0
      }
      const { data, status } = await actionHandleReview(openFeedBackV2?.id, req_data,{tab:1})

      if (status === 200) {
        message.success(data?.message)
        setDataTb(data?.list_interview)
        onCancel()
      }
    })
      .catch(err => console.log(err))
      .finally(() => setSpinning(false));
  }

  const handleSetTimeStart = (v) => {
    form.setFieldValue('start_working', v)
  }

  const handleDisabledDate = (currentDate) => {
    return currentDate <= dayjs().startOf("day");
  }


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
            onClick={handleAddFeedBackV2}
            type="primary"
          >
            Đánh giá
          </Button>
        </Col>

      </Row>}
    >
      <SpinCustom spinning={spinning}>
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={[32, 8]} >
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item name="salary"
                label="Lương:"
                rules={[
                  { required: true, message: "Vui lòng nhập lương" }
                ]}
              
              >
                <InputNumber
                 placeholder="Lương"
                 className="w-full" 
                 min={0}
                 onChange={(v) => setEstimatedPriceFormatCurrency(v)}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item name="convert_salary" label=" "
              >
                <Input className="w-full"  disabled/>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={8} xl={8}>

              <Form.Item name="start_working"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày nhận việc" }
                ]}
                label="Ngày nhận việc"
              >
                    <DatePickerCustom
                      setDatetime={handleSetTimeStart}
                      disabled={handleDisabledDate}
                    />
              </Form.Item>
            </Col>
            <Col  md={24} xs={24}>
              <Form.Item name="form_review"
              >
                <BM06V2 ref={bm06Ref}  openFeedBackV2={openFeedBackV2}/>


              </Form.Item>
            </Col>

          </Row>
        </Form>
      </SpinCustom>
    </Modal>
  )
}

export default FeedBackModalV2
