import { useEffect, useState } from "react";
import { UploadImage } from "components";
import {
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
  DatePicker,
  InputNumber,
} from "antd";

const AddUser = ({ onClose, setUser, departments }) => {
  const positions = useSelector((state) => state?.positions);
  const [form] = Form.useForm();
  const [callingApi, setCallApi] = useState(false);
  const [files, setFiles] = useState([]);

  const handleAddUser = async () => {
    const values = form.getFieldsValue();
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
      if (status === 200) {
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
      width={500}
      onCancel={onClose}
      onOk={handleAddUser}
      okText="Thêm tài khoản"
      okButtonProps={{ style: { marginRight: "30px" } }}
    >
      <SpinCutom spinning={callingApi}>
        <Form
          layout="vertical"
          className="commom-form"
          
          form={form}
        >
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên:"
                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
              >
                <Input placeholder="Nhập tên: " />
              </Form.Item>
            </Col>

            <Col span={12}>
              {" "}
              <Form.Item
                name="user_code"
                label="Mã nhân viên:"
                rules={[
                  { required: true, message: "Vui lòng nhập mã nhân viên" },
                ]}
              >
                <Input placeholder="Nhập mã nhân viên " />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="email"
                label="Email:"
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
            </Col>

            <Col span={12}>
              {" "}
              <Form.Item name="date_of_birth" label="Ngày sinh:">
                <Col className="w-full">
                  <DatePicker
                    onChange={(date) => handleDateChange(date)}
                    allowClear={false}
                    format={DATE_FORMAT}
                    className="w-full"
                  />
                </Col>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại:"
                rules={[
                  {
                    pattern: PHONE_PATTERN,
                    message: "Số điện thoại không đúng định dạng !",
                  },
                ]}
              >
                <Input placeholder="Nhập số điện thoại " />
              </Form.Item>
            </Col>

            <Col span={12}>
              {" "}
              <Form.Item
                name="position_id"
                label="Chức vụ:"
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
            </Col>

            <Col span={12}>
              <Form.Item
                name="department_id"
                label="Phòng ban:"
                rules={[
                  { required: true, message: "Vui lòng chọn phòng ban !" },
                ]}
              >
                <Select
                  className="w-full"
                  placeholder="Phòng ban"
                  options={departments?.map((e) => ({
                    value: e.id.toString(),
                    label: e.name,
                  }))}
                ></Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="password"
                label="Mật khẩu:"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu !" },
                ]}
              >
                <Input.Password placeholder="Mật khẩu" autoComplete="auto" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="telegram_chat_id" label="Telegram ID:">
                <InputNumber placeholder="ID telegram" className="w-full" />
              </Form.Item>
            </Col>

            <Col span={12}>
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
      </SpinCutom>
    </Modal>
  );
};

export default AddUser;
