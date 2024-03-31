import { Layout, Row, Col, DatePicker, Input, Tabs, Select } from "antd";
import KeepingHistory from "./components/historyKeeping";
import ListKeeping from "./components/ListKeeping";
import { useState } from "react";
import { DATE_FORMAT, DEPARTMENTS_CODE } from "../../utils/constants/config";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import FreeTime from "./components/FreeTime";
import SumTotalWorking from "./components/sumTotalWorking";

const ManagerKeeping = () => {
  const [start, setStart] = useState(dayjs().startOf("day"));
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [nameSeach, setNameSeach] = useState("");
  const [tabKey, setTabKey] = useState("1");
  const userLogin = useSelector((state) => state?.profile);
  const department = useSelector((state) => state?.departments);
  const [timeStart, setTimeStart] = useState(dayjs().startOf("month"));
  const [timeEnd, setTimeEnd] = useState(dayjs().startOf());

  const items = [
    userLogin.position_code !== "GIAM_DOC" &&
      userLogin.position_code !== "P_GIAM_DOC" && {
        key: "1",
        label: "Lịch sử chấm công",
        children: <KeepingHistory start={timeEnd} />,
      },
    (userLogin.position_code === "GIAM_DOC" ||
      userLogin.position_code === "P_GIAM_DOC" ||
      department.find((item) => item.id === userLogin.department_id).code ===
        "PB6") && {
      key: "2",
      label: "Danh sách chấm công",
      children: (
        <ListKeeping
          start={timeEnd}
          selectedStatus={selectedStatus}
          nameSeach={nameSeach}
        />
      ),
    },
    {
      key: "3",
      label: "Phút việc riêng",
      children: <FreeTime start={timeEnd} />,
    },
    {
      key: "4",
      label: "Tổng ngày công",
      children: <SumTotalWorking start={timeEnd} />,
    },
  ];

  const onChange = (key) => {
    setTabKey(key);
  };

  const handleDateChange = (newEndDate) => {
    setTimeEnd(newEndDate);
    console.log("ngay end", newEndDate);
    // Update startDate to first day of the new end date's month
    setTimeStart(newEndDate.startOf("month"));
    console.log("ngay start", newEndDate.startOf("month"));
  };

  return (
    <Layout className="common-layout">
      <div className="common-layout--header">
        <Row className="filler" gutter={[8, 8]}>
          <Col className="filler--item">
            <Row gutter={[8, 8]}>
              <Col>
                <Row gutter={[8, 0]} align="middle">
                  <Col>Từ</Col>

                  <Col>
                    <DatePicker
                      format={DATE_FORMAT}
                      value={timeStart}
                      onChange={(v) => {
                        window.navigatePage("keepingtimes");
                        setTimeStart(v);
                      }}
                    />
                  </Col>
                </Row>
              </Col>
              <Col className="align--center">
                <Col>Đến</Col>
                <DatePicker
                  onChange={(v) => {
                    window.navigatePage("keepingtimes");

                    handleDateChange(v);
                  }}
                  value={timeEnd}
                  allowClear={false}
                  format={DATE_FORMAT}
                />
              </Col>
            </Row>
          </Col>

          <>
            {(tabKey === "2" || tabKey === "3") && (
              <Col className="filler--item">
                <Input.Search
                  onSearch={(v) => {
                    setNameSeach(v);
                  }}
                  placeholder="Nhập tên ..."
                  allowClear
                />
              </Col>
            )}

            {tabKey === "2" && (
              <Col>
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
              </Col>
            )}
          </>
        </Row>
      </div>

      <div className="common-layout--content">
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </Layout>
  );
};

export default ManagerKeeping;
