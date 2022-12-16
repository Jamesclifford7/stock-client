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
    const [eps, setEps] = useState<string>('')
    const [quarterlyEarningsGrowthYOY, setQuarterlyEarningsGrowthYOY] = useState<string>('')
    // const [priceData, setPriceData] = useState<Object[]>([])
    const [labels, setLabels] = useState<string[]>([])
    const [priceData, setPriceData] = useState<string[]>([])

    const getAverages = (data: any) => {
        console.log('data', data)
        const totalAverages: Object[] = []
        const allDates: string[] = []
        const allPrices: string[] = []

        for (const key in data) {
            // const average = {[key]: data[key]['4. close']}
            const average = {name: key, closingPrice: data[key]['4. close']}
            totalAverages.push(average)
            allDates.push(key)
            allPrices.push(data[key]['4. close'])
        }
        //const halfLength = Math.ceil(totalAverages.length / 2); 
        //const leftSide = totalAverages.slice(0, halfLength); 
        // setPriceData(leftSide.reverse())
        setLabels(allDates)
        setPriceData(allPrices)
    }

    const getStockInfo = (e: any) => {
        e.preventDefault()
        const stock = e.target.stock.value
        const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stock}&apikey=TJCK4R5BLXT1IJGB`
        const earningsUrl = `https://www.alphavantage.co/query?function=EARNINGS&symbol=${stock}&apikey=TJCK4R5BLXT1IJGB`
        const priceUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${stock}&apikey=TJCK4R5BLXT1IJGB`

        axios.all([
            axios.get(overviewUrl), 
            axios.get(earningsUrl),
            axios.get(priceUrl)
        ])
        .then(axios.spread((res1, res2, res3) => {
            setStock(res1.data.Name); 
            setEps(res1.data.EPS); 
            setQuarterlyEarningsGrowthYOY(res1.data.QuarterlyEarningsGrowthYOY); 
            getAverages(res3.data["Weekly Time Series"]); 
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
            text: 'Chart.js Line Chart',
          },
        },
      };

    // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    const data = {
      labels,
      datasets: [
            {
            fill: true,
            label: 'Dataset 2',
            // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
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
    height: 400px; 
    width: 70%; 
    margin: 0 auto; 

    canvas {
        margin: 0 auto; 
    }
`