import { useState, useEffect } from "react";
import { SpinCustom } from "components";
import { actionGetUsers, actionLockUser } from "./actions";
import { useSelector } from "react-redux";
import AddUserModal from "./components/addUserModal";
import { DEPARTMENTS_CODE, POSITION_CODE } from "utils/constants/config";
import InfoUserModal from "./components/info-user";
import { IoLockClosedOutline } from "react-icons/io5";
import { GoUnlock } from "react-icons/go";
import { FiEdit } from "react-icons/fi";
import * as XLSX from "xlsx";
import {
  Button,
  Layout,
  Space,
  Table,
  Row,
  Col,
  message,
  Popconfirm,
  Select,
  Tag,
  Input,
} from "antd";
import EditUser from "./components/editUserModal";
import { actionGetDepartments } from "./actions";
import * as actions from "utils/constants/redux-actions";
import { useDispatch } from "react-redux";
import UploadExcel from "./components/uploadExcel";

const HomePage = () => {
  const userLogin = useSelector((state) => state?.profile);
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [name, setName] = useState(null);
  const [position, setPosition] = useState(null);
  const [code, setCode] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [user, setUser] = useState([]);
  const [editUser, setEditUser] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [openUpload, setOpenUpload] = useState(false);

  //modal
  const [isOpenAddUserModal, setOpenAddUserModal] = useState(false);
  const [isOpenUserModal, setOpenUserModal] = useState(false);

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
    const tmp = user.map((e, index) => {
      return {
        STT: index + 1,
        "Mã nhân viên": e?.user_code,
        "Họ và tên": e?.name,
        "Phòng ban": e?.department_name,
        "Số điện thoại": e?.phone,
        Email: e?.email,
        "Chức vụ": e?.position_name,
        Telegram: e?.telegram_chat_id,
      };
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(tmp);
    const wscols = [
      { wch: 10 },
      { wch: 25 },
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];
    worksheet["!cols"] = wscols;
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh_sach_nhan_vien");
    XLSX.writeFile(workbook, "Danh_sach_nhan_vien.xlsx");
  };

  const handleGetUser = async () => {
    setSpinning(true);
    try {
      const params = {
        department_id: selectedStatus,
        name: name,
        user_code: code,
        position: position,
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

  const handleGetDepartmentsList = async () => {
    try {
      const { data, status } = await actionGetDepartments();
      if (status === 200) {
        setDepartments(data);
        dispatch({ type: actions.SET_PROFILE, payload: data });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetUser();
  }, [selectedStatus, name, code, position]);

  useEffect(() => {
    handleGetDepartmentsList();
  }, []);

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
      title: "Mã nhân viên",
      dataIndex: "user_code",
      key: "user_code",
      align: "center",
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
      title: "Phòng ban",
      dataIndex: "department_name",
      key: "department_name",
      align: "center",
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
      align: "center",
    },
    {
      title: "Chức vụ",
      dataIndex: "position_name",
      key: "position_name",
      align: "center",
    },

    // {
    //   title: "Ảnh ",
    //   dataIndex: "avatar",
    //   key: "avatar",
    //   align: "center",
    //   render: (v, _) =>
    //     v && (
    //       <Image
    //         alt="avatar"
    //         src={`${REACT_APP_SERVER_BASE_URL}/${v}`.replace("server", "")}
    //       />
    //     ),
    // },
    {
      title: "",
      width: 100,
      dataIndex: "operation",
      key: "operation",
      render: (_, r) => (
        <Space>
          {userLogin?.position_code === "ADMIN" && (
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
              {r.account_stutus === 1 && r.position_code !== "ADMIN" ? (
                <Tag color="#87d068 " className="tag-btn">
                  <Button type="text" className="btn-lock">
                    <IoLockClosedOutline className="icon-fa icon-fa-lock" />
                  </Button>
                </Tag>
              ) : (
                r.position_code !== "ADMIN" && (
                  <Tag color="#f41f1f" className="tag-btn">
                    <Button type="text" className="btn-unlock">
                      <GoUnlock className="icon-fa icon-fa-unlock" />
                    </Button>
                  </Tag>
                )
              )}
            </Popconfirm>
          )}
        </Space>
      ),
      align: "center",
    },
    {
      title: "",
      width: 50,
      dataIndex: "edit",
      key: "edit",
      render: (_, r) =>
        userLogin?.position_code === "ADMIN" && (
          <Space>
            <FiEdit onClick={() => setEditUser(r)} className="icon-fa" />
          </Space>
        ),
      align: "center",
    },
  ];

  return (
    <Layout className="common-layout">
      <SpinCustom spinning={spinning}>
        <div className="common-layout--header">
          <Row
            className="filler"
            gutter={[{ xs: 8, sm: 8, md: 16, lg: 16 }, 16]}
          >
            <Button
              className="exit-home"
              onClick={() => window.navigatePage("home-navigate")}
            >
              Thoát
            </Button>
            <Col className="filler--item" xs={24} sm={12} md={6} lg={6}>
              <Select
                className="w-full"
                placeholder="Phòng ban"
                onChange={(e) => setSelectedStatus(e)}
                allowClear
              >
                {Object.keys(DEPARTMENTS_CODE).map((key) => (
                  <Select.Option key={key} value={key}>
                    {DEPARTMENTS_CODE[key]} ({key})
                  </Select.Option>
                ))}
              </Select>
            </Col>

            <Col className="filler--item" xs={24} sm={12} md={6} lg={6}>
              <Input.Search
                onSearch={(v) => {
                  setName(v);
                }}
                placeholder="Nhập tên ..."
                allowClear
              />
            </Col>
            <Col className="filler--item" xs={24} sm={12} md={6} lg={6}>
              <Input.Search
                onSearch={(v) => {
                  setCode(v);
                }}
                placeholder="Nhập mã nhân viên ..."
                allowClear
              />
            </Col>

            <Col className="filler--item" xs={24} sm={12} md={6} lg={6}>
              <Select
                className="w-full"
                placeholder=" Chức vụ"
                onChange={(e) => setPosition(e)}
                allowClear
              >
                {Object.keys(POSITION_CODE).map((key) => (
                  <Select.Option key={key} value={key}>
                    {POSITION_CODE[key]}
                  </Select.Option>
                ))}
              </Select>
            </Col>

            {userLogin.position_code === "ADMIN" && (
              <Col >
                <Button
                  className="w-full"
                  type="primary"
                  onClick={() => setOpenAddUserModal(true)}
                >
                  Thêm tài khoản
                </Button>
              </Col>
            )}

            {userLogin.position_code === "ADMIN" && (
              <Col >
                <Button
                  onClick={() => {
                    setOpenUpload(true);
                  }}
                  className="w-full"
                  type="primary"
                >
                  Nhập excel
                </Button>
              </Col>
            )}

            <Col >
              <Button
                onClick={handleExportData}
                // icon={<FilePdfOutlined />}
                type="primary"
              >
                Xuất excel
              </Button>
            </Col>
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
            departments={departments}
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

        {openUpload && (
          <UploadExcel setUser={setUser} onClose={() => setOpenUpload(false)} />
        )}
      </>
    </Layout>
  );
};

export default HomePage;
