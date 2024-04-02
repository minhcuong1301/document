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
  message,
  Checkbox,
} from "antd";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  actionGetlistEmpoyee,
  actionGetListRole,
  actionDecentralize,
} from "../action";
import { useSelector } from "react-redux";
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
  const [listRole, setlistRole] = useState([]);
  let [roleUser, setRoleUser] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleGetRoleUser = async () => {
    setSpinning(true);
    try {
      const params = {
        user_id: employee.id,
        doc_id: documentId,
      };
      const { data, status } = await actionGetListRole(params);
      if (status === 200) {
        setRoleUser(data?.data);
      }
    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };

  const handleCheckbox = (role) => {
    const list_role_id = roleUser.map((item) => {
      return item.id;
    });
    if (list_role_id.includes(role.id)) {
      roleUser = roleUser.filter((item) => item.id !== role.id);
    } else {
      roleUser.push(role);
    }
  };

  const handleSubmit = async () => {
    setSpinning(true);
    try {
      const list_role_id = roleUser.map((item) => {
        return item.id;
      });
      const params = {
        id_emp: employee.id,
        id_boss: userLogin.id,
        emp_role: list_role_id,
        doc_id: documentId,
      };
      let { data, status } = await actionDecentralize(params);
      if (status === 200) {
        setOpenRoleUser(false);
        message.success(data?.message);
      }
    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };

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
      width: 230,
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
    {
      title: "Quyền được cấp",
      dataIndex: "power",
      key: "power",
      align: "center",
      render: (record) => (
        <Space size="middle">
          <Checkbox>ok</Checkbox>
          <Checkbox>ok</Checkbox>
          <Checkbox>ok</Checkbox>
          <Checkbox>ok</Checkbox>
        </Space>
      ),
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

  const handleOpenChange = async () => {
    setSpinning(true);
    try {
      const { data, status } = await actionGetListRole();
      if (status === 200) {
        setlistRole(data?.data);
      }
    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    console.log("vua chon", value);
  };

  const handleClearSearch = () => {
    setSelectedOption(null);
  };

  // const handleSubmit = async () => {
  //   setSpinning(true);
  //   try {
  //     const list_role_id = roleUser.map((item) => {
  //       return item.id;
  //     });
  //     const params = {
  //       id_emp: employee.id,
  //       id_boss: userLogin.id,
  //       emp_role: list_role_id,
  //       doc_id: documentId,
  //     };
  //     let { data, status } = await actionDecentralize(params);
  //     if (status === 200) {
  //       onClose();
  //       message.success(data?.message);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   setSpinning(false);
  // };

  return (
    <Modal
      open={true}
      className="form-modal"
      width={800}
      height={550}
      onOk={handleSubmit}
      onCancel={onCancel}
      footer={[
        <Row gutter={[16, 0]}>
          <Col span={8}>
            <Button onClick={onCancel} className="power-modal-btn">
              Thoát
            </Button>
          </Col>
          ,
          <Col span={8}>
            <Button
              type="primary"
              className="power-modal-btn"
              onClick={handleSubmit}
            >
              Lưu
            </Button>
          </Col>
          ,
        </Row>,
      ]}
    >
      <SpinCustom spinning={spinning}>
        <Space direction="vertical" size={30}>
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
          <Table
            width="250"
            //
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
            pagination={false}
            scroll={{ y: 200 }}
          ></Table>
        </Space>
        {/* <Row gutter={[16, 0]}>
          <Col span={12}>
            <Button className="w-full" onClick={onCancel}>
              Thoát
            </Button>
          </Col>
          <Col span={12}>
            <Button className="w-full" type="primary">
              Lưu
            </Button>
          </Col>
        </Row> */}
        {/* <>
          {openRoleUser && (
            <RoleUser
              employee={employee}
              fileType={fileType}
              documentId={documentId}
              onClose={() => setOpenRoleUser(false)}
            />
          )}
        </> */}
      </SpinCustom>
    </Modal>
  );
};

export default Decentralize;
