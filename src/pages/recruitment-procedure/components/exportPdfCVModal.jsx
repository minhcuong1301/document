import React from 'react';
import { Modal } from 'antd'
import moment from 'moment';
import RobotoLightWebfont from 'assets/fonts/roboto-light-webfont.ttf'
import RobotoRegularWebfont from 'assets/fonts/roboto-regular-webfont.ttf'
import RobotoMediumWebfont from 'assets/fonts/roboto-medium-webfont.ttf'
import RobotoBoldWebfont from 'assets/fonts/roboto-bold-webfont.ttf'
import {useEffect} from 'react'
import { 
  NOTARIZATION_PROCEDURE_TYPES, 
  DATETIME_FORMAT, EDUCATION_LEVEL,EXPERIENCE,
  DATE_FORMAT ,INTERVIEW_STATUS
} from "utils/constants/config"
import 'moment/locale/vi'; // 
import {
  Row, Col, Button
} from 'antd'

import {
  Font, Page, Text, View,
  Document, StyleSheet,
  PDFViewer
} from '@react-pdf/renderer';
Font.register({
  family: "Roboto",
  fonts: [
    { src: RobotoLightWebfont, fontWeight: 300 },
    { src: RobotoRegularWebfont, fontWeight: 400 },
    { src: RobotoMediumWebfont, fontWeight: 500 },
    { src: RobotoBoldWebfont, fontWeight: 600 },
  ],
});
moment.locale('vi');


const formattedDate = moment().format('LLLL');
const styles = StyleSheet.create({
  page: {
    fontSize: 8,
    padding: 4,
    fontFamily: 'Roboto',
    padding: 24,
    pageBreakBefore: 'always',
  },
  pageTitle: {
    width: '100%',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 500,
    margin: 3,
  },
  pageSubTitle: {
    textAlign: 'right',
    marginTop: 32,
    marginBottom: 16,
  },

  commonText: {
    marginBottom: 12,
    fontSize: 10
  },
  approvalWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:"center",
    flexWrap: "wrap"
  },

  // table styles
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderRight: 0.3,
    borderBottom: 0.3,
  },
  tableRow: {
    flexDirection: "row",
    borderTop: 0.3,
  },
  tableCol: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    padding: 1,
    borderStyle: "solid",
    borderLeft: 0.3,
  },
});

