import React from 'react'
import { Link } from 'react-router-dom'
import { useUserContext } from '../UserProvider'

export default function NavBar() {
    const context = useUserContext()
    const user = context.user

    if (!user) {
        return (
            <nav>
                <Link to="">Login</Link>
                <Link to="">Signup</Link>
            </nav>
        )
    }

    return (
        <nav>
            <Link to="">My Portfolio</Link>
            <Link to="">Logout</Link>
        </nav>
    )
}