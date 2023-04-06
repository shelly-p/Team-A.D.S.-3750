//import './styles/index.css';
//import "./styles/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reset from './pages/Reset';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Game from './pages/Game';

function App() {

  return (
    <div className="app">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/Login" element={<Login />} />
          <Route exact path="/Register" element={<Register />} />
          <Route exact path="/Reset" element={<Reset />} />
          <Route exact path="/Dashboard" element={<Dashboard />} />
          <Route path="/Game" element={<Game />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
