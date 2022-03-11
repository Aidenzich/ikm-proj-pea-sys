import React, {useState, useEffect}  from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import styles from "./tooltip.module.css";
import Chart from "react-apexcharts";
import { Alert, Row, Col
} from 'react-bootstrap';

export const MyToolTipContent: React.FC<{
    task: any;
    fontSize: string;
    fontFamily: string;
}> = ({ task, fontSize, fontFamily }) => {

    var temp = {
      options: {
        dataLabels: {
          enabled: true
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        xaxis: {
          categories: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021']
        },
        title: {
          text:'該類別各年份數量統計'
        }
      },
      series: [{
        data: [10, 20, 30, 40, 50, 60, 70 ,80]
      }],
    }
    const [state, setState] = React.useState(temp);
    function checkDataSeries(task: any){
      try{
        if (task['data']['series']){
          temp.series[0].data = task.data.series
          
          return true;
        }
      }catch(e){
        return false;
      }
      return false;
    }
    

    var style = {
      fontSize,
      fontFamily,
      
    } as any;

    

    return (
      <div>
        
        {checkDataSeries(task) ? <div className={styles.tooltipDefaultContainer} style={style}>
          <Chart type="bar" options={state.options} series={state.series}/>
          </div> : null}
      </div>
      // <Row className={styles.tooltipDefaultContainer} style={style}>
      //   <h4>{task.name}</h4>        
      //   {
      //     checkDataSeries(task) ?         
      //     <Chart type="bar" options={state.options} series={state.series}/> : null
      //   }
      //   <Col>


      //         {
      //           !checkDataSeries(task) ? <div style={{textAlign: "left"}}>
      //             <Alert variant="success">
      //               <Alert.Heading>NER</Alert.Heading>
      //               <hr />
      //               <p className="mb-0">
      //                 {task.data.ner}
      //               </p>
      //             </Alert>
      //             <Alert variant="warning">
      //               <Alert.Heading>Keyword</Alert.Heading>
      //               <hr />
      //               <p className="mb-0">
      //                 {task.data.keyword}
      //               </p>
      //             </Alert>
      //             <Alert variant="danger">
      //               <Alert.Heading>TF-IDF</Alert.Heading>
      //               <hr />
      //               <p className="mb-0">
      //                 {task.data.tf_idf}
      //               </p>
      //             </Alert>
      //           </div>
      //         :
      //         null
      //       }
      //   </Col>
      //   <Col xs={8} className={styles.desp}>
      //     <div style={{whiteSpace: 'pre-wrap', textAlign: 'left'}}>                    
      //         {task.data.desp}
      //       </div>
      //   </Col>
      // </Row>
    );
  };