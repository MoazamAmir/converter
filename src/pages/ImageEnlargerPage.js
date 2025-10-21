// src/pages/ImageEnlargerPage.js
import React from 'react';

export default function ImageEnlargerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">🔍 Image Enlarger</h1>
          <p className="mt-1 opacity-90">Upscale your images without losing clarity</p>
        </div>
        <div className="p-6">
          <div className="border-2 border-dashed border-indigo-300 rounded-xl p-8 text-center mb-6 bg-indigo-50">
            <svg className="w-12 h-12 mx-auto text-indigo-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            <p className="text-gray-700 font-medium">Upload low-res image</p>
            <button className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Upload Image
            </button>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Scale Factor</label>
            <select className="w-full p-2 border rounded-lg">
              <option>2x (Double size)</option>
              <option>3x</option>
              <option>4x (Max quality)</option>
            </select>
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:opacity-90">
            Enlarge Image
          </button>
        </div>
      </div>
    </div>
  );
}