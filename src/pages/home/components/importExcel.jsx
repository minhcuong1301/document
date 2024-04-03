import { Modal } from "antd";

import { SpinCustom, UploadFile } from "components";
import { useState } from "react";
import { Form } from "react-router-dom";


const ImportExcel = () => {

  const [spinning, setSpinning] = useState(false);
  const [files, setFiles] = useState([]);

  return (
    <Modal
      className="form-modal"
      footer={false}
      open={true}
      width={350}
    >
      <SpinCustom spinning={spinning}>
        <Form.Item>
          <UploadFile
            setFiles={setFiles}
            files={files}
            maxCount={1}
          />
        </Form.Item>
      </SpinCustom>


    </Modal>

  )
}

export default ImportExcel