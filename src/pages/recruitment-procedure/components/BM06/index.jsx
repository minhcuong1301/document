import { usePDF } from 'react-to-pdf';
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
// import './index.scss';
import { AiptLogo } from 'assets';
import { DATETIME_FORMAT, DATE_FORMAT, EXPERIENCE } from 'utils/constants/config';
import moment from 'moment';

const BM06 = forwardRef(({ openFeedBack}, ref) => {
  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });
  const [fullName, setFullName] = useState(openFeedBack?.applicant_name || '')
  const [currentSalary, setCurrentSalary] = useState('');
  const [position, setPosition] = useState(openFeedBack?.position_name||'');
  const [desiredSalary, setDesiredSalary] = useState('');
  const [department, setDepartment] = useState(openFeedBack?.dep_name||'');
  const [expectedWorkday, setExpectedWorkday] = useState('');
  const [experience, setExperience] = useState(EXPERIENCE[openFeedBack?.experience]||'');
  const [positionCurrent, setPositionCurrent] = useState('')
  const [interviewer, setInterviewer] = useState(openFeedBack?.interviewer_name||'')
  const [interviewDay, setInterviewDay] = useState(moment(openFeedBack?.interview_time * 1000).format(DATE_FORMAT)||'')
  const [communicationSkills, setCommunicationSkills] = useState('')
  const [expertise, setExpertise] = useState('')
  const [adaptability, setAdaptability] = useState('')
  const [workAbility, setWorkAbility] = useState('')
  const [organizationalCpacity, setOrganizationalCpacity] = useState('')
  const [spiritLearning, setSpiritLearning] = useState('')
  const [totalScore, setTotalScore] = useState('');
  const [probationarySalary, setProbationarySalary] = useState('');
  const [officialSalary, setOfficialSalary] = useState('');
  const [otherContent, setOtherContent] = useState('');

  const [checkboxState, setCheckboxState] = useState({
    receiveTrial: false,
    notPassRound1: false,
    recommendOtherPosition: false
  });
  

  const handleCheckboxChange = (name) => {
    setCheckboxState(prevState => ({
      ...prevState,
      [name]: !prevState[name]
    }));
  };
  const handleSave = () => {  
    const text = targetRef.current.innerHTML;
    return text;
  };


  useImperativeHandle(ref, () => ({
    handleSave
  }))

  return (
    <div className='bm6vong1'>
      <button
        className='bieumau-pdf-btn'
        onClick={() => toPDF()}>Xuất PDF</button>
      {/* <button
        className='bieumau-pdf-btn'
        onClick={() => handleSave()}>Lưu</button> */}
      <div ref={targetRef}>
        <div id='g'>
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
            <hr className='first-divider-line' />
            <hr className='second-divider-line' />
            <div className='main'>
              <div className="main-first-table-BM6">
                <div className="main-first-table-BM6-info">A.Thông tin ứng viên </div>
                <div className="main-first-table-BM6-info-name">Họ tên ứng viên:
                <input
                  type="text"
                  className='main-first-table-BM6-info-input'
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  
                   />
                </div>
                <div className="main-first-table-BM6-info-salary-current">Mức lương hiện tại:
                <input
                  type="text"
                  className='main-first-table-BM6-info-input'
                  value={currentSalary}
                  onChange={(e) => setCurrentSalary(e.target.value)}
                   />
                </div>
                <div className="main-first-table-BM6-info-position-want">Vị trí dự tuyển:
                <input
                  type="text"
                  className='main-first-table-BM6-info-input'
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                   />
                </div>
                <div className="main-first-table-BM6-info-salary-want">Mức lương đề nghị:
                <input
                  type="text"
                  className='main-first-table-BM6-info-input'
                  value={desiredSalary}
                  onChange={(e) => setDesiredSalary(e.target.value)}
                   />
                </div>
                <div className="main-first-table-BM6-info-dept">Phòng ban:
                <input
                  type="text"
                  className='main-first-table-BM6-info-input'
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                   />
                </div>
                <div className="main-first-table-BM6-info-workday">Ngày làm việc dự kiến:
                <input
                  type="text"
                  className='main-first-table-BM6-info-input'
                  value={expectedWorkday}
                  onChange={(e) => setExpectedWorkday(e.target.value)}
                   />
                </div>
                <div className="main-first-table-BM6-info-exp">Số năm kinh nghiệm:
                <input
                  type="text"
                  className='main-first-table-BM6-info-input'
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                   />

                </div>
                <div className="main-first-table-BM6-info-position-current">Chức danh hiện tại:
                <input
                  type="text"
                  className='main-first-table-BM6-info-input'
                  value={positionCurrent}
                  onChange={(e) => setPositionCurrent(e.target.value)}
                   />
                </div>

                <div className="main-first-table-BM6-feedback">B. Đánh giá phỏng vấn</div>
                <div className="main-first-table-BM6-feedback-guide">
                  Hướng dẫn điểm đánh giá: <div style={{ margin: "0 10px" }}>Tốt (4) </div> <div style={{ margin: "0 10px" }}>Khá (3)</div> <div style={{ margin: "0 10px" }}>Trung bình (2)</div><div style={{ margin: "0 10px" }}>Kém (1)</div>

                </div>
                <div className="main-first-table-BM6-feedback-firstround">
                  Phỏng vấn vòng 1: Phòng Hành chính nhân sự

                </div>
                <div className="main-first-table-BM6-feedback-firstround-interviewer">Người phỏng vấn:
                <textarea
                

                  className='main-first-table-BM6-feedback-input-ta'
                   value={interviewer}
                  onChange={(e) => setInterviewer(e.target.value)}
                  rows='2'
                  />

                </div>
                <div className="main-first-table-BM6-feedback-firstround-interviewDate">Ngày phỏng vấn:
                  <input type="text"  value={interviewDay}

                  className='main-first-table-BM6-feedback-input'
                  onChange={(e) => setInterviewDay(e.target.value)}/>

                </div>
                <div className="main-first-table-BM6-feedback-firstround-skill"> 1. Kỹ năng giao tiếp ( Khả năng lập
                  luận, tư duy, mạch lạc, trình bày có sức
                  thuyết phục)</div>
                <div className="main-first-table-BM6-feedback-firstround-blank">
                <textarea name="myTextarea" cols="60" rows="5" className="main-first-table-BM6-feedback-firstround-blank-input" value={communicationSkills}
                  onChange={(e) => setCommunicationSkills(e.target.value)}></textarea>
                </div>
                <div className="main-first-table-BM6-feedback-firstround-score">Điểm</div>
                <div className="main-first-table-BM6-feedback-firstround-skill"> 2. Kiến thức chuyên môn, hiểu biết
                  nghiệp vụ</div>
                <div className="main-first-table-BM6-feedback-firstround-blank">
                <textarea name="myTextarea" cols="60" rows="5" className="main-first-table-BM6-feedback-firstround-blank-input" value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}></textarea>

                </div>
                <div className="main-first-table-BM6-feedback-firstround-score">Điểm</div>
                <div className="main-first-table-BM6-feedback-firstround-skill"> 3. Khả năng thích nghi môi trường
                  làm việc và chịu áp lực công việc</div>
                <div className="main-first-table-BM6-feedback-firstround-blank">
                <textarea name="myTextarea" cols="60" rows="5" className="main-first-table-BM6-feedback-firstround-blank-input" value={adaptability}
                  onChange={(e) => setAdaptability(e.target.value)}></textarea>                </div>
                <div className="main-first-table-BM6-feedback-firstround-score">Điểm</div>
                <div className="main-first-table-BM6-feedback-firstround-skill"> 4. Khả năng làm việc tập thể/ Ý thức
                  hợp tác, giúp đỡ đồng nghiệp</div>
                <div className="main-first-table-BM6-feedback-firstround-blank">
                <textarea name="myTextarea" cols="60" rows="5" className="main-first-table-BM6-feedback-firstround-blank-input" value={workAbility}
                  onChange={(e) => setWorkAbility(e.target.value)}></textarea>
                </div>
                <div className="main-first-table-BM6-feedback-firstround-score">Điểm</div>
                <div className="main-first-table-BM6-feedback-firstround-skill"> 5. Năng lực tổ chức quản lý, khả
                  năng lãnh đạo, tầm nhìn, đưa ra mục
                  tiêu, phân công công việc ( đối với
                  quản lý)</div>
                <div className="main-first-table-BM6-feedback-firstround-blank">
                <textarea name="myTextarea" cols="60" rows="5" className="main-first-table-BM6-feedback-firstround-blank-input" value={organizationalCpacity}
                  onChange={(e) => setOrganizationalCpacity(e.target.value)}></textarea>
                </div>
                <div className="main-first-table-BM6-feedback-firstround-score">Điểm</div>
                <div className="main-first-table-BM6-feedback-firstround-skill"> 6. Tinh thần học hỏi, tìm hiểu công việc, trách nhiệm và nhiệt tình/tâm huyết/cam
                  kết gắn bó với tổ chức</div>
                <div className="main-first-table-BM6-feedback-firstround-blank">
                <textarea name="myTextarea" cols="60" rows="5" className="main-first-table-BM6-feedback-firstround-blank-input" value={spiritLearning}
                  onChange={(e) => setSpiritLearning(e.target.value)}></textarea>
                </div>
                <div className="main-first-table-BM6-feedback-firstround-score">Điểm</div>
                <div className="main-first-table-BM6-feedback-firstround-score">
                  Tổng điểm
                </div>
                <div className="main-first-table-BM6-feedback-firstround-blank-total">
                  <input type="text"   value={totalScore}

                  className='main-first-table-BM6-info-input'
                  onChange={(e) => setTotalScore(e.target.value)}/>

                </div>
                <div className="main-first-table-BM6-feedback-firstround-end">
                  <div className="main-first-table-BM6-feedback-firstround-end-summary">   Kết luận - Đề xuất

                  </div>
                  <textarea name="myTextarea" cols="40" rows="3" className="main-first-table-BM6-feedback-firstround-blank-input"></textarea>
                  <div className="main-first-table-BM6-feedback-firstround-end-signature">  Ký xác nhận (ghi rõ họ tên)

                  </div>
                </div>
                <div className="main-first-table-BM6-feedback-firstround-bottomRight">
                  {/* <div className="main-first-table-BM6-feedback-firstround-bottomRight-checkbox-row">
                    <div className="main-first-table-BM6-feedback-firstround-bottomRight-checkbox1"> <input
                          type="checkbox"
                          checked={checkboxState.receiveTrial}
                          onChange={() => handleCheckboxChange('receiveTrial')}
                        />Nhận thử việc</div>
                    <div className="main-first-table-BM6-feedback-firstround-bottomRight-checkbox2">  <input
                          type="checkbox"
                          checked={checkboxState.notPassRound1}
                          onChange={() => handleCheckboxChange('notPassRound1')}
                        />Không đạt vòng 1</div>
                  </div>
                  <div className="main-first-table-BM6-feedback-firstround-bottomRight-checkbox3"> <input
                        type="checkbox"
                        checked={checkboxState.recommendOtherPosition}
                        onChange={() => handleCheckboxChange('recommendOtherPosition')}
                      />Tiến cử vào vị trí khác</div> */}
                  <div className="main-first-table-BM6-feedback-firstround-bottomRight-text">
                    Mức lương thử việc:
                    <input type="text" value={probationarySalary}

                    className='main-first-table-BM6-info-input'
                  onChange={(e) => setProbationarySalary(e.target.value)}/>

                    <br />
                    Mức lương chính thức:
                    <input type="text" value={officialSalary}

                    className='main-first-table-BM6-info-input'
                  onChange={(e) => setOfficialSalary(e.target.value)} />

                    <br />
                    Các nội dung khác:
                    <br />
                    <textarea name="myTextarea" cols="53" rows="3" className="main-first-table-BM6-info-input" value={otherContent}
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

export default BM06;