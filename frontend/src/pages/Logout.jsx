import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const performLogout = async () => {
			try {
				await dispatch(logout()).unwrap();
				navigate('/login');
			} catch (err) {
				console.error('Logout error:', err);
				navigate('/login'); // fallback redirect
			}
		};

		performLogout();
	}, [dispatch, navigate]);

	return <div>Logging out...</div>;
}
