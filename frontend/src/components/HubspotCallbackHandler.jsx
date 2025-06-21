import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

export default function HubSpotCallback() {
	const navigate = useNavigate();

	useEffect(() => {
		const code = new URLSearchParams(window.location.search).get('code');
		if (!code) return;

		api.post('/api/hubspot/callback', { code })
			.then(() => navigate('/integrations'))
			.catch(err => {
				console.error(err);
				alert('Failed to connect HubSpot');
			});
	}, []);

	return <p>Connecting to HubSpot...</p>;
}
