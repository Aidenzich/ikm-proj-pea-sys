
import {Card, Container, Button, Row, Col,Navbar, Nav} from 'react-bootstrap';
import { MyToolTipContent } from './components/myTooltip';
import { MyInfo } from './components/myInfo';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import { loadData } from './dataLoader';
import React, { useEffect }  from 'react';
import './App.css';
import "gantt-task-react/dist/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  var temp_style={
      background: "#f0f0f0",
      height: "94.5vh",
  }

  const [allTasks, setAllTasks] = React.useState<Task[]>(loadData());  
  const [tasks, setTasks] = React.useState<Task[]>(getProjectArr());
  
  const [expand, setExpand] = React.useState(false);
  const [curTask, setCurTask] = React.useState<Task>();  

  useEffect(()=>{
    setTasks(getProjectArr());
  }, [allTasks])

  const handleExpanderClick = (task: Task) => {    
    if (task.type === "project"){
      if (expand && curTask === task){
        setExpand(false);
        setTasks(getProjectArr());
      } else {
        setExpand(true);
        let pt: Task[] = getProjectTasks(task);
        let p: Task[] = getProjectArr();
        let all: Task[] = pt?.concat(p);
        if (pt.length == 0 ) alert("This project has no tasks.")
        setTasks(all);
      }
    };
    setCurTask(task);
  };


  function toggle(state1: boolean) {
    if (state1){      
      setAllTasks(loadData());
    } else {    
      setAllTasks(loadData(false));
      setTasks(getProjectArr())
    }
  }

  function getProjectArr(): Task[]{
    const temp = [];
    for (var i=0; i< allTasks.length; i++){
      if (allTasks[i].type === "project"){
        temp.push(allTasks[i]);
      }
    }
    return temp;
  }
  
  function getProjectTasks(project: Task): Task[]{
    const temp = [];
    var childCount = 0;

    if (project != null){      
      for (var i=0; i< allTasks.length; i++){        
        if (allTasks[i].project === project.id) {temp.push(allTasks[i]); childCount++;};
      }            
    }
    return temp;
  }

  return (
    <div className="App">
      
      <Navbar bg="white" expand="lg">
        <Container>
          <Navbar.Brand href="#home">計畫演變分析系統</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>    
      <header className="App-header">            
        <Row className="card-margin-top m-auto align-self-center" style={temp_style}>        
          <Col style={{paddingTop:'2vh'}}>
            <Card className="m-auto" style={{ width:"auto", maxWidth:"95vw", borderRadius: "20px",}}>
              <Card.Body className="m-auto  align-self-center">                                                                                  
                <div className="p-auto" style={{width:"auto", minWidth:"100eh", maxWidth:"90vw"}}>
                <Gantt
                  tasks={tasks}
                  viewMode={ViewMode.Month}          
                  columnWidth={13}
                  listCellWidth={""}                  
                  TooltipContent={MyToolTipContent}
                  onDoubleClick={handleExpanderClick}
                  ganttHeight={625}
                />
                </div>
                <div style={{margin:"1vw"}}>
                  <Button onClick={()=> toggle(true)} variant="primary">20 Category</Button>{' '}                                
                  <Button onClick={()=> toggle(false)} variant="secondary">30 Category</Button>{' '}
                </div>
              </Card.Body>
            </Card>
      
          </Col>
          <div>
              {
                (curTask != null && curTask.type=="task")? <MyInfo
                  task={curTask}
                  setCurTask={setCurTask}
                />:null
              }
          </div>
        </Row>
      </header>
    </div>
  );
}

export default App;
