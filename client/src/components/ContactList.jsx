import React from 'react';
import { Mail, Phone, Trash2, User } from 'lucide-react';
import axios from 'axios';

const ContactList = ({ contacts, onContactDeleted }) => {

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
                await axios.delete(`${baseUrl}/api/contacts/${id}`);
                onContactDeleted();
            } catch (err) {
                console.error('Error deleting contact:', err);
            }
        }
    };

    if (contacts.length === 0) {
        return (
            <div className="card contact-list">
                <h2>Connections</h2>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>No messages yet.</p>
                    <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '0.5rem' }}>Your incoming inquiries will appear here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card contact-list">
            <h2>Recent entries</h2>
            <div style={{ marginTop: '1.5rem' }}>
                {contacts.map((contact) => (
                    <div key={contact._id} className="contact-item">
                        <div className="contact-info">
                            <h4>{contact.name}</h4>
                            <p>{contact.email}</p>
                            <p>{contact.phone}</p>
                            {contact.message && (
                                <div style={{
                                    marginTop: '1rem',
                                    padding: '0.75rem',
                                    background: '#f9fafb',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    color: '#4b5563',
                                    border: '1px solid #e5e7eb'
                                }}>
                                    {contact.message}
                                </div>
                            )}
                        </div>
                        <button
                            className="delete-btn"
                            onClick={() => handleDelete(contact._id)}
                            title="Remove"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContactList;
