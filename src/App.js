import React, { useEffect, useState } from 'react';
import { fetchCameras, updateCameraStatus } from './Helper/api';
import './App.css';

const App = () => {
  const [cameras, setCameras] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch data from API
  useEffect(() => {
    const getCameras = async () => {
      const data = await fetchCameras();
      setCameras(data);
    };
    getCameras();
  }, []);

  // Toggle camera status
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    await updateCameraStatus(id, newStatus);
    setCameras((prev) =>
      prev.map((cam) =>
        cam.id === id ? { ...cam, status: newStatus } : cam
      )
    );
  };

  // Delete camera
  const handleDelete = (id) => {
    setCameras(cameras.filter((cam) => cam.id !== id));
  };

  // Filter cameras by search term, location, and status
  const filteredCameras = cameras
    .filter((camera) =>
      camera.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((camera) =>
      locationFilter ? camera.location === locationFilter : true
    )
    .filter((camera) =>
      statusFilter ? camera.status === statusFilter : true
    );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCameras.slice(indexOfFirstItem, indexOfLastItem);
 
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredCameras.length / itemsPerPage)));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Unique locations and statuses for the dropdown
  const locations = [...new Set(cameras.map(cam => cam.location))];
  const statuses = [...new Set(cameras.map(cam => cam.status))];

  return (
    <div className="container">
      <header className="header">
      <div className='inHeader'>
        <h2>Cameras</h2>
        <span>Manage your cameras here</span>
        </div>
        <input
          type="text"
          placeholder="Search cameras"
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>

      <div className="filters">
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">Location</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">Status</option>
          {statuses.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <table className="camera-table">
        <thead>
          <tr>
            <th></th> {/* Checkbox column */}
            <th>Name</th>
            <th>Health</th>
            <th>Location</th>
            <th>Recorder</th>
            <th>Tasks</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((camera) => (
            <tr key={camera.id}>
              <td><input type="checkbox" /></td> {/* Placeholder checkbox */}
              {
                camera.hasWarning ? <td>{camera.hasWarning && `${camera.name}⚠️`}</td> :
                <td>{camera.name}</td>
              }
              <td>
                <div className="health-icons">
                  <span className={`cloud ${camera.health.cloud}`}>{camera.health.cloud}</span>
                  <span className={`device ${camera.health.device}`}>{camera.health.device}</span>
                </div>
              </td>
              <td>{camera.location}</td>
              <td>{camera.recorder || 'N/A'}</td>
              <td>{`${camera.tasks} Tasks`}</td>
              <td>
                <button
                  className={`status-btn ${camera.status.toLowerCase()}`}
                  onClick={() => toggleStatus(camera.id, camera.status)}
                >
                  {camera.status}
                </button>
              </td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(camera.id)}>
                🚫
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button className="pagination-btn" onClick={prevPage} disabled={currentPage === 1}>
          Prev
        </button>
        <span>{`${indexOfFirstItem + 1}-${indexOfLastItem} of ${filteredCameras.length}`}</span>
        <button className="pagination-btn" onClick={nextPage} disabled={currentPage === Math.ceil(filteredCameras.length / itemsPerPage)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default App;