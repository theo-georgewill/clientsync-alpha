// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
	return (
		<div className="bg-light border-end vh-100 vh-auto p-3" style={{ width: '250px', minHeight: 'auto' }}>
			<h5>Menu</h5>
			<ul className="nav flex-column">
				<li className="nav-item">
					<Link className="nav-link" to="/">Dashboard</Link>
				</li>
				<li className="nav-item">
					<Link className="nav-link" to="/contacts">Contacts</Link>
				</li>
				<li className="nav-item">
					<Link className="nav-link" to="/deals">Deals</Link>
				</li>
				<li className="nav-item">
					<Link className="nav-link" to="/integrations">Integrations</Link>
				</li>
				<li className="nav-item">
					<Link className="nav-link" to="/activities">Activities</Link>
				</li>
				<li className="nav-item">
					<Link className="nav-link" to="/settings">Settings</Link>
				</li>
			</ul>
		</div>
	);
};

export default Sidebar;
