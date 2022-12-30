import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { useUserContext } from '../UserProvider'
import { useNavigate } from 'react-router-dom'

export default function NavBar() {
    const context = useUserContext()
    const [user, setUser] = useState(context.user)
    const navigate = useNavigate()

    const handleLogout = (e) => {
        e.preventDefault()
        setUser()
        context.setUser()
        window.localStorage.clear(); 
        navigate('/home')
    }

    if (!user) {
        return (
            <nav>
                <Link to="/login">Login</Link>
                <Link to="">Signup</Link>
            </nav>
        )
    }

    return (
        <nav>
            <Link to="">My Portfolio</Link>
            <button onClick={e => handleLogout(e)}>Logout</button>
        </nav>
    )
}