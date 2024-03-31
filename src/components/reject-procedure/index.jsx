import { Modal, Row, Col, Button, Form, Input } from "antd";

const RejectProcedureModal = ({ onCancel, onRejection }) => {
  const handleRejectProcedure = async (values) => {
    onRejection(values?.description);
  };

  return (
    <Modal
      open={true}
      closeIcon={false}
      title="Từ chối / hủy đơn"
      className="form-modal"
      width={350}
      footer={false}
    >
      <Form
        layout="vertical"
        className="commom-form"
        onFinish={handleRejectProcedure}
      >
        <Form.Item
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
        >
          <Input.TextArea rows={3} placeholder="Lý do từ chối" />
        </Form.Item>

        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Button className="w-full" onClick={onCancel}>
              Thoát
            </Button>
          </Col>

          <Col span={12}>
            <Button className="w-full" htmlType="submit" type="primary">
              Lưu
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default RejectProcedureModal;
