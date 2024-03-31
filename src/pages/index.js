// imports page
import HomePage from "./home";
import LoginPage from "./login";
import FilePreviewPage from "./file-preview";
import Procedure from "./procedure";
import LeaveProcess from "./leaveProcess";
import ManageVehicles from "./vehicles";
import CommonDocument from "./common-document";
import DepartmentDocument from "./department_document";
import ProcurementProcedure from "./procurement-procedure";
import NotarizationProcedure from "./notarization-procedure";
import RecruitmentProcedure from "./recruitment-procedure";
import GeneralPurchaseProcedure from "./general-purchase-procedure";
import OfficeProcurementProcedure from "./office-procurement-procedure";
import OvertimeProcedure from "./overtime-procedure";
import ManagerKeeping from "./keepingtimes";
import PayRoll from "./payroll";
import {
  UsergroupAddOutlined,
  FolderOutlined,
  IssuesCloseOutlined,
} from "@ant-design/icons";
import IconHomeNavigate from "./icon-home-navigate";

/** pages
 * page hiển thị trên menu thi có thêm 2 thuộc tính icon và label
 * page không hiển thị trên menu bỏ icon và lable
 */

const pages = [
  {
    name: "home-navigate",
    path: "/home-navigate",
    auth: false,
    element: <IconHomeNavigate />,
  },
  {
    name: "login",
    path: "/login",
    auth: false,
    element: <LoginPage />,
  },
  {
    name: "file-preview",
    path: "/file-preview/:fileId",
    auth: true,
    element: <FilePreviewPage />,
  },
  {
    name: "home",
    path: "/",
    auth: true,
    label: "Quản lý nhân viên",
    element: <HomePage />,
    icon: <UsergroupAddOutlined />,
  },
  {
    name: "document",
    path: "/document",
    auth: true,
    label: "Tài liệu",
    icon: <FolderOutlined />,
  },
  {
    name: "common-document",
    path: "/common-document",
    auth: true,
    label: "Tài liệu chung",
    element: <CommonDocument />,
    icon: null,
    parent: "document",
  },
  {
    name: "department-document",
    path: "/department-document",
    auth: true,
    label: "Tài liệu phòng ban",
    element: <DepartmentDocument />,
    icon: null,
    parent: "document",
  },
  {
    name: "procedure",
    path: "/procedure",
    auth: true,
    label: "Quản lý quy trình",
    icon: <IssuesCloseOutlined />,
  },
  {
    name: "vehicle-procedure",
    path: "/vehicle-procedure",
    auth: true,
    label: "Quy trình xin xe",
    element: <Procedure />,
    parent: "procedure",
  },
  {
    name: "leaveprocess",
    path: "/leaveprocess",
    auth: true,
    label: "Quy trình nghỉ phép",
    element: <LeaveProcess />,
    parent: "procedure",
  },
  {
    name: "notarization-procedure",
    path: "/notarization-procedure",
    auth: true,
    label: "Công chứng/dịch thuật",
    element: <NotarizationProcedure />,
    parent: "procedure",
  },
  {
    name: "overtime-procedure",
    path: "/overtime-procedure",
    auth: true,
    label: "Đề xuất làm thêm giờ",
    element: <OvertimeProcedure />,
    parent: "procedure",
  },
  {
    name: "recruitment-procedure",
    path: "/recruitment-procedure",
    auth: true,
    label: "Đề xuất tuyển dụng",
    element: <RecruitmentProcedure />,
    parent: "procedure",
  },
  {
    name: "general-purchase-procedure",
    path: "/general-purchase-procedure",
    auth: true,
    label: "Đề xuất chung",
    element: <GeneralPurchaseProcedure />,
    parent: "procedure",
  },
  {
    name: "office-procurement-procedure",
    path: "/office-procurement-procedure",
    auth: true,
    label: "Mua văn phòng phẩm",
    element: <OfficeProcurementProcedure />,
    parent: "procedure",
  },
  {
    name: "procurement-proposal",
    path: "/procurement-proposal-procedure",
    auth: true,
    label: "Mua trang thiết bị",
    element: <ProcurementProcedure />,
    parent: "procedure",
  },

  {
    name: "vehicles",
    path: "/vehicles",
    auth: true,
    label: "Quản lý xe",
    icon: <IssuesCloseOutlined />,
    element: <ManageVehicles />,
  },
  {
    name: "keepingtimes",
    path: "/keepingtimes",
    auth: true,
    label: "Chấm công",
    icon: <IssuesCloseOutlined />,
    element: <ManagerKeeping />,
  },
  {
    name: "payroll",
    path: "/payroll",
    auth: true,
    label: "Bảng lương",
    icon: <IssuesCloseOutlined />,
    element: <PayRoll />,
  },
];

export default pages;
