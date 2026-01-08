import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';

function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await axios.get(`${baseUrl}/api/contacts`);
      setContacts(response.data);
    } catch (err) {
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="container">
      <h1 className="main-title">Contact Management</h1>
      <ContactForm onContactAdded={fetchContacts} />
      {loading ? (
        <div className="card fade-in">
          <h2>Contacts</h2>
          <p>Loading...</p>
        </div>
      ) : (
        <ContactList contacts={contacts} onContactDeleted={fetchContacts} />
      )}
    </div>
  );
}

export default App;
