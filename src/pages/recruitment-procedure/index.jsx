import { useState, useEffect } from "react";
import { SpinCustom } from "components";
import { useSelector } from "react-redux";
import { DATETIME_FORMAT, DATE_FORMAT } from "utils/constants/config";
import AddProcedureModal from "./components/addProcedureModal";
import { RejectProcedureModal } from "components";
import { useSearchParams } from "react-router-dom";
import ProcedureDetailModal from "./components/procedureDetailModal";
import { DEPARTMENTS_CODE } from "utils/constants/config";
import ExportPdfModal from "./components/exportPdfScheduleModal";
import moment from "moment";
import dayjs from "dayjs";
import { DEATAIL_STATUS } from "utils/constants/config";
import ApproveProcedureModal from "./components/approveProcedureModal";
import ShowProcessingModal from "./components/showProcessingModal";
import {
  actionGetRecruitmentProcedures,
  actionGetPendingRecruitmentProcedures,
  actionApproveRecruitmentProcedure,
  actionCanCelProcedure,
  actionDeleteRequest,
  actionGetStatusProcedures,
} from "./actions";

import {
  Layout,
  Table,
  Select,
  Row,
  Col,
  Button,
  Space,
  Popconfirm,
  Tabs,
  DatePicker,
  message,
  Input,
} from "antd";

import CvTab from "./components/cvTab";
import ReceiveJob from "./components/receiveJob";

import AddCv from "./components/addCvModal";
import ScheduleTab from "./components/scheduleTab";

