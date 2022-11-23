import React, {useState} from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import styled from 'styled-components'
import axios from "axios"
import { formControlUnstyledClasses } from '@mui/base';

export default function Home() {
    const [stock, setStock] = useState<string>('')
    const [eps, setEps] = useState<string>('')
    const [quarterlyEarningsGrowthYOY, setQuarterlyEarningsGrowthYOY] = useState<string>('')

    const getStockInfo = (e) => {
        e.preventDefault()
        const stock = e.target.stock.value
        const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stock}&apikey=TJCK4R5BLXT1IJGB`
        const earningsUrl = `https://www.alphavantage.co/query?function=EARNINGS&symbol=${stock}&apikey=TJCK4R5BLXT1IJGB`

        axios.all([
            axios.get(overviewUrl), 
            axios.get(earningsUrl)
        ])
        .then(axios.spread((res1, res2) => {
            console.log('overview', res1)
            setStock(res1.data.Name); 
            setEps(res1.data.EPS); 
            setQuarterlyEarningsGrowthYOY(res1.data.QuarterlyEarningsGrowthYOY); 

            console.log('earnings response: ', res2)
        }))
        .catch((errors) => {
            console.log(errors)
        })

        // axios.get(overviewUrl).then((res) => {
        //     console.log(res)
        //     setStock(res.data.Name); 
        //     setEps(res.data.EPS); 
        //     setQuarterlyEarningsGrowthYOY(res.data.QuarterlyEarningsGrowthYOY); 
        // })
        // .catch((error) => {
        //     console.log('error retrieving stock information: ', error)
        // })

        // axios.get(earningsUrl).then((res) => {
        //     console.log('earnings response: ', res)
        // })
        // .catch((error) => {
        //     console.log('error retrieving earnings: ', error)
        // })
    }   

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
            <div className='graph'>

            </div>
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