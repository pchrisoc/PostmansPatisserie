"use client";

import React, { useState, FormEvent, useId } from 'react';

export default function OrderForm() {
  // Use a stable ID for form elements
  const formId = useId();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setStatusMessage('');
      setStatusType(null);
      
      const formData = {
        name,
        email,
        phone,
        message
      };
      
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit order');
      }
      
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      
      setStatusType('success');
      setStatusMessage('Thank you! Your order has been submitted successfully. We will contact you shortly.');
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatusType('error');
      setStatusMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-form">
      {statusMessage && (
        <div className={`p-4 mb-6 rounded-md ${
          statusType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {statusMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor={`${formId}-name`} className="block text-stone-700 mb-2">Name</label>
            <input 
              type="text" 
              id={`${formId}-name`}
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-black"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label htmlFor={`${formId}-email`} className="block text-stone-700 mb-2">Email</label>
            <input 
              type="email" 
              id={`${formId}-email`}
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-black"
              placeholder="Your email"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor={`${formId}-phone`} className="block text-stone-700 mb-2">Phone</label>
          <input 
            type="tel" 
            id={`${formId}-phone`}
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-black"
            placeholder="Your phone number"
            required
          />
        </div>
        <div>
          <label htmlFor={`${formId}-message`} className="block text-stone-700 mb-2">Order Details</label>
          <textarea 
            id={`${formId}-message`}
            name="message"
            rows={4} 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-black"
            placeholder="Tell us what you'd like to order"
            required
          ></textarea>
        </div>
        <div>
          <button 
            type="submit" 
            className={`bg-amber-700 hover:bg-amber-800 text-white py-2 px-6 rounded-md transition-colors w-full md:w-auto ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Order'}
          </button>
        </div>
      </form>
    </div>
  );
}