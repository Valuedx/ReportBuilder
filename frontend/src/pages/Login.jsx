import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, BarChart3 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button, Input, Card, CardContent } from '../components/ui'

export default function Login() {
	const { login } = useAuth()
	const [loginField, setLoginField] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			await login(loginField, password)
		} catch (err) {
			setError('Invalid credentials')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 px-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md"
			>
				<div className="text-center mb-8">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.2, type: 'spring' }}
						className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl mb-4"
					>
						<BarChart3 className="w-8 h-8 text-white" />
					</motion.div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
					<p className="text-gray-600 mb-4">Sign in to your Enterprise Reports account</p>
					
					{/* Test Credentials */}
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
						<p className="font-medium text-blue-900 mb-2">Test Credentials:</p>
						<ul className="text-blue-800 space-y-1">
							<li><strong>Admin:</strong> admin_user / admin123</li>
							<li><strong>Creator:</strong> report_creator / creator123</li>
							<li><strong>Viewer:</strong> report_viewer / viewer123</li>
						</ul>
					</div>
				</div>

				<Card>
					<CardContent className="p-8">
						<form onSubmit={handleSubmit} className="space-y-6">
							{error && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="p-4 bg-danger-50 border border-danger-200 rounded-xl text-danger-700 text-sm"
								>
									{error}
								</motion.div>
							)}

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Username or Email
									</label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
										<Input
											type="text"
											value={loginField}
											onChange={(e) => setLoginField(e.target.value)}
											className="pl-10"
											placeholder="Enter your username or email"
											required
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Password
									</label>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
										<Input
											type="password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className="pl-10"
											placeholder="Enter your password"
											required
										/>
									</div>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<label className="flex items-center">
									<input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
									<span className="ml-2 text-sm text-gray-600">Remember me</span>
								</label>
								<button type="button" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
									Forgot password?
								</button>
							</div>

							<Button
								type="submit"
								loading={loading}
								className="w-full"
								size="lg"
							>
								Sign in
							</Button>
						</form>
					</CardContent>
				</Card>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					className="text-center mt-6"
				>
					<p className="text-gray-600">
						Don't have an account?{' '}
						<button className="text-primary-600 hover:text-primary-700 font-medium">
							Sign up
						</button>
					</p>
				</motion.div>
			</motion.div>
		</div>
	)
}
