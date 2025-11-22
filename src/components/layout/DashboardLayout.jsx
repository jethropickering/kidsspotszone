import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-warm-50">
      <div className="section-container py-8">
        <Outlet />
      </div>
    </div>
  );
}
