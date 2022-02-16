import React, {useState, useEffect}  from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import './App.css';

import { loadData, loadExample } from './dataLoader';
import "gantt-task-react/dist/index.css";

import { Button, Card, Container, Row, Col,
  Navbar, NavDropdown, Nav
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import {TaskListHeaderDefault} from "./task-list-header"


function App() {
  
  var temp_style={
      background: "#f0f0f0",
      height: "94.5vh",
      
  }

  const [allTasks, setAllTasks] = React.useState<Task[]>(loadData());
  // const [allTasks, setAllTasks] = React.useState<Task[]>(loadExample());
  
  const [tasks, setTasks] = React.useState<Task[]>(getProjectArr());
  
  const [expand, setExpand] = React.useState(false);
  const [curTask, setCurTask] = React.useState<string>("");

  const handleExpanderClick = (task: Task) => {    
    // console.log("expand")
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
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">計畫演變分析系統</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <header className="App-header">            
        <Row className="card-margin-top m-auto align-self-center" style={temp_style}>
          <Col style={{paddingTop:'3vh'}}>
            <Card className="m-auto" style={{width:"75vw", borderRadius: "20px",}}>
              <Card.Body  >
              <Gantt                 
                tasks={tasks}
                viewMode={ViewMode.Month}
                // handleWidth={300}
                columnWidth={15}
                // rtl={false}
                listCellWidth={""}
                // rowHeight={60}                 
                onDoubleClick={handleExpanderClick}
                // TaskListHeader={TaskListHeaderDefault}
                ganttHeight={800}
              />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </header>
    </div>
  );
}

export default App;
