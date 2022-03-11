import { padding } from '@mui/system';
import React, {useState, useEffect}  from 'react';
import { Alert, Row, Col, CloseButton } from 'react-bootstrap';
import styles from "./tooltip.module.css";

export const MyInfo: React.FC<{
    task: any;
    setCurTask: Function;

}> = ({ task, setCurTask}) => {
    if (task == null){
        return null;
    }

    return (    
      <Row className={styles.myInfo} >
        <Row style={{padding:"5px"}}>
            <Col xs={10}>
                <h4>{task.name}</h4>
            </Col>
            <Col>
                <CloseButton 
                    onClick={()=>setCurTask(null)} 
                >                    
                </CloseButton>    
            </Col>
        </Row>
        <Col xs={6}>
            <h5>計畫描述</h5>
            <div className={styles.desp}>
                {task.data.desp}
            </div>
        </Col>
        <Col>
              {
                <div style={{textAlign: "left"}}>
                  <Alert variant="success">
                    <Alert.Heading>NER</Alert.Heading>
                    <hr />
                    <p className="mb-0">
                      {task.data.ner}
                    </p>
                  </Alert>
                  <Alert variant="warning">
                    <Alert.Heading>Keyword</Alert.Heading>
                    <hr />
                    <p className="mb-0">
                      {task.data.keyword}
                    </p>
                  </Alert>
                  <Alert variant="danger">
                    <Alert.Heading>TF-IDF</Alert.Heading>
                    <hr />
                    <p className="mb-0">
                      {task.data.tf_idf}
                    </p>
                  </Alert>
                </div>
            }
        </Col>
        
      </Row>
    );
  };