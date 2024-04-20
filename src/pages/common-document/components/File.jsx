import {
  Col,
  Dropdown,
  Row,
  message,
  Modal,
  Image,
  Button,
  Checkbox,
} from "antd";
import React, { useEffect, useState } from "react";
import { SpinCustom } from "components";
import {
  actionDeleteFile,
  actionGetImage,
  actionDownLoadFile,
} from "../action";
import {
  FolderIconDownload,
  WordIcon,
  PptxIcon,
  PdfIcon,
  ExcelIcon,
  DefaultIcon,
} from "assets";
import { DATETIME_FORMAT } from "utils/constants/config";
import Decentralize from "./decentralize";
import DetailFile from "./detailFile";
import moment from "moment";
import { useSelector } from "react-redux";
import { REACT_APP_SERVER_BASE_URL } from "utils/constants/config";

import UpdateNameFile from "./updateNameFile";

const File = ({
  listDocument,
  handleGetListDocument,
  handleGetChildFolder,
  idDocumentAdd,
  roleUser,
  setListDocument,
  checkIsOpenWorkSpace,
  checkIsOpenDoc,
  isRootFolder,
  onIsRootChange,
  onDeptChange,
  folderClickCount,
  setFolderClickCount,
}) => {
  const [spinning, setSpinning] = useState(false);
  const [openModalUpdateFile, setOpenModalUpdateFile] = useState(false);
  const [documentId, setDocumentId] = useState();
  const [typeDocument, setTypeDocument] = useState();
  const [openDetail, setOpenDetail] = useState(false);
  const [pathDoc, setPathDoc] = useState();
  const [openDecentralize, setOpenDecentralize] = useState(false);
  const [oldName, setOldName] = useState();
  const [idFile, setIdFile] = useState();
  const [modalEditName, setmodalEditName] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const userLogin = useSelector((state) => state?.profile);
  const [newIsRootValue, setNewIsRootValue] = useState();

  const [items, setItems] = useState([]);
  const [fileType, setFileType] = useState(null);
  console.log("isroot File", isRootFolder);
  console.log("handleRootFolderChange");
  // let folderClickCount = 0;
  const handleRootFolderChange = () => {
    if (folderClickCount === 0) {
      setNewIsRootValue(!isRootFolder);
      setFolderClickCount((prevCount) => prevCount + 1);
      console.log("vua click folder trong root");
    } else {
      setNewIsRootValue(isRootFolder);
      console.log("vua click folder trongchild folder");
    }
    // Gọi hàm callback được cung cấp bởi component cha
    onIsRootChange(newIsRootValue);
  };

  const handleDeptFolderChange = (v) => {
    onDeptChange(v);
  };

  const handleDeleteFile = async (list_doc) => {
    setSpinning(true);
    try {
      const body = {
        doc_id: list_doc,
        status: 1,
      };
      const { data, status } = await actionDeleteFile(body);
      if (status === 200) {
        setSelectedRows([]);
        if (idDocumentAdd) {
          const idAdd = {
            id: idDocumentAdd,
          };
          handleGetChildFolder(idAdd);
        } else {
          handleGetListDocument();
        }
        message.success(data?.message);
      }
    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };

  const hadleDownloadFile = async (id) => {
    setSpinning(true);
    try {
      const as_attachment = 1;
      const { data, status } = await actionDownLoadFile(id, as_attachment);
    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };

  const handleEditName = async (name, id, type) => {
    if (type === 1) {
      setOldName(name);
    } else {
      const nameWithoutExtension = name.split(".").slice(0, -1).join(".");
      setOldName(nameWithoutExtension);
    }

    setIdFile(id);
    setmodalEditName(true);
  };

  const handleMenuClick = (e, doc_id, document_type, doc_name) => {
    setDocumentId(doc_id);
    // setSelectedRows([doc_id]);
    if (e.key === "1") {
      setDocumentId(doc_id);
      setOpenModalUpdateFile(true);
    } else if (e.key === "2") {
      confirmDelete([doc_id]);
    } else if (e.key === "3") {
      hadleDownloadFile(doc_id);
    } else if (e.key === "4") {
      handleEditName(doc_name, doc_id, document_type);
    } else if (e.key === "5") {
      setOpenDecentralize(true);
      setFileType(document_type);
    }
  };

  const confirmDelete = (selectedRows) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa tệp tin này?",
      onOk() {
        handleDeleteFile(selectedRows);
      },
      onCancel() {},
    });
  };

  const handleOpenChange = (doc_type) => {
    if (doc_type === 1) {
      setTypeDocument(1);
    } else {
      setTypeDocument(2);
    }
  };

  const handleWatchVideo = (r) => {
    // console.log(r);
    const videoPath = `${REACT_APP_SERVER_BASE_URL}/${r.path.replace(
      "server",
      ""
    )}`;
    window.open(videoPath, "_blank");
    openDetail(false);
  };

  const handleClick = (event, name_file, id_file) => {
    if (event.detail === 1) {
      handleDetail(id_file);
    }
  };

  useEffect(() => {
    if (typeDocument === 1) {
      setItems([
        (roleUser
          .map((item) => {
            return item.code;
          })
          .includes("R4") ||
          userLogin.position_code === "GIAM_DOC" ||
          userLogin.position_code === "P_GIAM_DOC") && {
          label: "Xóa",
          key: "2",
        },
        roleUser
          .map((item) => {
            return item.code;
          })
          .includes("R2") && {
          label: "Sửa tên",
          key: "4",
        },
        (userLogin.position_code === "GIAM_DOC" ||
          userLogin.position_code === "P_GIAM_DOC" ||
          userLogin.position_code === "ADMIN") && {
          label: "Phân quyền",
          key: "5",
        },
      ]);
    } else if (typeDocument === 2) {
      setItems([
        (roleUser
          .map((item) => {
            return item.code;
          })
          .includes("R4") ||
          userLogin.position_code === "GIAM_DOC" ||
          userLogin.position_code === "P_GIAM_DOC") && {
          label: "Xóa",
          key: "2",
        },
        roleUser
          .map((item) => {
            return item.code;
          })
          .includes("R2") && {
          label: "Tải xuống",
          key: "3",
        },
        roleUser
          .map((item) => {
            return item.code;
          })
          .includes("R2") && {
          label: "Sửa tên",
          key: "4",
        },

        (userLogin.position_code === "GIAM_DOC" ||
          userLogin.position_code === "P_GIAM_DOC" ||
          userLogin.position_code === "ADMIN") && {
          label: "Phân quyền",
          key: "5",
        },
      ]);
    }
  }, [typeDocument]);

  const getIconForDocumentType = (documentType, record, extension_file) => {
    if (documentType === 1) {
      return (
        <FolderIconDownload
          className=" style-icon"
          onClick={(e) => {
            e.stopPropagation();
            handleGetChildFolder(record);
            handleRootFolderChange();
            handleDeptFolderChange(record?.department_name);
            console.log(
              "department_name khi click folder",
              record?.department_name
            );
          }}
        />
      );
    } else {
      switch (extension_file) {
        case "docx":
        case "doc":
          return <WordIcon className="style-icon" />;
        case "pptx":
          return <PptxIcon className="style-icon" />;
        case "pdf":
          return <PdfIcon className="style-icon" />;
        case "xls":
        case "xlsx":
          return <ExcelIcon className="style-icon" />;
        case "jpg":
        case "png":
        case "jpeg":
          return (
            <Image
              alt="avatar"
              src={`${actionGetImage(record.id, 2)}`}
              className="style-icon"
              onClick={(e) => console.log(e)}
            />
          );
        case "mp4":
        case "MOV":
          return (
            <video className="style-icon">
              <source
                src={`${REACT_APP_SERVER_BASE_URL}/${record.path.replace(
                  "server",
                  ""
                )}`}
                type={extension_file == "mp4" ? "video/mp4" : "video/quicktime"}
              />
            </video>
          );
        default:
          return <DefaultIcon className="style-icon" />;
      }
    }
  };

  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      setSelectedRows([...selectedRows, id]);
      console.log("selectedRows", [...selectedRows, id]);
      e.stopPropagation();
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const handleDetail = async (id) => {
    try {
      const selectedDocument = listDocument.find((doc) => doc.id === id);
      if (selectedDocument.document_type === 1) {
        handleGetChildFolder(selectedDocument);
        handleRootFolderChange();
        handleDeptFolderChange(selectedDocument?.department_name);
        console.log(
          "department_name khi click row ",
          selectedDocument?.department_name
        );
      }
      const arr = selectedDocument.path.split(".");
      if (arr.includes("mp4")) {
        handleWatchVideo(selectedDocument);
      }
      if (arr.includes("jpeg") || arr.includes("jpg") || arr.includes("png")) {
        {
          <Image src={`${actionGetImage(selectedDocument.id, 2)}`} />;
        }
      } else {
        setDocumentId(id);
        setPathDoc(selectedDocument.path);
        selectedDocument.document_type === 1
          ? setOpenDetail(false)
          : setOpenDetail(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const rows = listDocument.map((record, index) => {
    const extension_file = record.name.replace(/\s/g, "").split(".").pop();

    return (
      <tr
        className="cursor-pointer"
        key={index}
        onClick={() => handleDetail(record?.id)}
      >
        <td style={{ width: "2%" }} onClick={(e) => e.stopPropagation()}>
          <Checkbox onChange={(e) => handleCheckboxChange(e, record.id)} />
        </td>

        <td className="icon-document" style={{ width: "2%" }}>
          {getIconForDocumentType(record.document_type, record, extension_file)}
        </td>

        <td
          className="name-document"
          style={{ width: "5%" }}
          onClick={(event) => {
            event.stopPropagation();
            handleClick(event, record.name, record.id);
          }}
        >
          {record.name}
        </td>

        <td className="time-upload-document">
          {moment(record.time_upload * 1000).format(DATETIME_FORMAT)}
        </td>

        <td
          className="user-create-document"
          onClick={(event) => {
            event.stopPropagation();
            handleClick(event, record.name, record.id);
          }}
        >
          {record.user_create}
        </td>

        <td style={{ width: "7%" }} className="user-create-document">
          {record?.department_name}
        </td>

        <td
          className="action-document"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <Dropdown
            className="dropdown-action"
            menu={{
              items,
              onClick: (e) => {
                handleMenuClick(
                  e,
                  record.id,
                  record.document_type,
                  record.name
                );
              },
            }}
            trigger={["click"]}
            onOpenChange={() => handleOpenChange(record.document_type)}
          >
            <Button type="primary">Thao tác</Button>
          </Dropdown>
        </td>
      </tr>
    );
  });

  const renderTable = () => {
    if (listDocument && listDocument.length > 0) {
      return (
        <table className="style-table">
          <thead>
            <tr>
              <th></th>
              <th></th>

              <th style={{ textAlign: "left" }}>Tên</th>
              <th>Ngày tạo</th>
              <th>Người tạo</th>
              <th>Phòng ban</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      );
    }
  };

  return (
    <>
      <SpinCustom spinning={spinning}>
        <Row gutter={[16, 0]} className="style-list-document">
          {selectedRows.length > 0 && (
            <Col>
              <Button
                type="primary"
                onClick={() => confirmDelete(selectedRows)}
              >
                Xóa
              </Button>
            </Col>
          )}
          <Col>{renderTable()}</Col>
        </Row>
      </SpinCustom>

      <>
        {openDetail && (
          <DetailFile
            pathDoc={pathDoc}
            documentId={documentId}
            onCancel={() => setOpenDetail(false)}
          />
        )}

        {openDecentralize && (
          <Decentralize
            documentId={documentId}
            fileType={fileType}
            onCancel={() => setOpenDecentralize(false)}
          />
        )}

        {modalEditName && (
          <UpdateNameFile
            oldName={oldName}
            idFile={idFile}
            onCancel={() => setmodalEditName(false)}
            idDocumentAdd={idDocumentAdd}
            handleGetChildFolder={handleGetChildFolder}
            listDocument={listDocument}
            handleGetListDocument={handleGetListDocument}
            setListDocument={setListDocument}
          />
        )}
      </>
    </>
  );
};
export default File;
