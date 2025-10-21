// src/pages/ColorPickerPage.js
import React from 'react';

export default function ColorPickerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-pink-600 to-rose-700 p-6 text-white text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">🎨 Color Picker</h1>
          <p className="mt-1 opacity-90">Pick any color from image or palette</p>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <div className="w-full h-48 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-lg mb-4"></div>
            <div className="flex justify-center gap-4">
              <div className="w-12 h-12 bg-red-500 rounded-full border-2 border-white shadow"></div>
              <div className="w-12 h-12 bg-green-500 rounded-full border-2 border-white shadow"></div>
              <div className="w-12 h-12 bg-blue-500 rounded-full border-2 border-white shadow"></div>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <input type="color" defaultValue="#3b82f6" className="w-14 h-14 rounded border" />
            <input type="text" defaultValue="#3b82f6" className="flex-1 p-2 border rounded-lg font-mono" />
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-lg hover:opacity-90">
            Copy Color
          </button>
        </div>
      </div>
    </div>
  );
}