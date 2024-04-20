import { SpinCustom } from "components";
import { Button, Checkbox, Col, DatePicker, Input, Layout, Row, Space, Image, Table, Modal, message } from "antd";
import { useEffect, useState } from "react";
import moment from "moment";
import dayjs from "dayjs";
import { DATE_FORMAT } from 'utils/constants/config';
import "../common-document/index.scss";
import {
  FolderIconDownload,
  WordIcon,
  PptxIcon,
  PdfIcon,
  ExcelIcon,
  DefaultIcon,
} from "assets";
import { SECOND_FORMAT } from "utils/constants/config";
import { REACT_APP_SERVER_BASE_URL } from 'utils/constants/config'
import { actionGetImage } from '../common-document/action';
import { actionGetListDocumentDelete, actionDeleteForever, actionRestoreDocument } from './action';

const Bin = () => {
  const [spinning, setSpinning] = useState(false)
  const [openSelect, setOpenSelect] = useState(false)
  const [dateStart, setDateStart] = useState(null)
  const [dateEnd, setDateEnd] = useState(null)
  const [name, setName] = useState()
  const [openButtonDelete, setOpenButtonDelete] = useState()

  const [listSelect, setListSelect] = useState([])
  const [listFile, setListFile] = useState([])

  // const pagination = {
  //   pageNum: 1,
  //   pageSize: 10,
  // };

  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      setListSelect([...listSelect, id]);
    } else {
      setListSelect(listSelect.filter((rowId) => rowId !== id));
    }
  };

  const handleGetListDocumentDelete = async () => {
    setSpinning(true)
    try {
      const params = {
        name,
        time_del_start: dayjs(dateStart).startOf('D').unix() || null,
        time_del_end: dayjs(dateEnd).endOf('D').unix() || null
      }
      const { data, status } = await actionGetListDocumentDelete(params);
      if (status === 200) {
        setListFile(data?.data)
      }
    } catch (err) {
      console.log(err)
    }
    setSpinning(false)
  }

  const confirmDelete = async (selectedRows, row) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa ?",
      onOk: async () => {
        setSpinning(true)
        try {
          const { data, status } = await actionDeleteForever({ doc_id: selectedRows });
          if (status === 200) {
            message.success(data?.message)

            setListFile(data?.data)
            setListSelect([])
          }
        } catch (err) {
          console.log(err)
        }
        setSpinning(false)
      },
      onCancel() {
        if (row) {
          setListSelect([])
        }
      }
    });

  };

  const confirmRestore = async (selectedRows, row) => {
    Modal.confirm({
      title: "Bạn có chắc muốn khôi phục ?",
      onOk: async () => {
        await handleRestoreDocument(selectedRows)
      },
      onCancel() {
        if (row) {
          setListSelect([])
        }
      },
    });
  };

  const getIconForDocumentType = (documentType, record, extension_file) => {

    if (documentType === 1) {
      return (
        <FolderIconDownload
          className="style-icon "
          onClick={(e) => {
            e.stopPropagation();
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
                type={extension_file === "mp4" ? "video/mp4" : "video/quicktime"}
              />
            </video>
          );
        default:
          return <DefaultIcon className="style-icon" />;
      }
    }
  }

  const handleRestoreDocument = async (listSelect) => {
    setSpinning(true)
    try {
      const { data, status } = await actionRestoreDocument({ doc_id: listSelect, status: 0 });
      if (status === 200) {
        message.success(data?.message)
        setListFile(data?.data_delete)
        setListSelect([])
      }
    } catch (err) {
      console.log(err)
    }
    setSpinning(false)
  }

  const columns = [
    {
      width: 5,
      dataIndex: "checkbox",
      hidden: false,
      render: (v, record, index) => (
        <Checkbox onChange={(e) => handleCheckboxChange(e, record.document_id)} />
      )
    },
    // {
    //   fixed: "left",
    //   width: 60,
    //   title: "STT",
    //   dataIndex: "id",
    //   key: "id",
    //   align:"center",
    //   render: (v, record, index) => (
    //     <Space>
    //       {index + 1 + (pagination.pageNum - 1) * pagination.pageSize}
    //     </Space>
    //   ),
    // },
    {
      width: 100,
      dataIndex: "document_id",
      key: "document_id",
      align: "center",
      render: (v, record) => {
        return getIconForDocumentType(record?.document_type, record, record.document_name.replace(/\s/g, "").split(".").pop() || "")
      }
    },
    {
      title: "Tên tài liệu ",
      dataIndex: "document_name",
      key: "document_name",
      align: "left",
    },
    {
      title: "Thời gian ",
      dataIndex: "time_action",
      key: "time_action",
      width: 150,
      align: "center",
      render: (r, v) => {
        return v?.time_action ? moment(v?.time_action * 1000).format(SECOND_FORMAT) : null
      }
    },
    {
      title: "Đã xóa(ngày) ",
      dataIndex: "time_action",
      key: "time_action",
      width: 50,
      align: "center",
      render: (r, v) => {
        return v?.time_action ? parseInt(new Date().getTime() / (1000 * v?.time_action * 3600)) : null
      }
    },
    {
      title: "Người xóa",
      dataIndex: "user_action",
      width: 250,
      key: "user_action",
      align: "center",
    },
    {
      title: "Hành động",
      width: 100,
      dataIndex: "phone",
      key: "phone",
      align: "center",
      render: (v, r) => {
        return (
          <Space>
            <Button
              type="primary"
              className="ant-btn-primary"
              onClick={() => {
                setOpenSelect(false)
                confirmRestore([r?.document_id], r?.document_id)
              }}
            >
              Khôi phục
            </Button>

            <Button
              type="primary"
              className="ant-btn-cancel"
              onClick={() => {
                setOpenSelect(false)
                confirmDelete([r.document_id], r?.document_id)
              }}>
              Xóa
            </Button>
          </Space>
        )
      }
    },
  ].filter(item => { return openSelect ? item : item.dataIndex !== "checkbox" });

  useEffect(() => {
    handleGetListDocumentDelete()
  }, [name, dateStart, dateEnd])

  return (
    <Layout className="common-layout document-page">
      <SpinCustom spinning={spinning}>
        <div className="common-layout--header">
          <Row className="filler" gutter={[8, 8]}>
            <Col>
              <Row gutter={[8, 0]}>
                <Col className="align--center">
                  <span>Từ:</span>
                </Col>
                <Col>
                  <DatePicker
                    defaultValue={dateStart}
                    onChange={(v) => {
                      setDateStart(v);

                    }}
                    allowClear
                    format={DATE_FORMAT}
                  />
                </Col>
              </Row>
            </Col>

            <Col>
              <Row gutter={[8, 0]}>
                <Col className="align--center">
                  <span>Đến:</span>
                </Col>
                <Col>
                  <DatePicker
                    defaultValue={dateEnd}
                    onChange={(v) => {
                      setDateEnd(v);
                    }}
                    allowClear
                    format={DATE_FORMAT}
                  />
                </Col>
              </Row>
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

          </Row>
        </div>

        <div className="common-layout--content">
          <Row className="filler" gutter={[8, 8]}>
            <Col>
              <Button
                className="w-full"
                type="primary"
                onClick={() => {
                  setOpenSelect(!openSelect)
                  openSelect && setListSelect([])
                  !openSelect ? setOpenButtonDelete(true) : setOpenButtonDelete(false)
                }}>
                {!openSelect ? 'Chọn' : 'Bỏ chọn'}
              </Button>
            </Col>

            {(listSelect.length > 0 && openSelect) && (<Col>
              <Button
                className="w-full"
                type="primary"
                onClick={() => confirmRestore(listSelect, null)}
              >
                Khôi phục
              </Button>
            </Col>)}

            {(listSelect.length > 0 && openSelect) && (<Col>
              <Button
                type="primary"
                className="ant-btn-cancel"
                onClick={() => confirmDelete(listSelect, null)}
              >
                Xóa
              </Button>
            </Col>)}
          </Row>
          <Table
            width="100%"
            dataSource={listFile}
            rowKey={(r) => r.id}
            columns={columns}

          />
        </div>
      </SpinCustom>



    </Layout >
  )
}

export default Bin