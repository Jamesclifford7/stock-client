import React from 'react'
import { render, screen } from '@testing-library/react';
import Home from '../Home'
import UserProvider from '../../UserProvider';
import { BrowserRouter } from 'react-router-dom'
import StocksProvider from '../../StocksProvider';
import axios from 'axios'
import { fetchStockInfo } from '../../__utils__';

// Mock jest and set the type
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
    jest.clearAllMocks()
})

it('should render Home component', async () => {
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

it ('should fetch stock info', async () => {
    const response = {
        Name: "Apple Inc",
        PERatio: "23.88",
        EPS: "6.11",
    }
    mockedAxios.get.mockResolvedValueOnce(response);
    const result = await fetchStockInfo();
    expect(mockedAxios.get).toHaveBeenCalledWith(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=AAPL&apikey=${process.env.AV_API_KEY}`);
    expect(JSON.stringify(result)).toEqual(JSON.stringify(response))
})