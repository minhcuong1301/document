import { SpinCustom } from "components";
import {
  Button,
  Col,
  Row,
  Modal,
  Table,
  Input,
  Space,
  Select,
  Spin,
} from "antd";
import { useEffect, useState, useMemo, useRef } from "react";
import { actionGetlistEmpoyee } from "../action";
import { useSelector } from "react-redux";
import RoleUser from "./roleUser";
import debounce from "lodash/debounce";
const { Option } = Select;

//debounce function for searching

const Decentralize = ({ onCancel, documentId, department, fileType }) => {
  const [spinning, setSpinning] = useState(false);
  const [nameUser, setNameUser] = useState([]);
  const [openRoleUser, setOpenRoleUser] = useState(false);
  const [listEmployee, setListEmployee] = useState([]);
  const [employee, setEmployee] = useState();
  const userLogin = useSelector((state) => state.profile);
  const [selectedOption, setSelectedOption] = useState();
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
  });
  const [listEmployeeOption, setListEmployeeOption] = useState([]);

  const handleChangePage = (page, pageSize) => {
    setPagination({
      current: page,
      pageSize: pageSize,
    });
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleGetListEmployee = async () => {
    setSpinning(true);
    try {
      const params = {
        department_id: department || userLogin.department_id,
        name: selectedOption,
      };
      let { data, status } = await actionGetlistEmpoyee(params);
      if (status === 200) {
        console.log("data", data);
        setListEmployee(
          data.filter(
            (item) =>
              item.position_code !== "MANAGER" &&
              item.position_code !== "P_MANAGER" &&
              item.position_code !== "ADMIN"
          )
        );
        setListEmployeeOption(
          data.filter(
            (item) =>
              item.position_code !== "MANAGER" &&
              item.position_code !== "P_MANAGER" &&
              item.position_code !== "ADMIN"
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };

  const handleGetListEmployeeOptions = async () => {
    setSpinning(true);
    try {
      const params = {
        department_id: department || userLogin.department_id,
      };
      let { data, status } = await actionGetlistEmpoyee(params);
      if (status === 200) {
        setListEmployeeOption(
          data.filter(
            (item) =>
              item.position_code !== "MANAGER" &&
              item.position_code !== "P_MANAGER" &&
              item.position_code !== "ADMIN"
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };
  //search with debounce
  const handleSearch = debounce((value) => {
    setSelectedOption(value);
    console.log("value", value);
  }, 2000);

  const columns = [
    {
      fixed: "left",
      width: 60,
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
      title: "Tên",
      dataIndex: "name",
      key: "name",
      align: "center",
      onCell: (cell) => {
        return {
          onClick: (record, rowIndex) => {
            setOpenRoleUser(record);
            setEmployee(cell);
          },
        };
      },
    },
  ];

  useEffect(() => {
    handleGetListEmployee();
    handleGetListEmployeeOptions();
    console.log("listemployee", listEmployee);
  }, []);

  useEffect(() => {
    handleGetListEmployeeOptions();
    console.log("listemployee", listEmployee);
    console.log(
      "list nv filter:",
      listEmployee.filter((item) => {
        return item.name == selectedOption;
      })
    );
  }, [selectedOption]);

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    console.log("vua chon", value);
  };

  const handleClearSearch = () => {
    setSelectedOption(null);
  };
  return (
    <Modal
      open={true}
      title="Phân quyền"
      className="form-modal"
      footer={true}
      width={300}
      height={350}
    >
      <SpinCustom spinning={spinning}>
        <Row>
          {/* <Input.Search
            placeholder="Nhập tên ..."
            onSearch={(v) => {
              setNameUser(v);
            }}
          /> */}
          <Select
            mode="multiple"
            value={selectedOption}
            showSearch
            style={{
              width: "100%",
              height: "40px",
            }}
            className="employee-searchbar"
            placeholder="Chọn hoặc nhập tên để tìm kiếm nhân viên"
            onChange={handleOptionChange}
            onSearch={handleSearch}
            onClear={handleClearSearch}
          >
            {listEmployeeOption.map((item) => (
              <Option key={item.id} value={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Row>
        <Table
          width="250"
          height="300"
          dataSource={
            selectedOption?.length > 0
              ? listEmployee.filter((item) => {
                  return item.name == selectedOption;
                })
              : listEmployee
          }
          columns={columns}
          rowKey={(r) => r.id}
          scroll={{ y: 200 }}
          pagination={{
            pageSize: pagination.pageSize,
            current: pagination.current,
            onChange: handleChangePage,
          }}
        ></Table>
        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Button className="w-full" onClick={onCancel}>
              Thoát
            </Button>
          </Col>
        </Row>
        <>
          {openRoleUser && (
            <RoleUser
              employee={employee}
              fileType={fileType}
              documentId={documentId}
              onClose={() => setOpenRoleUser(false)}
            />
          )}
        </>
      </SpinCustom>
    </Modal>
  );
};

export default Decentralize;
