import React from 'react'
import NavBar from '../NavBar/NavBar'
import { useStocksContext } from '../StocksProvider'

interface StockProps {
    id: number
    'user_id': string
    'stock_name': string
}

export default function Portfolio() {
    const stockContext = useStocksContext()
    const stocks = stockContext
    
    return (
        <>
            <NavBar />
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
                        <div key={idx}>
                            <h3>{stock['stock_name']}</h3>
                        </div>
                    )
                })
            }
        </>
    )
}