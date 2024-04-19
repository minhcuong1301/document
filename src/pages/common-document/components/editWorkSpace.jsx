import React, { useState } from 'react';
import { SpinCustom, UploadImage } from 'components';
import { actionUpdateNameFile, actionGetListFolderChid, actionUpdateWorkSpace } from '../action';
import { Modal, Form, Input, Row, Button, Col, message, DatePicker, InputNumber, } from 'antd';
import { DATE_FORMAT } from 'utils/constants/config';
import dayjs from 'dayjs';


const EditWorkSpace = ({ oldName, openEdit, onCancel, idFile, idDocumentAdd, handleGetListDocument, setListDocument }) => {
    console.log(openEdit);
    const [form] = Form.useForm();
    const [spining, setSpinning] = useState(false)
    const [nameWorkSpace, setNameWorkSpace] = useState(openEdit?.name)
    const [objectName, setObjectName] = useState(openEdit?.object_name)
    const [objectAddress, setObjectAddress] = useState(openEdit?.object_address)
    const [cccd, setCCCD] = useState(openEdit?.object_identity)
    const [objectDescription, setObjectDescription] = useState(openEdit?.object_description)
    const [files, setFiles] = useState([]);

    const hanleEditNameFile = async () => {
        setSpinning(true)
        form.validateFields().then(async (values) => {

      
            const data_req = {
              ...values,
              object_description: values?.object_description || ' ',
              time_start: dayjs(values?.time_start).unix(),
    
            }
            const formData = new FormData()
            Object.keys(data_req).forEach(key => {          
                formData.append(key, data_req[key]);
              })
    
            const { data, status } = await actionUpdateWorkSpace(openEdit?.id,formData )
            if (status === 200) {
              message.success(data?.message)
    
            //   setDataTb(data?.list_appliant)
            //   setTotalRecordTb(data?.total)
              onCancel()
            }
          })
          .catch(
            err => console.log(err)
          )
          setSpinning(false)
    
    }


    const handleDisabledDate = (currentDate) => {
        return currentDate <= dayjs().startOf("day");
    };
    const handleDateChange = (date) => {
        form.setFieldValue("time_start", date);
    };

    return (
        <Modal
            className="form-modal"
            width={350}
            footer={false}
            open={true}
            title="Sửa"
        >
            <SpinCustom spinning={spining}>
                <Form
                    form={form}
                    onFinish={hanleEditNameFile}
                    initialValues={{
                        ...openEdit,
                       
                    }}
                >
                    {/* <Form.Item name='name'>
                        <Input placeholder='Tên workspace'
                            onChange={(event) => setNameWorkSpace(event.target.value)}
                        />
                    </Form.Item> */}

                    {/* <Form.Item name='object_name'>
                        <Input placeholder='Tên đối tượng'
                            onChange={(event) => setObjectName(event.target.value)}
                        />
                    </Form.Item> */}

                    {/* <Form.Item name='object_address'>
                        <Input placeholder='Địa chỉ'
                          onChange={(event) => setObjectAddress(event.target.value)}
                        />
                    </Form.Item> */}

                    {/* <Form.Item name='object_identity'>
                        <Input placeholder='Số CCCD'
                          onChange={(event) => setCCCD(event.target.value)}
                        />
                    </Form.Item> */}

                    <Form.Item name='object_description'>
                        <Input.TextArea rows={4} placeholder='Ghi chú'
                          onChange={(event) => setObjectDescription(event.target.value)}
                        />
                    </Form.Item>

                    {/* <Form.Item name="image">
                        <Row>
                            <Col>Ảnh:</Col>

                            <Col className="w-full">
                                <UploadImage
                                    maxCount={1}
                                    files={files}
                                    setFiles={setFiles}
                                    defaultFile={openEdit?.image}
                                />
                            </Col>
                        </Row>
                    </Form.Item> */}

                    <Form.Item name="time_start"
                        label="Thời gian bắt đầu"
                    >
                        <Row gutter={[4, 0]}>
                            <Col className="w-full">
                                <DatePicker
                                    format={DATE_FORMAT}
                                    className="w-full"
                                    defaultValue={dayjs(openEdit?.time_start * 1000)}
                                    disabledDate={handleDisabledDate}
                                    onChange={(date) => handleDateChange(date)}
                                />
                            </Col></Row>

                    </Form.Item>

                    <Form.Item name="storage_time"
                        label="Thời gian lưu trữ"
                    >
                        <InputNumber className="w-full" min={0} ></InputNumber>
                    </Form.Item>


                    <Row gutter={[16, 0]}>
                        <Col span={12}>
                            <Button className="w-full"
                                onClick={onCancel}
                            >Thoát</Button>
                        </Col>

                        <Col span={12}>
                            <Button className="w-full" type="primary" htmlType="submit">
                                Đổi tên
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </SpinCustom>
        </Modal>
    );
};

export default EditWorkSpace;