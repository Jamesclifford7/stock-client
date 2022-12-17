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

export default function Home() {
    const [stock, setStock] = useState<string>('')
    const [peRatio, setPeRatio] = useState<string>('')
    const [eps, setEps] = useState<string>('')
    const [quarterlyEarningsGrowthYOY, setQuarterlyEarningsGrowthYOY] = useState<string>('')
    const [labels, setLabels] = useState<string[]>([])
    const [priceData, setPriceData] = useState<string[]>([])

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
        const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stock}&apikey=TJCK4R5BLXT1IJGB`
        const earningsUrl = `https://www.alphavantage.co/query?function=EARNINGS&symbol=${stock}&apikey=TJCK4R5BLXT1IJGB`
        const priceUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${stock}&apikey=TJCK4R5BLXT1IJGB`

        axios.all([
            axios.get(overviewUrl), 
            axios.get(earningsUrl),
            axios.get(priceUrl)
        ])
        .then(axios.spread((res1, res2, res3) => {
            console.log(res1)
            setPeRatio(res1.data.PERatio)
            setStock(res1.data.Name); 
            setEps(res1.data.EPS); 
            setQuarterlyEarningsGrowthYOY(res1.data.QuarterlyEarningsGrowthYOY); 
            getAverages(res3.data["Monthly Adjusted Time Series"]); 
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
            text: `${stock}`
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
            <h1>Search for a Stock</h1>
            <StyledForm onSubmit={(e) => getStockInfo(e)}>
                <TextField 
                    id="stock" 
                    label="Stock Name" 
                    variant="outlined" 
                />
                <StyledButton 
                    variant="contained"
                    type="submit"
                >
                    Submit
                </StyledButton>
            </StyledForm>
            <div>Stock Name: {stock}</div>
            <div>PE Ratio: {peRatio}</div>
            <div>Earnings per Share: {eps}</div>
            <div>Quarterly Earnings Growth Year Over Year: {quarterlyEarningsGrowthYOY}</div>
            <GraphContainer>
                <Line options={options} data={data} />
            </GraphContainer>
        </>

    )
}

const StyledForm = styled.form`
    display: flex; 
    align-items: center; 
    justify-content: center; 
    margin-top: 50px !important; 
`

const StyledButton = styled(Button)`
    margin-left: 10px !important; 
`

const GraphContainer = styled.div`
    width: 70%; 
    margin: 0 auto; 

    canvas {
        margin: 0 auto; 
        height: 300px; 
        width: 600px; 
    }
`