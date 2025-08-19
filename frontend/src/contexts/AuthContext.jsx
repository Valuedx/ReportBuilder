import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'

const AuthContext = createContext(null)

export const useAuth = () => {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}

export const AuthProvider = ({ children }) => {
	const navigate = useNavigate()
	const [user, setUser] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	const isAuthenticated = !!localStorage.getItem('access_token')

	const loadMe = useCallback(async () => {
		if (!localStorage.getItem('access_token')) {
			setUser(null)
			setIsLoading(false)
			return
		}
		try {
			const me = await authService.me()
			setUser(me)
		} catch {
			localStorage.removeItem('access_token')
			localStorage.removeItem('refresh_token')
			setUser(null)
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		loadMe()
	}, [loadMe])

	const login = async (loginField, password) => {
		await authService.login(loginField, password)
		await loadMe()
		navigate('/')
	}

	const logout = () => {
		authService.logout()
		setUser(null)
		navigate('/login')
	}

	const register = async (payload) => {
		await authService.register(payload)
		return true
	}

	return (
		<AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, register }}>
			{children}
		</AuthContext.Provider>
	)
}
