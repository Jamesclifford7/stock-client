import React, {useState} from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import styled from 'styled-components'
import axios from "axios"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
  } from 'chart.js';
import { Line } from 'react-chartjs-2';
import NavBar from '../NavBar/NavBar';
import { useUserContext } from '../UserProvider';
import { useStocksContext } from '../StocksProvider';

export default function Home() {
    const [stockName, setStockName] = useState<string>('')
    const [stockSymbol, setStockSymbol] = useState<string>('')
    const [peRatio, setPeRatio] = useState<string>('')
    const [eps, setEps] = useState<string>('')
    const [quarterlyEarningsGrowthYOY, setQuarterlyEarningsGrowthYOY] = useState<string>('')
    const [labels, setLabels] = useState<string[]>([])
    const [priceData, setPriceData] = useState<string[]>([])
    const [stockErrorMessage, setStockErrorMessage] = useState<string | null>(null)

    const getAverages = (data: any) => {
        const totalAverages: Object[] = []
        const allDates: string[] = []
        const allPrices: string[] = []

        for (const key in data) {
            const average = {name: key, closingPrice: data[key]['4. close']}
            totalAverages.push(average)
            allDates.push(key)
            allPrices.push(data[key]['5. adjusted close'])
        }

        setLabels(allDates.reverse())
        setPriceData(allPrices.reverse())
    }

    const getStockInfo = (e: any) => {
        e.preventDefault()
        const stock = e.target.stock.value
        const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stock}&apikey=${process.env.AV_API_KEY}`
        const earningsUrl = `https://www.alphavantage.co/query?function=EARNINGS&symbol=${stock}&apikey=${process.env.AV_API_KEY}`
        const priceUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${stock}&apikey=${process.env.AV_API_KEY}`

        axios.all([
            axios.get(overviewUrl), 
            axios.get(earningsUrl),
            axios.get(priceUrl)
        ])
        .then(axios.spread((res1, res2, res3) => {
            if (!res1.data.Name) {
                setStockErrorMessage('Stock not found');
                setPeRatio('');
                setStockName(''); 
                setStockSymbol(''); 
                setEps(''); 
                setQuarterlyEarningsGrowthYOY(''); 
                getAverages([]); 
            } else {
                setStockErrorMessage(null);
                setPeRatio(res1.data.PERatio);
                setStockName(res1.data.Name); 
                setStockSymbol(res1.data.Symbol); 
                setEps(res1.data.EPS); 
                setQuarterlyEarningsGrowthYOY(res1.data.QuarterlyEarningsGrowthYOY); 
                getAverages(res3.data["Monthly Adjusted Time Series"]); 
            }
        }))
        .catch((errors) => {
            console.log(errors)
        })
    }   

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Filler,
        Legend
      );
      

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: `${stockName}`
          },
        },
      };


    const data = {
      labels,
      datasets: [
            {
            fill: true,
            label: 'Price',
            data: priceData,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ]
    };
    
    return (
        <>
            <NavBar />
            <StyledForm onSubmit={(e) => getStockInfo(e)}>
                <TextField 
                    name="stock"
                    label="Stock Symbol" 
                    variant="outlined" 
                />
                <StyledSubmitButton 
                    variant="contained"
                    type="submit"
                >
                    Submit
                </StyledSubmitButton>
            </StyledForm>
            <AddToPortfolioButton stockSymbol={stockSymbol} />
            <StockNotFound stockErrorMessage={stockErrorMessage} />
            <StockInfoContainer>
                <h3>PR Ratio: {peRatio ? `$${peRatio}` : null}</h3>
                <h3>Earnings per Share: {eps ? `$${eps}` : null}</h3>
                <h3>Quarterly Earnings Growth Year Over Year: {quarterlyEarningsGrowthYOY ? `$${quarterlyEarningsGrowthYOY}` : null}</h3>
            </StockInfoContainer>
            <GraphContainer>
                <Line options={options} data={data} />
            </GraphContainer>
        </>
    )
}

function AddToPortfolioButton(props: {stockSymbol: string}) {
    const {stockSymbol} = props
    const userContext = useUserContext()
    const stocksContext = useStocksContext()
    const user = userContext.user
    const stocks = stocksContext.stocks

    // if no user is logged in and/or no stock has been searched for, we want to hide the button
    if (!user.id || !stockSymbol) {
        return null
    }

    // if user is logged in, we need to check if the stock is already in user's portfolio
    let stockExists = false
    for (let i = 0; i < stocks.length; i++) {
        if (stocks[i].stock_name === stockSymbol) {
            stockExists = true
        }
    }; 

    if (stockExists) {
        return <StyledPortfolioMessage>(stock is already in your portfolio)</StyledPortfolioMessage>
    }

    // if it is, make POST request to add to portfolio
    const addToPortfolio = () => {
        axios({
            method: 'post', 
            url: `http://localhost:8000/stocks/${user.id}`, 
            headers: {
                'content-type': 'application/json'
            },
            data: {
                stock: stockSymbol
            },
        })
        .then((res) => {
            stocksContext.setStocks([...stocks, res.data])
            alert(`${stockSymbol} added to portfolio`)
        })
        .catch((error) => {
            console.log(error)
        }); 

    }

    return (
        <StyledPortfolioButton 
            color="secondary"
            onClick={addToPortfolio}
        >
            Add to Portfolio
        </StyledPortfolioButton>
    )
}

function StockNotFound(props: {stockErrorMessage: string | null}) {
    const {stockErrorMessage} = props

    if (!stockErrorMessage) {
        return null
    }

    return <h2>{stockErrorMessage}</h2>
}

const StyledForm = styled.form`
    display: flex; 
    align-items: center; 
    justify-content: center; 
    margin-top: 50px !important; 
`

export const StockInfoContainer = styled.div`
    @media all and (min-width: 640px) {
        text-align: left; 
        width: 40%; 
        margin: 0 auto; 
    }
`

const StyledSubmitButton = styled(Button)`
    margin-left: 10px !important; 
`

const StyledPortfolioButton = styled(Button)`
    margin-top: 20px !important; 
`

const StyledPortfolioMessage = styled.p`
    margin-top: 20px; 
`

export const GraphContainer = styled.div`
    width: 90%; 
    margin: 0 auto;

    @media all and (min-width: 640px) {
        width: 70%; 
        margin: 0 auto; 
    
        canvas {
            margin: 0 auto; 
            height: 300px !important; 
            width: 600px !important; 
        }
    }
`