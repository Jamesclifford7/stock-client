import React, {useState, useEffect} from 'react'
import NavBar from '../NavBar/NavBar'
import { useUserContext } from '../UserProvider'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

interface StockProps {
    id: number
    'user_id': string
    'stock_name': string
}

export default function Portfolio() {
    const context = useUserContext()
    const userId = context.user.id
    const [stocks, setStocks] = useState<StockProps[]>([])
    const navigate = useNavigate()
    
    useEffect(() => {
        if (!userId) {
            navigate('/login')
            return
        }

        axios({
            method: 'get', 
            url: `http://localhost:8000/stocks/${userId}`, 
            headers: {
                'content-type': 'application/json'
            },
        })
        .then((res) => {
            setStocks(res.data); 
        })
        .catch((error) => {
            console.log(error)
        })
    }, [userId, navigate])
    
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
        return null
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