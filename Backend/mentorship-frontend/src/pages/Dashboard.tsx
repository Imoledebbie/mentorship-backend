import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '../config';

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

interface Session {
  _id: string;
  date: string;
  time: string;
  topic: string;
  status: string;
  notes?: string;
  mentor?: {
    name: string;
    email: string;
  };
  mentee?: {
    name: string;
    email: string;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // ✅ Decode token and check login
  useEffect(() => {
    if (!token) {
      alert('You must be logged in to view this page.');
      navigate('/login', { replace: true });
    } else {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login', {
            replace: true,
            state: { message: 'Session expired. Please log in again.' },
          });
        } else {
          setUser(decoded);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        navigate('/login', {
          replace: true,
          state: { message: 'Invalid token. Please log in again.' },
        });
      }
    }
  }, [token, navigate]);

  // ✅ Fetch sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        if (!token) return;
        const res = await fetch(`${API_BASE_URL}/api/sessions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setSessions(data.sessions);
        setLoadingSessions(false);
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
        setLoadingSessions(false);
      }
    };

    fetchSessions();
  }, [token]);

  // ✅ Logout function
  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      localStorage.removeItem('token');
      navigate('/login', {
        replace: true,
        state: { message: 'You have been logged out.' },
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to your Dashboard!</h1>

      {user ? (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>User ID:</strong> {user.id}</p>

          <button
            onClick={handleLogout}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: 'crimson',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>

          <h2 style={{ marginTop: '30px' }}>My Sessions</h2>

          {loadingSessions ? (
            <p>Loading sessions...</p>
          ) : sessions.length === 0 ? (
            <p>No sessions booked yet.</p>
          ) : (
            <div>
              {sessions.map((session) => (
                <div
                  key={session._id}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    padding: '10px',
                    marginTop: '10px',
                  }}
                >
                  <p><strong>Topic:</strong> {session.topic}</p>
                  <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {session.time}</p>
                  <p><strong>Status:</strong> {session.status}</p>
                  {session.mentor && (
                    <p><strong>Mentor:</strong> {session.mentor.name} ({session.mentor.email})</p>
                  )}
                  {session.notes && (
                    <p><strong>Notes:</strong> {session.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
};

export default Dashboard;
