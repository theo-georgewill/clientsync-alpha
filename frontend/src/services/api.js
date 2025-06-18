import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, 
});

// Simple cookie parser function
function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

// ✅ Automatically attach the CSRF token from the cookie
api.interceptors.request.use((config) => {
	const xsrfToken = getCookie('XSRF-TOKEN');
	if (xsrfToken) {
		config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
	}
	return config;
});


export default api;
