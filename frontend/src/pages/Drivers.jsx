import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { driverAPI } from '../services/api';
import './CrudPage.css';

const Drivers = () => {
    const { isOwner } = useAuth();
    const [drivers, setDrivers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDrivers();
    }, []);

    const loadDrivers = async () => {
        try {
            const response = await driverAPI.getAll();
            setDrivers(response.data.data);
        } catch (error) {
            console.error('Error loading drivers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingDriver) {
                await driverAPI.update(editingDriver._id, {
                    name: formData.name,
                    email: formData.email
                });
                alert('Driver updated successfully!');
            } else {
                if (!formData.password || formData.password.length < 6) {
                    alert('Password must be at least 6 characters');
                    return;
                }
                await driverAPI.create(formData);
                alert('Driver added successfully!');
            }
            loadDrivers();
            resetForm();
        } catch (error) {
            alert(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (driver) => {
        setEditingDriver(driver);
        setFormData({
            name: driver.name,
            email: driver.email,
            password: ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this driver?')) return;

        try {
            await driverAPI.delete(id);
            alert('Driver deleted successfully!');
            loadDrivers();
        } catch (error) {
            alert(error.response?.data?.message || 'Delete failed');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: ''
        });
        setEditingDriver(null);
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
                    <h1>👥 Drivers</h1>
                    <p>Manage driver accounts</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    ➕ Add Driver
                </button>
            </div>

            <div className="crud-content">
                <div className="data-table">
                    {drivers.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Created Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {drivers.map(driver => (
                                    <tr key={driver._id}>
                                        <td><strong>{driver.name}</strong></td>
                                        <td>{driver.email}</td>
                                        <td><span className="badge badge-info">{driver.role}</span></td>
                                        <td>{new Date(driver.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="action-buttons">
                                                {isOwner && (
                                                    <>
                                                        <button onClick={() => handleEdit(driver)} className="btn-icon" title="Edit">
                                                            ✏️
                                                        </button>
                                                        <button onClick={() => handleDelete(driver._id)} className="btn-icon btn-icon-danger" title="Delete">
                                                            🗑️
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-data">No drivers found. Add your first driver!</p>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={resetForm}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingDriver ? 'Edit Driver' : 'Add New Driver'}</h2>
                            <button onClick={resetForm} className="modal-close">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label className="label">Full Name *</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Email Address *</label>
                                <input
                                    type="email"
                                    className="input"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            {!editingDriver && (
                                <div className="form-group">
                                    <label className="label">Password *</label>
                                    <input
                                        type="password"
                                        className="input"
                                        placeholder="Minimum 6 characters"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            )}

                            <div className="modal-actions">
                                <button type="button" onClick={resetForm} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingDriver ? 'Update Driver' : 'Add Driver'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Drivers;
