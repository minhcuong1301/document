import {
  Modal, Row, Col,
  Button, Form, message
} from "antd";
import { SpinCustom, UploadFile } from "components";
import { useState } from "react";
import { actionSendEmail, } from "../actions"


const SendEmailReceiveJob = ({ onCancel, interviewId, par, setDataTb }) => {
  const [spinning, setSpinning] = useState(false)
  const [files, setFiles] = useState([])
  const [form] = Form.useForm()

  const handleSendEmail = async () => {

    setSpinning(true)

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file_invite", file)
      })

      const { data, status } = await actionSendEmail(interviewId, formData, par)
      if (status === 200) {
        setDataTb(data?.list_interview)
        message.success(data?.message)
        onCancel()
      } else {
        message.error(data?.message)
        onCancel()
      }

    } catch (err) {
      console.log(err)
      message.error(err)
    }

    setSpinning(false)
  }

  return (

    <Modal
      className="common-modal"
      style={{ top: 10 }}
      open={true}
      title="Thêm hồ sơ"
      footer={<Row justify="center" gutter={[8, 0]}>
        <Col>
          <Button
            className="w-120"
            onClick={onCancel}
          >Thoát</Button>
        </Col>

        <Col>
          <Button className="w-120"
            onClick={handleSendEmail}
            type="primary"
          >
            Gửi Email
          </Button>
        </Col>
      </Row>}
    >
      <SpinCustom spinning={spinning}>
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={[8, 0]}>
            <Col md={8} xs={24}>
              <Form.Item name="file_invite"
                rules={[
                  { required: true, message: "Vui lòng chọn file đính kèm" }
                ]}
                label="file đính kèm email:"
              >
                <UploadFile
                  maxCount={1}
                  files={files}
                  setFiles={setFiles}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </SpinCustom>

    </Modal>
  )


}

export default SendEmailReceiveJob;