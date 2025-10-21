// src/pages/CollageMakerPage.js
import React from 'react';

export default function CollageMakerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-red-700 p-6 text-white text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">🖼️ Collage Maker</h1>
          <p className="mt-1 opacity-90">Create beautiful photo collages in seconds</p>
        </div>
        <div className="p-6">
          <div className="border-2 border-dashed border-orange-300 rounded-xl p-8 text-center mb-6 bg-orange-50">
            <svg className="w-12 h-12 mx-auto text-orange-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 8v8m4-8v8m4-8v4" />
            </svg>
            <p className="text-gray-700 font-medium">Add 2–9 photos for collage</p>
            <button className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              Add Photos
            </button>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Layout Style</label>
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3].map(i => (
                <div key={i} className="aspect-square bg-gray-200 rounded border border-dashed border-gray-400"></div>
              ))}
            </div>
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-lg hover:opacity-90">
            Create Collage
          </button>
        </div>
      </div>
    </div>
  );
}