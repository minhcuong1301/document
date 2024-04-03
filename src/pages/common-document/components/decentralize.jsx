import { SpinCustom } from "components";
import {
  Button,
  Col, Row, Modal, Table,
  Space, Select, message,
  Checkbox, Radio
} from "antd";
import { useEffect, useState } from "react";
import {
  actionGetlistEmpoyee,
  actionGetListRole,
  actionDecentralize,
} from "../action";
import { useSelector } from "react-redux";
import { TYPE_POWER } from "utils/constants/config";

//debounce function for searching

const Decentralize = ({ onCancel, documentId, fileType }) => {
  const [spinning, setSpinning] = useState(false);
  const [listEmployee, setListEmployee] = useState([]);
  const [employee, setEmployee] = useState();
  const userLogin = useSelector((state) => state.profile);
  const department = useSelector((state) => state.departments);
  const [permissionType, setPermissionType] = useState(0);

  const [listRole, setlistRole] = useState([]);
  const [roleUserMap, setRoleUserMap] = useState([]);

  const handleGetListEmployee = async () => {
    setSpinning(true);
    try {
      const params = {
        department_id: department || userLogin.department_id,
      };
      let { data, status } = await actionGetlistEmpoyee(params);
      if (status === 200) {
        const roleUserInitState = data.map((item) => ({ id: item.id, role: [] }));
        setListEmployee(data.filter((item) => item.position_code !== "ADMIN"));
        setRoleUserMap(roleUserInitState);
      }
    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };
  // setRoleDepartmentMap(department.map((item) => ({ id: item.id, role: [] })))
  const handleCheckbox = (employeeId, role) => {
    setRoleUserMap((prevMap) => {
      return prevMap.map((item) => {
        if (item.id === employeeId) {
          const updatedRoles = item.role.includes(role.id)
            ? item.role.filter((id) => id !== role.id)
            : [...item.role, role.id];
          return { ...item, role: updatedRoles };
        }
        return item;
      });
    });
  };

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

  const handleSubmit = async () => {
    setSpinning(true);
    try {
      const list_role = [];
      for (const employee of roleUserMap) {
        const params = {
          id_emp: employee.id,
          emp_role: employee.role,

        };
        list_role.push(params);
      }
      const { data, status } = await actionDecentralize({ list_role: list_role, department_id: [], role_department: [] }, documentId);
      if (status === 200) {
        message.success(data?.message);
      }
      // if(permissionType === 0){
      //   for (const employee of roleUserMap) {
      //     const params = {
      //       id_emp: employee.id,
      //       list_role:employee.role
      //     };
      //     paramsArray.push(params);
      //   }
      // }
      // if(permissionType === 1){
      //   for (const employee of roleUserMap) {
      //     const params = {
      //       id_emp: employee.id,
      //       emp_roles:employee.role
      //     };
      //     paramsArray.push(params);
      //   }
      // }



    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };


  useEffect(() => {
    handleGetListEmployee();
    handleShowPowers();
  }, []);

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Quyền được cấp",
      dataIndex: "power",
      key: "power",
      align: "center",
      render: (f, employee) => (
        <Space size="middle">
          {listRole.map((role) => (
            <Row key={role.id}>
              <Checkbox
                checked={roleUserMap.find((item) => item.id === employee.id)?.role.includes(role.id)}
                onChange={() => handleCheckbox(employee.id, role)}
              >
                {role.name}
              </Checkbox>
            </Row>
          ))}
        </Space>
      ),
    },
  ];

  return (
    <Modal
      open={true}
      className="common-long-modal"
      title="Phân quyền"
      width={600}
      footer={
        <Row gutter={[16, 0]} justify={"center"}>
          <Col>
            <Button onClick={onCancel}>Thoát</Button>
          </Col>
          <Col>
            <Button type="primary" onClick={handleSubmit}>
              Lưu
            </Button>
          </Col>
        </Row>
      }
    >
      <SpinCustom spinning={spinning}>
        {/* <Row gutter={[16, 16]}>

          <Col >
            <Select
              className="w-full"
              placeholder="Kiểu phân quyền"
              options={Object.entries(TYPE_POWER)?.map(([key, value]) => ({
                value: Number(key),
                label: value,
              }))}
              onChange={(value) => setPermissionType(value)}
            ></Select>
          </Col>

        </Row>
         */}

        <Space direction="vertical" size={30}>
          <Table
            dataSource={listEmployee}
            // dataSource={permissionType === 0 ? listEmployee : department}
            columns={columns}
            rowKey={(r) => r.id}
            pagination={false}
          />
        </Space>
      </SpinCustom>
    </Modal>
  );
};

export default Decentralize;
