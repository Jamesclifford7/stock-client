import React from 'react'
import { render, screen } from '@testing-library/react';
import Home from './Home'
import UserProvider from '../UserProvider';
import { BrowserRouter } from 'react-router-dom'
import StocksProvider from '../StocksProvider';

it('should render Home component', () => {

    render(<BrowserRouter>
            <UserProvider>
                <StocksProvider>
                    <Home hideLine={true} />
                </StocksProvider>
            </UserProvider>
        </BrowserRouter>); 

    const header = screen.getByText(/Stock Analyzer/); 
    expect(header).toBeInTheDocument(); 
})