const TablePDF = ({data }) => {

  const handleRenderText = (text, renderTextProps) => {
    const words = text.split(' ');

    let lines = [];
    let currentLine = '';
    words.forEach(word => {
      const width = renderTextProps.widthOfText(word);
      if (currentLine === '') {
        currentLine = word;
      } else if (width < renderTextProps.availableWidth) {
        currentLine += ` ${word}`;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });
    lines.push(currentLine);

    return lines.map((line, index) => (
      <Text key={index}>
        {line}
      </Text>
    ))
  };

  const TabCol = ({ children, width }) => {
    return (
      <View style={{
        ...styles.tableCol,
        width
      }}>
        {children}
      </View>
    )
  }
  

  function getApplicantEduLvl(lvl,i) {
    switch (lvl) {
      case 1:
        return EDUCATION_LEVEL[0];
      case 2:
        return EDUCATION_LEVEL[1];
      case 3:
        return EDUCATION_LEVEL[2];
      case 4:
        return EDUCATION_LEVEL[3];
      case 5:
        return EDUCATION_LEVEL[4];
      case 6:
        return EDUCATION_LEVEL[5];
      default:
        return '';
    }
  
  }
  function getApplicantExp(exp) {
    switch (exp) {
      case 0:
        return EXPERIENCE[0];
      case 1:
        return EXPERIENCE[1];
      case 2:
        return EXPERIENCE[2];
      case 3:
        return EXPERIENCE[3];
      case 4:
        return EXPERIENCE[4];
      case 5:
        return EXPERIENCE[5];
      default:
        return '';
    }
  }
  function getApplicantStatus(status) {
    switch (status) {
      case 0:
        return INTERVIEW_STATUS[0];
      case 1:
        return INTERVIEW_STATUS[1];
      case 2:
        return INTERVIEW_STATUS[2];
      case 3:
        return INTERVIEW_STATUS[3];
      case 4:
        return INTERVIEW_STATUS[4];
      case 5:
        return INTERVIEW_STATUS[5];
      default:
        return '';
    }
  }
  function getApplicantGender(g) {
    switch (g) {
      case 1:
        return 'Nam';
      case 0:
        return 'Nữ';
      default:
        return '';
    }
  }
  return (
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <TabCol width={20}>
          <Text>STT</Text>
        </TabCol>

   

        <TabCol width={80}>
          <Text>Họ và tên	</Text>
        </TabCol>

      
        <TabCol width={45}>
          <Text>Ngày sinh	</Text>
        </TabCol>


        <TabCol width={19}>
          <Text>Giới tính	</Text>
        </TabCol>
        
      
        <TabCol width={65}>
          <Text>Phòng ban			</Text>
        </TabCol>
        <TabCol width={45}>
          <Text>Vị trí			</Text>
        </TabCol>
        <TabCol width={40}>
          <Text>Trình độ học vấn			</Text>
        </TabCol>
        <TabCol width={30}>
          <Text>Kinh nghiệm</Text>
        </TabCol>
        <TabCol width={60}>
          <Text>Số điện thoại			</Text>
        </TabCol>
        <TabCol width={125}>
          <Text>Email			</Text>
        </TabCol>
        <TabCol width={47}>
          <Text>Trạng thái			</Text>
        </TabCol>
        
      </View>

      {data?.map((item, index) =>
       
    <View style={styles.table}>

        <View  style={styles.tableRow}>
          <TabCol width={20}>
            <Text>{index + 1}</Text>
          </TabCol>

          <TabCol width={80}>
            <Text renderText={handleRenderText}>{item?.name}</Text>
          </TabCol>
          <TabCol width={45}>
            <Text renderText={handleRenderText}>{item?.birthday  ? moment(item?.birthday * 1000).format(DATE_FORMAT) : ""}</Text>
          </TabCol>
          <TabCol width={19}>
            <Text renderText={handleRenderText}>{
           getApplicantGender(item?.gender)}</Text>
          </TabCol>
          <TabCol width={65}>
            <Text renderText={handleRenderText}>{item?.dep_name}</Text>
          </TabCol>
          <TabCol width={
            
            45}>
            <Text renderText={handleRenderText}>{item?.position_name}</Text>
          </TabCol>

         

          <TabCol width={40}>
            <Text>{
            
            getApplicantEduLvl(item?.education_level)}</Text>
          </TabCol>

          <TabCol width={30}>
            <Text renderText={handleRenderText}>{getApplicantExp(item?.experience)}</Text>
          </TabCol>
          <TabCol width={60}>
            <Text renderText={handleRenderText}>{item?.phone}</Text>
          </TabCol>
          <TabCol width={125}>
            <Text renderText={handleRenderText}>{item?.email}</Text>
          </TabCol>
          <TabCol width={47}>
            <Text renderText={handleRenderText}>
             {getApplicantStatus(item?.status)}
             </Text>
          </TabCol>
        
         

          

         
        </View>
        </View>
      )}
    </View>
  )
}

const PDFPage = ({ data,userLogin }) => {
  console.log('data tab cv:',data);
  console.log('data dang login:',userLogin);

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.pageTitle}>
        <Text> CÔNG TY CỔ PHẦN AIPT VIỆT NAM</Text>
      </View>
      <View style={styles.pageTitle}>
        <Text>Phiếu hồ sơ ứng viên</Text>
      </View>

      <View style={styles.pageSubTitle}>
        <Text style={styles.commonText}>
          Hà Nội,
          ngày {moment().format('DD')}{" "}
          tháng {moment().format('MM')}{" "}
          năm {moment().format('YYYY')}
        </Text>
      </View>

      <View>
        <Text style={styles.commonText}>Người làm phiếu: {userLogin?.name}</Text>
        <Text style={styles.commonText}>Bộ phận: {userLogin?.department_name}</Text>
        <Text style={styles.commonText}>Số bản ghi : {data.length}</Text>

      </View>

      <TablePDF data={data} userLogin={userLogin}/>
    </Page>
  )
}

const ExportPdfModal = ({ data, onCancel,userLogin }) => {
  console.log('userLogin tu tab lich pv thuc su xuong modal :',userLogin)

  return (
    <Modal
      className='export-pdf-modal'
      open={true}
      closeIcon={false}
      footer={<Row justify="end">
        <Col span={4}>
          <Button onClick={onCancel} className="w-full" >Thoát</Button>
        </Col>
      </Row>}
    >
      <PDFViewer className='export-pdf--content'>
        <Document>
          {/* {data?.map(item =>  */}
            <PDFPage key={data?.id} data={data} userLogin={userLogin}/>  
          {/* )} */}
        </Document>
      </PDFViewer>
    </Modal>
  );
}

export default ExportPdfModal;
