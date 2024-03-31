import { SpinCustom } from "components";
import {
  Layout,
  Table,
  Row,
  Col,
  Button,
  Space,
  Popconfirm,
  message,
  Select,
} from "antd";
import ExportPdfModal from "./exportPdf";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ShowProcessingModal from "./showProcessingModal";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { DEATAIL_STATUS } from "utils/constants/config";
import {
  actionHandleGetListOverTimePending,
  actionGetStatusProcedures,
} from "../action";
const ListOVerTimeFisnish = ({
  columns,
  listOverTimePending,
  timeStart,
  timeEnd,
  nameSeach,
}) => {
  //status
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [statusProcedures, setStatusProceduress] = useState([]);
  const [statusSelectedTb3, setStatusSelectedTb3] = useState();

  const [filteredProcedures, setFilteredProcedures] = useState([]);
  const [searchParams] = useSearchParams();

  const [spinning, setSpinning] = useState(false);
  const procedureId = searchParams.get("procedure_id");
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [listOverTimeFinished, setListOverTimeFinished] = useState([]);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
  });
  const [dataExport, setDataExport] = useState();
  const [totalProduceFinished, setTotalProduceFinished] = useState(0);
  const [filteredDataTb3, setFilteredDataTb3] = useState([]);
  const [statusProceduresRequested, setStatusProceduressRequested] = useState(
    []
  );
  const handleGetListOverTimeFinished = async () => {
    setSpinning(true);
    try {
      const params = {
        name: nameSeach,

        procedure_id: procedureId || null,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };
      const { data, status } = await actionHandleGetListOverTimePending(params);
      if (status === 200) {
        setListOverTimeFinished(
          data?.list_overtime_pending?.filter(
            (item) =>
              item.detail_status_id !== DEATAIL_STATUS.PENDING &&
              (item.status_id === DEATAIL_STATUS.SUCCESS ||
                item.status_id === DEATAIL_STATUS.CANCEL)
          )
        );
        console.log(
          "cac dx ot finished:",
          data?.list_overtime_pending?.filter(
            (item) =>
              item.detail_status_id !== DEATAIL_STATUS.PENDING &&
              (item.status_id === DEATAIL_STATUS.SUCCESS ||
                item.status_id === DEATAIL_STATUS.CANCEL)
          )
        );
        setTotalProduceFinished(
          data?.list_overtime_pending.filter(
            (item) =>
              item.detail_status_id !== DEATAIL_STATUS.PENDING &&
              (item.status_id === DEATAIL_STATUS.SUCCESS ||
                item.status_id === DEATAIL_STATUS.CANCEL)
          ).length
        );
      } else {
        message.error(data?.message);
      }
    } catch (err) {
      console.log(err);
      message.error(err);
    }

    setSpinning(false);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    if (!value) {
      setFilteredProcedures(listOverTimeFinished);
    } else {
      const filteredData = listOverTimeFinished.filter(
        (procedure) => procedure.status_id === value
      );
      setFilteredProcedures(filteredData);
    }
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

  const handleChangePage = (page, pageSize) => {
    setPagination({
      current: page,
      pageSize: pageSize,
    });
  };
  const userLogin = useSelector((state) => state?.profile);

  const columns2 = [
    {
      width: 60,
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (v, r, i) =>
        i + 1 + (pagination.current - 1) * pagination.pageSize,
    },
  ]
    .concat(columns)
    .concat([
      {
        width: 240,
        title: "",
        dataIndex: "detail_status_code",
        key: "operator",
        render: (v, r) => (
          <Space onClick={(e) => e.stopPropagation()}>
            {v === "PENDING" && r?.approved_by === userLogin?.id ? (
              <>
                {" "}
                <Popconfirm
                  title="Bạn chắc chắn muốn xác nhận ?"
                  okText="Đồng ý"
                  cancelText="Hủy"
                  onConfirm={() => (r?.id, 1)}
                >
                  <Button type="primary">Phê duyệt</Button>
                </Popconfirm>
                <Button
                  type="cancel"
                  // onClick={() => setRejectProcedureId(r?.id)}
                >
                  Từ chối
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setShowProcessingModal(r)}>
                  Xem trạng thái
                </Button>
              </>
            )}
          </Space>
        ),
        align: "center",
      },
    ]);

  const handleExportPdfTb3 = async () => {
    setSpinning(false);
    try {
      const params = {
        procedure_id: procedureId || null,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };

      const { data, status } = await actionHandleGetListOverTimePending(params);

      if (status === 200) {
        setDataExport(
          data?.list_overtime_pending?.filter(
            (item) =>
              item.detail_status_id !== DEATAIL_STATUS.PENDING &&
              (item.status_id === DEATAIL_STATUS.SUCCESS ||
                item.status_id === DEATAIL_STATUS.CANCEL)
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleOptionChange = (selectedOption) => {
    setFilteredDataTb3(
      filteredDataTb3.filter(
        (item) => item.detail_status_id === selectedOption - 1
      )
    );
  };
  useEffect(() => {
    handleGetListOverTimeFinished();
  }, [timeStart, timeEnd, procedureId, nameSeach]);

  useEffect(() => {
    handleGetStatusProcedures();
  }, []);
  return (
    <Layout className="common-layout">
      <SpinCustom spinning={spinning}>
        <Row gutter={[8, 8]}>
          <Col>
            <Select
              className="w-full"
              placeholder="Chọn trạng thái"
              allowClear
              onChange={(v) => {
                window.navigatePage("overtime-procedure");
                setStatusSelectedTb3(v);
                handleOptionChange(v);
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
          <Col>
            <Button type="primary" onClick={() => handleExportPdfTb3()}>
              Xuất pdf
            </Button>
          </Col>

          <Col span={24}>
            <Table
              className="tb-click-row"
              width="100%"
              columns={columns2}
              dataSource={
                selectedStatus !== null
                  ? filteredProcedures
                  : listOverTimeFinished
              }
              rowKey={(r) => r.id}
              pagination={{
                pageSize: pagination.pageSize,
                current: pagination.current,
                onChange: handleChangePage,
              }}
              scroll={{ x: 1024 }}
            />
          </Col>
        </Row>
      </SpinCustom>
      <>
        {showProcessingModal && (
          <ShowProcessingModal
            showProcessingModal={showProcessingModal}
            onClose={() => {
              setShowProcessingModal(null);
            }}
          />
        )}
        {dataExport && (
          <ExportPdfModal
            data={dataExport}
            onCancel={() => setDataExport(null)}
          />
        )}
      </>
    </Layout>
  );
};

export default ListOVerTimeFisnish;
