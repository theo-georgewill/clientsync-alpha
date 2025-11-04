import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Dropdown, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { fetchPipelines } from "@/store/slices/pipelineSlice";
import { fetchDeals, updateDealStage } from "@/store/slices/dealSlice";
import api from "@/services/api"; // Axios wrapper

const Navbar = () => {
	const dispatch = useDispatch();
	const [syncing, setSyncing] = useState(false);
	// Sync data manually
	const handleSyncNow = async () => {
		try {
			setSyncing(true);
			await api.post("/api/hubspot/sync");
			await dispatch(fetchPipelines());
			await dispatch(fetchDeals());
		} catch (err) {
			console.error("Sync failed", err);
			alert("Failed to sync. Check console or logs.");
		} finally {
			setSyncing(false);
		}
	};
	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 vw-100 d-flex justify-content-between">


			<div className="d-flex ms-auto">
				<Button className="me-2" onClick={handleSyncNow} disabled={syncing} variant="success">
					{syncing ? "Syncing..." : "Sync Now"}
				</Button>

				<Dropdown>
					<Dropdown.Toggle id="dropdown-profile">
						<FontAwesomeIcon icon={faUser} /> Profile
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item as={Link} to="/login">Login</Dropdown.Item>
						<Dropdown.Item as={Link} to="/signup">Sign Up</Dropdown.Item>
						<Dropdown.Item as={Link} to="/logout">Log out</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
		</nav>
	);
};

export default Navbar;
