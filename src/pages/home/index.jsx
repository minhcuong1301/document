import { useState, useEffect } from "react";
import { SpinCustom } from "components";
import { actionGetUsers, actionLockUser } from "./actions";
import { useSelector } from "react-redux";
import AddUserModal from "./components/addUserModal";
import {
  REACT_APP_SERVER_BASE_URL,
  DEPARTMENTS_CODE,
} from "utils/constants/config";
import InfoUserModal from "./components/info-user";
import ExportPDF from "../procedure/components/exportPDF";

import { FilePdfOutlined } from "@ant-design/icons";

import {
  Button,
  Layout,
  Space,
  Table,
  Row,
  Col,
  Pagination,
  message,
  Image,
  Popconfirm,
  Select,
  Input,
} from "antd";
import EditUser from "./components/editUserModal";

const HomePage = () => {
  const userLogin = useSelector((state) => state?.profile);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [name, setName] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [user, setUser] = useState([]);
  const [editUser, setEditUser] = useState(false);

  //modal
  const [isOpenAddUserModal, setOpenAddUserModal] = useState(false);
  const [isOpenUserModal, setOpenUserModal] = useState(false);
  const [dataExport, setDataExport] = useState();

  //paginate
  const pagination = {
    pageNum: 1,
    pageSize: 10,
  };

  const handleChangePage = (pageNum, pageSize) => {
    pagination.pageNum = pageNum;
    pagination.pageSize = pageSize;
  };

  const handleExportData = async () => {
    setSpinning(true);
    try {
      const params = {
        department_id: selectedStatus,
        name: name,
      };

      const { data, status } = await actionGetUsers(params);
      if (status === 200) {
        setDataExport({
          reports: data,
          total: data?.length,
        });
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleGetUser = async () => {
    setSpinning(true);
    try {
      const params = {
        department_id: selectedStatus,
        name: name,
      };
      const { data, status } = await actionGetUsers(params);

      if (status === 200) {
        setUser(data);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleLock = async (id) => {
    setSpinning(true);
    try {
      const { status, data } = await actionLockUser(id);

      if (status === 200) {
        message.success(data?.message);
        setUser(data?.employees);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleCheckRole = (r) => {
    if (
      (userLogin?.position_code === "GIAM_DOC" &&
        r?.position_code !== "GIAM_DOC") ||
      (userLogin?.position_code === "TRUONG_PHONG" &&
        userLogin?.department_id === r?.department_id &&
        r?.position_code !== "TRUONG_PHONG" &&
        r?.position_code !== "GIAM_DOC")
    ) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    handleGetUser();
  }, [selectedStatus, name]);

  const columns = [
    {
      fixed: "left",
      width: 60,
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
      width: 100,
      title: "Mã nhân viên",
      dataIndex: "id",
      key: "id",
    },
    {
      width: 100,
      title: "Mã nhân viên",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Họ và tên ",
      dataIndex: "name",
      key: "name",
      align: "center",
      onCell: (record, rowIndex) => {
        return {
          onClick: () => {
            setOpenUserModal(record);
          },
        };
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Chức vụ",
      dataIndex: "position_name",
      key: "position_name",
    },
    {
      title: "Phòng ban",
      dataIndex: "department_name",
      key: "department_name",
      align: "center",
    },
    {
      title: "Ảnh ",
      dataIndex: "avatar",
      key: "avatar",
      align: "center",
      render: (v, _) =>
        v && (
          <Image
            alt="avatar"
            src={`${REACT_APP_SERVER_BASE_URL}/${v}`.replace("server", "")}
          />
        ),
    },
    {
      width: 100,
      title: "",
      dataIndex: "operation",
      key: "operation",
      render: (_, r) => (
        <Space>
          {handleCheckRole(r) && (
            <Popconfirm
              title={
                r.account_stutus === 1
                  ? "Bạn chắc chắn muốn khóa?"
                  : "Bạn chắc chắn muốn mở khóa?"
              }
              okText={r.account_stutus === 1 ? "Khóa" : "Mở khóa"}
              cancelText="Hủy"
              onConfirm={() => handleLock(r.id)}
            >
              <Button>{r.account_stutus === 1 ? "Khóa" : "Mở khóa"}</Button>
            </Popconfirm>
          )}
        </Space>
      ),
      align: "center",
    },
    {
      width: 150,
      title: "",
      dataIndex: "edit",
      key: "edit",
      render: (_, r) =>
        (userLogin?.position_code === "P_GIAM_DOC" ||
          userLogin?.position_code === "GIAM_DOC") && (
          <Space>
            <Button type="info" onClick={() => setEditUser(r)}>
              Sửa
            </Button>
          </Space>
        ),
      align: "center",
    },
  ];

  return (
    <Layout className="common-layout">
      <SpinCustom spinning={spinning}>
        <div className="common-layout--header">
          <Row className="filler" gutter={[8, 8]}>
            <Button
              className="exit-home"
              onClick={() => window.navigatePage("home-navigate")}
            >
              Thoát
            </Button>
            <Col className="filler--item">
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

            <Col className="filler--item">
              <Input.Search
                onSearch={(v) => {
                  setName(v);
                }}
                placeholder="Nhập tên ..."
                allowClear
              />
            </Col>

            {(userLogin.position_code === "GIAM_DOC" ||
              userLogin.position_code === "TRUONG_PHONG") && (
              <Col>
                <Button
                  className="w-full"
                  type="primary"
                  onClick={() => setOpenAddUserModal(true)}
                >
                  Thêm nhân viên
                </Button>
              </Col>
            )}

            {userLogin?.position_code === "TRUONG_PHONG" &&
              userLogin.department_id === 6 && (
                <Col>
                  <Button
                    onClick={handleExportData}
                    icon={<FilePdfOutlined />}
                    type="primary"
                  >
                    Xuất file PDF
                  </Button>
                </Col>
              )}
          </Row>
        </div>

        <div className="common-layout--content">
          <Table
            width="100%"
            dataSource={user}
            rowKey={(r) => r.id}
            columns={columns}
            pagination={{
              pageSize: pagination.pageSize,
              current: pagination.current,
              onChange: handleChangePage,
            }}
            scroll={{ x: 1024 }}
          />
        </div>
      </SpinCustom>

      <>
        {isOpenAddUserModal && (
          <AddUserModal
            setUser={setUser}
            onClose={() => {
              setOpenAddUserModal(false);
            }}
          />
        )}
        {editUser && (
          <EditUser
            setUser={setUser}
            editUser={editUser}
            onClose={() => {
              setEditUser(false);
            }}
          />
        )}

        {isOpenUserModal && (
          <InfoUserModal
            isOpenUserModal={isOpenUserModal}
            onClose={() => {
              setOpenUserModal(false);
            }}
          />
        )}

        {dataExport && (
          <ExportPDF data={dataExport} onClose={() => setDataExport(null)} />
        )}
      </>
    </Layout>
  );
};

export default HomePage;
