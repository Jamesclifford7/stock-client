import React, {useState, useEffect} from 'react'
import { useUserContext } from './UserProvider'
import axios from 'axios'

interface StockProps {
    id: number
    'user_id': string
    'stock_name': string
}

const StocksContext = React.createContext<StockProps[]>([])

export default function StocksProvider(props: {children: JSX.Element}) {
    const context = useUserContext()
    const user = context.user
    const [stocks, setStocks] = useState<StockProps[]>([])
    
    useEffect(() => {
        if (!user.id) {
            return 
        } 
        
        axios({
            method: 'get', 
            url: `http://localhost:8000/stocks/${user.id}`, 
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
    }, [user])

    return (
        <StocksContext.Provider value={stocks}>
            {props.children}
        </StocksContext.Provider>
    )
}

export function useStocksContext() {
    const context = React.useContext(StocksContext)

    if (!context) {
        throw new Error('useStocksContext must be used within StocksProvider')
    }

    return context
}