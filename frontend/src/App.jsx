import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '@/store/slices/authSlice';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from '@/layouts/Main';
import Auth from '@/layouts/Auth';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Logout from '@/pages/Logout';
import RequireAuth from '@/components/RequireAuth';

export default function App() {
	const dispatch = useDispatch();
	const { loading, user } = useSelector((state) => state.auth);
	const [checkingAuth, setCheckingAuth] = useState(true);

	useEffect(() => {
		// Only run on initial mount
		const checkAuth = async () => {
			try {
				await dispatch(fetchUser()).unwrap();
			} catch (err) {
				// Optionally log error
			} finally {
				setCheckingAuth(false);
			}
		};

		checkAuth();
	}, [dispatch]);

	// Show spinner until we know if user is authenticated
	if (checkingAuth || loading) {
		return <div className="text-center mt-5">Loading...</div>;
	}

	return (
		<Router>
			<Routes>
				{/* Public Auth Routes */}
				<Route element={<Auth />}>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/logout" element={<Logout />} />
				</Route>

				{/* Main layout */}
				<Route element={<RequireAuth><Main /></RequireAuth>}>
					<Route path="/" element={<Dashboard />} />
				</Route>
			</Routes>
		</Router>
	);
}
