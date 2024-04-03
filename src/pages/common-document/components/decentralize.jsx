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

  //liet ke cac quyen duoc cap
  const [listRole, setlistRole] = useState([]);
  let [roleUser, setRoleUser] = useState([]);

  const handleGetRoleUser = async (employee) => {
    setSpinning(true);
    try {
      const params = {
        user_id: employee.id,
        doc_id: documentId,
      };
      const { data, status } = await actionGetListRole(params);
      if (status === 200) {
        setRoleUser(data?.data);
        console.log("roleusers", data);
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
    //bug
    {
      title: "Quyền được cấp",
      dataIndex: "power",
      key: "power",
      align: "center",
      render: (f, v) => {
        // handleGetRoleUser(v);
        console.log("employee", v);
        handleGetRoleUser(v);

        // console.log("v", v);
        return (
          <Space size="middle">
            {listRole.map((item, index) => {
              if (fileType === 2) {
                if (item.code !== "R1") {
                  return (
                    <Row key={index}>
                      <Checkbox
                        defaultChecked={roleUser
                          .map((item) => {
                            return item.id;
                          })
                          .includes(item.id)}
                        onChange={(e) => {
                          handleCheckbox(item);
                          console.log("handlecheckbox", e);
                        }}
                      >
                        {item.name}
                      </Checkbox>
                    </Row>
                  );
                }
              } else {
                return (
                  <Row key={index}>
                    <Checkbox
                      defaultChecked={roleUser
                        .map((item) => {
                          return item.id;
                        })
                        .includes(item.id)}
                      onChange={(e) => handleCheckbox(item)}
                    >
                      {item.name}
                    </Checkbox>
                  </Row>
                );
              }
            })}
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    handleGetListEmployee();
    handleGetListEmployeeOptions();
    handleShowPowers();
  }, []);

  useEffect(() => {
    handleGetListEmployeeOptions();
    // console.log(
    //   "list nv filter:",
    //   listEmployee.filter((item) => {
    //     return item.name == selectedOption;
    //   })
    // );
    handleShowPowers();
  }, [selectedOption]);

  const handleShowPowers = async () => {
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

  return (
    <Modal
      open={true}
      className="form-modal"
      width={800}
      height={470}
      onOk={handleSubmit}
      onCancel={onCancel}
      // footer={[
      //   <Row gutter={[16, 0]}>
      //     <Col span={8}>
      //       <Button onClick={onCancel} className="power-modal-btn">
      //         Thoát
      //       </Button>
      //     </Col>
      //     ,
      //     <Col span={8}>
      //       <Button
      //         type="primary"
      //         className="power-modal-btn"
      //         onClick={handleSubmit}
      //       >
      //         Lưu
      //       </Button>
      //     </Col>
      //     ,
      //   </Row>,
      // ]}
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
      </SpinCustom>
    </Modal>
  );
};

export default Decentralize;
