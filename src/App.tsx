import { MyNav } from './components/myNav';
import { TimeCard } from './components/timeCard';
import './App.css';
import "gantt-task-react/dist/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
 
  return (
    <div className="App" >
      <header className="App-header"></header>
      <MyNav/>      
      <TimeCard></TimeCard>
    </div>    
  );
}

export default App;