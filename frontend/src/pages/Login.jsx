import { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/store/slices/authSlice';

export default function Login() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Redux state
	const { loading, error, user } = useSelector((state) => state.auth);

	// Local state
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			//dispatch login thunk
			await dispatch(login({ email, password })).unwrap();
			
		} catch (err) {
			// Error already handled by the slice; optional extra logging
			console.error('Login error:', err);
		}
	};
	useEffect(() => {
		if (user) {
			navigate('/');
		}
	}, [user, navigate]);

	return (
		<Card className="mx-auto mt-5" style={{ maxWidth: '400px' }}>
			<Card.Body>
				<Card.Title className="mb-4">Login</Card.Title>
				<Form onSubmit={handleLogin}>
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
						disabled={loading}
					>
						{loading ? 'Logging in...' : 'Login'}
					</Button>

					<p className="pt-3 text-center">
						Don't have an account? <Link to="/signup">Sign up</Link>
					</p>

					{error && (
						<p className="text-danger text-center mt-2">{error}</p>
					)}
					
				</Form>
			</Card.Body>
		</Card>
	);
}
