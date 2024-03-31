import { useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import dayjs from "dayjs";
import { Layout, Row, Col, Tabs, DatePicker, Input } from "antd";
import ListOverTimeFisnish from "./components/ListOverTimeFisnish";
import ListOVerTimePending from "./components/ListVOverTimePending";
import ListOverTime from "./components/listOverTime";
import { DATE_FORMAT, TYPE_OVER_TIME } from "utils/constants/config";
import ApproveProcedureModal from "./components/approveProcedureModal";

const OverTimeProcedure = () => {
  const userLogin = useSelector((state) => state?.profile);
  const [nameSeach, setNameSeach] = useState("");
  const [searchParams] = useSearchParams();

  const [listOverTimePending, setListOverTimePending] = useState([]);
  // filter time
  const [timeStart, setTimeStart] = useState(
    dayjs().startOf("day").subtract(30, "day")
  );
  const [timeEnd, setTimeEnd] = useState(dayjs().endOf("day"));

  const tab = searchParams.get("tabKey");
  const [tabKey, setTabKey] = useState(tab || "tab-1");

  const columns = [
    {
      width: 80,
      title: "Mã số",
      dataIndex: "id",
      key: "id",
    },
    {
      width: 140,

      title: "Người đề xuất",
      dataIndex: "created_by",
      key: "created_by",
      align: "center",
    },
    {
      width: 160,

      title: "Ngày làm thêm ",
      dataIndex: "day",
      key: "day",
      render: (v) => moment(v * 1000).format(DATE_FORMAT),
      align: "center",
    },
    {
      width: 160,

      title: "Số giờ làm thêm ",
      dataIndex: "total_time",
      key: "total_time",
      align: "center",
    },
    {
      width: 160,

      title: "Nội dung công việc",
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      width: 140,

      title: "Kiểu làm thêm giờ",
      dataIndex: "over_time_type",
      key: "over_time_type",
      render: (v) => TYPE_OVER_TIME[v],
      align: "center",
    },
    {
      width: 200,
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

        return <span className={statusClass}>{r?.status}</span>;
      },
      align: "center",
    },
  ];

  const TabItem = [
    (userLogin.position_code === "GIAM_DOC" ||
      userLogin.position_code === "P_GIAM_DOC" ||
      userLogin.position_code === "HANH_CHINH" ||
      userLogin.position_code === "TRUONG_PHONG" ||
      userLogin.position_code === "KE_TOAN" ||
      userLogin.position_code === "THU_QUY" ||
      userLogin.department_id === 6) && {
      key: "tab-1",
      label: "Danh sách chờ duyệt",
      children: (
        <ListOVerTimePending
          columns={columns}
          setListOverTimePending={setListOverTimePending}
          listOverTimePending={listOverTimePending}
          timeStart={timeStart}
          timeEnd={timeEnd}
          nameSeach={nameSeach}
        />
      ),
    },
    (userLogin.position_code === "GIAM_DOC" ||
      userLogin.position_code === "P_GIAM_DOC" ||
      userLogin.position_code === "HANH_CHINH" ||
      userLogin.position_code === "TRUONG_PHONG" ||
      userLogin.position_code === "KE_TOAN" ||
      userLogin.position_code === "THU_QUY" ||
      userLogin.department_id === 6) && {
      key: "tab-2",
      label: "Đề xuất hoàn thành",
      children: (
        <ListOverTimeFisnish
          columns={columns}
          listOverTimePending={listOverTimePending}
          timeStart={timeStart}
          timeEnd={timeEnd}
          nameSeach={nameSeach}
        />
      ),
    },
    userLogin.position_code !== "GIAM_DOC" && {
      key: "tab-3",
      label: "Danh sách đã đề xuất",
      children: (
        <ListOverTime
          columns={columns}
          timeStart={timeStart}
          nameSeach={nameSeach}
          timeEnd={timeEnd}
        />
      ),
    },
  ];

  const handleSelectedTabKey = (e) => {
    setTabKey(e);
    window.history.pushState(null, null, `?tabKey=${e}`);
  };

  return (
    <Layout className="common-layout">
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
                    window.navigatePage("overtime-procedure");
                    setTimeStart(v);
                    console.log("time start", v);
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
                    window.navigatePage("overtime-procedure");
                    setTimeEnd(v);
                    console.log("time end", v);
                  }}
                />
              </Col>
            </Row>
          </Col>

          <Col>
            <Row gutter={[8, 0]} align="middle">
              <Col>
                <Input.Search
                  onSearch={(v) => {
                    setNameSeach(v);
                  }}
                  placeholder="Nhập tên ..."
                  allowClear
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      <div className="common-layout--content">
        <Tabs
          items={TabItem}
          defaultActiveKey={tabKey}
          onTabClick={(e) => handleSelectedTabKey(e)}
        />
      </div>
    </Layout>
  );
};

export default OverTimeProcedure;
