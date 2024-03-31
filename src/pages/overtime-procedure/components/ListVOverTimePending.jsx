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
} from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  actionHandleGetListOverTimePending,
  actionApproveOverTime,
} from "../action";
import { useSearchParams } from "react-router-dom";
import ApproveProcedureModal from "./approveProcedureModal";

import { useEffect } from "react";
import { STATUS } from "utils/constants/config";
import dayjs from "dayjs";
import ExportPdfModal from "./exportPdf";
import ShowProcessingModal from "./showProcessingModal";
import RejectProcedureModal from "components/reject-procedure";
const ListOVerTimePending = ({
  nameSeach,
  columns,
  listOverTimePending,
  setListOverTimePending,
  timeStart,
  timeEnd,
}) => {
  const [spinning, setSpinning] = useState(false);

  //modal
  const [showProcessingModal, setShowProcessingModal] = useState(false);

  //id
  const [rejectProcedureId, setRejectProcedureId] = useState();
  const [approveProcedureId, setApproveProcedureId] = useState();

  const [searchParams] = useSearchParams();
  const [dataExport, setDataExport] = useState();
  const procedureId = searchParams.get("procedure_id");

  //paginate
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
  });

  const handleExportPdfTb1 = async () => {
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
          data?.list_overtime_pending.filter(
            (item) => item?.status_code === "PENDING"
          )
        );
        console.log(
          "data cho duyet ot:",
          data?.list_overtime_pending.filter(
            (item) => item?.status_code === "PENDING"
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };
  const handleChangePage = (page, pageSize) => {
    setPagination({
      current: page,
      pageSize: pageSize,
    });
  };
  const userLogin = useSelector((state) => state?.profile);

  const handleGetListOverTimePending = async () => {
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
        console.log("ten dang search:", nameSeach);
        setListOverTimePending(data?.list_overtime_pending);
      } else {
        message.error(data?.message);
      }
    } catch (err) {
      console.log(err);
      message.error(err);
    }

    setSpinning(false);
  };

  const handleApproveOverTime = async (procedure_id, stt, description) => {
    setSpinning(true);
    try {
      const params = {
        description,
      };
      const { data, status } = await actionApproveOverTime(
        procedure_id,
        stt,
        params
      );
      if (status === 200) {
        setListOverTimePending(data?.list_overtime_pending);
      } else {
        message.error(data?.message);
      }
    } catch (err) {
      console.log(err);
      message.error(err);
    }

    setSpinning(false);
  };

  const columns1 = [
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
            {
              <>
                <Button onClick={() => setShowProcessingModal(r)}>
                  Xem trạng thái
                </Button>
                <Button type="primary" onClick={() => setDataExport([r])}>
                  Xuất PDF
                </Button>
              </>
            }
          </Space>
        ),
        align: "center",
      },
    ]);

  useEffect(() => {
    handleGetListOverTimePending(null);
  }, [timeStart, timeEnd, procedureId, nameSeach]);

  return (
    <Layout className="common-layout">
      <SpinCustom spinning={spinning}>
        <Row gutter={[8, 8]}>
          <Col>
            <Button
              type="primary"
              // onClick={() => setDataExport(dataTb1)}
              onClick={() => handleExportPdfTb1()}
            >
              Xuất pdf
            </Button>
          </Col>

          <Col span={24}>
            <Table
              className="tb-click-row"
              width="100%"
              columns={columns1}
              dataSource={listOverTimePending.filter(
                (item) => item?.status_code === "PENDING"
              )}
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

        {approveProcedureId && (
          <ApproveProcedureModal
            onCancel={() => {
              setApproveProcedureId(null);
            }}
            onOk={(description) => {
              handleApproveOverTime(
                approveProcedureId,
                STATUS["ACCEPT"],
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
              handleApproveOverTime(
                rejectProcedureId,
                STATUS["REFUSE"],
                description
              );
              setRejectProcedureId(null);
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

export default ListOVerTimePending;
