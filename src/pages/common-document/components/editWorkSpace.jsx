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
                time_start: dayjs(values?.time_start).startOf('D').unix(),
                time_end: dayjs(values?.time_end).endOf('D').unix(),

            }
            const params = {
                time_start: dayjs(values?.time_start).startOf('D').unix(),
                time_end: dayjs(values?.time_end).endOf('D').unix(),
                document_type: 2
            }
            const formData = new FormData()
            Object.keys(data_req).forEach(key => {
                formData.append(key, data_req[key]);
            })

            const { data, status } = await actionUpdateWorkSpace(openEdit?.id, formData, params)
            if (status === 200) {
                message.success(data?.message)
                setListDocument(data?.data)
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

    const handleDateChangeStart = (date) => {
        form.setFieldValue("time_start", date);
    };

    const handleDateChangeEnd = (date) => {
        form.setFieldValue("time_end", date);
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
                        time_start: dayjs(openEdit?.time_start * 1000),
                        time_end: dayjs(openEdit?.time_end * 1000),
                    }}
                >

                    {openEdit?.type == 2 &&
                        <>
                            <Form.Item name='object_description'>
                                <Input.TextArea rows={4} placeholder='Ghi chú'
                                    onChange={(event) => setObjectDescription(event.target.value)}
                                />
                            </Form.Item>

                            <Form.Item name="time_start"
                                label="Ngày bắt đầu"
                            >
                                <DatePicker
                                    format={DATE_FORMAT}
                                    allowClear={false}
                                    className="w-full"
                                    disabledDate={handleDisabledDate}
                                    onChange={(date) => handleDateChangeStart(date)}
                                />

                            </Form.Item>

                            <Form.Item name="time_end"
                                label="Ngày kết thúc "
                            >
                                <DatePicker
                                    format={DATE_FORMAT}
                                    className="w-full"
                                    allowClear={false}
                                    disabledDate={handleDisabledDate}
                                    onChange={(date) => handleDateChangeEnd(date)}
                                />
                            </Form.Item>
                        </>
                    }

                    {
                        openEdit?.type == 3 &&
                        <>
                           

                            <Form.Item name='object_name' label="Tên đối tượng"
                            >
                                <Input placeholder='Tên đối tượng'
                                    onChange={(event) => setObjectName(event.target.value)}
                                />
                            </Form.Item>

                            <Form.Item name='object_address'label="Địa chỉ">
                                <Input placeholder='Địa chỉ'
                                    onChange={(event) => setObjectAddress(event.target.value)}
                                />
                            </Form.Item>

                            <Form.Item name='object_identity'label="Số CCCD">
                                <Input placeholder='Số CCCD'
                                    onChange={(event) => setCCCD(event.target.value)}
                                />
                            </Form.Item>

                            <Form.Item name='object_description'label="Ghi chú">
                                <Input.TextArea rows={4} placeholder='Ghi chú'
                                    onChange={(event) => setObjectDescription(event.target.value)}
                                />
                            </Form.Item>

                            <Form.Item name="image" label="Ảnh:">
                                <UploadImage
                                    maxCount={1}
                                    files={files}
                                    setFiles={setFiles}
                                    defaultFile={openEdit?.image}
                                />
                            </Form.Item>

                            <Form.Item name="time_start"
                                label="Ngày bắt đầu"
                            >
                                <DatePicker
                                    format={DATE_FORMAT}
                                    allowClear={false}
                                    className="w-full"
                                    disabledDate={handleDisabledDate}
                                    onChange={(date) => handleDateChangeStart(date)}
                                />

                            </Form.Item>

                            <Form.Item name="time_end"
                                label="Ngày kết thúc "
                            >
                                <DatePicker
                                    format={DATE_FORMAT}
                                    className="w-full"
                                    allowClear={false}
                                    disabledDate={handleDisabledDate}
                                    onChange={(date) => handleDateChangeEnd(date)}
                                />
                            </Form.Item>


                        </>
                    }


                    <Row gutter={[16, 0]}>
                        <Col span={12}>
                            <Button className="w-full"
                                onClick={onCancel}
                            >Thoát</Button>
                        </Col>

                        <Col span={12}>
                            <Button className="w-full" type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </SpinCustom>
        </Modal>
    );
};

export default EditWorkSpace;