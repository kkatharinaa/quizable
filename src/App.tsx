import './App.css';
import { BrowserRouter } from 'react-router-dom';
// import { Link, Route, Routes } from 'react-router-dom';
// import Home from './pages/Home/Home';
// import About from './pages/About/About';
import Router from './Router';
import { useEffect } from 'react';
import app from './firebase/config';
import { getFirestore } from 'firebase/firestore';



function App() {

  useEffect(() => {
    console.log('App mounted');
    const db = getFirestore(app);
    console.log(db);
  });

  return (
    <BrowserRouter>
      <Router/>
    </BrowserRouter>
  );
}

export default App;
