import { SpinCustom, RejectProcedureModal } from "components";

import {
  Layout,
  Row,
  Col,
  Button,
  Table,
  Space,
  message
} from "antd";
import dayjs from 'dayjs'

import { useEffect, useState } from "react";
import { actionHandleGetSalaryUser } from '../../payroll/action'
import { actionCreatePropose, actionHandlePropose } from '../action';
import { PROPOSE_STATUS, PROPOSE_DISPLAY } from 'utils/constants/config'
import { useSelector } from "react-redux";

const SumTotalWorking = ({ start }) => {
  const userLogin = useSelector((state) => state?.profile);
  const [spinning, setSpinning] = useState(false)

  const [listWorking, setListWorking] = useState([])
  const [salaryid, setSalaryId] = useState()
  const [openModalCreatePopose, setOpenModalCreatePopose] = useState()
  const [openModalHandlePopose, setOpenModalHandlePopose] = useState()
  const [stt, setStatus] = useState()


  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
  });

  const checkRole = () => {
    return (userLogin.position_code === "GIAM_DOC"
      || userLogin.position_code === "P_GIAM_DOC"
      || (userLogin.position_code === "TRUONG_PHONG" && userLogin.department_code === "PB6")
    )
  }

  const createPropose = async (describe) => {
    setSpinning(true)
    try {
      const { data, status } = await actionCreatePropose(salaryid, stt, { description: describe });
      if (status === 200) {
        setListWorking(JSON.parse(data?.list_slary));
        message.success(data?.message)
      }

    } catch (err) {
      message.error(err)
    }
    setSpinning(false)
  }

  const handlePropose = async (describe) => {
    setSpinning(true)
    try {
      const { data, status } = await actionHandlePropose(salaryid, stt, { feedback: describe });
      if (status === 200) {
        setListWorking(JSON.parse(data?.list_slary));
        message.success(data?.message)
      }

    } catch (err) {
      message.error(err)
    }
    setSpinning(false)
  }

  const columns = [
    {
      fixed: "left",
      width: "1.7%",
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => (
        <Space>
          {index + 1 + (pagination.current - 1) * pagination.pageSize}
        </Space>
      ),
    },
    {
      title: "MS",
      dataIndex: "id",
      width: "1.5%",
      key: "id",
      align: "center",
    },
    {
      title: "Họ và tên",
      width: "4%",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Bộ phận",
      width: "4%",
      dataIndex: "dep_name",
      key: "dep_name",
      align: "center",
    },
    {
      title: "Chức danh",
      dataIndex: "pos_name",
      width: "4%",
      key: "pos_name",
      align: "center",
    },
    {
      title: "Tổng ngày công",
      width: "2%",
      dataIndex: "working_standard",
      key: "working_standard",
      align: "center",
    },
    {
      title: "Ngày công thực tế",
      width: "2%",
      dataIndex: "total_working_day",
      key: "total_working_day",
      align: "center",
    },
    {
      title: "Ngày nghỉ lễ tết",
      width: "2%",
      dataIndex: "holiday",
      key: "holiday",
      align: "center",
    },
    {
      title: "Ngày nghỉ phép",
      dataIndex: "leave_allow_day",
      width: "2%",
      key: "leave_allow_day",
      align: "center",
    },
    {
      title: "Ngày nghỉ không phép",
      dataIndex: "leave_not_allow_day",
      key: "leave_not_allow_day",
      width: "2%",
      align: "center",
    },
    {
      title: "Ngày công tác",
      dataIndex: "day_bussiness",
      width: "2%",
      key: "day_bussiness",
      align: "center",
    },
    {
      title: "Làm thêm giờ ngày thường",
      dataIndex: "over_time_weekday",
      width: "2%",
      key: "overtime_weekday",
      align: "center",
    },
    {
      title: "Làm thêm giờ ngày nghỉ",
      dataIndex: "over_time_weeken",
      width: "2%",
      key: "over_time_weeken",
      align: "center",
    },
    {
      title: "Làm thêm giờ ngày lễ tết",
      dataIndex: "over_time_holiday",
      width: "2%",
      key: "over_time_holiday",
      align: "center",
    },
    {
      title: "Phút việc riêng",
      dataIndex: "free_time_day",
      width: "2%",
      key: "free_time_day",
      align: "center",
    },
    {
      title: "Kiến nghị",
      dataIndex: "description",
      width: "5%",
      key: "description",
      align: "center",
    },
    {
      title: "Phản hồi",
      dataIndex: "feedback",
      width: "5%",
      key: "feedback",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "4%",
      key: "status",
      align: "center",
      render: (v, r) => {
        return PROPOSE_DISPLAY[r?.status]
      }
    },
    {
      title: "Thao tác ",
      dataIndex: "edit",
      width: "5%",
      key: "edit",
      render: (v, r) => (
        <Space onClick={(e) => e.stopPropagation()}>
          {(userLogin.id === r?.id && r?.status === null) && <Button
            type="primary"
            onClick={() => {
              setSalaryId(r?.salary_id);
              setStatus(PROPOSE_STATUS.ACCEPT)
              createPropose(null)
            }}
          >
            Xác nhận
          </Button>}

          {(userLogin.id === r?.id && r?.status === null) && <Button
            type="info"
            onClick={() => {
              setSalaryId(r?.salary_id);
              setStatus(PROPOSE_STATUS.PROPOSE)
              setOpenModalCreatePopose(true)
            }}
          >
            Kiến nghị
          </Button>}

          {(checkRole() && (userLogin.id !== r?.id) && r?.status === PROPOSE_STATUS.PROPOSE) && <Button Button
            type="primary"
            onClick={() => {
              setSalaryId(r?.salary_id);
              setStatus(PROPOSE_STATUS.ACCEPT_PROPOSE)
              setOpenModalHandlePopose(true)
            }}
          >
            Đồng ý
          </Button>}

          {(checkRole() && (userLogin.id !== r?.id) && r?.status === PROPOSE_STATUS.PROPOSE) && <Button Button
            type="info"
            onClick={() => {
              setSalaryId(r?.salary_id);
              setStatus(PROPOSE_STATUS.REFUSE_PROPOSE)
              setOpenModalHandlePopose(true)
            }}
          >
            Từ chối
          </Button>}
        </Space>


      ),
      align: "center",
    }
  ];

  const handleChangePage = (page, pageSize) => {
    setPagination({
      current: page,
      pageSize: pageSize,
    });
  };

  const handleGetListWorking = async () => {
    setSpinning(true)
    try {

      const params = {
        user_id: checkRole() ? null : userLogin.id
      }

      const { data, status } = await actionHandleGetSalaryUser(dayjs(start).startOf('D').unix(), params)
      if (status === 200) {
        setListWorking(JSON.parse(data?.list_slary));
      }
    } catch (err) {
      message.error(err)
    }
    setSpinning(false)
  }

  useEffect(() => {
    handleGetListWorking()
  }, [start])


  return (
    <Layout className="common-layout">
      <div className="common-layout--content">
        <SpinCustom spinning={spinning}>
          <Col>
            <Row gutter={[8, 0]} align="middle">
              <Col>
                <Table
                  width="100%"
                  dataSource={listWorking}
                  rowKey={(r) => r.id}
                  columns={columns}
                  pagination={{
                    pageSize: pagination.pageSize,
                    current: pagination.current,
                    onChange: handleChangePage,
                  }}
                  scroll={{ x: 1900 }}
                />
              </Col>
            </Row>
          </Col>
        </SpinCustom>
      </div>
      <>
        {openModalCreatePopose &&
          <RejectProcedureModal
            onCancel={() => setOpenModalCreatePopose(false)}
            onRejection={(describe) => {
              createPropose(describe)
              setSalaryId(null)
              setOpenModalCreatePopose(false)
            }}
          />
        }

        {openModalHandlePopose && <RejectProcedureModal
          onCancel={() => setOpenModalHandlePopose(false)}
          onRejection={(describe) => {
            handlePropose(describe)
            setSalaryId(null)
            setOpenModalHandlePopose(false)
          }}
        />}
      </>
    </Layout>
  );
};

export default SumTotalWorking;
