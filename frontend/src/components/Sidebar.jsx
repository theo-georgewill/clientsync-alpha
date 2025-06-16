// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
	return (
		<div className="bg-light border-end vh-100 p-3" style={{ width: '250px' }}>
			<h5>Menu</h5>
			<ul className="nav flex-column">
				<li className="nav-item">
					<Link className="nav-link" to="/">Dashboard</Link>
				</li>
				<li className="nav-item">
					<Link className="nav-link" to="/connect">Connect HubSpot</Link>
				</li>
			</ul>
		</div>
	);
};

export default Sidebar;
