import { useState, useEffect } from "react";
import React from "react";
import { SpinCustom } from "components";
import "../common-document/index.scss";
import dayjs from "dayjs";
import AddDocument from "../common-document/components/addDocument";
import { DATE_FORMAT } from "utils/constants/config";
import FileWorkSpace from "../common-document/components/FileWorkSpace";

import {
  actionGetListDocument,
  actionGetListFolderChid,
  actionGetListRole,
} from "../common-document/action";

import {
  Layout,
  Col,
  Row,
  Input,
  DatePicker,
  Button,
  Breadcrumb,
  Space,
} from "antd";
import { useSearchParams } from "react-router-dom";

const WorkSpace = () => {
  const [spinning, setSpinning] = useState(false);
  const [listDocument, setListDocument] = useState([]);
  const [name, setName] = useState(null);
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkIsOpenWorkSpace, setCheckIsOpenWorkSpace] = useState(false);
  const [idDocumentAdd, setIdDocumentAdd] = useState();
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [idLastFolder, setIdLastFolder] = useState();
  const [roleUser, setRoleUser] = useState([]);
  const [totalFile, setTotalFile] = useState();
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get("document_id");

  const handleNavigateBack = (e, breadcrumb, index) => {
    const last_folder = [];
    breadcrumbs.map((item, index1) => {
      return index1 < index && last_folder.push(item);
    });
    setBreadcrumbs(last_folder);
    setIdLastFolder(breadcrumb);
  };

  const handleCommonBreadcrumbClick = async () => {
    setSpinning(true);
    try {
      setIdDocumentAdd();
      setBreadcrumbs([]);
      setIdDocumentAdd();
      const params = {
        name: name || null,
        time_upload_start: dayjs(dateStart).startOf("D").unix() || null,
        time_upload_end: dayjs(dateEnd).endOf("D").unix() || null,
        document_type:2
      };
      const { data, status } = await actionGetListDocument(params);
      if (status === 200) {
        setListDocument(data?.data);
      }
    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };

  const handleGetListDocument = async () => {
    setSpinning(true);
    try {
      const params = {
        name: name || null,
        time_upload_start: dayjs(dateStart).startOf("D").unix() || null,
        time_upload_end: dayjs(dateEnd).endOf("D").unix() || null,
        document_type:2
      };
      if (idDocumentAdd) {
        params.document_id = idDocumentAdd;
      }
      setIdDocumentAdd();
      const { data, status } = await actionGetListDocument(params);
      if (status === 200) {
        setListDocument(data?.data);
        setBreadcrumbs([]);
        setTotalFile(data?.total);
      }
    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };

  const handleGetChildFolder = async (value) => {
    setSpinning(true);
    try {
      setIdDocumentAdd(value?.id);
      const params = {
        name: name || null,
        time_upload_start: dayjs(dateStart).startOf("D").unix() || null,
        time_upload_end: dayjs(dateEnd).endOf("D").unix() || null,
        document_id: value?.id,
        file_id: documentId,
        document_type:2
      };
      const { data, status } = await actionGetListFolderChid(params);
      if (status === 200) {
        setListDocument(data?.data);

        if (value && breadcrumbs.some((item) => item.id === value?.id)) {
          setBreadcrumbs(
            breadcrumbs.map((item) => {
              if (item.id === value?.id) {
                item.total = data?.total;
                return { ...item };
              } else {
                return item;
              }
            })
          );
        } else if (
          value &&
          !breadcrumbs.some((item) => item.id === value?.id)
        ) {
          setBreadcrumbs([
            ...breadcrumbs,
            { id: value?.id, name: value?.name, total: data?.total },
          ]);
        }
      }
    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };

  const handleGetRoleUser = async () => {
    setSpinning(true);
    try {
      const { data, status } = await actionGetListRole();
      if (status === 200) {
        setRoleUser(data?.data);
      }
    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };

  useEffect(() => {
    handleGetListDocument();
  }, [name, dateStart, dateEnd]);

  useEffect(() => {
    handleGetChildFolder(idLastFolder);
  }, [idLastFolder, documentId]);

  useEffect(() => {
    handleGetRoleUser();
  }, []);

  return (
    <Layout className="common-layout document-page">
      <SpinCustom spinning={spinning}>
        <div className="common-layout--header">
          <Row
            gutter={[8, 16]}
          >
            <Col span={24}>
              <Row
                className="filler"
                gutter={[8, 16]}
              >
                <Button
                  className="exit-home"
                  onClick={() => window.navigatePage("home-navigate")}
                >
                  Thoát
                </Button>

                <Col className="align--center" >
                  <Col gutter={[4, 0]}>
                    <span>Từ:</span>
                  </Col>
                  <Col className="align--center" gutter={[4, 0]}>
                    <DatePicker
                      defaultValue={dateStart}
                      onChange={(v) => {
                        setDateStart(v);
                      }}
                      allowClear
                      format={DATE_FORMAT}
                    />
                  </Col>
                </Col>

                <Col className="align--center" >
                  <Col gutter={[4, 0]}>
                    <span>Đến:</span>
                  </Col>
                  <Col gutter={[4, 0]}>
                    <DatePicker
                      defaultValue={dateEnd}
                      onChange={(v) => {
                        setDateEnd(v);
                      }}
                      allowClear
                      format={DATE_FORMAT}
                    />
                  </Col>
                </Col>

                <Col className="filler--item" xs={24} sm={24} md={6} lg={4}>
                  <Input.Search
                    onSearch={(v) => {
                      setName(v);
                    }}
                    placeholder="Nhập tên ..."
                    allowClear
                  />
                </Col>
              </Row>
            </Col>
            <Col span={24}>

              <Row gutter={[16,8]}>
              

                <Col>
                  <Button
                    onClick={() =>{
                      setCheckIsOpenWorkSpace(true)
                      setIsModalOpen(true)} }
                    type="primary"
                    className="doc-add-btn"
                  >
                    Tạo workspace
                  </Button>
                </Col>
              </Row>
            </Col>

          </Row>

        </div>
        <div className="common-layout--content">
          <Row gutter={[8, 16]}>
            <Breadcrumb className="dropdown-action ">
              <Breadcrumb.Item
                onClick={() => {
                  handleCommonBreadcrumbClick();
                }}
              >
                Tài liệu({totalFile})
              </Breadcrumb.Item>

              {breadcrumbs.map((breadcrumb, index) => {
                return (
                  <Breadcrumb.Item
                    key={index}
                    onClick={(e) => handleNavigateBack(e, breadcrumb, index)}
                  >
                    {breadcrumb.name}
                    {`(${breadcrumb.total})`}
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
            <FileWorkSpace
              listDocument={listDocument}
              handleGetListDocument={handleGetListDocument}
              handleGetChildFolder={handleGetChildFolder}
              setIsModalOpen={setIsModalOpen}
              idDocumentAdd={idDocumentAdd}
              setListDocument={setListDocument}
              roleUser={roleUser}

            />
          </Row>
        </div>
      </SpinCustom>
      <>
        {isModalOpen && (
          <AddDocument
            idDocumentAdd={idDocumentAdd}
            checkIsOpenWorkSpace={checkIsOpenWorkSpace}
            onCancel={() => setIsModalOpen(false)}
            handleGetListDocument={handleGetListDocument}
            handleGetChildFolder={handleGetChildFolder}
          />
        )}
      </>
    </Layout>
  );
};

export default WorkSpace;
