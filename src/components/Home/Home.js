import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'

export default function Home() {
    return (
        <>
            <h1>Search for a Stock</h1>
            <TextField 
                id="outlined-basic" 
                label="Stock Name" 
                variant="outlined" 
            />

        </>

    )
}