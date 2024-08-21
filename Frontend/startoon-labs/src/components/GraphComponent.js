import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { authContext } from '../hooks/authContext';

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
);

const Stats = () => {
    const [totalCount, setTotalCount] = useState(0);
    const [allUserCount, setAllUserCount] = useState(0);
    const [monthlyData, setMonthlyData] = useState([]);
    const [dateWiseData, setDateWiseData] = useState([]);
    const [isYearWise, setIsYearWise] = useState(true);
    const { user } = useContext(authContext);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                if (user.user.email === 'admin@email.com') {
                    const userResponse = await axios.get('http://localhost:8000/AllUser');
                    const users = userResponse.data;
                    console.log('Users:', users);
                    const totalCount = users.length;
                    setTotalCount(totalCount);
                    const allUserCount = users.reduce((sum, user) => sum + (user.count || 0), 0);
                    setAllUserCount(allUserCount);
                    console.log('Users:', allUserCount);
                    const response = await axios.get('http://localhost:8000/api/stats');
                    const { monthlyData, dateWiseData } = response.data;
                    setMonthlyData(monthlyData);
                    setDateWiseData(dateWiseData);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };

        fetchStats();
    }, []);


    const chartData = isYearWise
        ? {
            labels: monthlyData.map(data => `Month ${data.month}`),
            datasets: [
                {
                    label: 'User Logins',
                    data: monthlyData.map(data => data.count),
                    fill: false,
                    borderColor: '#4caf50',
                    tension: 0.1
                }
            ]
        }
        : {
            labels: dateWiseData.map(data => data.date),
            datasets: [
                {
                    label: 'User Logins',
                    data: dateWiseData.map(data => data.count),
                    fill: false,
                    borderColor: '#4caf50',
                    tension: 0.1
                }
            ]
        };

    const toggleView = () => {
        setIsYearWise(!isYearWise);
    };

    if (!user || user.user.email !== 'admin@email.com') {
        return (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> <p>You do not have permission to view this page. you want login in admin id!!!</p></div>);
    }

    return (
        <div className="container mt-4">
            <div className="row mb-4">

                <div className="col-md-6 mb-3">
                    <div className="box p-3 bg-light border rounded">
                        <p>{totalCount}</p>
                        <h4>Total User Count</h4>
                    </div>
                </div>

                <div className="col-md-6 mb-3">
                    <div className="box p-3 bg-light border rounded">
                        <p>{allUserCount}</p>
                        <h4>Total Click Count <span>(total user no.of login count)</span></h4>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content align-items-center">
                <h4>User Logins Per {isYearWise ? 'Month' : 'Date'}</h4>
                <button
                    className="btn btn-primary mx-2"
                    onClick={toggleView}
                >
                    {isYearWise ? 'Show Date-Wise' : 'Show Year-Wise'}
                </button>
            </div>
            <div style={{ width: '100%', height: '400px' }}>
                <Line data={chartData} />
            </div>
        </div>
    );
};

export default Stats;
