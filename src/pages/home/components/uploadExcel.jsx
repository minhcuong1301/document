import { SpinCustom, UploadFile, UploadImage } from "components"
import { useState } from "react";

import {
  Modal,
  Form,
  Row,
  Col,
  Input,

} from "antd";


const UploadExcel = () => {
  const [spinning, setSpinning] = useState(false)
  const [form] = Form.useForm()
  const [files, setFiles] = useState([])



  return (

    <Modal
      open={true}
      closeIcon={false}
      title="Tải file"
      className="form-modal"
      width={350}
      footer={false}
    >
      <SpinCustom SpinCutom spinning={spinning}>

        <Form
          layout="vertical"
          className="commom-form"
          // onFinish={handleAddUser}
          form={form}
        >
          <Row>
            <Col span={24}>
              <Form.Item name="avatar">
                <Row>
                  <Col>Ảnh:</Col>

                  <Col className="w-full">
                    <UploadImage
                      maxCount={1}
                      files={files}
                      setFiles={setFiles}
                    />
                  </Col>
                </Row>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </SpinCustom>
    </Modal>
  )
}

export default UploadExcel