import { useState, useEffect } from "react";
import { SpinCustom } from "components";
import { actionGetUsers, actionLockUser } from "./actions";
import { useSelector } from "react-redux";
import AddUserModal from "./components/addUserModal";
import {
  DEPARTMENTS_CODE,
  POSITION_CODE,
} from "utils/constants/config";
import InfoUserModal from "./components/info-user";

import * as XLSX from "xlsx";
// import ExportPDF from "./exportPDF";
import { IoLockClosedOutline } from "react-icons/io5";
import { GoUnlock } from "react-icons/go";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faLock } from "@fortawesome/free-regular-svg-icons";
// import { faLockOpen } from "@fortawesome/free-regular-svg-icons";
// import { faEdit } from "@fortawesome/free-regular-svg-icons";
// import { faUserPen } from "@fortawesome/free-regular-svg-icons";
import { FilePdfOutlined } from "@ant-design/icons";
import { FiEdit } from "react-icons/fi";
import UploadExcel from './components/uploadExcel'

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
  Input,
} from "antd";
import EditUser from "./components/editUserModal";
import { actionGetDepartments } from "./actions";
import * as actions from 'utils/constants/redux-actions'
import { useDispatch } from "react-redux";


const HomePage = () => {
  const userLogin = useSelector((state) => state?.profile);
  const dispatch = useDispatch()
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [position, setPosition] = useState(null);
  const [code, setCode] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [user, setUser] = useState([]);
  const [editUser, setEditUser] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [openUpload, setOpenUpload] = useState(false)
  console.log(openUpload)

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
        "Email": e?.email,
        "Chức vụ": e?.position_name,
        "Telegram": e?.telegram_chat_id
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
        phone: phone,
        user_code: code,
        position: position,
      };
      const { data, status } = await actionGetUsers(params);

      if (status === 200) {
        console.log("params", params);
        console.log("data", data);
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
        dispatch({ type: actions.SET_PROFILE, payload: data })
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetUser();
  }, [selectedStatus, name, code, phone, position]);


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
                <IoLockClosedOutline className="icon-fa" />
              ) : (
                r.position_code !== "ADMIN" && <GoUnlock className="icon-fa" />
              )}
            </Popconfirm>
          )}
        </Space>
      ),
      align: "center",
    },
    {
      title: "",
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
                onChange={(e) => setSelectedStatus(e)}
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
            <Col className="filler--item">
              <Input.Search
                onSearch={(v) => {
                  setCode(v);
                }}
                placeholder="Nhập mã nhân viên ..."
                allowClear
              />
            </Col>
            <Col className="filler--item">
              <Input.Search
                onSearch={(v) => {
                  setPhone(v);
                }}
                placeholder="Nhập số điên thoại ..."
                allowClear
              />
            </Col>
            <Col className="filler--item">
              {
                /* <Input.Search
                onSearch={(v) => {
                  setPosition(v);
                }}
                placeholder="Nhập chức vụ ..."
                allowClear */
                //  onChange={handleInputPositionChange}
                //  value={position}
              }
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

            {userLogin.position_code === "ADMIN"
              && (
                <Col>
                  <Button
                    className="w-full"
                    type="primary"
                    onClick={() => setOpenAddUserModal(true)}
                  >
                    Thêm tài khoản
                  </Button>
                </Col>
              )}
            {userLogin.position_code === "ADMIN"
              && (
                <Col>
                  <Button
                    onClick={() => { setOpenUpload(true) }}
                    className="w-full"
                    type="primary"

                  >
                    {`${openUpload}`}
                  </Button>
                </Col>
              )}

            <Col>
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

        {/* {true && <UploadExcel
        />
        } */}
      </>
    </Layout>
  );
};

export default HomePage;
