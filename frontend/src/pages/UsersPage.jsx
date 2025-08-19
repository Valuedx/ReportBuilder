import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Plus, Search, Mail, Settings, Trash2, Edit, Shield, UserCheck, UserX } from 'lucide-react'
import { Button } from '../components/ui'
import { Card, CardContent } from '../components/ui'
import { usersAPI } from '../services/users.js'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    admin_users: 0,
    email_recipients: 0
  })
  const [availableRoles, setAvailableRoles] = useState([])
  const [error, setError] = useState(null)

  const roleColors = {
    'Admin': 'bg-red-100 text-red-800',
    'Report Creator': 'bg-blue-100 text-blue-800', 
    'Report Viewer': 'bg-green-100 text-green-800'
  }

  const statusColors = {
    'Active': 'bg-success-100 text-success-800',
    'Inactive': 'bg-gray-100 text-gray-800'
  }

  // Load users and related data
  const loadUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const [usersData, statsData, rolesData] = await Promise.all([
        usersAPI.getUsers({ search: searchTerm, role: selectedRole }),
        usersAPI.getUserStats(),
        usersAPI.getUserRoles()
      ])
      
      setUsers(usersData.results || usersData)
      setStats(statsData)
      setAvailableRoles(rolesData)
    } catch (err) {
      console.error('Error loading users:', err)
      setError('Failed to load users. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [searchTerm, selectedRole])

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        loadUsers()
      }
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Since filtering is now done server-side, we don't need client-side filtering
  const filteredUsers = users

  const getUserInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase()
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.deleteUser(userId)
        await loadUsers() // Reload users after deletion
      } catch (err) {
        console.error('Error deleting user:', err)
        setError('Failed to delete user. Please try again.')
      }
    }
  }

  const handleToggleStatus = async (userId) => {
    try {
      await usersAPI.toggleUserStatus(userId)
      await loadUsers() // Reload users after status change
    } catch (err) {
      console.error('Error toggling user status:', err)
      setError('Failed to update user status. Please try again.')
    }
  }

  const statsDisplay = [
    { label: 'Total Users', value: stats.total_users, icon: Users, color: 'text-primary-600' },
    { label: 'Active Users', value: stats.active_users, icon: UserCheck, color: 'text-success-600' },
    { label: 'Admins', value: stats.admin_users, icon: Shield, color: 'text-purple-600' },
    { label: 'Report Recipients', value: stats.email_recipients, icon: Mail, color: 'text-orange-600' }
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
        <p className="text-gray-600">Manage users, roles, and report access permissions</p>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
        >
          <p className="text-red-800">{error}</p>
          <Button
            onClick={() => setError(null)}
            variant="ghost"
            size="sm"
            className="mt-2 text-red-600"
          >
            Dismiss
          </Button>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsDisplay.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br from-${stat.color.split('-')[1]}-500 to-${stat.color.split('-')[1]}-600`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Users Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-primary-600 mr-2" />
                <h3 className="text-lg font-semibold">Users ({filteredUsers.length})</h3>
              </div>
              <Button
                onClick={() => setShowAddModal(true)}
                variant="primary"
                icon={<Plus className="w-4 h-4" />}
              >
                Add User
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Roles</option>
                {availableRoles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Users List */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Users Found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {getUserInitials(user.full_name || user.username)}
                      </div>
                      
                      {/* User Info */}
                      <div>
                        <h4 className="font-medium text-gray-900">{user.full_name || user.username}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleColors[user.role_display] || 'bg-gray-100 text-gray-800'}`}>
                            {user.role_display}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[user.is_active ? 'Active' : 'Inactive']}`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* User Stats & Actions */}
                    <div className="flex items-center space-x-6">
                      <div className="text-right text-sm">
                        <p className="text-gray-600">Reports Access</p>
                        <p className="font-medium">{user.reports_access_count || 0}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-gray-600">Last Login</p>
                        <p className="font-medium">{user.last_login_display || 'Never'}</p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleToggleStatus(user.id)}
                          variant="ghost"
                          size="sm"
                          className={user.is_active ? 'text-gray-600' : 'text-success-600'}
                          icon={user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          title={user.is_active ? 'Deactivate User' : 'Activate User'}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Edit className="w-4 h-4" />}
                          className="text-primary-600"
                          title="Edit User"
                        />
                        <Button
                          onClick={() => handleDeleteUser(user.id)}
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 className="w-4 h-4" />}
                          className="text-danger-600"
                          title="Delete User"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add User Modal - Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>
            <p className="text-gray-600 mb-4">This feature is coming soon! For now, users can be managed through the Django admin interface.</p>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowAddModal(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
