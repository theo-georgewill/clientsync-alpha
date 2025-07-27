// src/pages/Dashboard.jsx
import {React, useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import { Card, Button } from 'react-bootstrap';

export default function Dashboard () {
	const [dealCount, setDealCount] = useState(0);
	const [workflows, setWorkflows] = useState(0);
	const [logs, setLogs] = useState(0);
	const { deals } = useSelector((state) => state.deals);

	useEffect(() => {

		setDealCount(deals.length);
	}, [deals]);

	return (
		<div className="container-full">
			<h2 className="mb-4">Dashboard</h2>

			{/* Stats Row */}
			<div className="row mb-4">
				<div className="col-md-4">
					<Card className="shadow-sm">
						<Card.Body>
							<Card.Title>Deals</Card.Title>
							<Card.Text>{dealCount} HubSpot accounts connected</Card.Text>
							<Button variant="primary" size="sm">Manage</Button>
						</Card.Body>
					</Card>
				</div>

				<div className="col-md-4">
					<Card className="shadow-sm">
						<Card.Body>
							<Card.Title>Workflows</Card.Title>
							<Card.Text>{workflows} active workflows</Card.Text>
							<Button variant="success" size="sm">View</Button>
						</Card.Body>
					</Card>
				</div>

				<div className="col-md-4">
					<Card className="shadow-sm">
						<Card.Body>
							<Card.Title>Sync Logs</Card.Title>
							<Card.Text>{logs} API syncs in the last 24 hours</Card.Text>
							<Button variant="info" size="sm">See Logs</Button>
						</Card.Body>
					</Card>
				</div>
			</div>

			{/* Activity or Placeholder */}
			<Card className="shadow-sm">
				<Card.Body>
					<Card.Title>Recent Activity</Card.Title>
					<Card.Text>No recent activity. Start by connecting a HubSpot account.</Card.Text>
				</Card.Body>
			</Card>
		</div>
	);
};

