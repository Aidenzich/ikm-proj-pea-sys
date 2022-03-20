
import {Card, Row, Col, Form} from 'react-bootstrap';
import { MyToolTipContent } from './components/myTooltip';
import { MyInfo } from './components/myInfo';
import { MyNav } from './components/myNav';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import { loadData } from './dataLoader';
import React, { useCallback, useEffect }  from 'react';
import './App.css';
import "gantt-task-react/dist/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  var app_style={
      background: "#f0f0f0",
      height: "100vh",  
  }
    
  // 讀取在背景的資料
  const [allTasks, setAllTasks] = React.useState<Task[]>(loadData());

  // 只有在更換category的狀況下，allTasks才會變動。當allTask變動時，從新設定顯示的tasks
  const getProjects = useCallback(()=>{
    const temp = [];
    for (var i=0; i< allTasks.length; i++){
      if (allTasks[i].type === "project"){
        temp.push(allTasks[i]);
      }
    }
    return temp;
  }, [allTasks])
  
  // 以 project 取得底下的 task
  const getTasks = useCallback((project: Task): Task[] => {
    const tasks = [];
    if (project !== undefined){      
      for (var i=0; i< allTasks.length; i++){        
        if (allTasks[i].project === project.id) {
          tasks.push(allTasks[i]);
        };
      }            
    }
    return tasks;
  }, [allTasks])

  // 顯示的資料
  const [displayTasks, setDisplayTasks] = React.useState<Task[]>(getProjects());  
  // 展開的計畫id
  const [expandedProj, setexpandedProj] = React.useState<Task[]>([]);
  const [curTask, setCurTask] = React.useState<Task>();  

  useEffect(()=>{
    // alert("change")
    setDisplayTasks(getProjects());
  }, [allTasks, getProjects]);

  // 控制展開項
  useEffect(()=> {    
    let diplayed: Task[] = [...getProjects()];      
    for (let p=0; p < expandedProj.length; ++p){
      let temp: Task[] = getTasks(expandedProj[p]);        
      Array.prototype.push.apply(diplayed, temp);    
    }      
    setDisplayTasks(diplayed);
  }, [expandedProj, getProjects, getTasks]);

  const handleExpanderClick = (task: Task) => {    
    if (task.type === "project"){
      if (expandedProj.filter(ep=> ep.id === task.id).length > 0){
        // 當計畫已展開，重新觸發即移除
        // NOTE: https://stackoverflow.com/questions/62943332/useeffect-not-getting-trigger-after-state-change
        const temp = [...expandedProj];
        let rmProjIndex = temp.indexOf(task);        
        temp.splice(rmProjIndex , 1);
        setexpandedProj(temp);                
      } else {        
        if (!expandedProj.includes(task)){
          const temp = [...expandedProj];
          temp.push(task);
          setexpandedProj(temp);          
        }
      }
      
    };
    setCurTask(task);
  };


  function changeEvent(event: any){    
    if (event.target.value === '1'){
      setAllTasks(loadData());
    } else {
      setAllTasks(loadData(false));
      setDisplayTasks(getProjects());
    }
  }

  return (
    <div className="App" style={app_style}>            
      <header className="App-header">
        <MyNav/>        
        <Row className="card-margin-top m-auto align-self-center">
          <Col style={{paddingTop:'2vh'}}>
            <Card className="m-auto" style={{ width:"auto", maxWidth:"1200px", borderRadius: "20px",}}>
              <div style={{margin:"5px", marginTop:"20px"}}>                
                <Form.Select aria-label="" style={{maxWidth:"1100px", margin: "auto"}} onChange={changeEvent}>                  
                  <option value="1">20 Category</option>
                  <option value="2">30 Category</option>                  
                </Form.Select>
              </div>
              <Card.Body className="m-auto  align-self-center">                                                                                  
                <div className="p-auto" style={{width:"auto", minWidth:"100eh", maxWidth:"90vw"}}>
                <Gantt
                  tasks={displayTasks}
                  viewMode={ViewMode.Month}          
                  columnWidth={10}
                  listCellWidth={""}                  
                  TooltipContent={MyToolTipContent}
                  onDoubleClick={handleExpanderClick}
                  ganttHeight={550}
                />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <span>
              {
                (curTask != null && curTask.type==="task")? <MyInfo
                  task={curTask}
                  setCurTask={setCurTask}
                />:null
              }
          </span>
        </Row>        
      </header>
    </div>
  );
}

export default App;