import { useEffect, useState, useRef } from "react"
import { actionSaveFeedback, actionHandleReview } from "../actions"
import { SpinCustom } from "components"
import {
  Modal, Form, Row, Col, Radio,
  Button, Input, InputNumber,
  message, Select, DatePicker
} from "antd"
import dayjs from "dayjs";
import BM06V3 from "./BM06_V3";
import { DATETIME_FORMAT, DATE_FORMAT } from "utils/constants/config";
import { formatCurrency } from "utils/helps";
const FeedBackModalV3 = ({ onCancel, openFeedBackV3, setDataTb ,interviewId}) => {
  const [form] = Form.useForm()
  const bm06Ref = useRef()
  const [spinning, setSpinning] = useState(false)
  const [convertSalary, setConvertSalary] = useState('')

  const setItemValue = (value) => {
    form.setFieldsValue({ "convert_salary": value });
    setConvertSalary(value)
  };
console.log(convertSalary);
  const setEstimatedPriceFormatCurrency = (value) => {
    setItemValue(formatCurrency(value || 0))
  };


  const handleAddFeedBackV3 = async () => {
    const text = await bm06Ref.current.handleSave();
    setSpinning(true)
    form.validateFields().then(async (values) => {

      const req_data = {
        ...values,
        form_review: text,
        status: 1,
        interview_time: null,
        start_working: dayjs(values?.start_working).unix(),
        description: null,
        interviewer:null,
        interview_action:null
    
      }
      const { data, status } = await actionHandleReview(openFeedBackV3?.id, req_data,{tab:1})

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
            onClick={handleAddFeedBackV3}
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
          initialValues={{
            ...openFeedBackV3,
            start_working: dayjs(openFeedBackV3?.start_working*1000),
            convert_salary:formatCurrency(openFeedBackV3?.salary || 0) 
          }}

        >
          <Row gutter={[32, 8]}>
          <Col  xs={24} sm={24} md={24} lg={8} xl={8}>
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

            <Col  xs={24} sm={24} md={24} lg={8} xl={8}>
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
                
                    <DatePicker
                      setDatetime={handleSetTimeStart}
                      // disabled={handleDisabledDate}
                      // allowClear={false}
                      format={DATE_FORMAT}
                    />
              </Form.Item>
            </Col>
            <Col md={24} xs={24}>
              <Form.Item name="form_review"
              >
                <BM06V3 
                openFeedBackV3={openFeedBackV3} 
                setEstimatedPriceFormatCurrency={setEstimatedPriceFormatCurrency}
                 ref={bm06Ref} 
                 />
                
              </Form.Item>

            </Col>
            
          </Row>
        </Form>
      </SpinCustom>
    </Modal>
  )
}

export default FeedBackModalV3
