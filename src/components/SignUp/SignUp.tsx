import React, {useState} from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import styled from 'styled-components'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../UserProvider'
import NavBar from '../NavBar/NavBar';

interface SignUpProps {
    email: string
    password: string
}

export default function SignUp() {
    const [errorMessage, setErrorMessage] = useState<string>()
    const navigate = useNavigate()
    const context = useUserContext()

    const handleSignUp = (e: any) => {
        e.preventDefault()
        const email: SignUpProps["email"] = e.target.email.value
        const password: SignUpProps["password"] = e.target.password.value

        axios({
            method: 'post', 
            url: `${process.env.REACT_APP_API_URL}/users`, 
            headers: {
                'content-type': 'application/json'
            },
            data: {
                email: email, 
                password: password
            },
        })
        .then((res) => {
            if (res.status === 201) {
                const user = {
                    id: res.data[0].id, 
                    email: res.data[0].email,
                }

                window.localStorage.setItem('user', JSON.stringify(user)); 
                context.setUser(user); 
                navigate('/home'); 
            }
        })
        .catch((error) => {
            setErrorMessage(error.response.data)
        })
    }

    return (
        <>
            <NavBar />
            <h2>Sign Up</h2>
            <form onSubmit={(e) => handleSignUp(e)}>
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
            <Error
                signUpErrorMessage={errorMessage}
            />
        </>
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

function Error(props: {signUpErrorMessage: string | undefined}) {

    if (!props.signUpErrorMessage) {
        return null
    }

    return (
        <UserNotFoundContainer>{props.signUpErrorMessage}</UserNotFoundContainer>
    )
}