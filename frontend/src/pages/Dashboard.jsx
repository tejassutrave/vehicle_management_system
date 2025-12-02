import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vehicleAPI, tripAPI, driverAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalVehicles: 0,
        activeVehicles: 0,
        totalDrivers: 0,
        activeTrips: 0,
        completedTrips: 0
    });
    const [recentVehicles, setRecentVehicles] = useState([]);
    const [recentTrips, setRecentTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [vehiclesRes, tripsRes] = await Promise.all([
                vehicleAPI.getAll(),
                tripAPI.getAll()
            ]);

            const vehicles = vehiclesRes.data.data;
            const trips = tripsRes.data.data;

            setRecentVehicles(vehicles.slice(0, 5));
            setRecentTrips(trips.slice(0, 5));

            setStats({
                totalVehicles: vehicles.length,
                activeVehicles: vehicles.filter(v => v.status === 'active').length,
                totalDrivers: user.role !== 'driver' ? await getDriverCount() : 0,
                activeTrips: trips.filter(t => t.status === 'ongoing').length,
                completedTrips: trips.filter(t => t.status === 'completed').length
            });
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDriverCount = async () => {
        try {
            const response = await driverAPI.getAll();
            return response.data.count;
        } catch (error) {
            return 0;
        }
    };

    const statCards = [
        { label: 'Total Vehicles', value: stats.totalVehicles, icon: '🚗', color: 'var(--purple-gradient)' },
        { label: 'Active Vehicles', value: stats.activeVehicles, icon: '✅', color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        { label: 'Active Trips', value: stats.activeTrips, icon: '🗺️', color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
        { label: 'Completed Trips', value: stats.completedTrips, icon: '✔️', color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
    ];

    if (user.role !== 'driver') {
        statCards.splice(2, 0, {
            label: 'Total Drivers',
            value: stats.totalDrivers,
            icon: '👥',
            color: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
        });
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-home">
            <div className="page-header">
                <h1>📊 Dashboard</h1>
                <p>Welcome back, {user?.name}!</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-icon" style={{ background: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <p className="stat-label">{stat.label}</p>
                            <h3 className="stat-value">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Data */}
            <div className="dashboard-content">
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Recent Vehicles</h2>
                        <Link to="/dashboard/vehicles" className="btn btn-secondary">View All</Link>
                    </div>
                    <div className="data-table">
                        {recentVehicles.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Vehicle Number</th>
                                        <th>Model</th>
                                        <th>Type</th>
                                        <th>Driver</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentVehicles.map(vehicle => (
                                        <tr key={vehicle._id}>
                                            <td><strong>{vehicle.vehicleNumber}</strong></td>
                                            <td>{vehicle.model}</td>
                                            <td><span className="badge badge-info">{vehicle.type}</span></td>
                                            <td>{vehicle.driver?.name || 'Unassigned'}</td>
                                            <td>
                                                <span className={`badge badge-${vehicle.status === 'active' ? 'success' : 'warning'}`}>
                                                    {vehicle.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-data">No vehicles found</p>
                        )}
                    </div>
                </div>

                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Recent Trips</h2>
                        <Link to="/dashboard/trips" className="btn btn-secondary">View All</Link>
                    </div>
                    <div className="data-table">
                        {recentTrips.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Vehicle</th>
                                        <th>Driver</th>
                                        <th>Start Time</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTrips.map(trip => (
                                        <tr key={trip._id}>
                                            <td><strong>{trip.vehicle?.vehicleNumber}</strong></td>
                                            <td>{trip.driver?.name}</td>
                                            <td>{new Date(trip.startTime).toLocaleString()}</td>
                                            <td>
                                                <span className={`badge badge-${trip.status === 'ongoing' ? 'info' :
                                                        trip.status === 'completed' ? 'success' : 'warning'
                                                    }`}>
                                                    {trip.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-data">No trips found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
