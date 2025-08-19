import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
	const { register } = useAuth()
	const [form, setForm] = useState({ email: '', username: '', first_name: '', last_name: '', password: '' })
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [loading, setLoading] = useState(false)

	const update = (k, v) => setForm((p) => ({ ...p, [k]: v }))

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setSuccess('')
		setLoading(true)
		try {
			await register(form)
			setSuccess('Account created. You can now sign in.')
		} catch (err) {
			setError('Registration failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<form onSubmit={handleSubmit} className="bg-white w-full max-w-md p-6 rounded-xl border">
				<h1 className="text-2xl font-bold mb-4">Create account</h1>
				{error && <div className="text-red-600 text-sm mb-3">{error}</div>}
				{success && <div className="text-green-600 text-sm mb-3">{success}</div>}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					<div>
						<label className="block text-sm font-medium mb-1">First name</label>
						<input value={form.first_name} onChange={(e) => update('first_name', e.target.value)} className="w-full border rounded-lg p-2" required />
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Last name</label>
						<input value={form.last_name} onChange={(e) => update('last_name', e.target.value)} className="w-full border rounded-lg p-2" required />
					</div>
				</div>
				<label className="block text-sm font-medium mb-1 mt-3">Email</label>
				<input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full border rounded-lg p-2" required />
				<label className="block text-sm font-medium mb-1 mt-3">Username</label>
				<input value={form.username} onChange={(e) => update('username', e.target.value)} className="w-full border rounded-lg p-2" required />
				<label className="block text-sm font-medium mb-1 mt-3">Password</label>
				<input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} className="w-full border rounded-lg p-2" required />
				<button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold mt-6 disabled:opacity-50">
					{loading ? 'Creating...' : 'Create account'}
				</button>
			</form>
		</div>
	)
}
