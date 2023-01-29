import axios from 'axios'

export const fetchStockInfo = async () => {
    try {
      return await axios.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=AAPL&apikey=${process.env.AV_API_KEY}`);
    } catch (error) {
      return {};
    }
};

export const fetchUserPortfolio = async () => {
    try {
      return await axios.get(`${process.env.REACT_APP_API_URL}/stocks/1`);
    } catch (error) {
      return [];
    }
};

export const fetchUser = async () => {
  try {
    return await axios.post(`${process.env.REACT_APP_API_URL}/login`); 
  } catch (error) {
    return {};
  }
};

