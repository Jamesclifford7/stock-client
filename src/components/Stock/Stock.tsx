import React, {useState, useEffect, useCallback} from 'react'
import NavBar from '../NavBar/NavBar'
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
import { StockInfoContainer, GraphContainer } from '../Home/Home';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '@mui/material/Button'
import { useStocksContext } from '../StocksProvider';
import { useNavigate } from 'react-router-dom';

export default function Stock() {
    const params = useParams()
    const stockSymbol = params['stock_symbol']
    const [stockName, setStockName] = useState<string>('')
    const [peRatio, setPeRatio] = useState<string>('')
    const [eps, setEps] = useState<string>('')
    const [quarterlyEarningsGrowthYOY, setQuarterlyEarningsGrowthYOY] = useState<string>('')
    const [labels, setLabels] = useState<string[]>([])
    const [priceData, setPriceData] = useState<string[]>([])

    const getAverages = useCallback((data: any) => {
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
    }, []) 

    const getStockInfo = useCallback((stock: string | undefined) => {
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
                setPeRatio('');
                setStockName(''); 
                setEps(''); 
                setQuarterlyEarningsGrowthYOY(''); 
                getAverages([]); 
            } else {
                setPeRatio(res1.data.PERatio);
                setStockName(res1.data.Name); 
                setEps(res1.data.EPS); 
                setQuarterlyEarningsGrowthYOY(res1.data.QuarterlyEarningsGrowthYOY); 
                getAverages(res3.data["Monthly Adjusted Time Series"]); 
            }
        }))
        .catch((errors) => {
            console.log(errors)
        })
    }, [getAverages])

    useEffect(() => {
        // get stock info 
        getStockInfo(stockSymbol)

    }, [stockSymbol, getStockInfo])

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
            <h2>{stockName}</h2>
            <RemoveFromPortfolioPrompt stockSymbol={stockSymbol} />
            <StockInfoContainer>
                <h3>PR Ratio: {peRatio ? `$${peRatio}` : null}</h3>
                <h3>Earnings per Share: {eps ? `$${eps}` : null}</h3>
                <h3>Quarterly Earnings Growth Year Over Year: {quarterlyEarningsGrowthYOY ? `$${quarterlyEarningsGrowthYOY}` : null}</h3>
            </StockInfoContainer>
            <GraphContainer>
                <Line options={options} data={data}/>
            </GraphContainer>

        </>
    )
}

function RemoveFromPortfolioPrompt(props: {stockSymbol: string | undefined}) {
    const {stockSymbol} = props
    const [isShowingRemoveButton, setIsShowingRemoveButton] = useState(false)
    const stocksContext = useStocksContext()
    const stocks = stocksContext.stocks
    const navigate = useNavigate()
    
    // get stock id 
    const stock = stocks.filter(stock => stock.stock_name === stockSymbol)
    const stockId = stock[0].id


    const deleteStock = () => {
        axios({
            method: 'delete', 
            url: `${process.env.REACT_APP_API_URL}/stocks/${stockId}`, 
            headers: {
                'content-type': 'application/json'
            },
        })
        .then((res) => {
            // update context
            const updatedStocks = stocks.filter(stock => stock.stock_name !== stockSymbol)
            stocksContext.setStocks(updatedStocks); 

            alert(res.data); 
            navigate('/portfolio'); 
        })
        .catch((error) => {
            console.log(error)
        })
    }

    if (!isShowingRemoveButton) {
        return <>
            <Button onClick={() => setIsShowingRemoveButton(!isShowingRemoveButton)}>Remove from Portfolio</Button>
        </>
    }

    return (
        <>
            <Button color="error" onClick={() => setIsShowingRemoveButton(!isShowingRemoveButton)}>Remove from Portfolio</Button>
            <div>Are you sure?</div>
            <Button color="error" onClick={deleteStock}>Delete Forever</Button>
        </>
    )
}




