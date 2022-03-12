
import {Card, Container, Button, Row, Col, Navbar, Nav, Form} from 'react-bootstrap';
import { MyToolTipContent } from './components/myTooltip';
import { MyInfo } from './components/myInfo';
import { MyNav } from './components/myNav';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import { loadData } from './dataLoader';
import React, { useEffect }  from 'react';
import './App.css';
import "gantt-task-react/dist/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  var temp_style={
      background: "#f0f0f0",
      height: "100vh",  
  }

  // 讀取所有資料
  const [allTasks, setAllTasks] = React.useState<Task[]>(loadData());  
  // 顯示的資料
  const [tasks, setTasks] = React.useState<Task[]>(getProjects());
  
  const [expand, setExpand] = React.useState(false);
  const [curTask, setCurTask] = React.useState<Task>();  



  useEffect(()=>{
    setTasks(getProjects());
  }, [allTasks])

  const handleExpanderClick = (task: Task) => {    
    if (task.type === "project"){
      if (expand && curTask!=undefined && curTask.displayOrder == task.displayOrder){
        setExpand(false);
        setTasks(getProjects());
      } else {
        setExpand(true);
        let tasks: Task[] = getTasks(task);
        let projects: Task[] = getProjects();
        let all: Task[] = tasks.concat(projects);
        if (tasks.length == 0 ) alert("This project has no tasks.")
        setTasks(all);
      }
    };
    setCurTask(task);
  };

  function getProjects(): Task[]{
    const temp = [];
    for (var i=0; i< allTasks.length; i++){
      if (allTasks[i].type === "project"){
        temp.push(allTasks[i]);
      }
    }
    return temp;
  }
  
  // 以 project 取得底下的 task
  function getTasks(project: Task): Task[]{
    const tasks = [];    
    if (project != undefined){      
      for (var i=0; i< allTasks.length; i++){        
        if (allTasks[i].project === project.id) {
          tasks.push(allTasks[i]);
        };
      }            
    }
    return tasks;
  }

  // function toggle(state1: boolean) {
  //   if (state1){
  //     setAllTasks(loadData());
  //   } else {    
  //     setAllTasks(loadData(false));
  //     setTasks(getProjects());
  //   }
  // }

  function changeEvent(event: any){
    
    if (event.target.value == '1'){
      setAllTasks(loadData());
    } else {
      setAllTasks(loadData(false));
      setTasks(getProjects());
    }
  }

  return (
    <div className="App" style={temp_style}>            
      <header className="App-header"  >
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
                  tasks={tasks}
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
                (curTask != null && curTask.type=="task")? <MyInfo
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
