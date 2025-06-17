import { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { loginStart, loginSuccess, loginFailure } from '@/features/auth/authSlice';

export default function Login() {
	const dispatch = useDispatch();
	const authStatus = useSelector((state) => state.auth.status);
	const authError = useSelector((state) => state.auth.error);
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		dispatch(loginStart());

		try {
			// 1. Get CSRF cookie
			await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
				withCredentials: true,
			});

			// 2. Post login
			await axios.post(
				'http://localhost:8000/api/login',
				{ email, password },
				{ withCredentials: true }
			);

			// 3. Get authenticated user
			const response = await axios.get('http://localhost:8000/api/user', {
				withCredentials: true,
			});

			dispatch(loginSuccess({ user: response.data }));
			navigate('/');
		} catch (error) {
			const message =
				error.response?.data?.message || 'Login failed. Please try again.';
			dispatch(loginFailure(message));
		}
	};

	return (
		<Card className="mx-auto mt-5" style={{ maxWidth: '400px' }}>
			<Card.Body>
				<Card.Title className="mb-4">Login</Card.Title>
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label>Email</Form.Label>
						<Form.Control
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</Form.Group>
					<Button
						type="submit"
						variant="primary"
						className="w-100"
						disabled={authStatus === 'loading'}
					>
						{authStatus === 'loading' ? 'Logging in...' : 'Login'}
					</Button>
					<p className="pt-3 text-center">
						Don't have an account? <Link to="/signup">Sign up</Link>
					</p>
					{authError && (
						<p className="text-danger text-center mt-2">{authError}</p>
					)}
				</Form>
			</Card.Body>
		</Card>
	);
}
