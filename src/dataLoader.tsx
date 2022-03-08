import { Task } from 'gantt-task-react';

const color_list = [
    '#010221', '#010221', '#010221', '#0A7373',
    '#0A7373', '#0A7373', '#B7BF99', '#B7BF99',
    '#B7BF99', '#EDAA25', '#EDAA25', '#EDAA25',
    '#2E4159', '#2E4159', '#2E4159', '#C43302',
    '#C43302', '#C43302'
];

const taskColor="#2E4E78";

export function loadData(cat20=true){
    
    var data = require('./data/main_result20.json');    
    var proj_data = require('./data/proj_result20.json');
    if (!cat20){
        data = require('./data/main_result30.json');
        proj_data = require('./data/proj_result30.json');
    }

    const tasks: Task[] = [];
    
    for (let i=0; i<data.length; ++i){        
        const temp = {
            start: new Date(data[i].start, 1, 1),
            end: new Date(data[i].end, 1, 1),
            name: data[i].name,
            id: data[i].id,
            displayOrder: data[i].displayOrder,
            type: "project",
            progress: 100,
            styles: { 
                backgroundColor:color_list[i%color_list.length],
                backgroundSelectedColor:color_list[i%color_list.length],
                progressColor: color_list[i%color_list.length], 
                progressSelectedColor: color_list[i%color_list.length],
                fontSize:"32px",
                rowHeight:100
            },
            data: data[i]            
        } as Task;

        tasks.push(temp);
    }

    for (let i=0; i<proj_data.length; ++i){        
        const temp = {
            start: new Date(proj_data[i].start, 1, 1),
            end: new Date(proj_data[i].end, 1, 1),
            name: proj_data[i].name,
            id: proj_data[i].id,
            displayOrder: proj_data[i].displayOrder,
            type: "task",
            project: proj_data[i].project,
            progress: 100,
            styles: { 
                backgroundColor:taskColor,
                progressColor:taskColor, 
                progressSelectedColor:taskColor,                
            },
            data: {
                "keyword": proj_data[i].keyword,
                "ner": proj_data[i].ner,
                "tf_idf": proj_data[i].tf_idf,
                "desp": proj_data[i].desp,
            }
        } as Task;
        
        tasks.push(temp);
    }
    return tasks;
}
export function loadExample(){
    const tasks: Task[] = [
        {
            start: new Date(2013, 1, 1),
            end: new Date(2015, 1, 1),
            id: "ProjectSample",
            displayOrder: 1,
            name: "5G+/6G",            
            progress: 100,
            type: "project",
            hideChildren: false,            
        },
        {
            start: new Date(2013, 1, 1),
            end: new Date(2014, 1, 1),
            name: "5G/B5G無線通訊網路技術sssss\n研發計畫(科技部)",
            id: "Task 0",
            progress: 100,
            type: "task",
            project: "ProjectSample",
            displayOrder: 2,            
        },
        {
            start: new Date(2014, 1, 1),
            end: new Date(2015, 1, 1),
            name: "5G+系統暨應用淬鍊計畫(經濟部)",
            id: "Task 1",
            progress: 100,
            type: "task",
            project: "ProjectSample",
            displayOrder: 3,
        },
        {
            start: new Date(2014, 1, 1),
            end: new Date(2015, 1, 1),
            name: "5G+產業生態鏈推動計畫(經濟部)",
            id: "Task 3",
            progress: 100,    
            type: "task",
            project: "ProjectSample",
            displayOrder: 4,
        },
        {
          start: new Date(2014, 1, 1),
          end: new Date(2015, 1, 1),
          name: "B5G前瞻系統關鍵技術開發計畫(經濟部)",
          id: "Task 4",
          progress: 100,    
          type: "task",
          project: "ProjectSample",
          displayOrder: 5,
        },
        {
            start: new Date(2014, 6, 1),
            end: new Date(2015, 1, 1),
            name: "Beyond 5G低軌衛星與下世代通訊系統關鍵技術研發計畫(國研院)",
            id: "Task5",
            progress: 100,    
            type: "task",
            project: "ProjectSample",
            displayOrder: 6,
        },
        {
            start: new Date(2014, 6, 1),
            end: new Date(2015, 1, 1),
            name: "Beyond 5G低軌衛星-地面設備與產業推動計畫(經濟部)",
            id: "Task6",
            progress: 100,    
            type: "task",
            project: "ProjectSample",
            displayOrder: 7,
        },
        {
            start: new Date(2014, 6, 1),
            end: new Date(2015, 1, 1),
            name: "5G/B5G電信資源整備及通訊網路發展研究計畫(交通部)",
            id: "Task7",
            progress: 100,    
            type: "task",
            project: "ProjectSample",
            displayOrder: 8,
        },    
        {
            start: new Date(2014, 1, 1),
            end: new Date(2016, 1, 1),
            name: "5G+/6G 2gen",
            id: "ProjectSample8",
            progress: 100,
            type: "project",
            hideChildren: false,
            displayOrder: 1,
            styles: { progressColor: '#ffbb54', progressSelectedColor: '#ffbb54' },
        },    
    ];

    return tasks;
}