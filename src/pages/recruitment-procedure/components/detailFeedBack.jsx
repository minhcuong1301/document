
import React from 'react';
import { Modal, Row, Col, Button } from 'antd'

const DetailFeedBack = ({ openDetailV1, statusRound,onCancel }) => {
    return (
        <Modal
            title="Chi tiết file"
            open={true}
            footer={<Row justify={"end"} >
                <Col span={4} >
                    <Button onClick={onCancel} className="w-full" >Thoát</Button>
                </Col>
            </Row>}
            className="fullscreen-modal"
            width={1200}
        >
            {statusRound === 1 && openDetailV1?.review_round_1 && <div className="bm6vong1">
                <div dangerouslySetInnerHTML={{ __html: openDetailV1?.review_round_1 }} />

            </div>
            }

            {statusRound === 2 && openDetailV1?.review_round_2 && <div className="bm6vong2">
                <div dangerouslySetInnerHTML={{ __html: openDetailV1?.review_round_2 }}></div>
            </div>
                
            }
              {statusRound === 3 && openDetailV1?.review_round_3 && <div className="bm6vong3">
                <div dangerouslySetInnerHTML={{ __html: openDetailV1?.review_round_3 }}>

                </div>
                
                </div>}


        </Modal>
    );
};

export default DetailFeedBack;
