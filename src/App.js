import React from 'react'
import './App.css';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom'
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
              path="/home"
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

const withRouter = (Component) => {
  // const Wrapper = (props) => {
  //   const history = useNavigate();
    
  //   return (
  //     <Component
  //       history={history}
  //       {...props}
  //       />
  //   );
  // };
  
  // return Wrapper;
  
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}

export default withRouter(App);
