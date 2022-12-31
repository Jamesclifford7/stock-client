import React from 'react'
import NavBar from '../NavBar/NavBar'
import { useStocksContext } from '../StocksProvider'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
interface StockProps {
    id: number
    'user_id': string
    'stock_name': string
}

export default function Portfolio() {
    const stockContext = useStocksContext()
    const stocks = stockContext.stocks
    
    return (
        <>
            <NavBar />
            <h2>My Portfolio</h2>
            <StockList stocks={stocks} />
        </>
    )
}

function StockList(props: {stocks: StockProps[]}) {
    const {stocks} = props

    if (stocks.length === 0) {
        return <div>Portfolio is Empty</div>
    }

    return (
        <>
            {
                stocks.map((stock, idx) => {
                    return (
                        <Stock key={idx}>
                            <Link to={`/portfolio/${stock['stock_name']}`}><h3>{stock['stock_name']}</h3></Link>
                        </Stock>
                    )
                })
            }
        </>
    )
}

const Stock = styled.div`
    margin: 0 auto; 
    border: solid;
    border-width: 0.8px; 
    width: 70%; 

    a {
        color: black; 
        text-decoration: none; 
    }

    a:hover {
        text-decoration: underline; 
    }
`