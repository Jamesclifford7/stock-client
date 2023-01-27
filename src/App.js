import React from 'react'
import './App.css';
import { Routes, Route} from 'react-router-dom'
import Home from './components/Home/Home.tsx'
import Login from './components/Login/Login.tsx'
import UserProvider from './components/UserProvider';
import StocksProvider from './components/StocksProvider';
import Portfolio from './components/Portfolio/Portfolio';
import Stock from './components/Stock/Stock.tsx'
import SignUp from './components/SignUp/SignUp';

function App() {

  return (
    <div className="App">
      <UserProvider>
        <StocksProvider>
          <Routes>
            <Route 
              exact path="/"
              element={<Home />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route 
              path="/signup"
              element={<SignUp />}
            />
            <Route
              path="/portfolio"
              element={<Portfolio />}
            />
            <Route 
              path="/portfolio/:stock_symbol"
              element={<Stock />}
            />
          </Routes>
        </StocksProvider>
      </UserProvider>
    </div>
  );
}

export default App;

