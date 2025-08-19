import api from './api.js'

export const usersAPI = {
  // Get all users with optional filtering
  getUsers: async (params = {}) => {
    const queryParams = new URLSearchParams()
    
    if (params.search) queryParams.append('search', params.search)
    if (params.role && params.role !== 'all') queryParams.append('role', params.role)
    if (params.is_active !== undefined) queryParams.append('is_active', params.is_active)
    if (params.ordering) queryParams.append('ordering', params.ordering)
    
    const queryString = queryParams.toString()
    const url = queryString ? `/users/?${queryString}` : '/users/'
    
    const response = await api.get(url)
    return response.data
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get('/users/stats/')
    return response.data
  },

  // Get available user roles
  getUserRoles: async () => {
    const response = await api.get('/users/roles/')
    return response.data
  },

  // Get a specific user by ID
  getUser: async (userId) => {
    const response = await api.get(`/users/${userId}/`)
    return response.data
  },

  // Create a new user
  createUser: async (userData) => {
    const response = await api.post('/users/', userData)
    return response.data
  },

  // Update a user
  updateUser: async (userId, userData) => {
    const response = await api.patch(`/users/${userId}/`, userData)
    return response.data
  },

  // Delete a user
  deleteUser: async (userId) => {
    await api.delete(`/users/${userId}/`)
  },

  // Toggle user active status
  toggleUserStatus: async (userId) => {
    const response = await api.post(`/users/${userId}/toggle_status/`)
    return response.data
  },

  // Bulk operations
  bulkUpdateUsers: async (userIds, updateData) => {
    const promises = userIds.map(id => 
      api.patch(`/users/${id}/`, updateData)
    )
    const responses = await Promise.all(promises)
    return responses.map(response => response.data)
  },

  bulkDeleteUsers: async (userIds) => {
    const promises = userIds.map(id => api.delete(`/users/${id}/`))
    await Promise.all(promises)
  }
}
