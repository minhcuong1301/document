import { useState } from "react";
import {
  DATE_FORMAT,
  EMAIL_PATTERN,
  PHONE_PATTERN,
} from "utils/constants/config";
import { useSelector } from "react-redux";
import SpinCutom from "components/spin-custom";
import moment from "moment";
import { actionUpdateUser } from "../actions";

import {
  Modal,
  Row,
  Col,
  Button,
  Form,
  Input,
  Select,
  Space,
  message,
  DatePicker,
} from "antd";
import dayjs from "dayjs";

const EditUser = ({ onClose, setUser, editUser }) => {
  const departments = useSelector((state) => state?.departments);
  const positions = useSelector((state) => state?.positions);
  const [form] = Form.useForm();
  const [callingApi, setCallApi] = useState(false);
  const handleEditUser = async () => {
    setCallApi(true);

    form
      .validateFields()
      .then(async (values) => {
        const data_req = {
          ...values,
          phone: values.phone || null,
          department_id: values.department_id || null,
          date_of_birth: moment(values.date_of_birth).valueOf() / 1000 || null,
        };
        if (values?.telegram_chat_id) {
          data_req.telegram_chat_id = values.telegram_chat_id || null;
        }
        if (values?.phone) {
          data_req.phone = values.phone || null;
        }
        console.log(data_req);

        const { data, status } = await actionUpdateUser(editUser?.id, data_req);
        if (status == 200) {
          message.success(data?.message);
          setUser(data?.employees);
          onClose();
        }
      })
      .catch((err) => console.log(err));
    setCallApi(false);
  };

  const handleDateChange = (date) => {
    form.setFieldValue("date_of_birth", date);
  };

  return (
    <Modal
      open={true}
      closeIcon={false}
      title="Sửa nhân viên"
      className="common-long-modal"
      width={500}
      footer={
        <Row gutter={[16, 0]} justify={"center"}>
          <Col>
            <Button onClick={onClose} className="w-full">
              Thoát
            </Button>
          </Col>
          <Col>
            <Button className="w-full" onClick={handleEditUser} type="primary">
              Cập nhật
            </Button>
          </Col>
        </Row>
      }
    >
      <SpinCutom SpinCutom spinning={callingApi}>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            ...editUser,
            birthday: dayjs(editUser?.birthday * 1000),
          }}
        >
          <Row>
            <Col span={24}>
              <Row gutter={30}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                    label="Họ và tên:"
                  >
                    <Input placeholder="Nhập tên " />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      {
                        pattern: EMAIL_PATTERN,
                        message: "Email không đúng định dạng !",
                      },
                    ]}
                    label="Email:"
                  >
                    <Input placeholder="Nhập email " />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={30}>
                {/* <Space size="large"> */}
                <Col span={12}>
                  <Form.Item name="date_of_birth" label="Ngày sinh:">
                    <Col className="w-full">
                      <DatePicker
                        onChange={(date) => handleDateChange(date)}
                        allowClear={false}
                        format={DATE_FORMAT}
                      />
                    </Col>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    rules={[
                      {
                        pattern: PHONE_PATTERN,
                        message: "Số điện thoại không đúng định dạng !",
                      },
                    ]}
                    label="Số điện thoại:"
                  >
                    <Input placeholder="Nhập số điện thoại " />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={30}>
                <Col span={12}>
                  <Form.Item
                    name="position_id"
                    rules={[
                      { required: true, message: "Vui lòng chọn chức vụ !" },
                    ]}
                    label="Vị trí"
                  >
                    <Select
                      className="w-full"
                      placeholder="chức vụ"
                      options={Object.entries(
                        positions?.filter((a) => a?.code !== "GIAM_DOC")
                      )?.map((e) => ({
                        value: e[1].id,
                        label: e[1].name,
                      }))}
                    ></Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="department_id" label="Phòng ban">
                    <Select
                      showSearch
                      className="w-full"
                      placeholder="Phòng ban"
                      options={Object.entries(departments)?.map((e) => ({
                        value: e[1].id,
                        label: e[1].name,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="telegram_chat_id" label="Telegram ID:">
                <Input placeholder="Nhập telegram id " />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </SpinCutom>
    </Modal>
  );
};

export default EditUser;
