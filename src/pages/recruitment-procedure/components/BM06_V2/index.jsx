import { usePDF } from 'react-to-pdf';
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { AiptLogo } from 'assets';
import moment from 'moment';
import { DATE_FORMAT } from 'utils/constants/config';

const BM06V2 = forwardRef(({ openFeedBackV2}, ref) => {
  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });
  const [interviewer, setInterviewer] = useState(openFeedBackV2?.interviewer_name||'')
  const [interviewDay, setInterviewDay] = useState(moment(openFeedBackV2?.interview_time * 1000).format(DATE_FORMAT)||'')
  const [expertise, setExpertise] = useState('');
  const [experience, setExperience] = useState('');
  const [comment, setComment] = useState('');
  const [totalScore, setTotalScore] = useState('');
  const [probationarySalary, setProbationarySalary] = useState('');
  const [officialSalary, setOfficialSalary] = useState('');
  const [probationaryPeriod, setProbationaryPeriod] = useState('');
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
    <div className='bm6vong2'>
      <button
        className='bieumau-pdf-btn'
        onClick={() => toPDF()}>Xuất PDF</button>
 {/* <button
        className='bieumau-pdf-btn'
        onClick={() => handleSave()}>Lưu</button> */}
      <div ref={targetRef}>
        <div>
          <div className="page">
            <div className='header'>

              <div className='header-container'>

                <div className='header-container-logo'>
                  <img src={AiptLogo} alt='logo' />
                </div>
                <div className='header-container-title'>
                  <div className=''>
                    <h1>PHIẾU ĐÁNH GIÁ <br />
                      KẾT QUẢ PHỎNG VẤN</h1>
                  </div>
                </div>
                <div className='header-container-detail'>
                  <div>
                    Mã tài liệu: HR-QT-01-BM05
                  </div>
                  <div>Phiên bản: Ver 1.0</div>
                  <div>
                    Ngày ban hành:</div>

                </div>
              </div>
            </div>
            <hr className='second-divider-line' />
            <hr className='second-divider-line' />
            <div className='main'>

              <div className="main-second-table-BM6">
                <div className="main-second-table-BM6-feedback-secondround">
                  Phỏng vấn vòng 2: Phụ trách bộ phận chuyên môn
                </div>
                <div className="main-second-table-BM6-feedback-secondround-interviewer">
                  Người phỏng vấn:
                  <textarea
                  className="main-second-table-BM6-feedback-secondround-interviewer-input-ta"
                  value={interviewer}
                  onChange={(e) => setInterviewer(e.target.value)}
                  rows="2"
                  />
                </div>
                <div className="main-second-table-BM6-feedback-secondround-interviewDate">Ngày phỏng vấn:
                  <input type="text"
                  className="main-second-table-BM6-feedback-secondround-interviewDate-input"
                  value={interviewDay}
                  onChange={(e) => setInterviewDay(e.target.value)} />

                </div>
                <div className="main-second-table-BM6-feedback-secondround-skill"> 1. Kiến thức chuyên môn, khả năng đáp ứng các
                  nhiệm vụ trong bảng mô tả
                  công việc

                </div>
                <div className="main-second-table-BM6-feedback-secondround-blank">
                  <textarea name="myTextarea" cols="60" rows="1" className="main-second-table-BM6-feedback-secondround-blank-input" value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}></textarea>

                </div>
                <div className="main-second-table-BM6-feedback-secondround-score">Điểm</div>
                <div className="main-second-table-BM6-feedback-secondround-skill">
                  2.Kinh nghiệm - Năng lực – Kỹ năng</div>
                <div className="main-second-table-BM6-feedback-secondround-blank">
                  <textarea name="myTextarea" cols="60" rows="1" className="main-second-table-BM6-feedback-secondround-blank-input"value={experience}
                  onChange={(e) => setExperience(e.target.value)}></textarea>

                </div>
                <div className="main-second-table-BM6-feedback-secondround-score">Điểm</div>
                <div className="main-second-table-BM6-feedback-secondround-skill">
                  3.Nhận xét các vấn đề khác
                  ( kỹ năng giải quyết công
                  việc, khả năng giao tiếp…..)</div>
                <div className="main-second-table-BM6-feedback-secondround-blank">
                  <textarea name="myTextarea" cols="60" rows="1" className="main-second-table-BM6-feedback-secondround-blank-input"    value={comment}
                  onChange={(e) => setComment(e.target.value)}></textarea>

                </div>
                <div className="main-second-table-BM6-feedback-secondround-score">Điểm</div>
                <div className="main-second-table-BM6-feedback-secondround-score">
                  Tổng điểm
                </div>
                <div className="main-second-table-BM6-feedback-secondround-blank-total">
                  <input type="text" 
                    value={totalScore}
                  className="main-second-table-BM6-feedback-secondround-interviewer-input"
                  onChange={(e) => setTotalScore(e.target.value)}/>

                </div>

                <div className="main-second-table-BM6-feedback-secondround-end">
                  <div className="main-second-table-BM6-feedback-secondround-end-summary">   Kết luận - Đề xuất

                  </div>
                  <textarea name="myTextarea" cols="53" rows="1" className="main-second-table-BM6-feedback-secondround-end-summary-input"></textarea>

                  <div className="main-second-table-BM6-feedback-secondround-end-signature">  Ký xác nhận (ghi rõ họ tên)

                  </div>
                </div>
                <div className="main-second-table-BM6-feedback-secondround-bottomRight">
                  {/* <div className="main-second-table-BM6-feedback-secondround-bottomRight-checkbox-row">
                    <div className="main-second-table-BM6-feedback-secondround-bottomRight-checkbox1"><input type="checkbox" /> Nhận thử việc</div>
                    <div className="main-second-table-BM6-feedback-secondround-bottomRight-checkbox2"><input type="checkbox" />Không đạt vòng 2</div>
                  </div>
                  <div className="main-second-table-BM6-feedback-secondround-bottomRight-checkbox3"><input type="checkbox" />Tiến cử vào vị trí khác</div> */}
                  <div className="main-second-table-BM6-feedback-secondround-bottomRight-text">
                    Mức lương thử việc:
                    <input type="text" 
                       value={probationarySalary}
                    className="main-second-table-BM6-feedback-secondround-blank-input"
                  onChange={(e) => setProbationarySalary(e.target.value)} />

                    <br />
                    Mức lương chính thức:
                    <input type="text"
                       value={officialSalary}
                    className="main-second-table-BM6-feedback-secondround-blank-input"
                  onChange={(e) => setOfficialSalary(e.target.value)}/>

                    <br />
                    Thời gian thử việc:
                    <input type="text" 
                      value={probationaryPeriod}
                    className="main-second-table-BM6-feedback-secondround-blank-input"
                  onChange={(e) => setProbationaryPeriod(e.target.value)} />

                    <br />
                    Chế độ BHXH, BHYT, BHTN:
                    <input type="text"
                     value={bhxh}
                    className="main-second-table-BM6-feedback-secondround-blank-input"
                  onChange={(e) => setBhxh(e.target.value)}/>

                    <br />
                    Các nội dung khác:
                    <br />
                    <textarea name="myTextarea" cols="50" rows="2" className="main-second-table-BM6-feedback-secondround-blank-input-ta"   value={otherContent}
                  onChange={(e) => setOtherContent(e.target.value)}></textarea>

                  </div>

                </div>

              </div>





            </div>
          </div>


        </div>
      </div>
    </div>
  );
})

export default BM06V2;