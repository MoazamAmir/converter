import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import { Upload, } from 'lucide-react';
// Mock icons
const Palette = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
    <path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z" />
  </svg>
);

const ImageResizerPro = ({ isDarkMode }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lockRatio, setLockRatio] = useState(true);
  const [targetFileSize, setTargetFileSize] = useState('');
  const [outputFormat, setOutputFormat] = useState('jpg');
  const [activeTab, setActiveTab] = useState('size');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const originalImageRef = useRef(null);
  const location = useLocation();

  // ✅ Theme-aware classes (no hardcoded dark: )
  const bgPrimary = isDarkMode ? 'bg-[#111727]' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100';
  const bgCard = isDarkMode ? 'bg-[#1a2332]' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const textTertiary = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDarkMode ? 'bg-[#1f2937]' : 'bg-white';
  const buttonBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-200';
  const adBg = isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-100 border-blue-200';
  const adText = isDarkMode ? 'text-blue-300' : 'text-blue-800';
  const adSubText = isDarkMode ? 'text-blue-400' : 'text-blue-600';

  // Handle file selection
  const handleFileChange = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10 MB');
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      originalImageRef.current = img;
      setImageSrc(url);
      setWidth(img.width);
      setHeight(img.height);
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files?.[0]) handleFileChange(files[0]);
  };
 const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleWidthChange = (e) => {
    const w = e.target.value === '' ? 0 : Number(e.target.value);
    setWidth(w);
    if (lockRatio && originalImageRef.current) {
      const aspect = originalImageRef.current.width / originalImageRef.current.height;
      setHeight(Math.round(w / aspect));
    }
  };

  const handleHeightChange = (e) => {
    const h = e.target.value === '' ? 0 : Number(e.target.value);
    setHeight(h);
    if (lockRatio && originalImageRef.current) {
      const aspect = originalImageRef.current.width / originalImageRef.current.height;
      setWidth(Math.round(h * aspect));
    }
  };

  const exportImage = () => {
    if (!originalImageRef.current || !width || !height) return;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(originalImageRef.current, 0, 0, width, height);
    let mimeType = outputFormat === 'png' ? 'image/png' : 'image/jpeg';
    const dataUrl = canvas.toDataURL(mimeType, mimeType === 'image/jpeg' ? 0.92 : undefined);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `resized.${outputFormat}`;
    a.click();
  };

  const resetImage = () => {
    setImageSrc(null);
    setWidth(800);
    setHeight(600);
    setTargetFileSize('');
    setOutputFormat('jpg');
    originalImageRef.current = null;
  };

  return (
    <div className={`${bgPrimary} min-h-screen overflow-x-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {!imageSrc ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
               <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center">Resize Image</h1>
              <p className={`text-lg ${textTertiary}`}>Quickly resize image files online for free!</p>
            </div>

            {/* Ad Banner */}
            <div className="text-center mt-5">
              <div className={`rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center min-h-[90px] mx-auto w-full max-w-[728px] shadow-md border ${adBg}`}>
                <p className={`text-sm sm:text-base font-semibold ${adText}`}>Advertisement Space 728x90</p>
                <p className={`text-xs sm:text-sm mt-1 ${adSubText}`}>Your Banner Ad Here</p>
              </div>
            </div>

            {/* Upload Area */}
            <div className="mt-10">
              <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 rounded-2xl shadow-2xl">
                <div className={`${bgCard} rounded-2xl p-8 sm:p-12 text-center`}>
                  <div
                    onClick={() => fileInputRef.current.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-4 border-dashed rounded-lg p-16 transition-all duration-300 cursor-pointer ${isDragging
                      ? isDarkMode
                        ? 'border-blue-400 bg-blue-900/20'
                        : 'border-blue-500 bg-blue-50'
                      : isDarkMode
                        ? 'border-white/20'
                        : 'border-white/30'
                      }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <Upload className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                    <h3 className={`text-2xl font-semibold ${textPrimary} mb-2`}>
                      Upload or Drop Image
                    </h3>
                    <p className={`mt-6 ${isDarkMode ? 'text-white/80' : 'text-gray-800'} text-lg`}>
                      Drag & drop an image here, or click to browse
                    </p>
                    <p className={`mt-3 ${textTertiary} text-sm`}>
                      Max file size: 10 MB. <span className="underline cursor-pointer">Sign up</span> for more.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Ads */}
            <div className="hidden lg:block absolute left-4 top-[390px]">
              <div className={`rounded-lg p-4 w-[110px] h-[500px] shadow-md border ${adBg}`}>
                <p className={`text-xs mt-2 rotate-90 whitespace-nowrap ${adSubText}`}>Left Skyscraper Banner</p>
              </div>
            </div>
            <div className="hidden lg:block absolute right-4 top-[390px]">
              <div className={`rounded-lg p-4 w-[110px] h-[500px] shadow-md border ${adBg}`}>
                <p className={`text-xs mt-2 rotate-90 whitespace-nowrap ${adSubText}`}>Right Skyscraper Banner</p>
              </div>
            </div>

            {/* Features */}
            <div className="mt-16 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Perfect Quality', color: 'blue', desc: 'The best online image resizer...' },
                  { title: 'Lightning Fast', color: 'yellow', desc: 'This cloud-hosted tool...' },
                  { title: 'Easy To Use', color: 'green', desc: 'Simply upload your image...' },
                  { title: 'Works Anywhere', color: 'purple', desc: 'Browser-based, works on any platform...' },
                  { title: 'Privacy Guaranteed', color: 'red', desc: 'Uploaded via 256-bit SSL...' },
                  { title: "It's Free", color: 'pink', desc: 'No software, registrations, or watermarks...' }
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`${isDarkMode ? 'bg-[#1a2332] border-gray-700' : 'bg-gray-50 border-gray-200'} p-6 rounded-xl text-center border`}
                  >
                    <div className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? `bg-${item.color}-900/30` : `bg-${item.color}-100`} rounded-lg flex items-center justify-center`}>
                      <svg className={`w-7 h-7 text-${item.color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.color === 'blue' ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : item.color === 'yellow' ? 'M13 10V3L4 14h7v7l9-11h-7z' : item.color === 'green' ? 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' : item.color === 'purple' ? 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' : item.color === 'red' ? 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' : 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'} />
                      </svg>
                    </div>
                    <h3 className={`font-semibold mb-2 ${textPrimary}`}>{item.title}</h3>
                    <p className={`text-sm ${textTertiary}`}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Resize */}
            <div className={`mt-16 max-w-5xl mx-auto ${isDarkMode ? 'bg-[#1a2332] border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-2xl p-8 border`}>
              <h2 className={`text-3xl font-bold ${textPrimary} text-center mb-8`}>How to Resize an Image?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="flex items-center justify-center gap-6">
                  <div className={`${isDarkMode ? 'bg-[#1f2937]' : 'bg-gray-200'} p-6 rounded-xl`}>
                    <svg className={`w-20 h-20 ${textTertiary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className={`${isDarkMode ? 'bg-[#1f2937] border-blue-500' : 'bg-white border-blue-400'} p-6 rounded-xl border-2 border-dashed`}>
                    <svg className="w-20 h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-4">
                  {['Select Image', 'Target Size', 'Resize Image'].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                      <p className={textPrimary}>
                        Click on the <span className="font-semibold text-blue-400">"{step}"</span> {i === 0 ? 'button' : i === 1 ? 'for your image' : 'button to resize the image'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Editor Screen
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview */}
            <div className="space-y-6">
              <div className={`${bgCard} rounded-xl p-6 shadow-lg border ${borderColor}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-bold ${textPrimary}`}>Image Preview</h2>
                  <button
                    onClick={resetImage}
                    className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                  >
                    Change Image
                  </button>
                </div>
                <div className={`${isDarkMode ? 'bg-[#1f2937]' : 'bg-gray-100'} rounded-lg p-4 flex items-center justify-center min-h-[400px]`}>
                  <img src={imageSrc} alt="Preview" className="max-w-full max-h-[500px] object-contain rounded-lg shadow-md" />
                </div>
                {originalImageRef.current && (
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className={`${isDarkMode ? 'bg-[#1f2937]' : 'bg-gray-50'} p-3 rounded`}>
                      <p className={textTertiary}>Original Size</p>
                      <p className={`font-semibold ${textPrimary}`}>{originalImageRef.current.width} × {originalImageRef.current.height} px</p>
                    </div>
                    <div className={`${isDarkMode ? 'bg-[#1f2937]' : 'bg-gray-50'} p-3 rounded`}>
                      <p className={textTertiary}>New Size</p>
                      <p className={`font-semibold ${textPrimary}`}>{width} × {height} px</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Ad */}
              <div className={`rounded-lg p-4 text-center border ${adBg}`}>
                <p className={`text-sm font-medium ${adText}`}>Advertisement Space</p>
                <p className={`text-xs mt-1 ${adSubText}`}>300x250 Medium Rectangle</p>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              {/* Resize Settings */}
              <div className={`${bgCard} rounded-xl p-6 shadow-lg border ${borderColor}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-lg font-semibold ${textPrimary}`}>Resize Settings</h3>
                  <div className="flex gap-2">
                    {['size', 'percent', 'social'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${activeTab === tab
                            ? 'bg-blue-600 text-white'
                            : `${isDarkMode ? 'bg-[#1f2937] text-gray-300' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200 dark:hover:bg-[#1a2332]`
                          }`}
                      >
                        {tab === 'size' ? 'By Size' : tab === 'percent' ? 'Percentage' : 'Social'}
                      </button>
                    ))}
                  </div>
                </div>

                {activeTab === 'size' && (
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Width</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={width || ''}
                          onChange={handleWidthChange}
                          className={`flex-1 px-4 py-2.5 border ${borderColor} rounded-lg ${inputBg} ${textPrimary} focus:ring-2 focus:ring-blue-500 transition`}
                        />
                        <span className={textTertiary}>px</span>
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Height</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={height || ''}
                          onChange={handleHeightChange}
                          className={`flex-1 px-4 py-2.5 border ${borderColor} rounded-lg ${inputBg} ${textPrimary} focus:ring-2 focus:ring-blue-500 transition`}
                        />
                        <span className={textTertiary}>px</span>
                      </div>
                    </div>
                    <label className={`flex items-center gap-2 text-sm ${textSecondary} cursor-pointer p-3 ${isDarkMode ? 'bg-[#1f2937]' : 'bg-gray-50'} rounded-lg hover:${isDarkMode ? 'bg-[#1a2332]' : 'bg-gray-100'} transition`}>
                      <input
                        type="checkbox"
                        checked={lockRatio}
                        onChange={(e) => setLockRatio(e.target.checked)}
                        className="w-4 h-4 rounded accent-blue-600"
                      />
                      <span className="font-medium">Lock Aspect Ratio</span>
                    </label>
                  </div>
                )}

                {activeTab !== 'size' && (
                  <div className="text-center py-8">
                    <p className={textTertiary}>
                      {activeTab === 'percent' ? 'Percentage resize' : 'Social media presets'} coming soon...
                    </p>
                  </div>
                )}
              </div>

              {/* Export */}
              <div className={`${bgCard} rounded-xl p-6 shadow-lg border ${borderColor}`}>
                <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Export Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                      Target File Size <span className={`font-normal ${textTertiary}`}> (optional)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={targetFileSize}
                        onChange={(e) => setTargetFileSize(e.target.value)}
                        placeholder="e.g. 200"
                        disabled={outputFormat !== 'jpg'}
                        className={`flex-1 px-4 py-2.5 border rounded-lg transition ${outputFormat !== 'jpg'
                            ? `${isDarkMode ? 'bg-[#1f2937]' : 'bg-gray-100'} ${textTertiary} cursor-not-allowed border-gray-300`
                            : `${inputBg} ${textPrimary} border ${borderColor} focus:ring-2 focus:ring-blue-500`
                          }`}
                      />
                      <span className={textTertiary}>KB</span>
                    </div>
                    <p className={`text-xs ${textTertiary} mt-2`}>Set max output file size (JPG only)</p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Save Image As</label>
                    <select
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      className={`w-full px-4 py-2.5 border ${borderColor} rounded-lg ${inputBg} ${textPrimary} focus:ring-2 focus:ring-blue-500 transition`}
                    >
                      <option value="original">Original Format</option>
                      <option value="jpg">JPG</option>
                      <option value="png">PNG</option>
                    </select>
                  </div>

                  <button
                    onClick={exportImage}
                    disabled={!imageSrc}
                    className={`w-full py-3 rounded-lg font-semibold text-base transition transform ${imageSrc
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:scale-105'
                        : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} cursor-not-allowed`
                      }`}
                  >
                    Export Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer — pass isDarkMode */}
      <Footer currentPage={location.pathname} isDarkMode={isDarkMode} />
    </div>
  );
};

export default ImageResizerPro;