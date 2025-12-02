import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['owner', 'manager', 'driver'] },
        { path: '/dashboard/vehicles', label: 'Vehicles', icon: '🚗', roles: ['owner', 'manager', 'driver'] },
        { path: '/dashboard/drivers', label: 'Drivers', icon: '👥', roles: ['owner', 'manager'] },
        { path: '/dashboard/live-tracking', label: 'Live Tracking', icon: '📍', roles: ['owner', 'manager', 'driver'] },
        { path: '/dashboard/trips', label: 'Trips', icon: '🗺️', roles: ['owner', 'manager', 'driver'] },
    ];

    const filteredNavItems = navItems.filter(item =>
        item.roles.includes(user?.role)
    );

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="sidebar-logo-icon">🚗</div>
                        <h2>VehicleTracker</h2>
                    </div>
                </div>

                <div className="sidebar-user">
                    <div className="user-info">
                        <h3>{user?.name}</h3>
                        <p className="badge badge-info" style={{ display: 'inline-block', marginTop: '0.25rem' }}>
                            {user?.role}
                        </p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {filteredNavItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard'}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <span className="nav-item-icon">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%' }}>
                        🚪 Logout
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
