import { ReactNode, useState, createContext, useEffect } from 'react'

interface UserContextI {
  username: string;
  setUsername: (username: string) => void;
}

const UserContext = createContext<UserContextI>({
  username: '',
  setUsername: () => {
  },
})

export default function UserProvider({ children }: { children: ReactNode }) {
  const [username, setUsernameState] = useState(() => {
    return localStorage.getItem('username') || ''
  })

  const setUsername = (newUsername: string) => {
    setUsernameState(newUsername)
    localStorage.setItem('username', newUsername)
  }

  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    if (storedUsername && storedUsername !== username) {
      setUsernameState(storedUsername)
    }
  }, [])


  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  )
}

export { UserProvider, UserContext }
