import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Sidebar = () => {
	return (
		<div
			className="d-flex flex-column p-3 text-white bg-dark vh-100 shadow"
			style={{ width: '250px'}}
		>
			
			<ul className="nav nav-pills flex-column mb-auto">
				<li className="nav-item">
					<NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-white'}`}>
						<i className="bi bi-speedometer2 me-2"></i> Dashboard
					</NavLink>
				</li>
				<li>
					<NavLink to="/contacts" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-white'}`}>
						<i className="bi bi-people me-2"></i> Contacts
					</NavLink>
				</li>
				<li>
					<NavLink to="/deals" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-white'}`}>
						<i className="bi bi-briefcase me-2"></i> Deals
					</NavLink>
				</li>
				<li>
					<NavLink to="/integrations" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-white'}`}>
						<i className="bi bi-plug me-2"></i> Integrations
					</NavLink>
				</li>
				<li>
					<NavLink to="/activities" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-white'}`}>
						<i className="bi bi-calendar-check me-2"></i> Activities
					</NavLink>
				</li>
				<li>
					<NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-white'}`}>
						<i className="bi bi-gear me-2"></i> Settings
					</NavLink>
				</li>
			</ul>

			<hr />
			<div className="text-center small text-secondary">
				© 2025 Tedtek Solutions
			</div>
		</div>
	);
};

export default Sidebar;
