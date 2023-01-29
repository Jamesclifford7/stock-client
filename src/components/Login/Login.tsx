import React, {useState} from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import styled from 'styled-components'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../UserProvider'
import NavBar from '../NavBar/NavBar';
interface LoginProps {
    email: string
    password: string
}

export default function Login() {
    const [userNotFoundMessage, setUserNotFoundMessage] = useState<string>()
    const navigate = useNavigate()
    const context = useUserContext()

    const handleLogin = (e: any) => {
        e.preventDefault()
        const email: LoginProps["email"] = e.target.email.value
        const password: LoginProps["password"] = e.target.password.value

        axios({
            method: 'post', 
            url: `${process.env.REACT_APP_API_URL}/login`, 
            headers: {
                'content-type': 'application/json'
            },
            data: {
                email: email, 
                password: password
            },
        })
        .then((res) => {
            if (res.data === "User not found") {
                setUserNotFoundMessage("User not found")
            }
            
            const user = {
                id: res.data[0].id, 
                email: res.data[0].email,
            }

            window.localStorage.setItem('user', JSON.stringify(user)); 
            context.setUser(user); 
            navigate('/'); 
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return (
        <>
            <NavBar />
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
                <StyledButton
                    type="submit"
                    variant='contained'
                >
                    Submit
                </StyledButton>
            </form>
            <UserNotFound 
                userNotFoundMessage={userNotFoundMessage}
            />
            <CredentialsContainer>
                <h3>Demo Credentials:</h3>
                <p>Email: gordongekko@gmail.com</p>
                <p>Password: Password1</p>
            </CredentialsContainer>
        </>
    )
}

function UserNotFound(props: {userNotFoundMessage: string | undefined}) {

    if (!props.userNotFoundMessage) {
        return null
    }

    return (
        <UserNotFoundContainer>{props.userNotFoundMessage}</UserNotFoundContainer>
    )
}

const TextFieldContainer = styled.div`
    margin-bottom: 20px; 
`

const UserNotFoundContainer = styled.div`
    margin-top: 20px; 
`

const StyledButton = styled(Button)`
    background-color: #4392F1 !important;
`

const CredentialsContainer = styled.div`
    background-color: #E7E7E7; 
    padding: 12px; 
    width: 80%; 
    border: solid; 
    border-width: 0.8px; 
    margin: 0 auto; 
    margin-top: 20px; 
    border-radius: 25px; 
    @media all and (min-width: 640px) {
        width: 25%;
    }
`