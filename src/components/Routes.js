import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Home from './Home/Home';
import Login from './Login/Login';
import Portfolio from './Portfolio/Portfolio';
import Stock from './Stock/Stock';
import SignUp from './SignUp/SignUp';

export default function AppRoutes() {

    return (
        <Routes>
            <Route 
                path="/"
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
    )
}