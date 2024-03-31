import { SpinCustom } from "components";
import { Layout, Table, Row, Col, Button, Space, message } from "antd";
import { useEffect, useState } from "react";

import { actionGetListOverTime, actionCancelOverTime } from "../action";
import AddProcedure from "./addProcedureModal";
import RejectProcedureModal from "components/reject-procedure";
import ShowProcessingModal from "./showProcessingModal";

const ListOverTime = ({ columns }) => {
  const [spinning, setSpinning] = useState(false);

  //modal
  const [isOpenAddModal, setOpenAddModal] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);

  const [procedure, setProcedure] = useState();
  const [totalTable, setTotalTable] = useState(null);

  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
  });

  const handleChangePage = (page, pageSize) => {
    setPagination({
      current: page,
      pageSize: pageSize,
    });
  };

  const [listOverTime, setListOverTime] = useState([]);

  const handleCancelOverTime = async (procedure_id, rejection) => {
    setSpinning(true);

    try {
      const { data, status } = await actionCancelOverTime(procedure_id, {
        description: rejection,
      });
      if (status === 200) {
        message.success(data?.message);
        setTotalTable(data?.total);
        setListOverTime(data?.procedures);
      } else {
        message.error(data?.message);
      }
    } catch (err) {
      console.log(err);
      message.error(err);
    }

    setSpinning(false);
  };

  const columns2 = [
    {
      fixed: "left",
      width: 60,
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (v, r, i) =>
        i + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    pagination,
  ]
    .concat(columns)
    .concat([
      {
        width: 340,
        title: "",
        dataIndex: "detail_status_code",
        key: "operator",
        render: (v, r) => (
          <Space onClick={(e) => e.stopPropagation()}>
            {r?.status_code === "PENDING" && (
              <Button
                type="cancel"
                onClick={() => {
                  setProcedure(r?.id);
                }}
              >
                Hủy đơn
              </Button>
            )}

            <Button
              onClick={() => {
                console.log(r);
                setShowProcessingModal(r);
              }}
            >
              Xem trạng thái
            </Button>
          </Space>
        ),
        align: "center",
      },
    ]);

  const handleGetListOverTime = async () => {
    setSpinning(true);
    try {
      const { data, status } = await actionGetListOverTime();
      if (status === 200) {
        setListOverTime(data?.list_over_time);
      } else {
        message.error(data?.message);
      }
    } catch (err) {
      console.log(err);
      message.err(err);
    }
    setSpinning(false);
  };

  useEffect(() => {
    handleGetListOverTime();
  }, []);

  return (
    <Layout className="common-layout">
      <SpinCustom spinning={spinning}>
        <Row gutter={[8, 8]}>
          <Col>
            <Button type="primary" onClick={() => setOpenAddModal(true)}>
              Đề xuất
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              // onClick={() => setDataExport(dataTb1)}
            >
              Xuất pdf
            </Button>
          </Col>

          <Col span={24}>
            <Table
              className="tb-click-row"
              width="100%"
              columns={columns2}
              dataSource={listOverTime}
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
        {isOpenAddModal && (
          <AddProcedure
            onCancel={() => setOpenAddModal(false)}
            setListOverTime={setListOverTime}
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
        {procedure && (
          <RejectProcedureModal
            onCancel={() => setProcedure(null)}
            onRejection={(description) => {
              handleCancelOverTime(procedure, description);
              setProcedure(null);
            }}
          />
        )}
      </>
    </Layout>
  );
};

export default ListOverTime;
