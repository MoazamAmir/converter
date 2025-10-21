// src/pages/ImageResizerPage.js
import React from 'react';

export default function ImageResizerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">📏 Image Resizer</h1>
          <p className="mt-1 opacity-90">Resize your images to any dimension instantly</p>
        </div>
        <div className="p-6">
          <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center mb-6 bg-blue-50">
            <svg className="w-12 h-12 mx-auto text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <p className="text-gray-700 font-medium">Drag & drop your image here</p>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Choose Image
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
              <input type="number" className="w-full p-2 border rounded-lg" placeholder="e.g. 800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
              <input type="number" className="w-full p-2 border rounded-lg" placeholder="e.g. 600" />
            </div>
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:opacity-90">
            Resize Image
          </button>
        </div>
      </div>
    </div>
  );
}