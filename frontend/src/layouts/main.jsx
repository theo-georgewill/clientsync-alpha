// src/layouts/MainLayout.jsx
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
	return (
		<>
			<Navbar />
			<div className="d-flex">
				<Sidebar />
				<div className="flex-grow container">
					<main className="py-4 ">
						<Outlet />
					</main>
				</div>
			</div>
		</>
	);
}
