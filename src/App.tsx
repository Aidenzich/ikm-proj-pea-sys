
import {Card, Container, Row, Col,Navbar, Nav} from 'react-bootstrap';
import { MyToolTipContent } from './components/myTooltip';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import { loadData } from './dataLoader';
import React  from 'react';
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
  const [curTask, setCurTask] = React.useState<string>("");

  const handleExpanderClick = (task: Task) => {
    if (task.type === "project"){
      if (expand && curTask === task.id){
        setExpand(false);
        setTasks(getProjectArr());
      } else {
        setExpand(true);
        console.log(task);
        let pt: Task[] = getProjectTasks(task);
        console.log(pt);
        let p: Task[] = getProjectArr();
        let all: Task[] = pt?.concat(p);
        if (pt.length == 0 ) alert("This project has no tasks.")
        setTasks(all);
        setCurTask(task.id)
      }
    }
  };

  
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
                  columnWidth={18}
                  listCellWidth={""}                  
                  TooltipContent={MyToolTipContent}
                  onDoubleClick={handleExpanderClick}
                  ganttHeight={625}
                />
              </div>              
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </header>
    </div>
  );
}

export default App;
