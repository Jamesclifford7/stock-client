import React from 'react'
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './components/Home/Home.tsx'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route 
          path="/home"
          element={<Home />}
        />
      </Routes>
    </div>
  );
}

const withRouter = (Component) => {
  const Wrapper = (props) => {
    const history = useNavigate();
    
    return (
      <Component
        history={history}
        {...props}
        />
    );
  };
  
  return Wrapper;
}

export default withRouter(App);
