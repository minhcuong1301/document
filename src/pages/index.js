// imports page
import HomePage from "./home";
import LoginPage from "./login";
import CommonDocument from "./common-document";
import History from "./historyUser";
import {
  UsergroupAddOutlined,
  FolderOutlined,
  IssuesCloseOutlined,
  DeleteOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

import Bin from './Bin'
/** pages
 * page hiển thị trên menu thi có thêm 2 thuộc tính icon và label
 * page không hiển thị trên menu bỏ icon và lable
 */

const pages = [
  {
    name: "login",
    path: "/login",
    auth: false,
    element: <LoginPage />,
  },
  {
    name: "home",
    path: "/",
    auth: true,
    label: "Quản lý tài khoản",
    element: <HomePage />,
    icon: <UsergroupAddOutlined />,
  },

  {
    name: "common-document",
    path: "/common-document",
    auth: true,
    label: "Quản lý tài liệu",
    icon: <FolderOutlined />,
    element: <CommonDocument />,
  },
  {
    name: "history-document",
    path: "/history-document",
    auth: true,
    label: "Lịch sử",
    icon: <HistoryOutlined />,
    element: <History />,
  },
  {
    name: "bin",
    path: "/bin",
    auth: true,
    label: "Thùng rác",
    icon: < DeleteOutlined />,
    element: <Bin />,
  },

];

export default pages;
