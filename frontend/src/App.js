import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import RankingsPage from './pages/RankingsPage';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element = {<LoginPage/>} />
        <Route path ="/MainPage" element ={<MainPage/>}/>
        <Route path = "/RankingsPage" element = {<RankingsPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
