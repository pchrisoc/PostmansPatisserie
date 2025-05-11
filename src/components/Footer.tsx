import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-amber-900 text-amber-50 py-8 px-4 md:px-8 mt-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Postman Patisserie</h3>
            <p className="mb-2">123 Bakery Lane</p>
            <p className="mb-2">Flourville, BR34D</p>
            <p className="mb-2">Tel: (555) 123-4567</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Hours</h3>
            <p className="mb-2">Monday - Friday: 7am - 6pm</p>
            <p className="mb-2">Saturday: 8am - 5pm</p>
            <p className="mb-2">Sunday: 8am - 2pm</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="text-amber-50 hover:text-amber-200 transition-colors">Instagram</a>
              <a href="#" className="text-amber-50 hover:text-amber-200 transition-colors">Facebook</a>
              <a href="#" className="text-amber-50 hover:text-amber-200 transition-colors">Twitter</a>
            </div>
          </div>
        </div>
        <div className="border-t border-amber-800 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Postman Patisserie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}