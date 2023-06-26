import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import { MainPage } from './Pages/MainPage';
import { LoginPage } from './Pages/LoginPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <div>
          <Routes>
            <Route path='/' element={<LoginPage/>} />
            <Route path='/main' element={<MainPage/>} />
          </Routes>        
        </div>
      </div>      
    </Router>
  );
}

export default App;
