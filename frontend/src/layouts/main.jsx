// src/layouts/MainLayout.jsx
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <>
    <div className="d-flex flex-column vh-100">
    	<Navbar />
    	<div className="d-flex flex-grow-1 overflow-hidden">
			<Sidebar />
			<div className="flex-grow-1 bg-light overflow-auto" style={{ padding: '1.5rem' }}>
				<Outlet />
			</div>
      	</div>
    </div>
    </>
  );
}