const RecruitmentProcedure = () => {
  const [spinning, setSpinning] = useState(false);
  const userLogin = useSelector((state) => state?.profile);

  const [searchParams] = useSearchParams();

  //modal
  const [isOpenAddModal, setOpenAddModal] = useState(false);
  const [openAddCv, setOpenAddCv] = useState(false);

  //status
  const [statusProcedures, setStatusProceduress] = useState([]);
  const [statusProceduresRequested, setStatusProceduressRequested] = useState(
    []
  );
  const [selectedStatus, setSelectedStatus] = useState(null);
  const procedureStatus = useSelector((state) => state?.procedureStatus);
  const proceduresDetailStatus = useSelector(
    (state) => state?.proceduresDetailStatus
  );

  //procedure
  const [totalProduceFinished, setTotalProduceFinished] = useState(0);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [filteredProcedures, setFilteredProcedures] = useState([]);
  const [proceduresFinished, setProceduressFinished] = useState([]);

  //id
  const [rejectProcedureId, setRejectProcedureId] = useState();
  const [procedureIdCancel, setProcedureIdCancel] = useState();
  const [recruitmentId, setRecruitmentId] = useState();
  const procedureId = searchParams.get("procedure_id");

  //detail
  const [isRecordShowDetail, setRecordShowDetail] = useState();

  //export
  const [dataExport, setDataExport] = useState();

  //table data
  const [dataTb, setDataTb] = useState([]);

  // fillter
  const [timeStart, setTimeStart] = useState(
    dayjs().startOf("day").subtract(30, "day")
  );
  const [timeEnd, setTimeEnd] = useState(dayjs().endOf("day"));
  const [nameSeach, setNameSeach] = useState("");
  const [positionSeach, setPositionSeach] = useState("");

  // table 1
  const [dataTb1, setDataTb1] = useState([]);
  const [totalRecordTb1, setTotalRecordTb1] = useState(0);
  const [statusSelectedTb1, setStatusSelectedTb1] = useState(1);
  const [approveProcedureId, setApproveProcedureId] = useState();

  const tab = searchParams.get("tabKey");

  const [paginationTab1, setPaginationTab1] = useState({
    page_num: 1,
    page_size: 10,
  });

  // table 2
  const [dataTb2, setDataTb2] = useState([]);
  const [totalRecordTb2, setTotalRecordTb2] = useState(0);
  const [statusSelectedTb2, setStatusSelectedTb2] = useState();

  const [paginationTab2, setPaginationTab2] = useState({
    page_num: 1,
    page_size: 10,
  });

  const [tabKey, setTabKey] = useState(tab || "tab-1");

  // table 3
  const [dataTb3, setDataTb3] = useState([]);
  const [totalRecordTb3, setTotalRecordTb3] = useState(0);
  const [statusSelectedTb3, setStatusSelectedTb3] = useState();
  const [paginationTab3, setPaginationTab3] = useState({
    page_num: 1,
    page_size: 10,
  });

  const handleGetStatusProceduresRequested = async () => {
    try {
      const { data, status } = await actionGetStatusProcedures();
      if (status === 200) {
        const newData = data.slice(0, 1).concat(data.slice(2));
        setStatusProceduressRequested(newData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    if (!value) {
      setFilteredProcedures(proceduresFinished);
    } else {
      const filteredData = proceduresFinished.filter(
        (procedure) => procedure.status_id === value
      );
      setFilteredProcedures(filteredData);
    }
  };

  const handlePendingProcedureChangePage = async (page_num, page_size) => {
    setPaginationTab1({ page_num, page_size });
    setSpinning(true);
    try {
      const params = {
        procedure_id: procedureId,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };

      const { data, status } = await actionGetPendingRecruitmentProcedures(
        params
      );
      if (status == 200) {
        setDataTb1(data?.procedures);
        setTotalRecordTb1(
          data?.procedures.filter((item) => {
            return (
              item.detail_status_id === DEATAIL_STATUS.PENDING ||
              (item.detail_status_id === DEATAIL_STATUS.D_CONFIRMED &&
                item.status_id === DEATAIL_STATUS.PENDING)
            );
          }).length
        );

        setTotalProduceFinished(
          data?.procedures.filter(
            (item) =>
              item.detail_status_id !== DEATAIL_STATUS.PENDING &&
              (item.status_id === DEATAIL_STATUS.SUCCESS ||
                item.status_id === DEATAIL_STATUS.CANCEL)
          ).length
        );
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleFinishedProcedureChangePage = async (page_num, page_size) => {
    setPaginationTab3({ page_num, page_size });
    setSpinning(true);
    try {
      const params = {
        procedure_id: procedureId,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };

      const { data, status } = await actionGetPendingRecruitmentProcedures(
        params
      );
      if (status == 200) {
        setDataTb1(data?.procedures);
        setTotalRecordTb1(
          data?.procedures.filter((item) => {
            return (
              item.detail_status_id === DEATAIL_STATUS.PENDING ||
              (item.detail_status_id === DEATAIL_STATUS.D_CONFIRMED &&
                item.status_id === DEATAIL_STATUS.PENDING)
            );
          }).length
        );

        setTotalProduceFinished(
          data?.procedures.filter(
            (item) =>
              item.detail_status_id !== DEATAIL_STATUS.PENDING &&
              (item.status_id === DEATAIL_STATUS.SUCCESS ||
                item.status_id === DEATAIL_STATUS.CANCEL)
          ).length
        );
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleGetPendingRecruitmentProcedures = async (page_num, page_size) => {
    setSpinning(true);
    try {
      setPaginationTab1({ page_num, page_size });

      const params = {
        procedure_id: procedureId || null,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };

      const { data, status } = await actionGetPendingRecruitmentProcedures(
        params
      );

      if (status === 200) {
        setDataTb1(data?.procedures);
        setProceduressFinished(
          data?.procedures.filter(
            (item) =>
              item.detail_status_id !== DEATAIL_STATUS.PENDING &&
              (item.status_id === DEATAIL_STATUS.SUCCESS ||
                item.status_id === DEATAIL_STATUS.CANCEL)
          )
        );
        setTotalRecordTb1(
          data?.procedures.filter((item) => {
            return (
              item.detail_status_id === DEATAIL_STATUS.PENDING ||
              (item.detail_status_id === DEATAIL_STATUS.D_CONFIRMED &&
                item.status_id === DEATAIL_STATUS.PENDING)
            );
          }).length
        );
      }
      setTotalProduceFinished(
        data?.procedures.filter(
          (item) =>
            item.detail_status_id !== DEATAIL_STATUS.PENDING &&
            (item.status_id === DEATAIL_STATUS.SUCCESS ||
              item.status_id === DEATAIL_STATUS.CANCEL)
        ).length
      );
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleGetRecruitmentProcedures = async (page_num, page_size) => {
    setSpinning(true);
    try {
      setPaginationTab2({ page_num, page_size });

      const params = {
        procedure_id: procedureId || null,
        status_id: statusSelectedTb2,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };

      const { data, status } = await actionGetRecruitmentProcedures(params);

      if (status === 200) {
        setDataTb2(data?.procedures);
        setTotalRecordTb2(data?.total);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleGetStatusProcedures = async () => {
    try {
      const { data, status } = await actionGetStatusProcedures();
      if (status === 200) {
        const newData = data.slice(2, 4);
        setStatusProceduress(newData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleApproveRecruitmentProcedure = async (
    procdect_id,
    isStatus,
    description
  ) => {
    setSpinning(true);
    try {
      const { data, status } = await actionApproveRecruitmentProcedure(
        procdect_id,
        isStatus,
        { description }
      );
      if (status === 200) {
        message.success(data?.message);

        // get new data
        handleGetPendingRecruitmentProcedures(1, 10);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
    handleGetPendingRecruitmentProcedures();
  };

  const handleDeleteRequest = async (id, page_num, page_size) => {
    setSpinning(true);
    try {
      // setPaginationTab({ page_num, page_size })
      const params = {
        page_num,
        page_size,
        recruitment_id: recruitmentId || null,
      };

      const { status, data } = await actionDeleteRequest(id, params);

      if (status === 200) {
        message.success(data?.message);
        setDataTb1(data?.procedures);
        setDataTb(data?.procedures);
        setDataTb2(data?.procedures);
        setTotalRecordTb1(data?.total);
        setTotalRecordTb2(data?.total);
        // setTotalRecordTb(data?.total)
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleCancleProcedure = async (procedure_id, description) => {
    setSpinning(true);
    try {
      setPaginationTab2({ page_num: 1, page_size: 10 });

      const params = {
        page_num: 1,
        page_size: 10,
        procedure_id: procedureId || null,
        status_id: statusSelectedTb2,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };

      const { data, status } = await actionCanCelProcedure(
        procedure_id,
        description,
        params
      );

      if (status === 200) {
        setDataTb2(data?.procedures);
        setTotalRecordTb2(data?.total);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const columns = [
    {
      // fixed: 'left',
      width: 80,
      title: "Mã số",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Người đề xuất",
      dataIndex: "created_by",
      key: "created_by",
      align: "center",
    },
    {
      title: "Thời gian đề xuất",
      dataIndex: "time_created",
      key: "time_created",
      render: (v) => moment(v * 1000).format(DATETIME_FORMAT),
      align: "center",
    },
    {
      title: "Phòng ban",
      dataIndex: "department_name",
      key: "department_name",
      align: "center",
    },
    {
      width: 180,
      title: "Trạng thái",
      dataIndex: "status_code",
      key: "status_code",
      render: (v, r) => {
        let statusClass;
        switch (v) {
          case "PENDING":
            statusClass = "process--waiting";
            break;
          case "D_CONFIRMED":
            statusClass = "process--waiting";
            break;
          case "SUCCESS":
            statusClass = "process--success";
            break;
          case "CANCEL":
            statusClass = "process--cancel";
            break;
          default:
            statusClass = "process";
        }
        return v === "SUCCESS" ? (
          <span className={statusClass}>Đang tuyển dụng</span>
        ) : (
          <span className={statusClass}>{r?.status}</span>
        );
      },
      align: "center",
    },
  ];

  const columns1 = [
    {
      width: 60,
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (v, r, i) =>
        i + 1 + (paginationTab1.page_num - 1) * paginationTab1.page_size,
    },
  ]
    .concat(columns)
    .concat([
      {
        width: 450,
        title: "",
        dataIndex: "detail_status_code",
        key: "operator",
        render: (v, r) => (
          <Space onClick={(e) => e.stopPropagation()}>
            {v === "PENDING" && r?.approved_by === userLogin?.id && (
              <>
                <Button
                  type="primary"
                  onClick={() => setApproveProcedureId(r?.id)}
                >
                  Xác nhận
                </Button>
                <Button
                  type="cancel"
                  onClick={() => setRejectProcedureId(r?.id)}
                >
                  Từ chối
                </Button>
              </>
            )}

            {v === "CONFIRMED" &&
              (userLogin?.department_id === 6 ||
                userLogin?.position_code === "GIAM_DOC") && (
                <>
                  <Button onClick={() => setOpenAddCv(r?.recruitment_id)}>
                    Thêm hồ sơ
                  </Button>

                  <Popconfirm
                    title={"Bạn chắc chắn muốn xóa?"}
                    okText={"Xóa"}
                    cancelText="Hủy"
                    onConfirm={() => handleDeleteRequest(r.id)}
                  >
                    <Button type="cancel">Xóa đề xuất</Button>
                  </Popconfirm>
                </>
              )}

            {
              <Button onClick={() => setShowProcessingModal(r)}>
                Xem trạng thái
              </Button>
            }
          </Space>
        ),
        align: "center",
      },
    ]);

  const columns2 = [
    {
      width: 60,
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (v, r, i) =>
        i + 1 + (paginationTab2.page_num - 1) * paginationTab2.page_size,
    },
  ]
    .concat(columns)
    .concat([
      {
        width: 240,
        title: "",
        dataIndex: "status",
        key: "operator",
        render: (v, r) => (
          <Space onClick={(e) => e.stopPropagation()}>
            {r?.status_code == "PENDING" && (
              <Button type="cancel" onClick={() => setProcedureIdCancel(r?.id)}>
                Hủy đơn
              </Button>
            )}

            {r?.status_code === "SUCCESS" && userLogin?.department_id === 6 && (
              <>
                <Button onClick={() => setOpenAddCv(r?.recruitment_id)}>
                  Thêm hồ sơ
                </Button>

                <Popconfirm
                  title={"Bạn chắc chắn muốn xóa?"}
                  okText={"Xóa"}
                  cancelText="Hủy"
                  onConfirm={() => handleDeleteRequest(r.id)}
                >
                  <Button type="cancel">Xóa đề xuất</Button>
                </Popconfirm>
              </>
            )}
            <Button onClick={() => setShowProcessingModal(r)}>
              Xem trạng thái
            </Button>
          </Space>
        ),
        align: "center",
      },
    ]);

  const columns3 = [
    {
      width: 60,
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (v, r, i) =>
        i + 1 + (paginationTab3.page_num - 1) * paginationTab3.page_size,
    },

    {
      width: 80,
      title: "Mã số",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Người đề xuất",
      dataIndex: "created_by",
      key: "created_by",
      align: "center",
    },
    {
      title: "Thời gian đề xuất",
      dataIndex: "time_created",
      key: "time_created",
      render: (v) => moment(v * 1000).format(DATETIME_FORMAT),
      align: "center",
    },
    {
      title: "Phòng ban",
      dataIndex: "department_name",
      key: "department_name",
      align: "center",
    },
    {
      width: 180,
      title: "Trạng thái",
      dataIndex: "status_code",
      key: "status_code",
      render: (v, r) => {
        let statusClass;
        switch (v) {
          case "PENDING":
            statusClass = "process--waiting";
            break;
          case "D_CONFIRMED":
            statusClass = "process--waiting";
            break;
          case "SUCCESS":
            statusClass = "process--success";
            break;
          case "CANCEL":
            statusClass = "process--cancel";
            break;
          default:
            statusClass = "process";
        }
        return v === "SUCCESS" ? (
          <span className={statusClass}>Đang tuyển dụng</span>
        ) : (
          <span className={statusClass}>{r?.status}</span>
        );
      },
      align: "center",
    },
    {
      width: 150,
      title: "",
      dataIndex: "detail_status_code",
      key: "operator",
      render: (v, r) => (
        <>
          <Space>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setShowProcessingModal(r);
              }}
            >
              Xem trạng thái
            </Button>
          </Space>
        </>
      ),
      align: "center",
    },
  ];

  const Tab1 = () => {
    return (
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Table
            className="tb-click-row"
            width="100%"
            rowKey={(r) => r.id}
            columns={columns1}
            dataSource={dataTb1.filter((item) => {
              return (
                item.detail_status_id === DEATAIL_STATUS.PENDING ||
                (item.detail_status_id === DEATAIL_STATUS.D_CONFIRMED &&
                  item.status_id === DEATAIL_STATUS.PENDING)
              );
            })}
            onRow={(r) => ({
              onClick: () => {
                setRecordShowDetail(r);
                setRecruitmentId(r?.recruitment_id);
              },
            })}
            pagination={{
              current: paginationTab1.page_num,
              pageSize: paginationTab1.page_size,
              total: totalRecordTb1,
              onChange: handlePendingProcedureChangePage,
            }}
            scroll={{ x: 1024 }}
          />
        </Col>
      </Row>
    );
  };

  const Tab2 = () => (
    <Row gutter={[8, 8]}>
      <Col>
        <Button type="primary" onClick={() => setOpenAddModal(true)}>
          Đề xuất tuyển dụng
        </Button>
      </Col>
      {statusProceduresRequested && (
        <Col>
          <Select
            className="w-full"
            placeholder="Chọn trạng thái"
            allowClear
            onChange={(v) => {
              window.navigatePage("general-purchase-procedure");
              setStatusSelectedTb2(v);
            }}
            value={statusSelectedTb2}
          >
            {statusProceduresRequested.map((item) => (
              <Select.Option key={item?.id} value={item?.id}>
                {item?.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
      )}
      <Col span={24}>
        <Table
          className="tb-click-row"
          width="100%"
          rowKey={(r) => r.id}
          columns={columns2}
          dataSource={dataTb2}
          onRow={(r) => ({
            onClick: () => {
              setRecordShowDetail(r);
              setRecruitmentId(r?.recruitment_id);
            },
          })}
          pagination={{
            current: paginationTab2.page_num,
            pageSize: paginationTab2.page_size,
            total: totalRecordTb2,
            onChange: handleGetRecruitmentProcedures,
          }}
          scroll={{ x: 1024 }}
        />
      </Col>
    </Row>
  );

  const Tab3 = () => {
    return (
      <Row gutter={[8, 8]}>
        {proceduresDetailStatus && (
          <Col>
            <Select
              className="w-full"
              placeholder="Chọn trạng thái"
              allowClear
              onChange={(v) => {
                window.navigatePage("recruitment-procedure");
                setStatusSelectedTb3(v);
                handleStatusChange(v);
              }}
              value={statusSelectedTb3}
            >
              {statusProcedures.map((item) => (
                <Select.Option key={item?.id} value={item?.id}>
                  {item?.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
        )}

        <Col span={24}>
          <Table
            className="tb-click-row"
            width="100%"
            rowKey={(r) => r.id}
            columns={columns3}
            dataSource={
              selectedStatus !== null ? filteredProcedures : proceduresFinished
            }
            onRow={(r) => ({
              onClick: () => {
                setRecordShowDetail(r);
                setRecruitmentId(r?.recruitment_id);
              },
            })}
            pagination={{
              current: paginationTab3.page_num,
              pageSize: paginationTab3.page_size,
              total: totalProduceFinished,
              onChange: handleFinishedProcedureChangePage,
            }}
            scroll={{ x: 1024 }}
          />
        </Col>
      </Row>
    );
  };
  const TabItem = [
    (userLogin.position_code === "GIAM_DOC" ||
      userLogin.position_code === "P_GIAM_DOC" ||
      userLogin.position_code === "TRUONG_PHONG" ||
      userLogin.position_code === "KE_TOAN" ||
      userLogin.position_code === "THU_QUY" ||
      userLogin.department_id === 6) && {
      key: "tab-1",
      label: "Danh sách chờ duyệt",
      children: <Tab1 />,
    },
    (userLogin.position_code === "GIAM_DOC" ||
      userLogin.position_code === "P_GIAM_DOC" ||
      userLogin.position_code === "TRUONG_PHONG" ||
      userLogin.position_code === "KE_TOAN" ||
      userLogin.position_code === "THU_QUY" ||
      userLogin.department_id === 6) && {
      key: "tab-2",
      label: "Đề xuất hoàn thành",
      children: <Tab3 />,
    },
    {
      key: "tab-3",
      label: "Danh sách đã đề xuất",
      children: <Tab2 />,
    },

    {
      key: "tab-4",
      label: "Hồ sơ ứng viên",
      children: (
        <CvTab
          setTabKey={setTabKey}
          nameSeach={nameSeach}
          selectedStatus={selectedStatus}
          recruitmentId={recruitmentId}
          dataTb={dataTb}
          setDataTb={setDataTb}
          setRecruitmentId={setRecruitmentId}
          timeEnd={timeEnd}
          timeStart={timeStart}
          positionSeach={positionSeach}
        />
      ),
    },
    {
      key: "tab-5",
      label: "Lịch phỏng vấn",
      children: <ScheduleTab timeEnd={timeEnd} timeStart={timeStart} />,
    },
    {
      key: "tab-6",
      label: "Nhận việc",
      children: <ReceiveJob timeEnd={timeEnd} timeStart={timeStart} />,
    },
  ];

  const handleSelectedTabKey = (e) => {
    setTabKey(e);
    window.history.pushState(null, null, `?tabKey=${e}`);
  };

  useEffect(() => {
    handleGetPendingRecruitmentProcedures(1, 10);
  }, [procedureId, timeStart, timeEnd, statusSelectedTb1]);

  useEffect(() => {
    handleGetStatusProcedures();
  }, []);

  useEffect(() => {
    handleGetRecruitmentProcedures(1, 10);
  }, [procedureId, timeStart, timeEnd, statusSelectedTb2]);
  useEffect(() => {
    handleGetStatusProceduresRequested();
  }, []);
  return (
    <Layout className="common-layout">
      <SpinCustom spinning={spinning}>
        <div className="common-layout--header">
          <Row gutter={[8, 8]}>
            <Col>
              <Row gutter={[8, 0]} align="middle">
                <Col>Từ</Col>

                <Col>
                  <DatePicker
                    format={DATE_FORMAT}
                    defaultValue={timeStart}
                    onChange={(v) => {
                      window.navigatePage("recruitment-procedure");
                      setTimeStart(v);
                    }}
                  />
                </Col>
              </Row>
            </Col>

            <Col>
              <Row gutter={[8, 0]} align="middle">
                <Col>Đến</Col>
                <Col>
                  <DatePicker
                    format={DATE_FORMAT}
                    defaultValue={timeEnd}
                    onChange={(v) => {
                      window.navigatePage("recruitment-procedure");
                      setTimeEnd(v);
                    }}
                  />
                </Col>
              </Row>
            </Col>

            {tabKey === "tab-3" && (
              <Col>
                <Input.Search
                  onChange={(v) => {
                    setNameSeach(v.target.value);
                  }}
                  placeholder="Nhập tên ..."
                  allowClear
                />
              </Col>
            )}
            {tabKey === "tab-3" && (
              <Col>
                <Input.Search
                  onChange={(v) => {
                    setPositionSeach(v.target.value);
                  }}
                  placeholder="Vị trí ..."
                  allowClear
                />
              </Col>
            )}

            {tabKey === "tab-3" && (
              <Col className="filler--item">
                <Select
                  className="w-full"
                  placeholder="Phòng ban"
                  onChange={setSelectedStatus}
                  allowClear
                >
                  {Object.keys(DEPARTMENTS_CODE).map((key) => (
                    <Select.Option key={key} value={key}>
                      {DEPARTMENTS_CODE[key]}
                    </Select.Option>
                  ))}
                </Select>
                <></>
              </Col>
            )}
          </Row>
        </div>

        <div key={tabKey} className="common-layout--content">
          <Tabs
            items={TabItem}
            defaultActiveKey={tabKey}
            onTabClick={(e) => handleSelectedTabKey(e)}
          />
        </div>
      </SpinCustom>

      <>
        {isOpenAddModal && (
          <AddProcedureModal
            onCancel={() => setOpenAddModal(false)}
            setData={setDataTb2}
          />
        )}
        {showProcessingModal && (
          <ShowProcessingModal
            showProcessingModal={showProcessingModal}
            onClose={() => {
              setShowProcessingModal(null);
            }}
          />
        )}
        {isRecordShowDetail && (
          <ProcedureDetailModal
            onCancel={() => setRecordShowDetail(null)}
            record={isRecordShowDetail}
            recruitmentId={recruitmentId}
            setTabKey={setTabKey}
          />
        )}
        {approveProcedureId && (
          <ApproveProcedureModal
            onCancel={() => {
              setApproveProcedureId(null);
            }}
            onOk={(description) => {
              handleApproveRecruitmentProcedure(
                approveProcedureId,
                1,
                description
              );
              setApproveProcedureId(null);
            }}
          />
        )}{" "}
        {approveProcedureId && (
          <ApproveProcedureModal
            onCancel={() => {
              setApproveProcedureId(null);
            }}
            onOk={(description) => {
              handleApproveRecruitmentProcedure(
                approveProcedureId,
                1,
                description
              );
              setApproveProcedureId(null);
            }}
          />
        )}
        {rejectProcedureId && (
          <RejectProcedureModal
            onCancel={() => setRejectProcedureId(null)}
            onRejection={(description) => {
              handleApproveRecruitmentProcedure(
                rejectProcedureId,
                2,
                description
              );
              setRejectProcedureId(null);
            }}
          />
        )}
        {procedureIdCancel && (
          <RejectProcedureModal
            onCancel={() => setProcedureIdCancel(null)}
            onRejection={(description) => {
              handleCancleProcedure(procedureIdCancel, description);
              setProcedureIdCancel(null);
            }}
          />
        )}
        {dataExport && (
          <ExportPdfModal
            data={dataExport}
            onCancel={() => setDataExport(null)}
            userLogin={userLogin}
          />
        )}
        {openAddCv && (
          <AddCv
            openAddCv={openAddCv}
            onCancel={() => setOpenAddCv(false)}
            setTabKey={setTabKey}
            setRecruitmentId={setRecruitmentId}
            // setData={setDataTb2}
            dataTb={dataTb}
            setDataTb={setDataTb}
          />
        )}
      </>
    </Layout>
  );
};

export default RecruitmentProcedure;
