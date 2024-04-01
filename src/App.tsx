import './App.css';
import { BrowserRouter } from 'react-router-dom';
// import { Link, Route, Routes } from 'react-router-dom';
// import Home from './pages/Home/Home';
// import About from './pages/About/About';
import Router from './Router';

function App() {
  return (
    <BrowserRouter>
      <Router/>
    </BrowserRouter>
  );
}

export default App;
