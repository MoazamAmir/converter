import React, { useState, useRef } from 'react';

// Mock icons
const Palette = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
    <path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z" />
  </svg>
);

const ImageResizerPro = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lockRatio, setLockRatio] = useState(true);
  const [targetFileSize, setTargetFileSize] = useState('');
  const [outputFormat, setOutputFormat] = useState('jpg');
  const [activeTab, setActiveTab] = useState('size');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const fileInputRef = useRef(null);
  const originalImageRef = useRef(null);

  // Theme classes
  const bgPrimary = isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#1a1a1a]';
  const bgSecondary = isDarkMode ? 'bg-slate-900/80' : 'bg-white/95';
  const bgCard = isDarkMode ? 'bg-slate-800/50' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-gray-700';
  const textTertiary = isDarkMode ? 'text-slate-400' : 'text-gray-500';
  const borderColor = isDarkMode ? 'border-slate-700/50' : 'border-gray-200';
  const hoverBg = isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-100';
  const inputBg = isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100';
  const buttonBg = isDarkMode ? 'bg-slate-700/50' : 'bg-gray-200';

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      originalImageRef.current = img;
      setImageSrc(url);
      setWidth(img.width);
      setHeight(img.height);
    };
    img.src = url;
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
    <div className={`${bgPrimary} min-h-screen`}>
      {/* Header */}
      <header className={`${bgSecondary} backdrop-blur-md border-b ${borderColor} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Palette />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  ImageResizer Pro
                </h1>
                <p className={`text-xs ${textTertiary} hidden sm:block`}>Professional Resizer Tool</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className={`px-4 py-2 border rounded ${textPrimary} ${borderColor} hover:opacity-90 transition`}>
                Login
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Signup
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={`${bgSecondary} px-6 py-3 border-b ${borderColor}`}>
        <div className="max-w-7xl mx-auto text-sm text-gray-400">
          Home › Resizer Image
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {!imageSrc ? (
          // Upload Screen
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className={`text-4xl font-bold ${textPrimary} mb-3`}>Resize Image</h1>
              <p className={`text-lg ${textTertiary}`}>Quickly resize image files online for free!</p>
            </div>

            <div className="text-center mt-5">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center min-h-[90px] mx-auto w-full max-w-[728px] shadow-md border border-blue-200 dark:border-blue-800">
                <p className="text-blue-800 dark:text-blue-300 text-sm sm:text-base font-semibold">Advertisement Space 728x90</p>
                <p className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm mt-1">Your Banner Ad Here</p>
              </div>
            </div>

            <div className="mt-10">
              <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 rounded-2xl shadow-2xl">
                <div className={`${bgCard} rounded-2xl p-8 sm:p-12 text-center`}>
                  <div className={`border-4 border-dashed ${borderColor} rounded-xl p-12 sm:p-16 transition-all hover:border-blue-400 hover:bg-slate-800/30`}>
                    <svg
                      className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto ${textTertiary} mb-6`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold text-base sm:text-lg inline-flex items-center gap-2 shadow-lg transition-all transform hover:scale-105"
                    >
                      <span>📁</span>
                      Select Image
                      <span className="ml-2">▼</span>
                    </button>
                    <p className={`mt-6 ${textPrimary} text-base sm:text-lg`}>or drag and drop an image here</p>
                    <p className={`mt-3 ${textTertiary} text-sm`}>
                      Max file size: 10 MB • <span className="underline cursor-pointer hover:text-blue-400">Sign up</span> for more
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block absolute left-4 top-[390px]">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center min-h-[90px] mx-auto w-full w-[110px] h-[500px] shadow-md border border-blue-200 dark:border-blue-800">
                <p className="text-blue-600 text-xs mt-2 rotate-90 whitespace-nowrap">Left Skyscraper Banner</p>
              </div>
            </div>

            <div className="hidden lg:block absolute right-4 top-[390px]">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center min-h-[90px] mx-auto w-full w-[110px] h-[500px] shadow-md border border-blue-200 dark:border-blue-800">
                <p className="text-blue-600 text-xs mt-2 rotate-90 whitespace-nowrap">Right Skyscraper Banner</p>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-16 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Perfect Quality */}
                <div className="bg-slate-800/50 p-6 rounded-xl text-center border border-slate-700/50">
                  <div className="w-12 h-12 mx-auto mb-4 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Perfect Quality</h3>
                  <p className="text-slate-400 text-sm">The best online image resizer to resize your images at the highest quality.</p>
                </div>

                {/* Lightning Fast */}
                <div className="bg-slate-800/50 p-6 rounded-xl text-center border border-slate-700/50">
                  <div className="w-12 h-12 mx-auto mb-4 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-slate-400 text-sm">This cloud-hosted, highly scalable tool can resize your images in seconds!</p>
                </div>

                {/* Easy To Use */}
                <div className="bg-slate-800/50 p-6 rounded-xl text-center border border-slate-700/50">
                  <div className="w-12 h-12 mx-auto mb-4 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Easy To Use</h3>
                  <p className="text-slate-400 text-sm">Simply upload your image and enter a target size. It's as easy as that!</p>
                </div>

                {/* Works Anywhere */}
                <div className="bg-slate-800/50 p-6 rounded-xl text-center border border-slate-700/50">
                  <div className="w-12 h-12 mx-auto mb-4 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Works Anywhere</h3>
                  <p className="text-slate-400 text-sm">ImageResizer.com is browser-based (no software to install). It works on any platform (Windows, Linux, Mac).</p>
                </div>

                {/* Privacy Guaranteed */}
                <div className="bg-slate-800/50 p-6 rounded-xl text-center border border-slate-700/50">
                  <div className="w-12 h-12 mx-auto mb-4 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Privacy Guaranteed</h3>
                  <p className="text-slate-400 text-sm">Your images are uploaded via a secure 256-bit encrypted SSL connection and deleted automatically within 6 hours.</p>
                </div>

                {/* It's Free */}
                <div className="bg-slate-800/50 p-6 rounded-xl text-center border border-slate-700/50">
                  <div className="w-12 h-12 mx-auto mb-4 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2">It's Free</h3>
                  <p className="text-slate-400 text-sm">Since 2012 we have resized millions of images for free! There is no software to install, registrations, or watermarks.</p>
                </div>
              </div>
            </div>

            {/* How to Resize Section */}
            <div className="mt-16 max-w-5xl mx-auto bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
              <h2 className="text-3xl font-bold text-white text-center mb-8">How to Resize an Image?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left side - Visual */}
                <div className="flex items-center justify-center gap-6">
                  <div className="bg-slate-700/50 p-6 rounded-xl">
                    <svg className="w-20 h-20 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  
                  <div className="bg-slate-700/50 p-6 rounded-xl border-2 border-dashed border-blue-400">
                    <svg className="w-20 h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                {/* Right side - Steps */}
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <p className="text-white">Click on the <span className="font-semibold text-blue-400">"Select Image"</span> button to select an image.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <p className="text-white">Enter a new <span className="font-semibold text-blue-400">target size</span> for your image.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <p className="text-white">Click the <span className="font-semibold text-blue-400">"Resize Image"</span> button to resize the image.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        ) : (
          // Editor Screen - Shows after image upload
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Image Preview */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Image Preview</h2>
                  <button
                    onClick={resetImage}
                    className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                  >
                    Change Image
                  </button>
                </div>

                <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 flex items-center justify-center min-h-[400px]">
                  <img
                    src={imageSrc}
                    alt="Preview"
                    className="max-w-full max-h-[500px] object-contain rounded-lg shadow-md"
                  />
                </div>

                {originalImageRef.current && (
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <p className="text-gray-500 dark:text-gray-400">Original Size</p>
                      <p className="text-gray-800 dark:text-white font-semibold">
                        {originalImageRef.current.width} × {originalImageRef.current.height} px
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <p className="text-gray-500 dark:text-gray-400">New Size</p>
                      <p className="text-gray-800 dark:text-white font-semibold">
                        {width} × {height} px
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Advertisement */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border border-dashed border-purple-300 dark:border-purple-700 rounded-lg p-4 text-center">
                <p className="text-purple-700 dark:text-purple-300 text-sm font-medium">Advertisement Space</p>
                <p className="text-purple-500 dark:text-purple-400 text-xs mt-1">300x250 Medium Rectangle</p>
              </div>
            </div>

            {/* Right Side - Controls */}
            <div className="space-y-6">
              {/* Resize Settings Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Resize Settings</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab('size')}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${activeTab === 'size'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                    >
                      By Size
                    </button>
                    <button
                      onClick={() => setActiveTab('percent')}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${activeTab === 'percent'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                    >
                      Percentage
                    </button>
                    <button
                      onClick={() => setActiveTab('social')}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${activeTab === 'social'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                    >
                      Social
                    </button>
                  </div>
                </div>

                {activeTab === 'size' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Width
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={width || ''}
                          onChange={handleWidthChange}
                          className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <span className="text-gray-500 dark:text-gray-400 font-medium">px</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Height
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={height || ''}
                          onChange={handleHeightChange}
                          className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <span className="text-gray-500 dark:text-gray-400 font-medium">px</span>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
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

                {activeTab === 'percent' && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">Percentage resize coming soon...</p>
                  </div>
                )}

                {activeTab === 'social' && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">Social media presets coming soon...</p>
                  </div>
                )}
              </div>

              {/* Export Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Export Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target File Size <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={targetFileSize}
                        onChange={(e) => setTargetFileSize(e.target.value)}
                        placeholder="e.g. 200"
                        disabled={outputFormat !== 'jpg'}
                        className={`flex-1 px-4 py-2.5 border rounded-lg transition ${outputFormat !== 'jpg'
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed border-gray-200 dark:border-gray-600'
                            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500'
                          }`}
                      />
                      <span className="text-gray-500 dark:text-gray-400 font-medium">KB</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Set max output file size (JPG only)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Save Image As
                    </label>
                    <select
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
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
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
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
       <footer className={`${bgSecondary} backdrop-blur-md border-t ${borderColor} mt-20 py-12`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Palette className="text-white" size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      ImageResizer Pro
                    </h3>
                    <p className={`text-xs ${textTertiary}`}>Professional Tool</p>
                  </div>
                </div>
                <p className={`text-sm ${textTertiary} text-center md:text-left`}>
                  Your ultimate Image Resizer and design tool for professional workflows.
                </p>
              </div>

              <div className="flex flex-col items-center md:items-start">
                <h4 className={`text-sm font-semibold ${textSecondary} mb-4 uppercase tracking-wide`}>Features</h4>
                <ul className={`space-y-2 text-sm ${textTertiary}`}>
                  <li className="hover:text-blue-400 transition cursor-pointer">Color Picker</li>
                  <li className="hover:text-blue-400 transition cursor-pointer">Image Extractor</li>
                  <li className="hover:text-blue-400 transition cursor-pointer">Color Harmonies</li>
                  <li className="hover:text-blue-400 transition cursor-pointer">Contrast Checker</li>
                </ul>
              </div>

              <div className="flex flex-col items-center md:items-start">
                <h4 className={`text-sm font-semibold ${textSecondary} mb-4 uppercase tracking-wide`}>Resources</h4>
                <ul className={`space-y-2 text-sm ${textTertiary}`}>
                  <li className="hover:text-blue-400 transition cursor-pointer">Documentation</li>
                  <li className="hover:text-blue-400 transition cursor-pointer">Tutorials</li>
                  <li className="hover:text-blue-400 transition cursor-pointer">Support</li>
                  <li className="hover:text-blue-400 transition cursor-pointer">Privacy Policy</li>
                </ul>
              </div>
            </div>

            <div className={`border-t ${borderColor} pt-6`}>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className={`text-sm ${textTertiary}`}>© {new Date().getFullYear()} ImageResizer Pro. All rights reserved.</p>
                <div className="flex items-center gap-6">
                  {['facebook', 'twitter', 'linkedin'].map((s) => (
                    <a key={s} href="#" className={`${textTertiary} hover:text-blue-400 transition`}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d={s === 'facebook' ? "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" : s === 'twitter' ? "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" : "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
    </div>
  );
};

export default ImageResizerPro;