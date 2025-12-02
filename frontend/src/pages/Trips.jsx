import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tripAPI, vehicleAPI } from '../services/api';
import './CrudPage.css';

const Trips = () => {
    const { user, isDriver, isOwner } = useAuth();
    const [trips, setTrips] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        vehicle: '',
        startLat: '',
        startLng: '',
        startAddress: '',
        purpose: '',
        notes: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTrips();
        loadVehicles();
    }, []);

    const loadTrips = async () => {
        try {
            const response = await tripAPI.getAll();
            setTrips(response.data.data);
        } catch (error) {
            console.error('Error loading trips:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadVehicles = async () => {
        try {
            const response = await vehicleAPI.getAll();
            if (isDriver) {
                // Filter only vehicles assigned to this driver
                setVehicles(response.data.data.filter(v => v.driver?._id === user.id));
            } else {
                setVehicles(response.data.data);
            }
        } catch (error) {
            console.error('Error loading vehicles:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const tripData = {
                vehicle: formData.vehicle,
                startLocation: {
                    type: 'Point',
                    coordinates: [parseFloat(formData.startLng), parseFloat(formData.startLat)],
                    address: formData.startAddress
                },
                purpose: formData.purpose,
                notes: formData.notes
            };

            await tripAPI.create(tripData);
            alert('Trip started successfully!');
            loadTrips();
            resetForm();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to start trip');
        }
    };

    const handleComplete = async (tripId) => {
        if (!window.confirm('Are you sure you want to complete this trip?')) return;

        try {
            // Get current location
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const endData = {
                        endLocation: {
                            type: 'Point',
                            coordinates: [position.coords.longitude, position.coords.latitude]
                        }
                    };

                    await tripAPI.complete(tripId, endData);
                    alert('Trip completed successfully!');
                    loadTrips();
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get current location. Trip not completed.');
                }
            );
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to complete trip');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this trip?')) return;

        try {
            await tripAPI.delete(id);
            alert('Trip deleted successfully!');
            loadTrips();
        } catch (error) {
            alert(error.response?.data?.message || 'Delete failed');
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData({
                        ...formData,
                        startLat: position.coords.latitude.toFixed(6),
                        startLng: position.coords.longitude.toFixed(6),
                        startAddress: `Location: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
                    });
                },
                (error) => {
                    alert('Unable to get your location');
                }
            );
        }
    };

    const resetForm = () => {
        setFormData({
            vehicle: '',
            startLat: '',
            startLng: '',
            startAddress: '',
            purpose: '',
            notes: ''
        });
        setShowModal(false);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="crud-page">
            <div className="page-header">
                <div>
                    <h1>🗺️ Trips</h1>
                    <p>Track and manage vehicle trips</p>
                </div>
                {(isDriver || isOwner) && (
                    <button onClick={() => setShowModal(true)} className="btn btn-primary">
                        ➕ Start Trip
                    </button>
                )}
            </div>

            <div className="crud-content">
                <div className="data-table">
                    {trips.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Vehicle</th>
                                    <th>Driver</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Purpose</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trips.map(trip => (
                                    <tr key={trip._id}>
                                        <td><strong>{trip.vehicle?.vehicleNumber}</strong></td>
                                        <td>{trip.driver?.name}</td>
                                        <td>{new Date(trip.startTime).toLocaleString()}</td>
                                        <td>{trip.endTime ? new Date(trip.endTime).toLocaleString() : '-'}</td>
                                        <td>{trip.purpose || '-'}</td>
                                        <td>
                                            <span className={`badge badge-${trip.status === 'ongoing' ? 'info' :
                                                    trip.status === 'completed' ? 'success' : 'warning'
                                                }`}>
                                                {trip.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {trip.status === 'ongoing' && (trip.driver._id === user.id || isOwner) && (
                                                    <button
                                                        onClick={() => handleComplete(trip._id)}
                                                        className="btn-icon"
                                                        title="Complete Trip"
                                                        style={{ color: 'var(--success)' }}
                                                    >
                                                        ✅
                                                    </button>
                                                )}
                                                {isOwner && (
                                                    <button onClick={() => handleDelete(trip._id)} className="btn-icon btn-icon-danger" title="Delete">
                                                        🗑️
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-data">No trips found. Start your first trip!</p>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={resetForm}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Start New Trip</h2>
                            <button onClick={resetForm} className="modal-close">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label className="label">Select Vehicle *</label>
                                <select
                                    className="input"
                                    value={formData.vehicle}
                                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                                    required
                                >
                                    <option value="">Choose a vehicle</option>
                                    {vehicles.map(vehicle => (
                                        <option key={vehicle._id} value={vehicle._id}>
                                            {vehicle.vehicleNumber} - {vehicle.model}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="label">Starting Location</label>
                                <button
                                    type="button"
                                    onClick={getCurrentLocation}
                                    className="btn btn-secondary"
                                    style={{ marginBottom: '0.5rem' }}
                                >
                                    📍 Use Current Location
                                </button>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label">Latitude *</label>
                                    <input
                                        type="number"
                                        step="any"
                                        className="input"
                                        value={formData.startLat}
                                        onChange={(e) => setFormData({ ...formData, startLat: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="label">Longitude *</label>
                                    <input
                                        type="number"
                                        step="any"
                                        className="input"
                                        value={formData.startLng}
                                        onChange={(e) => setFormData({ ...formData, startLng: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="label">Address/Location Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.startAddress}
                                    onChange={(e) => setFormData({ ...formData, startAddress: e.target.value })}
                                    placeholder="e.g., Main Office, Warehouse A"
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Purpose</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.purpose}
                                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                    placeholder="e.g., Delivery, Customer Visit"
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Notes</label>
                                <textarea
                                    className="input"
                                    rows="3"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Additional notes about this trip..."
                                ></textarea>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={resetForm} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Start Trip
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Trips;
