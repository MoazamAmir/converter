import React from 'react';

export default function ConverterUI(props) {
  const {
    files,
    setFiles,
    activeIndex,
    setActiveIndex,
    convertedFile,
    conversionFormat,
    setConversionFormat,
    isConverting,
    isToolsOpen,
    setIsToolsOpen,
    showUploadMenu,
    setShowUploadMenu,
    showFormatMenu,
    setShowFormatMenu,
    formatSearch,
    setFormatSearch,
    showDropdown,
    setShowDropdown,
    isSettingsOpen,
    setIsSettingsOpen,
    showResults,
    setShowResults,
    downloadProgress,
    setDownloadProgress,
    isConvertersOpen,
    setIsConvertersOpen,
    settings,
    setSettings,
    addFileObject,
    handleFileChange,
    handleDragOver,
    handleDrop,
    handleAddFromUrl,
    handleCloudFallback,
    handleRemoveFile,
    selectedFile,
    selectedFileMeta,
    handleConvert,
    handleDownload,
    handleConvertMore,
    resetConverter,
    formats,
    filteredFormats,
    handleChatToggle,
    showChat,
    setShowChat,
    chatMessages,
    setChatMessages,
    chatInput,
    setChatInput,
    sendChatMessage,
    handleChatKeyDown,
  } = props;

  // added: header hover state — when user moves mouse over header it auto-opens mobile dropdown
  const [headerHovered, setHeaderHovered] = React.useState(false);

  React.useEffect(() => {
    // if parent provided setter for mobile dropdown, toggle it with header hover
    if (typeof setShowDropdown === 'function') {
      setShowDropdown(headerHovered);
    }
  }, [headerHovered, setShowDropdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 overflow-x-hidden">
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-gradient { background-size: 200% 200%; animation: gradient 15s ease infinite; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .animate-bounce-slow { animation: bounce 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        .animate-slideIn { animation: slideIn 0.5s ease-out forwards; }
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }
        .glass-effect { backdrop-filter: blur(10px); background: rgba(255,255,255,0.9); }
        html { scroll-behavior: smooth; } body { overflow-x: hidden; }
      `}</style>

      {/* Header */}
      <header
        onMouseEnter={() => setHeaderHovered(true)}
        onMouseLeave={() => setHeaderHovered(false)}
        className={`glass-effect shadow-sm sticky top-0 z-50 border-b border-gray-200 transition-all ${headerHovered ? 'backdrop-blur-md bg-white/95' : ''}`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div className="leading-none">
              <div className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Image Converter Pro</div>
              <div className="text-xs text-gray-500">Convert images instantly</div>
            </div>
          </div>

          {/* <nav className={`hidden md:flex items-center gap-6 text-sm text-gray-600 font-medium ${headerHovered ? 'md:opacity-100' : ''}`}>
            <a href="#" className="hover:text-indigo-600 transition">Convert</a>
            <a href="#" className="hover:text-indigo-600 transition">Compress</a>
            <a href="#" className="hover:text-indigo-600 transition">Tools</a>
            <a href="#" className="hover:text-indigo-600 transition">API</a>
            <a href="#" className="hover:text-indigo-600 transition">Pricing</a>
          </nav> */}

          <div className="flex items-center gap-3">
            {/* removed search button per request */}
            <button className="px-4 py-2 text-sm border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50">Log In</button>
            <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">Sign Up</button>

            {/* mobile hamburger - will auto-open when header hovered because of useEffect above */}
            <button onClick={() => setShowDropdown(prev => !prev)} className="md:hidden ml-2 p-2 rounded-lg border border-gray-200">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>
<header className="glass-effect shadow-lg sticky top-0 z-50 border-b-4 border-indigo-500">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center animate-bounce-slow">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Image Converter Pro
            </h1>
          </div>
          <p className="text-center text-gray-600 mt-2 text-lg">Convert images to JPG, PNG, WebP and more formats instantly</p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* CONVERSION RESULTS SCREEN */}
        {showResults && convertedFile ? (
          <div className="bg-white rounded-2xl shadow-2xl p-8 hover-lift border-t-4 border-green-500 animate-slideIn">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Conversion Complete!</h2>
              <p className="text-gray-600">Your image has been successfully converted</p>
            </div>

            {/* Image Preview */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6 shadow-lg">
              <div className="border-2 rounded-lg p-2 bg-white shadow-inner mb-4">
                <img
                  src={convertedFile.url}
                  alt="Converted"
                  className="w-full h-auto rounded max-h-96 object-contain"
                />
              </div>
              
              {/* File Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-3 rounded-lg shadow">
                  <p className="text-xs text-gray-500 mb-1">File Name</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{convertedFile.name}</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow">
                  <p className="text-xs text-gray-500 mb-1">Format</p>
                  <p className="text-sm font-semibold text-indigo-600 uppercase">{conversionFormat}</p>
                </div>
              </div>

              {/* Download Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Ready to Download</span>
                  <span className="text-sm font-bold text-green-600">{downloadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownload}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download Image
              </button>
              
              <button
                onClick={handleConvertMore}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Convert More
              </button>
            </div>

            {/* Additional Options */}
            <div className="mt-6 flex items-center justify-center gap-4 text-sm">
              <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
                Share
              </button>
              <button onClick={resetConverter} className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Clear All
              </button>
            </div>
          </div>
        ) : (
          // ORIGINAL CONVERTER SCREEN
          <div className="bg-white rounded-2xl shadow-2xl p-8 hover-lift border-t-4 border-indigo-500">

            {/* File Upload Area */}
            <div className="mb-6">

              {/* Always keep the hidden input in DOM so dropzone click can trigger it */}
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Show dropzone only when no files; otherwise show "Add More Files" control */}
              <div className="mb-6">
                {files.length === 0 ? (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50/40 p-12 text-center cursor-pointer transition-shadow hover:shadow-lg"
                    onClick={() => {
                      const el = document.getElementById('fileInput');
                      if (el) el.click();
                    }}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0l4-4m-4 4-4-4"></path>
                      </svg>
                      <div className="text-lg font-semibold text-indigo-700">Drop images here or click to choose</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <button
                        onClick={() => setShowUploadMenu(!showUploadMenu)}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-200 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Add More Files
                        <svg className={`w-4 h-4 transition-transform ${showUploadMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>

                      {showUploadMenu && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-indigo-600 rounded-lg shadow-xl z-50 overflow-hidden">
                          <button
                            onClick={() => {
                              const el = document.getElementById('fileInput');
                              if (el) el.click();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-indigo-700 transition-all"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            From Device
                          </button>
                          <button
                            onClick={handleCloudFallback}
                            className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-indigo-700 transition-all"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"></path>
                            </svg>
                            From Dropbox
                          </button>
                          <button
                            onClick={handleCloudFallback}
                            className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-indigo-700 transition-all"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"></path>
                            </svg>
                            From Google Drive
                          </button>
                          <button
                            onClick={handleCloudFallback}
                            className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-indigo-700 transition-all"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M13.8 12l4.8-4.8c.5-.5.5-1.3 0-1.8s-1.3-.5-1.8 0L12 10.2 7.2 5.4c-.5-.5-1.3-.5-1.8 0s-.5 1.3 0 1.8l4.8 4.8-4.8 4.8c-.5.5-.5 1.3 0 1.8.2.2.5.4.9.4s.6-.1.9-.4l4.8-4.8 4.8 4.8c.2.2.5.4.9.4s.6-.1.9-.4c.5-.5.5-1.3 0-1.8L13.8 12z"></path>
                            </svg>
                            From OneDrive
                          </button>
                          <button
                            onClick={handleAddFromUrl}
                            className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-indigo-700 transition-all"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                            </svg>
                            From Url
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {files.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-gray-800">Added Files ({files.length})</p>
                    <button onClick={() => setFiles([])} className="text-sm text-red-500">Clear All</button>
                  </div>
                  <div className="space-y-2">
                    {files.map((f, idx) => (
                      <div key={`${f.name}-${idx}`} className={`flex items-center justify-between p-2 rounded ${idx === activeIndex ? 'bg-indigo-50 border-2 border-indigo-200' : 'bg-white'} `}>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 flex items-center justify-center border-2 border-dashed border-indigo-300 rounded overflow-hidden bg-white">
                            <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{f.name}</p>
                            <p className="text-xs text-gray-500">{(f.size / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setActiveIndex(idx)} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm">Select</button>
                          <button onClick={() => handleRemoveFile(idx)} className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Output Format and Convert Button */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-600 font-medium">Output:</span>

              <div className="relative">
                <button
                  onClick={() => setShowFormatMenu(!showFormatMenu)}
                  className="flex items-center gap-2 px-6 py-2 bg-white border-2 border-indigo-500 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-50 transition-all"
                >
                  {conversionFormat.toUpperCase()}
                  <svg className={`w-4 h-4 transition-transform ${showFormatMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                {showFormatMenu && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 border-2 border-gray-200 max-h-80 overflow-y-auto">
                    <input
                      type="text"
                      value={formatSearch}
                      onChange={(e) => setFormatSearch(e.target.value)}
                      placeholder="Search Format"
                      className="w-full px-4 py-2 border-b-2 border-gray-200 focus:outline-none focus:border-indigo-500"
                    />

                    <div className="p-2">
                      <div className="text-xs font-bold text-indigo-600 px-2 py-1 mb-1">Image</div>
                      <div className="grid grid-cols-3 gap-2">
                        {filteredFormats.map((format) => (
                          <button
                            key={format.value}
                            onClick={() => {
                              setConversionFormat(format.value);
                              setShowFormatMenu(false);
                              setFormatSearch('');
                            }}
                            className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                              conversionFormat === format.value
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {format.name}
                          </button>
                        ))}
                      </div>

                      <div className="text-xs font-bold text-indigo-600 px-2 py-1 mt-3 mb-1">Document</div>
                      <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => { setConversionFormat('pdf'); setShowFormatMenu(false); }} className="px-3 py-2 rounded text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">PDF</button>
                        <button onClick={() => { setConversionFormat('doc'); setShowFormatMenu(false); }} className="px-3 py-2 rounded text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">DOC</button>
                        <button onClick={() => { setConversionFormat('txt'); setShowFormatMenu(false); }} className="px-3 py-2 rounded text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">TXT</button>
                      </div>

                      <div className="text-xs font-bold text-indigo-600 px-2 py-1 mt-3 mb-1">Report</div>
                      <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => { setConversionFormat('csv'); setShowFormatMenu(false); }} className="px-3 py-2 rounded text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">CSV</button>
                        <button onClick={() => { setConversionFormat('xls'); setShowFormatMenu(false); }} className="px-3 py-2 rounded text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">XLS</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>

              <button className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </button>

              <button 
                onClick={resetConverter}
                className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all ml-auto"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <button
              onClick={handleConvert}
              disabled={!selectedFile || isConverting}
              className={`w-full py-4 rounded-lg text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                !selectedFile || isConverting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
              }`}
            >
              {isConverting ? (
                <>
                  <svg className="w-6 h-6 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Converting...
                </>
              ) : (
                <>
                  Convert
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </>
              )}
            </button>

            {selectedFile && !convertedFile && selectedFileMeta && (
              <div className="mt-8 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Preview</h2>
                <div className="flex justify-center">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 w-full max-w-md shadow-lg">
                    <div className="text-center text-gray-700 font-bold mb-3 text-lg">Selected Image</div>
                    <div className="border-2 rounded-lg p-2 bg-white shadow-inner">
                      <img
                        src={selectedFileMeta.url}
                        alt="Preview"
                        className="w-full h-auto rounded max-h-64 object-contain"
                      />
                    </div>
                    <div className="text-center mt-3 text-sm text-gray-600 font-medium">
                      {selectedFileMeta.name} ({(selectedFileMeta.size / 1024).toFixed(2)} KB)
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-gray-700">
                Convert images directly in your browser with our <span className="font-semibold">Image Converter</span> or <span className="font-semibold">iOS</span> app.
              </p>
            </div>
          </div>
        )}

        {/* How to Convert Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 animate-fadeIn" style={{animationDelay: '0.4s', opacity: 0}}>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="text-3xl">❓</span>
            How to Convert Images?
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover-lift">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
              <div>
                <p className="text-gray-700">Click the <span className="font-bold text-indigo-600">"Add More Files"</span> button and select from Device, Dropbox, Google Drive, OneDrive, or URL.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover-lift">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
              <div>
                <p className="text-gray-700">Select a target image format from the <span className="font-bold text-purple-600">"Output"</span> drop-down list.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover-lift">
              <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
              <div>
                <p className="text-gray-700">Click on the <span className="font-bold text-green-600">"Convert"</span> button to start the conversion.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Valuable Image Tools Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 animate-fadeIn" style={{animationDelay: '0.5s', opacity: 0}}>
          <button 
            className="w-full flex items-center justify-between text-left group"
            onClick={() => setIsToolsOpen(!isToolsOpen)}
          >
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <span className="text-3xl">🛠️</span>
              Valuable Image Tools
            </h2>
            <svg 
              className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${isToolsOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <div 
            className="transition-all duration-500 ease-in-out overflow-hidden"
            style={{
              maxHeight: isToolsOpen ? '1000px' : '0',
              opacity: isToolsOpen ? 1 : 0
            }}
          >
            <p className="text-gray-600 mt-4 mb-6">Here is a list of image tools to further edit your images.</p>
            <div className="space-y-3">
              {[
                { name: 'Image Resizer', desc: 'Quick and easy way to resize an image to any size', color: 'blue' },
                { name: 'Crop Image', desc: 'Use this tool to crop unwanted areas from your image', color: 'green' },
                { name: 'Image Compressor', desc: 'Reduce image files size by up to 80 to 90% using this tool', color: 'purple' },
                { name: 'Color Picker', desc: 'Quickly pick a color from the color wheel or from your image online', color: 'pink' },
                { name: 'Image Enlarger', desc: 'A fast way to make your images bigger', color: 'indigo' },
                { name: 'Collage Maker', desc: 'Create a beautiful photo collage from your photos', color: 'orange' }
              ].map((tool, index) => (
                <div 
                  key={tool.name}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 hover-lift group"
                >
                  <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <a href="#" className="font-bold text-indigo-600 hover:text-indigo-800 group-hover:underline">
                      {tool.name}
                    </a>
                    <span className="text-gray-600"> - {tool.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Specific Image Converters Section */}
      <div 
  className="mt-8 bg-white rounded-2xl shadow-xl p-8 animate-fadeIn" 
  style={{ animationDelay: '0.5s', opacity: 0 }}
>
  <button
    onClick={() => setIsConvertersOpen(!isConvertersOpen)}
    className="w-full flex items-center justify-between text-left group"
  >
    <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
      <span className="text-3xl">🔄</span>
      Specific Image Converters
    </h2>
    <svg
      className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${isConvertersOpen ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  </button>

  <div
    className="transition-all duration-500 ease-in-out overflow-hidden"
    style={{
      maxHeight: isConvertersOpen ? '2000px' : '0',
      opacity: isConvertersOpen ? 1 : 0,
    }}
  >
    <p className="text-gray-600 mt-4 mb-6">
      Convert your images between many popular formats using these online tools.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Column 1 */}
      <div className="space-y-3">
        {[
          'DJV Converter','ART Converter','DDS Converter','PCX Converter','EMZ Converter',
          'DJVU Converter','JXL Converter','JFIF Converter','X3F Converter','NEF Converter'
        ].map(name => (
          <a 
            key={name} 
            href="#" 
            className="block p-3 bg-gray-50 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-all duration-300 group hover-lift"
          >
            {name}
          </a>
        ))}
      </div>

      {/* Column 2 */}
      <div className="space-y-3">
        {[
          'EPS Converter','DPX Converter','HEIC Converter','TIF Converter','TGA Converter',
          'CBZ Converter','ICO Converter','PSB Converter','Panasonic RAW Converter','RWL Converter'
        ].map(name => (
          <a 
            key={name} 
            href="#" 
            className="block p-3 bg-gray-50 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-all duration-300 group hover-lift"
          >
            {name}
          </a>
        ))}
      </div>

      {/* Column 3 */}
      <div className="space-y-3">
        {[
          'PPM Converter','WMZ Converter','AVIF Converter','JPEG Converter','DIB Converter',
          'HEIF Converter','CBR Converter','ARW Converter','NRW Converter','Sigma RAW Converter'
        ].map(name => (
          <a 
            key={name} 
            href="#" 
            className="block p-3 bg-gray-50 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-all duration-300 group hover-lift"
          >
            {name}
          </a>
        ))}
      </div>
    </div>
  </div>
</div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              ),
              title: 'Fast Conversion',
              desc: 'Convert images in seconds with optimized processing',
              color: 'blue'
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              ),
              title: 'Secure',
              desc: 'Your images are processed locally in your browser',
              color: 'green'
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              ),
              title: 'High Quality',
              desc: 'Maintain image quality during format conversion',
              color: 'purple'
            }
          ].map((feature, index) => (
            <div 
              key={feature.title}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover-lift animate-fadeIn"
              style={{animationDelay: `${0.3 + index * 0.1}s`, opacity: 0}}
            >
              <div className={`w-14 h-14 bg-${feature.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <svg className={`w-7 h-7 text-${feature.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* "Are you a happy user?" Section */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-indigo-500">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Are you a happy user?</h3>
          
          {/* Want more features */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <span className="text-gray-700">Want more features?</span>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all border border-indigo-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Upgrade to Pro
            </button>
          </div>

          {/* Buy us Coffee */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <span className="text-gray-700">Buy us Coffee</span>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-all border border-gray-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Donate
            </button>
          </div>

          {/* Sharing is caring */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <span className="text-gray-700">Sharing is caring</span>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all border border-blue-200 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
              <button className="flex items-center gap-1 px-3 py-2 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-all border border-sky-200 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
              </button>
              <button className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all border border-red-200 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
                Reddit
              </button>
              <button className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all border border-blue-200 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </button>
            </div>
          </div>

          {/* Come back */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <span className="text-gray-700">Come back!</span>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-all border border-gray-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Bookmark Page
            </button>
          </div>

          {/* Link to this tool */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <span className="text-gray-700">Link to this tool</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value="https://www.freeconvert.com/image-converter"
                readOnly
                className="px-3 py-2 bg-gray-50 text-gray-600 text-sm rounded-lg border border-gray-200 w-64"
              />
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            </div>
          </div>

          {/* Send Feedback */}
          <div className="flex items-center justify-between py-4">
            <span className="text-gray-700">Send Feedback</span>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-all border border-gray-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact us
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade Banner */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Want to convert large files without a queue or Ads?
            </h2>
            <p className="text-xl mb-8 text-indigo-100">Upgrade Now</p>
            <button className="px-8 py-4 bg-yellow-400 text-gray-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-xl">
              Sign Up
            </button>
          </div>
        </div>
      </div>

     

      {/* SETTINGS POPUP MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <h3 className="font-semibold text-lg text-gray-800">Advanced Options (Optional)</h3>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="text-gray-500 hover:text-gray-700 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                File Name: {selectedFileMeta?.name || 'N/A'} ({selectedFileMeta ? (selectedFileMeta.size / 1024).toFixed(2) : '0'} KB)
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border">
                <h4 className="font-semibold mb-3 text-gray-800">Image Options</h4>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resize Output Image</label>
                  <select value={settings.resize} onChange={(e) => setSettings(prev => ({ ...prev, resize: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                    <option value="keep-original">Keep original size</option>
                    <option value="custom">Custom Size</option>
                    <option value="percent">Percentage</option>
                  </select>

                  {settings.resize === 'custom' && (
                    <div className="mt-2 flex gap-2">
                      <input type="number" min="1" placeholder="Width" value={settings.width} onChange={(e) => setSettings(prev => ({ ...prev, width: e.target.value }))} className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                      <input type="number" min="1" placeholder="Height" value={settings.height} onChange={(e) => setSettings(prev => ({ ...prev, height: e.target.value }))} className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  )}
                  {settings.resize === 'percent' && (
                    <input type="number" min="1" max="200" placeholder="Percent (e.g., 50)" value={settings.width} onChange={(e) => setSettings(prev => ({ ...prev, width: e.target.value }))} className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input type="text" value={settings.bgColor} onChange={(e) => setSettings(prev => ({ ...prev, bgColor: e.target.value }))} className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="#FFFFFF" />
                    <input type="color" value={settings.bgColor} onChange={(e) => setSettings(prev => ({ ...prev, bgColor: e.target.value }))} className="w-10 h-10 border border-gray-300 rounded cursor-pointer" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compress Output Image</label>
                  <select value={settings.compression} onChange={(e) => setSettings(prev => ({ ...prev, compression: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                    <option value="none">No Compression</option>
                    <option value="low">Low Quality</option>
                    <option value="medium">Medium Quality</option>
                    <option value="high">High Quality</option>
                  </select>
                </div>

                <div className="flex items-start gap-2 mb-2">
                  <input type="checkbox" id="autoOrient" checked={settings.autoOrient} onChange={(e) => setSettings(prev => ({ ...prev, autoOrient: e.target.checked }))} className="mt-1 w-4 h-4 accent-indigo-600" />
                  <label htmlFor="autoOrient" className="text-sm text-gray-700">Correctly orient the image using EXIF data.</label>
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" id="stripMetadata" checked={settings.stripMetadata} onChange={(e) => setSettings(prev => ({ ...prev, stripMetadata: e.target.checked }))} className="mt-1 w-4 h-4 accent-indigo-600" />
                  <label htmlFor="stripMetadata" className="text-sm text-gray-700">Strip EXIF, profiles, and comments to reduce file size.</label>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center justify-between"
                  >
                    Apply to All Files
                    <svg className={`w-5 h-5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Apply from Preset</button>
                      <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Save as Preset</button>
                    </div>
                  )}

                </div>

                <button onClick={() => setIsSettingsOpen(false)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  Apply Settings
                </button>

                <button
                  onClick={() =>
                    setSettings({
                      resize: 'keep-original',
                      width: '',
                      height: '',
                      bgColor: '#FFFFFF',
                      compression: 'none',
                      autoOrient: false,
                      stripMetadata: false,
                    })
                  }
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Reset All Options
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== ADDED: Floating Chat Button + Chat Panel ===== */}
      <div className="fixed bottom-6 left-6 z-60">
        {/* Chat panel (opens when showChat true) */}
        {showChat && (
          <div className="mb-3 w-80 max-w-xs bg-white rounded-2xl shadow-2xl border overflow-hidden flex flex-col" role="dialog" aria-label="ImageBot chat">
            <div className="flex items-center justify-between px-4 py-3 bg-indigo-600 text-white">
              <div className="flex items-center gap-2">
                {/* small cat icon */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 11c1-4 5-6 9-6s8 2 9 6v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 11s1-2 4-2 4 2 4 2M9 14v.5M15 14v.5" />
                </svg>
                <span className="font-semibold">ImageBot</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setChatMessages([{ id: Date.now(), from: 'bot', text: 'Hi! I am ImageBot. Click the cat to start chatting.' }]); }} className="text-sm bg-white/20 px-2 py-1 rounded">Reset</button>
                <button onClick={() => setShowChat(false)} className="text-white/90 hover:text-white">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <div className="p-3 flex-1 overflow-y-auto max-h-64 space-y-2 bg-gray-50">
              {chatMessages.map((m) => (
                <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${m.from === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800'} px-3 py-2 rounded-lg shadow-sm max-w-[80%]`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t bg-white">
              <div className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleChatKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none"
                />
                <button onClick={sendChatMessage} className="px-3 py-2 bg-indigo-600 text-white rounded-lg">Send</button>
              </div>
            </div>
          </div>
        )}

        {/* Floating cat button */}
        <button
          onClick={handleChatToggle}
          aria-label={showChat ? 'Close chat' : 'Open chat'}
          className="w-14 h-14 rounded-full bg-indigo-600 shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform"
          title="Chat"
        >
          {/* Cat face svg */}
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 11c1-4 5-6 9-6s7 2 8 6v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 9s.5-2 4-2 4 2 4 2M9 13v.5M15 13v.5" />
          </svg>
        </button>
      </div>

      {/* Footer */}
      <footer className="glass-effect mt-16 py-8 border-t-2 border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <span className="font-bold text-gray-700">Image Converter Pro</span>
          </div>
          <p className="text-gray-600">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}