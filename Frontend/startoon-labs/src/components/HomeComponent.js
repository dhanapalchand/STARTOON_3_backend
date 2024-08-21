import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { authContext } from '../hooks/authContext';
import { API_URL } from "./env";
import '../css/Table.css'

const HomeComponent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(authContext);

  useEffect(() => {
    const fetchUsers = async () => {
        try {
          const response = await axios.get(`${API_URL}/AllUser`, {
            headers: {
              Authorization: `Bearer ${user.token}` 
            }
          });
          setUsers(response.data);
        } catch (error) {
          setError('Failed to fetch users');
        } finally {
          setLoading(false);
        }
      };
  
      fetchUsers();
  }, [user]);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (user && user.user.email === 'admin@email.com') {
    return (
      <div className="container mt-4">
      <h2>User List</h2>
      <div className="table-responsive"> {/* This class makes the table scrollable on smaller screens */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ backgroundColor: "#1E90FF", color: "white" }}>S.No</th>
              <th style={{ backgroundColor: "#1E90FF", color: "white" }}>Name</th>
              <th style={{ backgroundColor: "#1E90FF", color: "white" }}>Email</th>
              <th style={{ backgroundColor: "#1E90FF", color: "white" }}>Count</th>
              <th style={{ backgroundColor: "#1E90FF", color: "white" }}>Last Login Date</th>
              <th style={{ backgroundColor: "#1E90FF", color: "white" }}>Last Login Time</th>
            </tr>
          </thead>
          <tbody>
  {users.map((user, index) => (
    <tr key={user._id}>
      <td data-label="S.No">{index + 1}</td>
      <td data-label="Name">{user.name}</td>
      <td data-label="Email">{user.email}</td>
      <td data-label="Count">{user.count}</td>
      <td data-label="Last Login Date">{new Date(user.lastLogin).toLocaleDateString()}</td>
      <td data-label="Last Login Time">{new Date(user.lastLogin).toLocaleTimeString()}</td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
    );
  } else if (user) {
    return (
      <div className="container mt-4 d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
            <h3>LOGIN SUCCESSFULLY</h3>
          <h2>My Details</h2>
          <div>
            <p><strong>Name:</strong> {user.user.name}</p>
            <p><strong>Email:</strong> {user.user.email}</p>
            <p><strong>Login Count:</strong> {user.user.count}</p>
            <p><strong>Last Login Date:</strong> {new Date(user.user.lastLogin).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container mt-4">
        <p>No user details available</p>
      </div>
    );
  }
};

export default HomeComponent;
