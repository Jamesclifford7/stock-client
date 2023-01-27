import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { useUserContext } from '../UserProvider'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

export default function NavBar() {
    const context = useUserContext()
    const [user, setUser] = useState(context.user)
    const navigate = useNavigate()

    const handleLogout = (e) => {
        e.preventDefault()
        setUser({})
        context.setUser({})
        window.localStorage.clear(); 
        navigate('/')
    }
    
    if (!user.id) {
        return (
            <>
                <StyledNav>
                    <StyledLink to="/login">Login</StyledLink>
                    <StyledLink to="/signup">Sign Up</StyledLink>
                </StyledNav>
                <StyledLink to="/"><h1>Stock Analyzer</h1></StyledLink>
            </>
        )
    }

    return (
        <>
            <StyledNav>
                <StyledLink to="/portfolio">My Portfolio</StyledLink>
                <StyledLogout onClick={e => handleLogout(e)}>Logout</StyledLogout>
            </StyledNav>
            <StyledLink to="/"><h1>Stock Analyzer</h1></StyledLink>
            <span>Welcome, {user.email}</span>
        </>
    )
}

const StyledNav = styled.nav`
    height: none; 
    display: flex; 
    align-items: center; 
    justify-content: flex-end; 
    border-bottom: solid; 
    border-width: 0.8px; 
    flex-direction: column; 

    a, button {
        padding: 25px 0; 
    }

    @media all and (min-width: 640px)  {
        flex-direction: row; 
        align-items: center; 
        justify-content: flex-end; 
        height: 70px;

        a, button {
            margin-right: 50px; 
        }
    }
`

const StyledLink = styled(Link)`
    text-decoration: none; 
    color: #4392F1; 
    font-size: 16px; 

    &:hover {
        text-decoration: underline; 
    }
`

const StyledLogout = styled.button`
    background: none; 
    border: none; 
    color: #4392F1;
    font-size: 16px; 

    &:hover {
        text-decoration: underline; 
        cursor: pointer; 
    }
`
