import React, { useState } from 'react';
import { Send, User, Mail, Phone, MessageSquare } from 'lucide-react';
import axios from 'axios';

const ContactForm = ({ onContactAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const validate = () => {
        let tempErrors = {};
        if (!formData.name.trim()) tempErrors.name = 'Name is required';
        if (!formData.email) {
            tempErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) tempErrors.phone = 'Phone number is required';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await axios.post(`${baseUrl}/api/contacts`, formData);
            if (response.status === 201) {
                setSuccessMessage('Message sent successfully! ✨');
                setFormData({ name: '', email: '', phone: '', message: '' });
                onContactAdded();
                setTimeout(() => setSuccessMessage(''), 5000);
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            if (err.response && err.response.status === 409) {
                setErrors({ email: 'This email is already registered.' });
            } else {
                setErrors({ submit: 'Failed to send message. Please try again.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const isInvalid = !formData.name || !formData.email || !formData.phone;

    return (
        <div className="card">
            <h2>Get in touch</h2>
            <p className="subtitle">Fill out the form below and we'll get back to you as soon as possible.</p>

            {successMessage && <div className="success-message">{successMessage}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                    />
                    {errors.name && <p className="error-text">{errors.name}</p>}
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                    />
                    {errors.email && <p className="error-text">{errors.email}</p>}
                </div>

                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                    />
                    {errors.phone && <p className="error-text">{errors.phone}</p>}
                </div>

                <div className="form-group">
                    <label>Message</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        placeholder="How can we help you?"
                    ></textarea>
                </div>

                <button type="submit" disabled={isSubmitting || isInvalid}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                <p className="footer-text">Or email us at <strong>contact@example.com</strong></p>
                {errors.submit && <p className="error-text" style={{ marginTop: '10px' }}>{errors.submit}</p>}
            </form>
        </div>
    );
};

export default ContactForm;
