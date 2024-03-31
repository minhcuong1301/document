
import { SpinCustom } from "components";

import {
  Modal,
  Form,
  Row,
  Col,
  Button,
  Input,
  Select,
  DatePicker,
  message,
} from "antd";


import { useState } from "react";
// import DatePickerCustom from "@/components/datePickerCustom";
import TextArea from "antd/es/input/TextArea";
import DatePickerCustom from "components/datePickerCustom";
import { DATE_FORMAT, TYPE_OVER_TIME } from "utils/constants/config";
import { actionHandleAddOverTime } from "../action";
import dayjs from "dayjs";

const AddProcedure = ({ onCancel, setListOverTime, title }) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [spinning, setSpinning] = useState(false);


  const handleAddProcedure = async () => {
    
    form.validateFields().then(async (values) => {
      setSpinning(true)
      const data_req = {
        ...values,
        over_time_type:parseInt(values?.over_time_type) ,


        day: dayjs(values?.day).unix(),
      }
  
      const { data, status } = await actionHandleAddOverTime(data_req)

      if (status === 200) {
        message.success(data?.message)
        setListOverTime(data?.list_over_time)
        onCancel()
      }else{
        message.error(data?.message)
    setSpinning(false)

    }})
      .catch(
        err => console.log(err)
      )

    setSpinning(false)
  }

  const handleDateChange = (day) => {
    form.setFieldValue('day', day)
  };

  return (
    <Modal
      className="common-long-modal"

      open={true}
      title="Đề xuất làm thêm giờ"
      footer={<Row justify="center" gutter={[8, 0]}>
      <Col>
        <Button className="w-120" onClick={onCancel}>Thoát</Button>
      </Col>

      <Col>
        <Button className="w-120"
          onClick={handleAddProcedure}
          type="primary"
        >
          Thêm
        </Button>
      </Col>
    </Row>}
      width={350}
    >
      <Form
        layout="vertical"
        className="commom-form"
        
        form={form}
      >
        <SpinCustom spinning={spinning}>
          <Row gutter={[8, 8]}>

            <Col span={24}>
              <Form.Item name="description"
                rules={[
                  { required: true, message: "Vui lòng nhập nội dung công việc" }
                ]}
                label="Nội dung công việc:"
              >
                <TextArea rows={2} placeholder="Nhập nội dung công việc" />
              </Form.Item>
            </Col>



            <Col span={24}>
              <Form.Item name="day"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày làm việc" }
                ]}
                label="Ngày làm việc"

              >
                 <DatePicker
                 className="w-full"
                 onChange={(day) => handleDateChange(day)}
                    format={DATE_FORMAT}
                  />
              </Form.Item>
            </Col>


            <Col span={24}>
              <Form.Item name="total_time"
                rules={[
                  { required: true, message: "Vui lòng nhập số giờ" }
                ]}
                label="Số giờ làm:"
              >
                <Input placeholder="Nhập số giờ làm " />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="over_time_type"
                rules={[
                  { required: true, message: "Vui lòng chọn" }
                ]}
                label="Kiểu làm thêm giờ:"
              >
                <Select
                  placeholder="Kiểu làm thêm giờ"

                >
                  {Object.keys(TYPE_OVER_TIME).map((key) => (
                    <Select.Option key={key} value={key}>
                      {TYPE_OVER_TIME[key]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

        </SpinCustom>
      </Form>
    </Modal>
  );
};

export default AddProcedure;
