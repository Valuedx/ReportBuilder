// Simple axios wrapper for future real backend
import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('access_token')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error) => Promise.reject(error)
)

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config || {}
		if (error.response && error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true
			const refresh = localStorage.getItem('refresh_token')
			if (refresh) {
				try {
					const res = await axios.post(`${API_BASE_URL}/auth/refresh/`, { refresh })
					const newAccess = res.data?.access
					if (newAccess) {
						localStorage.setItem('access_token', newAccess)
						originalRequest.headers = originalRequest.headers || {}
						originalRequest.headers.Authorization = `Bearer ${newAccess}`
						return api(originalRequest)
					}
				} catch (e) {
					localStorage.removeItem('access_token')
					localStorage.removeItem('refresh_token')
				}
			}
		}
		return Promise.reject(error)
	}
)

export default api


