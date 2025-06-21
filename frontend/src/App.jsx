import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '@/store/slices/authSlice';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from '@/layouts/Main';
import NoAuth from '@/layouts/Auth';

import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Logout from '@/pages/Logout';
import Contacts from '@/pages/Contacts';
import Deals from '@/pages/Deals';
import Activities from '@/pages/Activities';
import Settings from '@/pages/Settings';
import Integrations from './pages/Integrations';
import RequireAuth from '@/components/RequireAuth';
import HubSpotCallback from '@/components/HubspotCallbackHandler'; 

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
				console.log(err?.data?.message);
			} finally {
				setCheckingAuth(false);
			}
		};

		checkAuth();
	}, [dispatch]);

	// Show spinner until we know if user is authenticated
	if (checkingAuth || loading) {
		return <div className="text-center mt-5">Authenticating user...</div>;
	}

	return (
		<Router>
			<Routes>
				{/* Public Auth Routes */}
				<Route element={<NoAuth />}>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/logout" element={<Logout />} />
				</Route>

				{/* Main layout */}
				<Route element={<RequireAuth><Main /></RequireAuth>}>
					<Route path="/" element={<Dashboard />} />
					<Route path="/integrations" element={<Integrations />} />
					<Route path="/integrations/hubspot/callback" element={<HubSpotCallback />} /> 
					<Route path="/contacts" element={<Contacts />} />
					<Route path="/deals" element={<Deals />} />
					<Route path="/activities" element={<Activities />} />
					<Route path="/settings" element={<Settings />} />
				</Route>
			</Routes>
		</Router>
	);
}
