import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { vehicleAPI, driverAPI } from '../services/api';
import './CrudPage.css';

const Vehicles = () => {
    const { user, isOwner, isManager } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [formData, setFormData] = useState({
        vehicleNumber: '',
        model: '',
        type: 'car',
        year: new Date().getFullYear(),
        color: '',
        driver: '',
        status: 'active'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVehicles();
        loadDrivers();
    }, []);

    const loadVehicles = async () => {
        try {
            const response = await vehicleAPI.getAll();
            setVehicles(response.data.data);
        } catch (error) {
            console.error('Error loading vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadDrivers = async () => {
        if (isOwner || isManager) {
            try {
                const response = await driverAPI.getAll();
                setDrivers(response.data.data);
            } catch (error) {
                console.error('Error loading drivers:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingVehicle) {
                await vehicleAPI.update(editingVehicle._id, formData);
                alert('Vehicle updated successfully!');
            } else {
                await vehicleAPI.create(formData);
                alert('Vehicle added successfully!');
            }
            loadVehicles();
            resetForm();
        } catch (error) {
            alert(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (vehicle) => {
        setEditingVehicle(vehicle);
        setFormData({
            vehicleNumber: vehicle.vehicleNumber,
            model: vehicle.model,
            type: vehicle.type,
            year: vehicle.year || new Date().getFullYear(),
            color: vehicle.color || '',
            driver: vehicle.driver?._id || '',
            status: vehicle.status
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this vehicle?')) return;

        try {
            await vehicleAPI.delete(id);
            alert('Vehicle deleted successfully!');
            loadVehicles();
        } catch (error) {
            alert(error.response?.data?.message || 'Delete failed');
        }
    };

    const resetForm = () => {
        setFormData({
            vehicleNumber: '',
            model: '',
            type: 'car',
            year: new Date().getFullYear(),
            color: '',
            driver: '',
            status: 'active'
        });
        setEditingVehicle(null);
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
                    <h1>🚗 Vehicles</h1>
                    <p>Manage your fleet vehicles</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    ➕ Add Vehicle
                </button>
            </div>

            <div className="crud-content">
                <div className="data-table">
                    {vehicles.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Vehicle Number</th>
                                    <th>Model</th>
                                    <th>Type</th>
                                    <th>Year</th>
                                    <th>Color</th>
                                    <th>Driver</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.map(vehicle => (
                                    <tr key={vehicle._id}>
                                        <td><strong>{vehicle.vehicleNumber}</strong></td>
                                        <td>{vehicle.model}</td>
                                        <td><span className="badge badge-info">{vehicle.type}</span></td>
                                        <td>{vehicle.year}</td>
                                        <td>{vehicle.color || '-'}</td>
                                        <td>{vehicle.driver?.name || 'Unassigned'}</td>
                                        <td>
                                            <span className={`badge badge-${vehicle.status === 'active' ? 'success' : 'warning'}`}>
                                                {vehicle.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {(isOwner || isManager) && (
                                                    <button onClick={() => handleEdit(vehicle)} className="btn-icon" title="Edit">
                                                        ✏️
                                                    </button>
                                                )}
                                                {isOwner && (
                                                    <button onClick={() => handleDelete(vehicle._id)} className="btn-icon btn-icon-danger" title="Delete">
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
                        <p className="no-data">No vehicles found. Add your first vehicle!</p>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={resetForm}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
                            <button onClick={resetForm} className="modal-close">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label">Vehicle Number *</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.vehicleNumber}
                                        onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="label">Model *</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label">Type *</label>
                                    <select
                                        className="input"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        required
                                    >
                                        <option value="car">Car</option>
                                        <option value="truck">Truck</option>
                                        <option value="van">Van</option>
                                        <option value="motorcycle">Motorcycle</option>
                                        <option value="bus">Bus</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="label">Year</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label">Color</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="label">Assign Driver</label>
                                    <select
                                        className="input"
                                        value={formData.driver}
                                        onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                                    >
                                        <option value="">Unassigned</option>
                                        {drivers.map(driver => (
                                            <option key={driver._id} value={driver._id}>{driver.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="label">Status</label>
                                <select
                                    className="input"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={resetForm} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vehicles;
