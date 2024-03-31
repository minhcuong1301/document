import { usePDF } from 'react-to-pdf';
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { AiptLogo } from 'assets';
import { DATE_FORMAT } from 'utils/constants/config';
import moment from 'moment';
import { formatCurrency } from 'utils/helps';

const BM06V3 = forwardRef(({ openFeedBackV3, setEstimatedPriceFormatCurrency }, ref) => {
  // console.log(setEstimatedPriceFormatCurrency);
  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });
  const [position, setPosition] = useState(openFeedBackV3?.position_name || '');
  const [department, setDepartment] = useState(openFeedBackV3?.dep_name || '');
  const [probationarySalary, setProbationarySalary] = useState(formatCurrency(openFeedBackV3?.salary || 0));
  const [startWorking, setStartWorking] = useState(moment(openFeedBackV3?.start_working * 1000).format(DATE_FORMAT) || '')
  const [bhxh, setBhxh] = useState('');
  const [otherContent, setOtherContent] = useState('');
  const handleSave = () => {
    const text = targetRef.current.innerHTML;
    return text;
  };

  useImperativeHandle(ref, () => ({
    handleSave
  }))
  return (
    <div className='bm6vong3'>
      <button
        className='bieumau-pdf-btn'

        onClick={() => toPDF()}>Xuất PDF</button>
      <div ref={targetRef}>
        <div className="page">
          <div className="header">

            <div className="header-container">

              <div className="header-container-logo">
                <img src={AiptLogo} alt="logo" />
              </div>
              <div className="header-container-title">
                <div className="">
                  <h1>PHIẾU ĐÁNH GIÁ <br />
                    KẾT QUẢ PHỎNG VẤN</h1>
                </div>
              </div>
              <div className="header-container-detail">
                <div>
                  Mã tài liệu: HR-QT-01-BM05
                </div>
                <div>Phiên bản: Ver 1.0</div>
                <div>
                  Ngày ban hành:</div>

              </div>
            </div>

          </div>
          <hr className='first-divider-line' />
          <hr className='second-divider-line' />
          <div className='main'>
            <div className="main-second-table-BM6">
              <div className="main-second-table-BM6-feedback-secondround-bossDecision">Kết luận của Giám đốc</div>
              <div className="main-second-table-BM6-feedback-secondround-bossSignature">
                <div className="main-second-table-BM6-feedback-secondround-bossSignature-upper">
                  GĐ phê duyệt
                </div>
                <div className="main-second-table-BM6-feedback-secondround-bossSignature-sub">
                  <i> ( ký, ghi rõ họ tên)</i></div>
              </div>
              <div className="main-second-table-BM6-feedback-secondround-bossApproval">
                {/* <div className="main-second-table-BM6-feedback-secondround-bossApproval-checkbox-row">
                  <div className="main-second-table-BM6-feedback-secondround-bossApproval-checkbox1"><input type="checkbox" /> 
                  <span className="main-second-table-BM6-feedback-secondround-bossApproval-field-sidetext">Tiếp nhận</span> </div>
                  <div className="main-second-table-BM6-feedback-secondround-bossApproval-checkbox2"><input type="checkbox" />
                  <span className="main-second-table-BM6-feedback-secondround-bossApproval-field-sidetext">Không tiếp nhận</span> </div>
                </div> */}
                <div className="main-second-table-BM6-feedback-secondround-bossApproval-text">
                    Tiếp nhận vào chức vụ:
                  <input type="text"
                    className="main-second-table-BM6-feedback-secondround-bossApproval-text-input"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)} />

                  <br />

                    Bộ phận:

                  <input type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="main-second-table-BM6-feedback-secondround-bossApproval-text-input"

                  />

                  <br />

                    Mức lương thử việc:

                  <input type="text" name='convert_salary'
                    value={probationarySalary}
                    className="main-second-table-BM6-feedback-secondround-bossApproval-text-input"

                    onChange={(e) => setProbationarySalary(e.target.value)} />

                  <br />

                    Mức lương dự kiến chính thức:

                  <input type="text"
                    name='convert_salary'
                    className="main-second-table-BM6-feedback-secondround-bossApproval-text-input"

                    value={probationarySalary}
                    onChange={(e) => setProbationarySalary(e.target.value)} />

                  <br />

                    Ngày bắt đầu làm việc:

                  <input type="text"
                    className="main-second-table-BM6-feedback-secondround-bossApproval-text-input"

                    value={startWorking}
                    onChange={(e) => setStartWorking(e.target.value)} />

                  <br />

                    Thời gian thử việc:

                  <input type="text" value={startWorking}
                    className="main-second-table-BM6-feedback-secondround-bossApproval-text-input"

                    onChange={(e) => setStartWorking(e.target.value)} />

                  <br />
                    Chế độ BHXH, BHYT, BHTN:

                  <input type="text"
                    value={bhxh}
                    className="main-second-table-BM6-feedback-secondround-bossApproval-text-input"

                    onChange={(e) => setBhxh(e.target.value)} />


                  <br />

                    Các chế độ khác:
                  <input type="text"
                    value={otherContent}
                    onChange={(e) => setOtherContent(e.target.value)}
                    className="main-second-table-BM6-feedback-secondround-bossApproval-text-input"

                  />
                </div>
              </div>
            </div>





          </div>
        </div>


      </div>
    </div>
  );
})

export default BM06V3;