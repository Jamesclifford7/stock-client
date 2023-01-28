import React from 'react'; 
import axios from 'axios'; 
import { fetchUserPortfolio } from '../../__utils__';
import Portfolio from '../Portfolio'
import UserProvider from '../../UserProvider';
import { BrowserRouter } from 'react-router-dom'
import StocksProvider from '../../StocksProvider';
import { render, screen } from '@testing-library/react';

// Mock jest and set the type
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
    jest.clearAllMocks()
})

it('should render portfolio component', async () => {
    render(<BrowserRouter>
        <UserProvider>
            <StocksProvider>
                <Portfolio />
            </StocksProvider>
        </UserProvider>
    </BrowserRouter>); 

    const header = await screen.findByText(/My Portfolio/)
    expect(header).toBeInTheDocument()
})

it('should fetch a users portfolio', async () => {
    const stocks = [
        {
            "id": 1,
            "user_id": "1",
            "stock_name": "AAPL"
        }, 
        {
            "id": 2,
            "user_id": "1",
            "stock_name": "TSLA"
        }, 
        {
            "id": 3,
            "user_id": "1",
            "stock_name": "AMZN"
        }
    ]; 

    mockedAxios.get.mockResolvedValueOnce(stocks);
    const portfolio = await fetchUserPortfolio();
    expect(portfolio).toEqual(stocks); 
})