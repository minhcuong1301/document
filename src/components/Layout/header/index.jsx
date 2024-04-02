import { useEffect, useMemo, useState } from "react";
import { findPageByPath, isEmpty } from "utils/helps";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AIPT_WEB_TOKEN, SECOND_FORMAT } from "utils/constants/config";
import Cookies from "js-cookie";
import { SET_PROFILE } from "utils/constants/redux-actions";
import InfoUserModal from "./components/info-user";
// import NotificationModal from "./components/notificationModal"
import ChangePassword from "./components/changePassword";
import pages from "pages";
import socketIO from "utils/service/socketIO";
import { REACT_APP_SERVER_BASE_URL } from "utils/constants/config";
import { useNavigate } from "react-router-dom";
import { BellOutlined, MailOutlined } from "@ant-design/icons";

import {
  actionChangeNotificationStatus,
  actionGetNotification,
} from "./actions";

import {
  Layout,
  Space,
  Divider,
  Button,
  Row,
  Avatar,
  Col,
  Dropdown,
  Menu,
} from "antd";

import "./index.scss";
import moment from "moment";
import { AiptLogo } from "assets";

const AppHeader = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state?.profile);
  const token = Cookies.get(AIPT_WEB_TOKEN);
  const currentPath = useLocation().pathname;
  const [notifications, setNotifications] = useState([]);
  const [isOpenModalUserinfo, setOpenModalUserInfo] = useState(false);
  const [isOpenModalChangePassword, setOpenModalChangePassword] =
    useState(false);

  const shouldHideFixIcon = useMemo(() => {
    return notifications.filter((notification) => notification.status === 0);
  }, [notifications]);

  const page = useMemo(() => {
    return findPageByPath(currentPath, pages);
  }, [currentPath]);

  const handleLogout = () => {
    dispatch({ type: SET_PROFILE, payload: {} });
    Cookies.remove(AIPT_WEB_TOKEN);
    window.navigatePage("login");
  };

  socketIO.on("notifications", (data) => {
    setNotifications(data);
  });

  const handleGetNotifications = async () => {
    try {
      const { data, status } = await actionGetNotification();
      if (status === 200) {
        setNotifications(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeStatus = async (notification) => {
    try {
      const { data, status } = await actionChangeNotificationStatus(
        notification?.id
      );
      if (status === 200) {
        setNotifications(data?.notifications);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // let tabKey = "";
  // const handleCheckProcedureType = (notification) => {
  //   console.log("noti detail:", notification);
  //   if (
  //     notification.content.includes("hoàn thành") ||
  //     notification.content.includes("từ chối")
  //   ) {
  //     tabKey = "tab-2";
  //   }
  //   if (notification.content.includes("được duyệt")) {
  //     tabKey = "tab-3";
  //   } else {
  //     tabKey = "tab-1";
  //   }
  // };

  const handleNavigateProcedure = async (notification) => {
    handleChangeStatus(notification);
    // handleCheckProcedureType(notification);
    window.navigatePage("common-document", null, {
      document_id: notification.document_id,
    });

    // switch (notification.document_id){
    //   case "QT1":
    //     window.navigatePage("vehicle-procedure", null, {
    //       procedure_id: notification.procedure_id,
    //       tabKey: tabKey,
    //     });
    //     break;

    //   case "QT5":
    //     window.navigatePage("leaveprocess", null, {
    //       procedure_id: notification.procedure_id,
    //       // tabKey: tabKey,
    //     });
    //     break;

    //   case "QT6":
    //     console.log("general");
    //     window.navigatePage("general-purchase-procedure", null, {
    //       procedure_id: notification.procedure_id,
    //     });

    //     break;

    //   case "QT7":
    //     window.navigatePage("notarization-procedure", null, {
    //       procedure_id: notification.procedure_id,
    //     });
    //     break;

    //   case "QT8":
    //     window.navigatePage("recruitment-procedure", null, {
    //       procedure_id: notification.procedure_id,
    //     });
    //     break;

    //   case "QT9":
    //     window.navigatePage("office-procurement-procedure", null, {
    //       procedure_id: notification.procedure_id,
    //     });
    //     break;

    //   case "QT10":
    //     window.navigatePage("procurement-proposal", null, {
    //       procedure_id: notification.procedure_id,
    //     });
    //     break;

    //   case "QT11":
    //     window.navigatePage("overtime-procedure", null, {
    //       procedure_id: notification.procedure_id,
    //     });
    //     break;

    //   default:
    //     break;
    //}
  };

  useEffect(() => {
    if (token) {
      handleGetNotifications();
    }
  }, [token]);

  const dropdownMenuNotification = notifications
    .slice(0, 50)
    .map((notification, index) => (
      <Menu.Item
        key={index}
        onClick={() => handleNavigateProcedure(notification)}
      >
        <div
          className={`notification-item ${
            notification.status === 0 ? "unread" : "read"
          }`}
        >
          <div
            className="notification-content"
            dangerouslySetInnerHTML={{ __html: notification?.content }}
          />
          <div className="notification-time">
            {moment(notification.time_created * 1000).format(SECOND_FORMAT)}
          </div>
        </div>
      </Menu.Item>
    ));

  return (
    <Layout.Header className="app-header">
      <div className="app-header--left">
        <span className="app-header--title hidden-mobile">{page?.label}</span>

        <img className="hidden-logo" src={AiptLogo} alt="logo" />
      </div>
      <div className="app-header--right">
        <Space size={8} split={<Divider type="vertical" />}>
          <MailOutlined />
          <Dropdown
            placement="bottomRight"
            arrow
            trigger={["click"]}
            overlay={
              <Menu className="app-header-dropdown-menu">
                {dropdownMenuNotification}
              </Menu>
            }
          >
            <div className="icon-notifi">
              {!isEmpty(shouldHideFixIcon) && <div className="fix-icon"></div>}
              <BellOutlined />
            </div>
          </Dropdown>

          <Row gutter={[8, 0]}>
            <Col>
              <Avatar
                className="avatar"
                shape="circle"
                size={24}
                src={`${REACT_APP_SERVER_BASE_URL}${userLogin?.avatar}`.replace(
                  "server",
                  ""
                )}
                onClick={() => setOpenModalUserInfo(true)}
              />
            </Col>

            <Col className="hidden-mobile">{userLogin?.name}</Col>
          </Row>

          <Button size="small" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Space>
      </div>

      <>
        {isOpenModalUserinfo && (
          <InfoUserModal
            onClose={() => setOpenModalUserInfo(false)}
            userLogin={userLogin}
            onChangePassword={() => {
              setOpenModalUserInfo(false);
              setOpenModalChangePassword(true);
            }}
          />
        )}

        {isOpenModalChangePassword && (
          <ChangePassword
            onClose={() => {
              setOpenModalUserInfo(true);
              setOpenModalChangePassword(false);
            }}
          />
        )}
      </>
    </Layout.Header>
  );
};

export default AppHeader;
