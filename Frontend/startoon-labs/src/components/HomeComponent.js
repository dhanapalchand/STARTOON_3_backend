import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { authContext } from '../hooks/authContext';
import { API_URL } from "./env";

const UserTable = () => {
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
        <table className="table table-bordered">
          <thead>
            <tr >
              <th style={{ backgroundColor: "	#1E90FF", color: "white" }}>S.No</th>
              <th style={{ backgroundColor: "	#1E90FF", color: "white" }}>Name</th>
              <th style={{ backgroundColor: "	#1E90FF", color: "white" }}>Email</th>
              <th style={{ backgroundColor: "	#1E90FF", color: "white" }}>Count</th>
              <th style={{ backgroundColor: "	#1E90FF", color: "white" }}>Last Login Date</th>
              <th style={{ backgroundColor: "#1E90FF", color: "white" }}>Last Login Time</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.count}</td>
                <td>{new Date(user.lastLogin).toLocaleDateString()}</td>
                <td>{new Date(user.lastLogin).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default UserTable;
