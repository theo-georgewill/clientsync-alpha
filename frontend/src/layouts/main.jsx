// src/layouts/MainLayout.jsx
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
	return (
		<>
			<Navbar />
			<div className="w-100 row">
				<div className="col-md-2">
					<Sidebar />	
				</div>				
				<main className="flex-grow col-md-10 container">
					<Outlet />
				</main>
			</div>
		</>
	);
}
