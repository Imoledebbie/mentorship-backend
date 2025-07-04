// src/pages/BookSession.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface Mentor {
  _id: string;
  name: string;
  email: string;
}

const BookSession = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');

  const navigate = useNavigate(); // Create navigate function

  // Fetch mentors on page load
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/mentors');
        setMentors(res.data.mentors); // adjust if backend structure differs
      } catch (error) {
        console.error('❌ Failed to load mentors:', error);
      }
    };

    fetchMentors();
  }, []);

  // Submit booking form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:5000/api/sessions',
        {
          mentorId: selectedMentor,
          date,
          time,
          topic,
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus('✅ Session booked successfully!');

      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('❌ Booking error:', error);
      setStatus('❌ Booking failed. Try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <h2>Book a Mentorship Session</h2>

      {/* Mentor Dropdown */}
      <label>Choose a Mentor:</label><br />
      <select
        value={selectedMentor}
        onChange={(e) => setSelectedMentor(e.target.value)}
        required
      >
        <option value="">-- Select Mentor --</option>
        {mentors.map((mentor) => (
          <option key={mentor._id} value={mentor._id}>
            {mentor.name} ({mentor.email})
          </option>
        ))}
      </select>
      <br /><br />

      {/* Date Field */}
      <label>Date:</label><br />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <br /><br />

      {/* Time Field */}
      <label>Time:</label><br />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      <br /><br />

      {/* Topic */}
      <label>Topic:</label><br />
      <input
        type="text"
        placeholder="What do you want to learn?"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        required
      />
      <br /><br />

      {/* Notes (optional) */}
      <label>Notes (optional):</label><br />
      <textarea
        placeholder="Any extra notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <br /><br />

      <button type="submit">Book Session</button>
      {status && <p>{status}</p>}
    </form>
  );
};

export default BookSession;
