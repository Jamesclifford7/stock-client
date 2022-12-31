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
        navigate('/home')
    }

    if (!user.id) {
        return (
            <>
                <StyledNav>
                    <StyledLink to="/login">Login</StyledLink>
                    <StyledLink to="">Signup</StyledLink>
                </StyledNav>
                <Link to="/home"><h1>Stock Analyzer</h1></Link>
            </>
        )
    }

    return (
        <>
            <StyledNav>
                <StyledLink to="/portfolio">My Portfolio</StyledLink>
                <button onClick={e => handleLogout(e)}>Logout</button>
            </StyledNav>
            <StyledLink to="/home"><h1>Stock Analyzer</h1></StyledLink>
        </>
    )
}

const StyledNav = styled.nav`
    height: 70px; 
    display: flex; 
    align-items: center; 
    justify-content: flex-end; 
    border-bottom: solid; 
    border-width: 0.8px; 

    a, button {
        margin-right: 50px; 
    }
`

const StyledLink = styled(Link)`
    text-decoration: none; 
`
