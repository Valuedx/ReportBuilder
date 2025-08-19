import api from './api'

export const authService = {
	login: async (login, password) => {
		const res = await api.post('/auth/login/', { login, password })
		const { access, refresh } = res.data
		if (access) localStorage.setItem('access_token', access)
		if (refresh) localStorage.setItem('refresh_token', refresh)
		return res.data
	},
	register: async (payload) => {
		const res = await api.post('/auth/register/', payload)
		return res.data
	},
	me: async () => {
		const res = await api.get('/auth/me/')
		return res.data
	},
	logout: () => {
		localStorage.removeItem('access_token')
		localStorage.removeItem('refresh_token')
	},
}
