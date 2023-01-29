import React from 'react'
import './App.css';
import UserProvider from './components/UserProvider';
import StocksProvider from './components/StocksProvider';
import AppRoutes from './components/Routes'

function App() {

  return (
    <div className="App">
      <UserProvider>
        <StocksProvider>
            <AppRoutes />
        </StocksProvider>
      </UserProvider>
    </div>
  );
}

export default App;

