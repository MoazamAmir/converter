// src/pages/CropImagePage.js
import React from 'react';

export default function CropImagePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">✂️ Crop Image</h1>
          <p className="mt-1 opacity-90">Remove unwanted parts from your image</p>
        </div>
        <div className="p-6">
          <div className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center mb-6 bg-green-50">
            <svg className="w-12 h-12 mx-auto text-green-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <p className="text-gray-700 font-medium">Upload an image to crop</p>
            <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Select Image
            </button>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
            <div className="flex flex-wrap gap-2">
              {['Free', '1:1', '4:3', '16:9', 'Custom'].map((ratio) => (
                <button
                  key={ratio}
                  className="px-3 py-1.5 border rounded-lg text-sm font-medium hover:bg-green-100 border-green-500 text-green-700"
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:opacity-90">
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}