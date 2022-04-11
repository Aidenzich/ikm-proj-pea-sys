import React, {useState, useEffect, useContext}  from 'react';
import styles from "./myComponents.module.css";
import Chart from "react-apexcharts";
import { Row, Col} from 'react-bootstrap';
import { CategoryContext } from "../helpers/CategoryContext"

export const MyToolTipContent: React.FC<{
    task: any;
    fontSize: string;
    fontFamily: string;
}> = ({ task, fontSize, fontFamily }) => {
    
    
    const category = useContext(CategoryContext)    

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
        title: { text:'該類別各年份數量統計' }
      },
      series: [{
        data: [10, 20, 30, 40, 50, 60, 70 ,80]
      }],
    }

    const [state, setState] = React.useState(temp)
    
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
        {
        checkDataSeries(task) ?
        <Row className={styles.popBox} style={style}>
          <h5>
            {task.name}
          </h5>
          <Col className={styles.barChart}>
            <Chart type="bar" options={state.options} series={state.series}/>
          </Col>
          <Col >
            <img className={styles.popBoxImg} src={require('./wordcloud/category' + category + '/' + task.id.replace("main_", "") +'.png')} />
          </Col>
        </Row> : undefined
        }
      </div>
    );
  };