import { useState, useEffect } from "react";
import React from "react";
import { SpinCustom } from "components";
import "./index.scss";
import dayjs from "dayjs";
import AddDocument from "./components/addDocument";
import { DATE_FORMAT } from "utils/constants/config";
import File from "./components/File";
import {
  actionGetListDocument,
  actionGetListFolderChid,
  actionGetListRole,
} from "./action";

import {
  Layout,
  Col,
  Row,
  Input,
  DatePicker,
  Button,
  Breadcrumb,
} from "antd";
import { useSearchParams } from "react-router-dom";

const CommonDocument = () => {
  const [spinning, setSpinning] = useState(false);
  const [listDocument, setListDocument] = useState([]);
  const [name, setName] = useState(null);
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idDocumentAdd, setIdDocumentAdd] = useState();
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [idLastFolder, setIdLastFolder] = useState();
  const [roleUser, setRoleUser] = useState([]);
  const [totalFile, setTotalFile] = useState();
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get("document_id");
console.log(documentId);
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
        time_upload_start: dayjs(dateStart).unix() || null,
        time_upload_end: dayjs(dateEnd).startOf("D").unix() || null,
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
        time_upload_start: dayjs(dateStart).unix() || null,
        time_upload_end: dayjs(dateEnd).endOf("D").unix() || null,
   
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
        time_upload_start: dayjs(dateStart).unix() || null,
        time_upload_end: dayjs(dateEnd).endOf("D").unix() || null,
        document_id:  value?.id,
        file_id:documentId
       
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
  }, [idLastFolder,documentId]);

  useEffect(() => {
    handleGetRoleUser();
  }, []);

  return (
    <Layout className="common-layout document-page">
      <SpinCustom spinning={spinning}>
        <div className="common-layout--header">
          <Row className="filler" gutter={[8, 8]}>
            <Col span={24}>
              <Button
                className="exit-home"
                onClick={() => window.navigatePage("home-navigate")}
              >
                Thoát
              </Button>
            </Col>

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

            <Col span={12}>
              <Button
                onClick={() => setIsModalOpen(true)}
                type="primary"
                className="doc-add-btn"
              >
                Thêm tài liệu
              </Button>
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
            <File
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
            onCancel={() => setIsModalOpen(false)}
            handleGetListDocument={handleGetListDocument}
            handleGetChildFolder={handleGetChildFolder}
          />
        )}
      </>

    </Layout>
  );
};

export default CommonDocument;
