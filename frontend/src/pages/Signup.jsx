	import { useState, useEffect } from 'react';
	import { Form, Button, Card } from 'react-bootstrap';
	import { useNavigate, Link } from 'react-router-dom';
	import { useDispatch, useSelector } from 'react-redux';
	import { register } from '@/store/slices/authSlice';

	export default function Signup() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	


	const { loading, error, user } = useSelector((state) => state.auth);

	const handleRegister = async (e) => {
		e.preventDefault();
		try {
			await dispatch(register({ name, email, password })).unwrap();
		} catch (err) {
			alert('Signup failed');
		}
	};

	const  handleHubspotAuth = () => {
  		window.location.href = 'http://localhost:8000/api/hubspot/connect';
	}

	useEffect(() => {
		if (user) {
			navigate('/');
		}
	}, [user, navigate]);

	return (
		<Card className="mx-auto mt-5" style={{ maxWidth: '400px' }}>
			<Card.Body>
				<Card.Title>Sign Up</Card.Title>
				<Form onSubmit={handleRegister}>
					<Form.Group className="mb-3">
						<Form.Label>Name</Form.Label>
						<Form.Control type="text" value={name} onChange={e => setName(e.target.value)} required />
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Email</Form.Label>
						<Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Password</Form.Label>
						<Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
					</Form.Group>
					<div className="d-flex justify-content-around">
						<Button type="submit" variant="success" className="btn">Sign Up</Button>
						<Button onClick={handleHubspotAuth}  variant="success" className="btn">Sign in with Hubspot</Button>
					</div>
					<p className="pt-3">Already have an account? <Link to="/login">Log in</Link></p>
					
				</Form>
			</Card.Body>
		</Card>
	);
	}
