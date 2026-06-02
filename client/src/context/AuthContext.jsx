/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react'
const environment = import.meta.env.VITE_ENVIRONMENT || 'development'

const API_URL = environment === 'development' ? import.meta.env.VITE_LOCAL_SERVER_URL : import.meta.env.VITE_PRODUCTION_SERVER_URL

const AuthContext = createContext()
let authMePromise = null
let cachedUser = null

const fetchCurrentUser = async (apiUrl) => {
  if (cachedUser) return cachedUser
  if (!authMePromise) {
    authMePromise = fetch(`${apiUrl}/v1/auth/me`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok || !data.success) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`)
        }
        cachedUser = data.data
        return cachedUser
      })
      .finally(() => {
        authMePromise = null
      })
  }
  return authMePromise
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await fetchCurrentUser(API_URL)
        setUser(currentUser)
        setIsLoggedIn(true)
      } catch (error) {
        console.error('Auth check error:', error.message)
        setUser(null)
        setIsLoggedIn(false)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async () => {
    setLoading(true)
    try {
      const currentUser = await fetchCurrentUser(API_URL)
      setUser(currentUser)
      setIsLoggedIn(true)
      return true
    } catch (error) {
      console.error('Login error:', error.message)
      setUser(null)
      setIsLoggedIn(false)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    cachedUser = null
    authMePromise = null
    setUser(null)
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
