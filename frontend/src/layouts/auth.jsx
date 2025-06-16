// src/layouts/AuthLayout.jsx
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 vw-100 bg-light">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <Outlet />
      </div>
    </div>
  );
}
