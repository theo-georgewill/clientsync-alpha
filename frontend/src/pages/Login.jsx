import { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '@/features/auth/authSlice';
import axios from 'axios';

export default function Login() {
	const dispatch = useDispatch();
	const authStatus = useSelector(state => state.auth.status);
	const authError = useSelector(state => state.auth.error);
	
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		dispatch(loginStart());

		try {
			await axios.post('/api/login', { email, password });
      		dispatch(loginSuccess({ user: response.data.user, token: response.data.token }));

			navigate('/dashboard'); // adjust based on your app
		} catch (error) {

      		dispatch(loginFailure(error.response?.data?.message || error.message));
			alert('Login failed');
		}
	};

	return (
		<Card className="mx-auto mt-5" style={{ maxWidth: '400px' }}>
			<Card.Body>
				<Card.Title>Login</Card.Title>
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label>Email</Form.Label>
						<Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Password</Form.Label>
						<Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
					</Form.Group>
					<Button type="submit" variant="primary" className="w-100" disabled={authStatus === 'loading'}>Login</Button>
					<p className="pt-3">Don't have an account? <Link to="/signup">Sign up</Link></p>
					{authError && <p>{authError}</p>}
				</Form>
			</Card.Body>
		</Card>
	);
}
