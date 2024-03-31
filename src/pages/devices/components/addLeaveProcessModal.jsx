import { useEffect, useState } from 'react';
import moment from "moment"
import dayjs from "dayjs"
import DatePickerCustom from 'components/datePickerCustom';
import {
  Modal, Row, Col,
  Button, Form, Input,
  Select, message, Spin, DatePicker,
} from 'antd'

const { TextArea } = Input;

const AddDevicesProcess= ({ onClose, setTableData }) => {
  const [form] = Form.useForm()
  const [callingApi, setCallApi] = useState(false)
  const handle1 = (v) => {
    form.setFieldValue('12', v)
  }

  const handle2 = (v) => {
    form.setFieldValue('32', v)
  }

  const handleAdd = (values) => {
  }

  return (
    <Modal
      open={true}
      closeIcon={false}
      title="Thêm quy trình xin nghỉ "
      className='common-modal'
      width={350}
      footer={false}
    >
      <Form
        layout="vertical"
        className="commom-form"
        onFinish={handleAdd}
        form={form}
      >
        <Row>
          <Col span={24}>
            <Form.Item name="reason">
              <TextArea rows={2} placeholder="Lý do xin xe" />
            </Form.Item>

            <Form.Item name="type_leave">
              <Select
                className='w-full'
                mode='tags'
                placeholder="Loại nghỉ phép"
              >

              </Select>
            </Form.Item>
            <Form.Item name="hand_over"
              rules={[
                { required: true, message: "Tên người bàn giao" }
              ]}
            >
              <Input placeholder="Tên người bàn giao "
              />
            </Form.Item>
          </Col>
          
          <Col span={24}>
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <Button className='w-full' onClick={onClose} >Thoát</Button>
              </Col>

              <Col span={12}>
                <Button htmlType='submit' type='primary' className='w-full'>Thêm đề xuất</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default AddDevicesProcess