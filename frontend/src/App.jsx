// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from '@/layouts/Main';
import Auth from '@/layouts/Auth';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import RequireAuth from '@/components/RequireAuth';

export default function App() {
	return (
		<Router>
			<Routes>
				{/* Public Auth Routes */}
				<Route element={<Auth />}>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
				</Route>

				{/* Main layout */}
				<Route 
					element={
						<RequireAuth>
							<Main />
						</RequireAuth>
					}>
					<Route path="/" element={<Dashboard />} />
				</Route>
			</Routes>
		</Router>
	);
}
