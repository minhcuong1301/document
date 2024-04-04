import { SpinCustom, UploadFile } from "components"
import { useState } from "react";

import {
  Modal,
  Form,
  Row,
  Col,
  Button,
  message,

} from "antd";
import { actionImportExcel } from '../actions'


const UploadExcel = ({ onClose, setUser }) => {
  const [spinning, setSpinning] = useState(false)
  const [form] = Form.useForm()
  const [files, setFiles] = useState([])

  const handelImportExcel = async () => {
    setSpinning(true)
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file);
      });
      const { data, status } = await actionImportExcel(formData);
      if (status === 200) {
        message.success(data?.message)
        setUser(data?.list_employee)
        onClose()
      }
    } catch (err) {
      console.log(err)
    }
    setSpinning(false)
  }

  return (
    <Modal
      open={true}
      closeIcon={false}
      title="Upload file"
      className="form-modal"
      width={350}
      footer={false}
    >
      <SpinCustom SpinCutom spinning={spinning}>

        <Form
          layout="vertical"
          className="commom-form"
          form={form}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>

              <Form.Item >
                <Col>File:</Col>
                <Col className="w-full">
                  <UploadFile
                    setFiles={setFiles}
                    files={files}
                    maxCount={1}
                  />
                </Col>
              </Form.Item>

              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Button className="w-full"
                    onClick={onClose}
                  >Thoát</Button>
                </Col>

                <Col span={12}>
                  <Button
                    className="w-full"
                    type="primary"
                    htmlType="submit"
                    onClick={() => { handelImportExcel() }}
                  >
                    Nhập dữ liệu
                  </Button>
                </Col>
              </Row>

            </Col>
          </Row>
        </Form>
      </SpinCustom>
    </Modal>
  )
}

export default UploadExcel