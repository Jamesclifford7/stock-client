import React, {useState, Dispatch, SetStateAction} from 'react'

interface UserObjectProps {
    id: number
    email: string
}
interface UserProps {
    user: UserObjectProps
    setUser: Dispatch<SetStateAction<{}>>
}

const UserContext = React.createContext<UserProps | undefined>(undefined)

export default function UserProvider(props: {children: JSX.Element}) {
    const localUser = window.localStorage.getItem('user')
    const [user, setUser] = useState(localUser ? JSON.parse(localUser) : {})

    return (
        <UserContext.Provider value={{
            user, 
            setUser
        }}>
            {props.children}
        </UserContext.Provider>
    )
}

export function useUserContext() {
    const context = React.useContext(UserContext)

    if (!context) {
        throw new Error('useUserContext must be used within EditModeProvider')
    }

    return context
}