import {
  Button, Row, Col, Avatar,
  Modal
} from "antd"
import { DefaultAvatar } from "assets"
import {
  ExclamationCircleOutlined,
  PhoneOutlined,
  GoldOutlined
} from "@ant-design/icons"

import { REACT_APP_SERVER_BASE_URL } from "utils/constants/config"

import './index.scss'

const InfoUserModal = ({ onClose, isOpenUserModal, onChangePassword}) => {
  return (
    <Modal
      title="Thông tin nhân viên"
      open={true}
      closeIcon={false}
      width={280}
      className='common-modal employee-profile-modal'
      footer={<Row gutter={[8, 0]}>
        <Col span={12}>
          <Button onClick={onClose} className='w-full'>Thoát</Button>
        </Col>

       
      </Row>}
    >
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Row gutter={[16, 0]}>
            <Col>
              <Avatar shape='square'
               size={48} 
               src={`${REACT_APP_SERVER_BASE_URL}${isOpenUserModal?.avatar}`.replace("server","")}
              />
            </Col>
            <Col>
              <div className='employee-name'>{isOpenUserModal?.name}</div>
              <div>{isOpenUserModal?.email}</div>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <Row gutter={[6, 4]}>
            <Col>
              <PhoneOutlined />
            </Col>

            <Col>{isOpenUserModal?.phone || "Số điện thoại"}</Col>
          </Row>
        </Col>

        <Col span={24}>
          <Row gutter={[6, 4]}>
            <Col>
              <GoldOutlined />
            </Col>

            <Col>{isOpenUserModal?.position_name}</Col>
          </Row>
        </Col>

        <Col span={24}>
          <Row gutter={[6, 4]}>
            <Col>
              <ExclamationCircleOutlined />
            </Col>

            <Col>{isOpenUserModal?.department_name}</Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
}

export default InfoUserModal