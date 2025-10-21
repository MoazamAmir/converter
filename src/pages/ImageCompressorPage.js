// src/pages/ImageCompressorPage.js
import React from 'react';

export default function ImageCompressorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-violet-700 p-6 text-white text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">🗜️ Image Compressor</h1>
          <p className="mt-1 opacity-90">Reduce file size by up to 90% without losing quality</p>
        </div>
        <div className="p-6">
          <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center mb-6 bg-purple-50">
            <svg className="w-12 h-12 mx-auto text-purple-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-gray-700 font-medium">Upload image to compress</p>
            <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Choose File
            </button>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Compression Level</label>
            <input type="range" min="1" max="100" defaultValue="80" className="w-full" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>High Quality</span>
              <span>Smaller Size</span>
            </div>
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold rounded-lg hover:opacity-90">
            Compress Image
          </button>
        </div>
      </div>
    </div>
  );
}