import { SpinCustom } from "components";
import {
  Button,
  Col, Row, Modal, Table,
  Space, Select, message,
  Checkbox, Radio, Tabs
} from "antd";
import { useEffect, useState } from "react";
import {
  actionGetlistEmpoyee,
  actionGetListRole,
  actionDecentralize,
  actionDecentralizeDep,
  actionGetListRoleUser,
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
  const [tabKey, setTabKey] = useState("tab-1");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedDep, setSelectedDep] = useState([]);


  const [listRole, setlistRole] = useState([]);
  const [listRoleUser, setlistRoleUser] = useState([]);
  const [roleUserMap, setRoleUserMap] = useState([]);

  const handleGetListEmployee = async () => {
    setSpinning(true);
    try {
      const params = {
        department_id: department || userLogin.department_id,
      };
      const { data, status } = await actionGetlistEmpoyee(params);
      if (status === 200) {
        const roleUserInitState = data.map((item) => ({ id: item.id, role: [] }));
        setListEmployee(data.filter((item) => item.position_code !== "ADMIN"));
        setRoleUserMap(roleUserInitState);
        const respone = await  actionGetListRoleUser(documentId,{list_user:data.map(e=>e.id)});

        setlistRoleUser(JSON.parse(respone.data.list_role))
      }
    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };
  
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

  const handleCheckboxTab2 = (roleId) => {
    setSelectedRoles(prevSelectedRoles => {
      if (prevSelectedRoles.includes(roleId)) {
        return prevSelectedRoles.filter(id => id !== roleId);
      } else {
        return [...prevSelectedRoles, roleId];
      }
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
      if (tabKey == 'tab-1') {
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

      }
      else {
        const params = {
          department: selectedDep,
          role: selectedRoles
        }
        const { data, status } = await actionDecentralizeDep({ list_role: params }, documentId);
        if (status === 200) {
          message.success(data?.message);
        }
      }


    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };


  useEffect(() => {
    handleGetListEmployee();
  }, [tabKey]);

    useEffect(() => {
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
                checked={listRoleUser.find((item) => item.user_id === employee.id)?.role.map(e=>e.id).includes(role.id)}
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

  const Tab1 = () => (
    <Table
      dataSource={listEmployee}
      columns={columns}
      rowKey={(r) => r.id}
      pagination={false}
    />
  )


  const Tab2 = () => (
    <Row gutter={[16,30]}>

      <Col md={8} xs={24}>
        <Select
          className="w-full"
          mode="multiple"
          placeholder="Phòng ban"
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            `${option.children}`
              .toLocaleLowerCase()
              .includes(input.toLocaleLowerCase())
          }
          value={selectedDep}
          onChange={(v) => setSelectedDep(v)}
        >
          {department.map((u) => (
            <Select.Option key={u?.id} value={u.id}>
              {u?.name}
            </Select.Option>
          ))}
        </Select>
      </Col>

      <Col span={16} className="checkbox-style">

        {listRole.map((role) => (
          <Row key={role.id}>
            <Checkbox
              checked={selectedRoles.includes(role.id)}
              onChange={() => handleCheckboxTab2(role.id)}
            >
              {role.name}
            </Checkbox>
          </Row>
        ))}
      </Col>

    </Row>


  )

  const TabItem = [
    {
      key: "tab-1",
      label: "Quyền theo nhân sự",
      children: <Tab1 />,
    },
    {
      key: "tab-2",
      label: "Quyền theo phòng ban",
      children: <Tab2 />,
    },
  ]
  const handleSelectedTabKey = (e) => {
    setTabKey(e);
    // window.history.pushState(null, null, `?tabKey=${e}`);
  };


  return (
    <Modal
      open={true}
      className="common-long-modal"
      title="Phân quyền"
      width={800}
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
        <Tabs
          items={TabItem}
          defaultActiveKey={tabKey}
          onTabClick={(e) => handleSelectedTabKey(e)}
        />


      </SpinCustom>
    </Modal>
  );
};

export default Decentralize;
