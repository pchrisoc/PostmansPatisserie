"use client";

import React, { useState, FormEvent, useId } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function OrderForm() {
  // Use a stable ID for form elements
  const formId = useId();
  
  // Use the updated scroll reveal hook
  const { ref: formRef, isRevealed } = useScrollReveal({
    threshold: 0.1,
    triggerOnce: true
  });

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
    <div 
      ref={formRef} 
      className={`order-form transition-all duration-700 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ minHeight: '200px' }}
    >
      {isRevealed && (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-2 relative inline-block">
              Place Your Order
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-amber-400 transform origin-left scale-x-100"></span>
            </h2>
            <p className="text-stone-600">Fill out the form below to place an order for our artisanal bread.</p>
          </div>
          
          {statusMessage && (
            <div className={`p-5 mb-8 rounded-lg shadow-md animate-fade-in flex items-start ${
              statusType === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : 'bg-red-50 text-red-800 border-l-4 border-red-500'
            }`}>
              <div className="mr-3 flex-shrink-0">
                {statusType === 'success' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium">{statusType === 'success' ? 'Order Received!' : 'Error'}</p>
                <p className="text-sm mt-1">{statusMessage}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-md p-8 border border-amber-100 relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-amber-400 rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-amber-500 rounded-full opacity-10"></div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor={`${formId}-name`} className="block text-stone-700 font-medium mb-2 transition-colors duration-200">Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    id={`${formId}-name`}
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-amber-50/50 text-stone-800 transition-all duration-300 placeholder:text-stone-400"
                    placeholder="Your name"
                    required
                  />
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-amber-400 transition-all duration-500 ${name ? 'w-full' : 'w-0'}`}></div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor={`${formId}-email`} className="block text-stone-700 font-medium mb-2 transition-colors duration-200">Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    id={`${formId}-email`}
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-amber-50/50 text-stone-800 transition-all duration-300 placeholder:text-stone-400"
                    placeholder="Your email address"
                    required
                  />
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-amber-400 transition-all duration-500 ${email ? 'w-full' : 'w-0'}`}></div>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor={`${formId}-phone`} className="block text-stone-700 font-medium mb-2 transition-colors duration-200">Phone</label>
              <div className="relative">
                <input 
                  type="tel" 
                  id={`${formId}-phone`}
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-amber-50/50 text-stone-800 transition-all duration-300 placeholder:text-stone-400"
                  placeholder="Your phone number"
                  required
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-amber-400 transition-all duration-500 ${phone ? 'w-full' : 'w-0'}`}></div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor={`${formId}-message`} className="block text-stone-700 font-medium mb-2 transition-colors duration-200">Order Details</label>
              <div className="relative">
                <textarea 
                  id={`${formId}-message`}
                  name="message"
                  rows={4} 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-amber-50/50 text-stone-800 transition-all duration-300 placeholder:text-stone-400 resize-none"
                  placeholder="Tell us what you'd like to order and any special instructions"
                  required
                ></textarea>
                <div className={`absolute bottom-0 left-0 h-0.5 bg-amber-400 transition-all duration-500 ${message ? 'w-full' : 'w-0'}`}></div>
              </div>
              <p className="text-xs text-stone-500 mt-2">Please include quantity, type of bread, and preferred pickup date</p>
            </div>
            
            <div className="mt-8">
              <button 
                type="submit" 
                className={`group relative overflow-hidden bg-amber-700 hover:bg-amber-800 text-white py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:translate-y-[-2px] w-auto ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={isSubmitting}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit Order
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-full bg-amber-600 -z-1 group-hover:w-full transition-all duration-300"></span>
              </button>
            </div>
          </form>
          
          <div className="mt-8 bg-amber-50 p-6 rounded-lg border border-amber-100 flex items-start space-x-4 animate-slide-in">
            <div className="text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-amber-800">Order Information</h3>
              <p className="mt-1 text-stone-600">All orders require 24-hour advance notice. For special orders or large quantities, please allow 48 hours.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}