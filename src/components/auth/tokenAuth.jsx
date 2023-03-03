import { useState, useContext, createContext } from "react"

// Set authentication context
const AuthContext = createContext({
  user: null
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // Force refresh the token every 10 minutes
  // useEffect(() => {
  //   const handle = setInterval(async () => {
  //     const user = firebaseClient.auth().currentUser

  //     if (user) await user.getIdToken(true)
  //   }, 10 * 60 * 1000)

  //   return () => clearInterval(handle)
  // }, [])

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
