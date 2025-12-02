import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useAuth } from '../context/AuthContext';
import { vehicleAPI } from '../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './LiveTracking.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map center
function ChangeMapView({ center }) {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
}

const LiveTracking = () => {
    const { user, isDriver } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [tracking, setTracking] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [watchId, setWatchId] = useState(null);
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default: India

    useEffect(() => {
        loadVehicles();
    }, []);

    useEffect(() => {
        // Update map center when current location changes
        if (currentLocation) {
            setMapCenter([currentLocation.latitude, currentLocation.longitude]);
        }
    }, [currentLocation]);

    const loadVehicles = async () => {
        try {
            const response = await vehicleAPI.getAll();
            setVehicles(response.data.data);

            // If driver, auto-select their vehicle
            if (isDriver) {
                const myVehicle = response.data.data.find(v => v.driver?._id === user.id);
                if (myVehicle) {
                    setSelectedVehicle(myVehicle);
                    // Set initial map center to vehicle's current location if available
                    if (myVehicle.currentLocation?.coordinates) {
                        const [lng, lat] = myVehicle.currentLocation.coordinates;
                        if (lat && lng) {
                            setMapCenter([lat, lng]);
                        }
                    }
                }
            } else if (response.data.data.length > 0) {
                setSelectedVehicle(response.data.data[0]);
                const firstVehicle = response.data.data[0];
                if (firstVehicle.currentLocation?.coordinates) {
                    const [lng, lat] = firstVehicle.currentLocation.coordinates;
                    if (lat && lng) {
                        setMapCenter([lat, lng]);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading vehicles:', error);
        }
    };

    const startTracking = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        if (!selectedVehicle) {
            alert('Please select a vehicle first');
            return;
        }

        const id = navigator.geolocation.watchPosition(
            (position) => {
                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    speed: position.coords.speed || 0
                };

                setCurrentLocation(location);
                updateVehicleLocation(location);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to get your location. Please enable location services.');
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

        setWatchId(id);
        setTracking(true);
    };

    const stopTracking = () => {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
        }
        setTracking(false);
    };

    const updateVehicleLocation = async (location) => {
        if (!selectedVehicle) return;

        try {
            await vehicleAPI.updateLocation(selectedVehicle._id, location);
            // Reload vehicles to get updated data
            await loadVehicles();
        } catch (error) {
            console.error('Error updating location:', error);
        }
    };

    const formatLastUpdated = (date) => {
        if (!date) return 'Never';
        const now = new Date();
        const updated = new Date(date);
        const diff = Math.floor((now - updated) / 1000); // seconds

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        return `${Math.floor(diff / 86400)} days ago`;
    };

    return (
        <div className="live-tracking-page">
            <div className="page-header">
                <h1>📍 Live Tracking</h1>
                <p>Monitor vehicle locations in real-time</p>
            </div>

            {/* Tracking Controls */}
            <div className="tracking-controls">
                <div style={{ flex: 1 }}>
                    <label className="label">Select Vehicle</label>
                    <select
                        className="input"
                        value={selectedVehicle?._id || ''}
                        onChange={(e) => {
                            const vehicle = vehicles.find(v => v._id === e.target.value);
                            setSelectedVehicle(vehicle);
                            if (vehicle?.currentLocation?.coordinates) {
                                const [lng, lat] = vehicle.currentLocation.coordinates;
                                if (lat && lng) {
                                    setMapCenter([lat, lng]);
                                }
                            }
                        }}
                        disabled={isDriver}
                    >
                        <option value="">Select a vehicle</option>
                        {vehicles.map(vehicle => (
                            <option key={vehicle._id} value={vehicle._id}>
                                {vehicle.vehicleNumber} - {vehicle.model}
                            </option>
                        ))}
                    </select>
                </div>

                {isDriver && selectedVehicle && (
                    <div>
                        <label className="label" style={{ visibility: 'hidden' }}>Action</label>
                        {!tracking ? (
                            <button onClick={startTracking} className="btn btn-primary">
                                ▶️ Start Tracking
                            </button>
                        ) : (
                            <button onClick={stopTracking} className="btn btn-danger">
                                ⏸️ Stop Tracking
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Tracking Status */}
            {tracking && (
                <div className="tracking-status">
                    <div className="status-indicator">
                        📡
                    </div>
                    <div className="status-info">
                        <h3>Live Connection Active</h3>
                        <p>Tracking real-time location for {selectedVehicle?.vehicleNumber}</p>
                    </div>
                </div>
            )}

            {/* Location Info Cards */}
            {selectedVehicle && selectedVehicle.currentLocation && (
                <div className="location-cards">
                    <div className="location-card">
                        <div className="location-icon">📍</div>
                        <div className="location-details">
                            <h4>Current Location</h4>
                            <p>
                                {selectedVehicle.currentLocation.coordinates[1]?.toFixed(6)},
                                {selectedVehicle.currentLocation.coordinates[0]?.toFixed(6)}
                            </p>
                        </div>
                    </div>

                    <div className="location-card">
                        <div className="location-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                            🚀
                        </div>
                        <div className="location-details">
                            <h4>Current Speed</h4>
                            <p>{selectedVehicle.currentLocation.speed || 0} km/h</p>
                        </div>
                    </div>

                    <div className="location-card">
                        <div className="location-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                            ⏰
                        </div>
                        <div className="location-details">
                            <h4>Last Update</h4>
                            <p>{formatLastUpdated(selectedVehicle.currentLocation.lastUpdated)}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Map */}
            <div className="map-container">
                <div className="map-header">
                    <h2>
                        🗺️ Live Map View
                    </h2>
                    {tracking && (
                        <div className="online-badge">
                            <span className="online-dot"></span>
                            Online
                        </div>
                    )}
                </div>

                <div className="map-wrapper">
                    {selectedVehicle ? (
                        <MapContainer
                            center={mapCenter}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <ChangeMapView center={mapCenter} />
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {vehicles.map(vehicle => {
                                if (!vehicle.currentLocation?.coordinates) return null;
                                const [lng, lat] = vehicle.currentLocation.coordinates;
                                if (!lat || !lng || lat === 0 || lng === 0) return null;

                                return (
                                    <Marker key={vehicle._id} position={[lat, lng]}>
                                        <Popup>
                                            <div style={{ color: '#000' }}>
                                                <strong>{vehicle.vehicleNumber}</strong><br />
                                                Model: {vehicle.model}<br />
                                                Driver: {vehicle.driver?.name || 'Unassigned'}<br />
                                                Speed: {vehicle.currentLocation.speed || 0} km/h<br />
                                                <small>Updated: {formatLastUpdated(vehicle.currentLocation.lastUpdated)}</small>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MapContainer>
                    ) : (
                        <div className="no-location">
                            <div className="no-location-icon">🗺️</div>
                            <h3>No Vehicle Selected</h3>
                            <p>Please select a vehicle to view its location on the map</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveTracking;
