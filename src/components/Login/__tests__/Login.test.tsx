import React from 'react'
import { render, screen } from '@testing-library/react';
import Login from '../Login'
import UserProvider from '../../UserProvider';
import { BrowserRouter } from 'react-router-dom'
import StocksProvider from '../../StocksProvider';
import axios from 'axios'
import { fetchUser } from '../../__utils__';

// Mock jest and set the type
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
    jest.clearAllMocks()
})

it('should render Login component', async () => {
    render(<BrowserRouter>
            <UserProvider>
                <StocksProvider>
                    <Login />
                </StocksProvider>
            </UserProvider>
        </BrowserRouter>); 

    const header = screen.getAllByText(/Login/)[1]; 
    expect(header).toBeInTheDocument(); 
})

it('should fetch user upon login', async () => {
    const response = {
        id: 1,
        email: "gordongekko@gmail.com",
        password: "Password1"
    }
    mockedAxios.post.mockResolvedValueOnce(response);
    const result = await fetchUser();
    expect(mockedAxios.post).toHaveBeenCalledWith(`${process.env.REACT_APP_API_URL}/login`);
    expect(JSON.stringify(result)).toEqual(JSON.stringify(response))
})
