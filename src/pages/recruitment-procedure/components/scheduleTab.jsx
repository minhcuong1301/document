import { useState, useEffect, } from "react";
import { useRef } from "react";
import dayjs from "dayjs";

import {
  Table,
  Row, Col, Button, Space,
  Popconfirm,
  message
} from "antd"


import moment from "moment"
import { DATETIME_FORMAT, INTERVIEW_STATUS } from "utils/constants/config"
import { useSearchParams } from "react-router-dom"
import { actionGetScheldule, actionHandleReview } from "../actions"
import 'antd-button-color/dist/css/style.css';
import FeedBackModal from "./feedBackModal"
import ExportPdfModal from "./exportPdfScheduleModal";
import FeedBackModalV2 from "./feedBackModalV2"
import FeedBackModalV3 from "./feedBackModalV3"
import { useSelector } from "react-redux";
import DetailFeedBack from "./detailFeedBack";
import SendEmailReceiveJob from "./uploadFileReceiveJob";
const ScheduleTab = ({ setTabKey, timeStart, timeEnd }) => {

  const [spinning, setSpinning] = useState(false)
  const userLogin = useSelector((state) => state?.profile);
  const [searchParams] = useSearchParams()
  const [openFeedBack, setOpenFeedBack] = useState(false)
  const [openFeedBackV2, setOpenFeedBackV2] = useState(false)
  const [openFeedBackV3, setOpenFeedBackV3] = useState(false)
  const [interviewId, setInterviewId] = useState()
  const [openDetailV1, setOpenDetailV1] = useState(false)
  const [statusRound, setStatusRound] = useState(0)
  const [openModalSendEmail, SetOpenModalSendEmail] = useState(false)
  const [par, setPar] = useState()

  const targetRef = useRef();
  const [dataExport, setDataExport] = useState()

  const [dataTb, setDataTb] = useState([])
  const [totalRecordTb, setTotalRecordTb] = useState(0)

  const [paginationTab, setPaginationTab] = useState({
    page_num: 1,
    page_size: 10
  })

  const recruitmentId = searchParams.get('recruitment_id')

  const handleGetScheldule = async (page_num, page_size) => {

    setSpinning(true)
    try {
      setPaginationTab({ page_num, page_size })

      const params = {
        page_num,
        page_size,
        // recruitment_id: recruitmentId || null,
        imterview_time_start: dayjs(timeStart).startOf('D').unix() || null,
        imterview_time_end: dayjs(timeEnd).endOf('D').unix() || null,
        tab: 1,
      }
      setPar(params)

      const { data, status } = await actionGetScheldule(params)

      if (status === 200) {
        setDataTb(data?.list_interview)
        setTotalRecordTb(data?.total)
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false)
  }

  const handleReview = async (id, page_num, page_size) => {
    setSpinning(true)
    try {
      setPaginationTab({ page_num, page_size })
      const params = {
        page_num,
        page_size,
        // recruitment_id: recruitmentId || null,
        tab: 1,
      }
      setPar(params)
      const req_data = {
        form_review: null,
        status: 0,
        interview_time: null,
        interviewer: null,
        salary: null,
        start_working: null,
        description: null,
        interview_action: null
      }
      const { status, data } = await actionHandleReview(id, req_data, params)

      if (status === 200) {
        message.success(data?.message)
        setDataTb(data?.list_interview)
        setTotalRecordTb(data?.total)
      }
    } catch (error) {
      console.log(error)
    }
    setSpinning(false)
  }

  useEffect(() => {
    handleGetScheldule(1, 10)
  }, [
    recruitmentId,
    timeStart,
    timeEnd
  ])

  const columns = [
    {
      fixed: 'left',
      width: 60,
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (v, r, index) => index + 1 + (paginationTab.page_num - 1) * paginationTab.page_size,
    },
    {
      width: 80,
      title: "Mã số",
      dataIndex: "id",
      key: "id",

    },
    {
      title: "Họ và tên",
      dataIndex: "applicant_name",
      key: "applicant_name",
      align: "center",
    },
    {
      title: "Phòng ban",
      dataIndex: "dep_name",
      key: "dep_name",
      align: "center"
    },
    {
      title: "Thời gian phỏng vấn",
      dataIndex: "interview_time",
      key: "interview_time",
      render: (v) => moment(v * 1000).format(DATETIME_FORMAT),
      align: "center"
    },
    {
      title: "Vị trí",
      dataIndex: "position_name",
      key: "position_name",
      align: "center"
    },
    {
      title: "Người phỏng vấn",
      dataIndex: "interviewer_name",
      key: "interviewer_name",
      render: (v, r) => r?.interviewer_name.map(e => e).toLocaleString().replace(/,/g, ', '),
      align: "center"
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      align: "center"
    },

    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      align: "center"
    },
    {
      title: "Đánh giá V1",
      dataIndex: "cvreview_round_1",
      key: "review_round_1",
      render: (v, r) => r?.review_round_1 && <Button
        type="primary"
        className="btn-update"
        onClick={() =>{
          setStatusRound(1)
        setOpenDetailV1(r)}} 
      >
        Mở
      </Button>,
      align: "center"
    },
    {
      title: "Đánh giá V2",
      dataIndex: "cvreview_round_2",
      key: "review_round_2",
      render: (v, r) => r?.review_round_2 && <Button
        type="primary"
        className="btn-update"
        onClick={() => {
          setStatusRound(2)
          setOpenDetailV1(r)}}
      >
        Mở
      </Button>,
      align: "center"
    },
    {
      title: "Đánh giá V3",
      dataIndex: "cvreview_round_3",
      key: "review_round_3",
      render: (v, r) => r?.review_round_3 && <Button
        type="primary"
        className="btn-update"
        onClick={() => {
          setStatusRound(3)
          setOpenDetailV1(r)}}
      >
        Mở
      </Button>,
      align: "center"
    },
    {
      width: 180,
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (v, r) => {
        let statusClass;
        switch (v) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
            statusClass = "process--waiting";
            break;

          case 5:
            statusClass = "process--success";
            break;
          case 6:
            statusClass = "process--cancel";
            break;
          default:
            statusClass = "process";
        }
        return <span className={statusClass}>{INTERVIEW_STATUS[v]}</span>
      },
      align: "center"
    },
    {
      width: 450,
      title: "Thao tác",
      dataIndex: "t",
      key: "t",
      render: (v, r) => <Space onClick={e => e.stopPropagation()}>
        <Button type="info" onClick={() => {
          setOpenFeedBack(r)
          setInterviewId(r.id)
        }}
          disabled={(r?.status !== 0)}
        >
          Vòng 1
        </Button>
        <Button
          type="info"
          onClick={() => {
            setOpenFeedBackV2(r)
            setInterviewId(r.id)
          }}
          disabled={r?.status == 2 || r?.status == 3 || r?.status === 4 || r?.status === 5 || r?.status === 6
          }

        >
          Vòng 2

        </Button>
        <Button
          type="info"
          onClick={() => {
            setOpenFeedBackV3(r)
            setInterviewId(r.id)
          }}
          disabled={r?.status !== 2 || userLogin?.position_code !== "GIAM_DOC"}
        >
          Vòng 3
        </Button>

       {userLogin?.position_code !== "GIAM_DOC" && <Button
          type="info"
          onClick={() => {
            setInterviewId(r.id)
            SetOpenModalSendEmail(true)
          }}
        >
          Email
        </Button> }

        <Popconfirm
          title={"Bạn chắc chắn muốn loại?"}
          okText={"Loại"}
          cancelText="Hủy"
          // onConfirm={() => handleReview(r.id, paginationTab.page_num, paginationTab.page_size)}
          onConfirm={() => handleReview(r.id)}
        >
          <Button type="cancel"
          >Loại</Button>

        </Popconfirm>



      </Space>,
      align: "center"
    }
  ]

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col>
          <Button type="primary" onClick={() => {

            console.log('dataTb', dataTb);
            setDataExport(dataTb)
          }}>
            Xuất pdf
          </Button>
        </Col>

        <Col span={24} ref={targetRef}>
          <Table
            className="tb-click-row"
            width="100%"
            rowKey={(r) => r.id}
            loading={spinning}
            columns={columns}
            dataSource={dataTb}
            scroll={{ x: 2000 }}
            pagination={{
              current: paginationTab.page_num,
              pageSize: paginationTab.page_size,
              total: totalRecordTb,
              onChange: handleGetScheldule,
            }}
          />
        </Col>
      </Row>

      <>

        {
          openFeedBack && <FeedBackModal
            openFeedBack={openFeedBack}
            onCancel={() => setOpenFeedBack(false)}
            setDataTb={setDataTb}
            interviewId={interviewId}
            page_num={paginationTab.page_num}
            page_size={paginationTab.page_size}
          />
        }

        {
          openFeedBackV2 && <FeedBackModalV2
            openFeedBackV2={openFeedBackV2}
            onCancel={() => setOpenFeedBackV2(false)}
            setDataTb={setDataTb}
            interviewId={interviewId}
          />
        }

        {
          openFeedBackV3 && <FeedBackModalV3
            openFeedBackV3={openFeedBackV3}
            onCancel={() => setOpenFeedBackV3(false)}
            setDataTb={setDataTb}
            interviewId={interviewId}
          />
        }
        {openDetailV1 && (
          <DetailFeedBack
            openDetailV1={openDetailV1}
            statusRound={statusRound}
            onCancel={() => setOpenDetailV1(false)}
          />
        )}
        {dataExport && <ExportPdfModal
          data={dataExport}
          onCancel={() => setDataExport(null)}
          userLogin={userLogin}

        />}
        {openModalSendEmail && <SendEmailReceiveJob
          interviewId={interviewId}
          setDataTb={setDataTb}
          par={par}
          onCancel={() => SetOpenModalSendEmail(false)}
        />}
      </>
    </>
  )


}
export default ScheduleTab