import './styles/index.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import About from "./pages/About";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reset from './pages/Reset';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Game from './pages/Game';
import WaitingRoom from './pages/WaitingRoom';
import NotFound from './pages/NotFound';


function App() {

  return (
    
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/About" element={<About />} />
          <Route exact path="/Login" element={<Login />} />
          <Route exact path="/Register" element={<Register />} />
          <Route exact path="/Reset" element={<Reset />} />
          <Route exact path="/Dashboard" element={<Dashboard />} />
          <Route exact path="/Game" element={<Game />} />
          <Route exact path="/WaitingRoom" element={<WaitingRoom />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
  );
}
export default App;
