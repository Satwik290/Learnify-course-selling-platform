import { useState, useEffect } from 'react'
import axios from '../api/axios'
import { AuthContext } from './auth'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data } = await axios.get('/profile/view')
      setUser(data.user || data)
    } catch (error) {
      // 401 is expected when user is not logged in — handle silently
      if (error.response?.status !== 401) {
        console.warn('Auth check error:', error.message)
      }
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const { data } = await axios.post('/auth/login', { email, password })
    setUser(data.user)
    return data
  }

  const signup = async (userData) => {
    const { data } = await axios.post('/auth/signup', userData)
    setUser(data.user)
    return data
  }

  const logout = async () => {
    try {
      await axios.post('/auth/logout')
    } catch {
      // ignore logout errors (expired token etc.)
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
