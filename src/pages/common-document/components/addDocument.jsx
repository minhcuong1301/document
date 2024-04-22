import { UploadFile, SpinCustom } from "components";
import { useState } from "react";
import { actionAddDocument } from "../action";
import { useSelector } from "react-redux";
import {
  Modal,
  Input,
  Form,
  Row,
  Col,
  Button,
  message,
  Select,
  InputNumber,
  DatePicker,
} from "antd";
import { DATE_FORMAT } from "utils/constants/config";
import dayjs from "dayjs";

const AddDocument = ({
  idDocumentAdd,
  onCancel,
  handleGetListDocument,
  handleGetChildFolder,
  checkIsOpenWorkSpace,
  isRootFolder,
  checkIsOpenDoc,
  folderDepartment,
  checkSelectedFolderDT,
  checkSelectedFolderTL
}) => {
  const [form] = Form.useForm();
  const [files, setFiles] = useState([]);
  const [spinning, setSpinning] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState(null);

  const userLogin = useSelector((state) => state.profile);
  const department = useSelector((state) => state.departments);


  const handleAddDocument = async (values) => {
    setSpinning(true);
    try {
      const formData = new FormData();

      if (checkIsOpenDoc) {
        Object.keys(values).forEach((key) => {
          formData.append(key, values[key]);
        });
        files.forEach((file) => {
          formData.append("files", file);
        });

        if (userLogin?.position_code !== "ADMIN") {
          formData.append("department_id", userLogin?.department_id);
        }

        formData.append("document_type", 1);
        if (idDocumentAdd) {
          formData.append("document_id", idDocumentAdd);
        }
        const { data, status } = await actionAddDocument(formData);
        if (status === 200) {
          if (idDocumentAdd) {
            const idAdd = {
              id: idDocumentAdd,
            };
            await handleGetChildFolder(idAdd);
          } else {
            await handleGetListDocument();
          }
          message.success(data?.message);
          onCancel();
        }
      }
      if (checkIsOpenWorkSpace) {
        const params = {
          ...values,
          time_start: dayjs(values?.time_start).unix(),
          storage_time: values?.storage_time || null,
        };
        formData.append("document_type", 2);

        Object.keys(params).forEach((key) => {
          formData.append(key, params[key]);
        });

        const { data, status } = await actionAddDocument(formData);
        if (status === 200) {
          if (idDocumentAdd) {
            const idAdd = {
              id: idDocumentAdd,
            };
            await handleGetChildFolder(idAdd);
          } else {
            await handleGetListDocument();
          }
          message.success(data?.message);
          onCancel();
        }
      }
    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };
  const handleDisabledDate = (currentDate) => {
    return currentDate <= dayjs().startOf("day");
  };

  return (
    <Modal
      className="form-modal"
      footer={false}
      open={true}
      width={350}
      title="Thêm tài liệu"
    >
      <SpinCustom spinning={spinning}>
        <Form form={form} onFinish={handleAddDocument}>
          {checkIsOpenDoc && (
            <>
              <Form.Item name="name_folder" label="Tên tài liệu">
                <Input placeholder="Tên tài liệu" />
              </Form.Item>

              {userLogin?.position_code === "ADMIN" && isRootFolder ? (
                <Form.Item
                  name="department_id"
                  label="Phòng ban"
                  rules={[
                    { required: true, message: "Vui lòng chọn phòng ban" },
                  ]}
                >
                  <Select
                    className="w-full"
                    placeholder="Phòng ban"
                    onChange={(e) => setSelectedStatus(e)}
                    allowClear
                    value={selectedStatus}
                  >
                    {department.map((u) => (
                      <Select.Option key={u?.id} value={u.id}>
                        {u?.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : (
                <Form.Item
                  label="Phòng ban"
                  name="department_id"
                  rules={[
                    { required: false, message: "Vui lòng chọn phòng ban" },
                  ]}
                  initialValue={folderDepartment.split("").pop()}
                >
                  <Select
                    className="w-full"
                    placeholder={folderDepartment}
                    disabled
                  ></Select>
                </Form.Item>
              )}

              <Form.Item label="Tệp">
                <UploadFile setFiles={setFiles} files={files} />
              </Form.Item>
            </>
          )}

          {checkIsOpenWorkSpace && (
            <>
              <Form.Item
                name="name_folder"
                label="Tên tài liệu"
                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
              >
                <Input placeholder="Tên tài liệu" />
              </Form.Item>

              <Form.Item name="time_start" label="Thời gian bắt đầu">
                <DatePicker
                  format={DATE_FORMAT}
                  className="w-full"
                  disabledDate={handleDisabledDate}
                />
              </Form.Item>

              <Form.Item name="storage_time" label="Thời gian lưu trữ">
                <InputNumber className="w-full" min={0}></InputNumber>
              </Form.Item>

              <Form.Item name="object_description" label="Ghi chú">
                <Input.TextArea rows={4} />
              </Form.Item>
            </>
          )}

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Button className="w-full" onClick={onCancel}>
                Thoát
              </Button>
            </Col>

            <Col span={12}>
              <Button className="w-full" type="primary" htmlType="submit">
                Tạo tài liệu
              </Button>
            </Col>
          </Row>
        </Form>
      </SpinCustom>
    </Modal>
  );
};

export default AddDocument;
