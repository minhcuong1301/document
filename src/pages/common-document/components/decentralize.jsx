import { SpinCustom } from "components";
import {
  Button,
  Col, Row, Modal, Table,
  Space, Select, message,
  Checkbox, Tabs
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

import { DEPARTMENTS_CODE } from "utils/constants/config";
//debounce function for searching

const Decentralize = ({ onCancel, documentId, fileType }) => {
  const department = useSelector((state) => state.departments);
  const [spinning, setSpinning] = useState(false);
  const [listEmployee, setListEmployee] = useState([]);
  const [tabKey, setTabKey] = useState("tab-1");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedDep, setSelectedDep] = useState([]);
  const [listRole, setlistRole] = useState([]);
  const [roleUserMap, setRoleUserMap] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const pagination = {
    pageNum: 1,
    pageSize: 10,
  };

  const handleGetListEmployee = async () => {
    setSpinning(true);
    try {
      const params = {
        department_id: selectedStatus || null,
        document_id: documentId
      };
      const { data, status } = await actionGetlistEmpoyee(params);
      if (status === 200) {
        setListEmployee(data.filter((item) => item.position_code !== "ADMIN"));
        const respone = await actionGetListRoleUser(documentId, { list_user: data.map(e => e.id) });
        const init_role = []
        JSON.parse(respone.data.list_role).map(item => {
          const obj = {
            user_id: item.user_id,
            role: item.role.map(r => r.id)
          }
          init_role.push(obj)
        })
        setRoleUserMap(init_role);
      }
    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };

  const handleCheckbox = (employeeId, role) => {
    for (let i = 0; i < roleUserMap.length; i++) {
      if (roleUserMap[i].user_id === employeeId) {
        if (roleUserMap[i].role.indexOf(role.id) !== -1) {
          roleUserMap[i].role = roleUserMap[i].role.filter(item => item !== role.id) || []
        } else {
          roleUserMap[i].role = [...roleUserMap[i].role, role.id] || []
        }
        console.log(roleUserMap[i])
      }
    }
    setRoleUserMap(roleUserMap)
  }

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
      if (tabKey === 'tab-1') {
        const list_role = [];
        for (const employee of roleUserMap) {
          const params = {
            id_emp: employee.user_id,
            emp_role: employee.role,
          };
          list_role.push(params);
        }

        const { data, status } = await actionDecentralize({ list_role: list_role }, documentId);
        if (status === 200) {
          const list_n_role = []
          JSON.parse(data?.list_role).map(item => {
            list_n_role.push({
              user_id: item.id_emp,
              role: item.emp_role
            })
          })

          setRoleUserMap(list_n_role)
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
  }, [tabKey, selectedStatus]);


  useEffect(() => {
    handleShowPowers();
  }, []);

  const handleChecked = (list, employee, role_id) => {
    return list.find((item) => item.user_id === employee.id)?.role.includes(role_id)
  }

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (v, record, index) => (
        <Space>
          {index + 1 + (pagination.pageNum - 1) * pagination.pageSize}
        </Space>
      ),
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
          {listRole.map((role, index) => (
            (<Row key={role.id}>
              <Checkbox
                defaultChecked={handleChecked(roleUserMap, employee, role.id)}
                onChange={() => handleCheckbox(employee.id, role)}
              >
                {role.name}
              </Checkbox>
            </Row>)
          ))}
        </Space>
      ),
    },
  ];

  const Tab1 = () => (
    <Row gutter={[0, 8]}

    >
      <Col span={24}>
        <Col md={8} sx={24} >
          <Select
            className="w-full"
            placeholder="Phòng ban"
            onChange={(e) => setSelectedStatus(e)}
            allowClear
            value={selectedStatus}
          >
            {Object.keys(DEPARTMENTS_CODE).map((key) => (
              <Select.Option key={key} value={key}>
                {DEPARTMENTS_CODE[key]}
              </Select.Option>
            ))}
          </Select>
        </Col>

        <Col>
          <Table
            dataSource={listEmployee}
            columns={columns}
            // pagination={false}

            pagination={{
              pageSize: pagination.pageSize,
              current: pagination.current,
              // onChange: handleChangePage,
            }}
          />
        </Col>

      </Col>
    </Row>
  )

  const Tab2 = () => (
    <Row gutter={[16, 30]}>

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
