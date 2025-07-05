import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

interface Feedback {
  _id: string;
  rating: number;
  comments: string;
  menteeId: {
    name: string;
  };
}

const SessionFeedback: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/feedback/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFeedbacks(res.data);
      } catch (err) {
        console.error('Error fetching feedback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [sessionId]);

  if (loading) return <p>Loading feedback...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Session Feedback</h2>
      {feedbacks.length === 0 ? (
        <p>No feedback available for this session.</p>
      ) : (
        feedbacks.map((fb) => (
          <div key={fb._id} className="border p-3 mb-3 rounded-lg shadow-sm">
            <p><strong>Mentee:</strong> {fb.menteeId?.name || 'Anonymous'}</p>
            <p><strong>Rating:</strong> {fb.rating}/5</p>
            <p><strong>Comments:</strong> {fb.comments}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default SessionFeedback;
