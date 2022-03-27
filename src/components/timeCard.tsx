import { useCallback, useEffect, useState }  from 'react';
import { Card, Row, Col, Form, InputGroup, FormControl, Button} from 'react-bootstrap';
import { MyToolTipContent } from './myTooltip';
import { MyInfo } from './myInfo';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import { loadData, } from '../helpers/dataLoader';
import '../App.css';
import "gantt-task-react/dist/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {CategoryContext} from "../helpers/CategoryContext"


export const TimeCard = () => {
    // 讀取在背景的資料
    const [allTasks, setAllTasks] = useState<Task[]>(loadData());

    // 顯示的資料
    const [displayTasks, setDisplayTasks] = useState<Task[]>([]);  

    // 展開的計畫id
    const [expandedProj, setexpandedProj] = useState<Task[]>([]);
    const [curTask, setCurTask] = useState<Task>();

    const [searchString, setSearchString] = useState<string>('');  

    const [categoryName, setCategoryName] = useState<string>('20');

    
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


    useEffect(()=>{
        resetDisplayedTask();
    }, [allTasks, getProjects]);

    // 控制展開項
    useEffect(()=> {    
        let diplayed: Task[] = [...getProjects()];      
        for (let p=0; p < expandedProj.length; ++p){
        let temp: Task[] = getTasks(expandedProj[p])
        Array.prototype.push.apply(diplayed, temp);
        }      
        setDisplayTasks(diplayed);
    }, [expandedProj, getProjects, getTasks]);

    const handleExpanderClick = (task: Task) => {    
        if (task.type === "project"){
        if (expandedProj.filter(ep=> ep.id === task.id).length > 0){            
            const tempid = expandedProj.map(e => e.id);
            const temp = [...expandedProj]
            let rmProjIndex = tempid.indexOf(task.id);        
            temp.splice(rmProjIndex  , 1);
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

    const changeEvent = (event: any) => {
        setexpandedProj([])    
        setCategoryName(event.target.value)
        setAllTasks(loadData(event.target.value))    
    }

    const searchTaskName = (searchInput: string) => {
        let searchTasks = allTasks.filter(t=> String(t.name).includes(searchInput));
        let searchTaskId: any[];
        let searchProjId: any[];
        searchProjId = [];
        searchTaskId = [];
        for (let i=0; i< searchTasks.length; ++i){
        if (!searchProjId.includes(searchTasks[i].project)){
            searchProjId.push(searchTasks[i].project)
        }
        searchTaskId.push(searchTasks[i].id)
        }
            
        let searchProj = allTasks.filter(p=> 
        searchProjId.includes(p.id) && !searchTaskId.includes(p.id)
        );
        Array.prototype.push.apply(searchTasks, searchProj);
        
        setDisplayTasks(searchTasks);
    }

    const resetDisplayedTask = ()=>{
        setDisplayTasks(getProjects());
    }

    const [isBertopic, setBertopic] = useState<boolean>(false);
    const [topicFigWidth, setTopicFigWidth] = useState<number>(1000);
    const [topicFigHeight, setTopicFigHeight] = useState<number>(500);
    const [topicFig, setTopicFig] = useState<string>("test");

    const toggleBertopic = ()=>{
      setBertopic(!isBertopic)
      setTopicFig("test")
      setTopicFigWidth(1000)
      setTopicFigHeight(500)
    }

    

    

    return (
        <CategoryContext.Provider value={categoryName}>
        <Row className="card-margin-top m-auto align-self-center">
          <Col style={{paddingTop:'2vh'}}>            
            <Card className="m-auto" style={{ width:"auto", maxWidth:"1200px"}}>
              <Row style={{margin:"20px 0px 10px 40px"}}>
                <Col>
                  <div >                
                    <Form.Select aria-label="" style={{maxWidth:"1100px", margin: "auto"}} onChange={changeEvent}>
                      <option value="20">20 Category</option>
                      <option value="30">30 Category</option>
                      <option value="40">40 Category</option>
                      <option value="50">50 Category</option>
                    </Form.Select>
                  </div>
                </Col>
                <Col>
                  <InputGroup className="mb-3">
                    <FormControl
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="Search"
                      onChange={e=>setSearchString(e.target.value)}
                    />
                    <Button id="Search" variant="primary" onClick={()=>searchTaskName(searchString)}>
                      Search
                    </Button>
                    <Button variant="dark" onClick={()=>resetDisplayedTask()}>
                      Reset
                    </Button>
                  </InputGroup>
                </Col>
                <Col xs={2}>
                  <Button variant="info" onClick={()=>toggleBertopic()} style={{color:"white"}}>
                    BERTopic
                  </Button>
                </Col>
              </Row>
              <Card.Body className="m-auto  align-self-center">
                { isBertopic ? 
                  <div >
                    <iframe 
                      src={process.env.PUBLIC_URL + "/" + topicFig + ".html"} 
                      width={topicFigWidth} 
                      height={topicFigHeight}
                    ></iframe>
                    <br/>
                    <Button variant="outline-info" onClick={() => {
                      setTopicFig("test")
                      setTopicFigHeight(500)
                      setTopicFigWidth(1000)
                      }
                      }>
                      Bar Chart
                    </Button>                    
                    <Button variant="outline-info" onClick={()=>{
                      setTopicFig("timeTopics")
                      setTopicFigHeight(500)
                      setTopicFigWidth(1000)
                    }}
                      style={{margin:"10px"}}
                    >
                      Topics over Time
                    </Button>                    
                    <Button variant="outline-info" onClick={()=>{
                      setTopicFig("topics")
                      setTopicFigHeight(700)
                      setTopicFigWidth(700)
                    }}>
                      Cluster
                    </Button>
                  </div>  
                  :
                  <div className="p-auto" style={{width:"auto", minWidth:"100eh", maxWidth:"90vw"}}>
                    {
                      (displayTasks.length === 0 ? "empty": <Gantt
                        tasks={displayTasks}
                        viewMode={ViewMode.Month}          
                        columnWidth={10}
                        listCellWidth={""}                  
                        TooltipContent={MyToolTipContent}
                        onDoubleClick={handleExpanderClick}
                        ganttHeight={550}
                      />)
                    }
                  </div>
                }                                                                              
                
                              
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
        </CategoryContext.Provider>
    )
}