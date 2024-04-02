import { useState } from "react";
import { UploadImage } from "components";
import {
  DATETIME_FORMAT,
  DATE_FORMAT,
  EMAIL_PATTERN,
  PHONE_PATTERN,
} from "utils/constants/config";
import { useSelector } from "react-redux";
import SpinCutom from "components/spin-custom";
import moment from "moment";
import { actionAddUser } from "../actions";

import {
  Modal,
  Row,
  Col,
  Button,
  Form,
  Input,
  Select,
  message,
  Spin,
  DatePicker,
  InputNumber,
} from "antd";

const AddUser = ({ onClose, setUser }) => {
  const departments = useSelector((state) => state?.departments);
  const positions = useSelector((state) => state?.positions);
  const [form] = Form.useForm();
  const [callingApi, setCallApi] = useState(false);
  const [files, setFiles] = useState([]);
  const [date, setDate] = useState(null);

  const handleAddUser = async (values) => {
    setCallApi(true);
    try {
      const params = {
        ...values,
        phone: values.phone || null,

        avatar: values.avatar || null,
        department_id: values.department_id || null,
        date_of_birth: moment(values.date_of_birth).valueOf() / 1000 || null,
      };
      if (values?.telegram_chat_id) {
        params.telegram_chat_id = values.telegram_chat_id || null;
      }
      if (values?.phone) {
        params.phone = values.phone;
      }
      const formData = new FormData();
      files.forEach((file) => formData.append(`avatar`, file));

      Object.keys(params).forEach((key) => {
        if (key !== "avatar") {
          formData.append(key, params[key]);
        }
      });

      const { data, status } = await actionAddUser(formData);
      if (status == 200) {
        message.success(data?.message);
        setUser(data?.employees);
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
    setCallApi(false);
  };
  const handleDateChange = (date) => {
    form.setFieldValue("date_of_birth", date);
  };

  return (
    <Modal
      open={true}
      closeIcon={false}
      title="Thêm tài khoản"
      className="form-modal"
      width={350}
      footer={false}
    >
      <SpinCutom SpinCutom spinning={callingApi}>
        <Form
          layout="vertical"
          className="commom-form"
          onFinish={handleAddUser}
          form={form}
        >
          <Row>
            <Col span={24}>
              <Form.Item
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
              >
                <Input placeholder="Nhập tên " />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  {
                    pattern: EMAIL_PATTERN,
                    message: "Email không đúng định dạng !",
                  },
                ]}
              >
                <Input placeholder="Nhập email " />
              </Form.Item>

              <Form.Item name="date_of_birth">
                <Row gutter={[4, 0]}>
                  <Col>
                    <span>Ngày sinh:</span>
                  </Col>

                  <Col className="w-full">
                    <DatePicker
                      onChange={(date) => handleDateChange(date)}
                      allowClear={false}
                      format={DATE_FORMAT}
                    />
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[
                  {
                    pattern: PHONE_PATTERN,
                    message: "Số điện thoại không đúng định dạng !",
                  },
                ]}
              >
                <Input placeholder="Nhập số điện thoại " />
              </Form.Item>

              <Form.Item
                name="position_id"
                rules={[{ required: true, message: "Vui lòng chọn chức vụ !" }]}
              >
                <Select
                  className="w-full"
                  placeholder="chức vụ"
                  options={positions
                    ?.filter((e) => e?.code !== "GIAM_DOC")
                    ?.map((e) => ({
                      value: e.id.toString(),
                      label: e.name,
                    }))}
                ></Select>
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu !" },
                ]}
              >
                <Input.Password placeholder="Mật khẩu" autoComplete="auto" />
              </Form.Item>

              <Form.Item name="telegram_chat_id">
                <InputNumber placeholder="ID telegram" className="w-full" />
              </Form.Item>

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

            <Col span={24}>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Button className="w-full" onClick={onClose}>
                    Thoát
                  </Button>
                </Col>

                <Col span={12}>
                  <Button htmlType="submit" type="primary" className="w-full">
                    Thêm tài khoản
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </SpinCutom>
    </Modal>
  );
};

export default AddUser;
