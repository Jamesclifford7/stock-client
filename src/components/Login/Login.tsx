import React, {useState} from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import styled from 'styled-components'
import axios from 'axios'

interface LoginProps {
    email: string
    password: string
}

export default function Login() {
    const [user, setUser] = useState<object>()

    const handleLogin = (e: any) => {
        e.preventDefault()
        const email: LoginProps["email"] = e.target.email.value
        const password: LoginProps["password"] = e.target.password.value

        axios({
            method: 'post', 
            url: 'http://localhost:8000/login', 
            headers: {
                'content-type': 'application/json'
            },
            data: {
                email: email, 
                password: password
            },
        })
        .then((res) => {
            setUser(res.data[0])
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return (
        <>
            <h2>Login</h2>
            <form onSubmit={(e) => handleLogin(e)}>
                <TextFieldContainer>
                    <TextField
                        label='Email'
                        name='email'
                    />
                </TextFieldContainer>
                <TextFieldContainer>
                    <TextField
                        label='Password'
                        name='password'
                        type='password'
                    />
                </TextFieldContainer>
                <Button
                    type="submit"
                    variant='contained'
                >
                    Submit
                </Button>
            </form>
        </>
    )
}

const TextFieldContainer = styled.div`
    margin-bottom: 20px; 
`