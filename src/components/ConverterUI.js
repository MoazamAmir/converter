import React from 'react';

export default function ConverterUI(props) {
  const {
    files,
    setFiles,
    convertedFiles,
    isConverting,
    isToolsOpen,
    setIsToolsOpen,
    showUploadMenu,
    setShowUploadMenu,
    formatSearch,
    setFormatSearch,
    isSettingsOpen,
    setIsSettingsOpen,
    showResults,
    downloadProgress,
    isConvertersOpen,
    setIsConvertersOpen,
    settings,
    setSettings,
    handleFileChange,
    handleDragOver,
    handleDrop,
    handleAddFromUrl,
    handleCloudFallback,
    handleRemoveFile,
    handleConvert,
    handleDownload,
    handleConvertMore,
    resetConverter,
    formats,
    filteredFormats,
    setFileOutputFormat,
    showFormatMenuFor,
    setShowFormatMenuFor,
    handleChatToggle,
    showChat,
    chatMessages,
    chatInput,
    setChatInput,
    sendChatMessage,
    handleChatKeyDown,
  } = props;

  const [headerHovered, setHeaderHovered] = React.useState(false);
  const [showDownloadMenuFor, setShowDownloadMenuFor] = React.useState(null);
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef(null);

  const menuCloseTimeout = React.useRef(null);

  React.useEffect(() => {
    if (typeof props.setShowDropdown === 'function') {
      props.setShowDropdown(headerHovered);
    }
  }, [headerHovered, props.setShowDropdown]);

  const openFormatMenu = (index) => {
    setShowFormatMenuFor(index);
    setFormatSearch('');
  };

  const closeFormatMenu = () => {
    setShowFormatMenuFor(null);
    setFormatSearch('');
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // ✅ Helper for dynamic tool gradient
  const getToolBgClass = (color) => {
    const map = {
      blue: 'from-blue-500 to-indigo-600',
      green: 'from-green-500 to-emerald-600',
      purple: 'from-purple-500 to-violet-600',
      pink: 'from-pink-500 to-rose-600',
      indigo: 'from-indigo-500 to-purple-600',
      orange: 'from-orange-500 to-red-500'
    };
    return map[color] || 'from-gray-500 to-gray-600';
  };

  // Valuable Tools Data with URLs
  const valuableTools = [
    { name: 'Image Resizer', desc: 'Quick and easy way to resize an image to any size', color: 'blue', url: '/tools/image-resizer' },
    { name: 'Crop Image', desc: 'Use this tool to crop unwanted areas from your image', color: 'green', url: '/tools/crop-image' },
    { name: 'Image Compressor', desc: 'Reduce image files size by up to 80 to 90% using this tool', color: 'purple', url: '/tools/image-compressor' },
    { name: 'Color Picker', desc: 'Quickly pick a color from the color wheel or from your image online', color: 'pink', url: '/tools/color-picker' },
    { name: 'Image Enlarger', desc: 'A fast way to make your images bigger', color: 'indigo', url: '/tools/image-enlarger' },
    { name: 'Collage Maker', desc: 'Create a beautiful photo collage from your photos', color: 'orange', url: '/tools/collage-maker' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 overflow-x-hidden">
      <style>{`
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
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
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">

          {/* Left: Logo and title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div className="leading-none text-center sm:text-left">
              <div className="text-sm sm:text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Image Converter Pro
              </div>
              <div className="text-xs text-gray-500 hidden sm:block">Convert images instantly</div>
            </div>
          </div>

          {/* Center: Animated clickable feature list */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-8 text-[10px] sm:text-sm font-medium">
            {valuableTools.map((tool, index) => (
              <a
                key={index}
                href={tool.url}
                className="relative text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                {tool.name}
              </a>
            ))}
          </div>
          {/* Right: Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="hidden sm:block px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 transition-all duration-200">
              Log In
            </button>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-all duration-200">
              Sign Up
            </button>
            <button
              onClick={() => props.setShowDropdown?.(prev => !prev)}
              className="md:hidden ml-1 sm:ml-2 p-1.5 sm:p-2 rounded-lg border border-gray-200"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>


      {/* Hero Header */}
      <header className="glass-effect shadow-lg sticky top-0 z-50 border-b-4 border-indigo-500">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center">
              Image Converter Pro
            </h1>
          </div>
          <p className="text-center text-gray-600 mt-2 text-sm sm:text-base md:text-lg px-2">Convert images to JPG, PNG, WebP and more formats instantly</p>
        </div>
      </header>
      <div className="text-center mt-5">
        <div className="bg-blue-100 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center min-h-[80px] mx-auto w-[300px] sm:w-[400px] md:w-[700px] shadow-md">
          <p className="text-blue-800 text-sm sm:text-base font-semibold">Ad Space 728x90</p>
          <p className="text-blue-600 text-xs sm:text-sm mt-1">Leaderboard Banner Ad Here</p>
        </div>
      </div>



      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        {/* CONVERSION RESULTS SCREEN */}

        {showResults && convertedFiles.length > 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 hover-lift border-t-4 border-green-500 animate-slideIn">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                {convertedFiles.length} File{convertedFiles.length > 1 ? 's' : ''} Converted!
              </h2>
              <p className="text-sm sm:text-base text-gray-600">Your images have been successfully converted</p>
            </div>
            <div className="space-y-6">
              {convertedFiles.map((cf, idx) => (
                <div key={cf.name} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
                  <div className="border-2 rounded-lg p-2 bg-white shadow-inner mb-4">
                    {cf.name.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i) ? (
                      <img src={cf.url} alt="Converted" className="w-full h-auto rounded max-h-64 sm:max-h-96 object-contain" />
                    ) : (
                      <div className="text-center py-6 text-gray-600">📄 {cf.name}</div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div className="bg-white p-2 sm:p-3 rounded-lg shadow">
                      <p className="text-xs text-gray-500 mb-1">File Name</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{cf.name}</p>
                    </div>
                    <div className="bg-white p-2 sm:p-3 rounded-lg shadow">
                      <p className="text-xs text-gray-500 mb-1">Format</p>
                      <p className="text-xs sm:text-sm font-semibold text-indigo-600 uppercase">
                        {cf.name.split('.').pop()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1" ref={menuRef}>
                      <button
                        onClick={toggleMenu}
                        className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:opacity-90 transition"
                      >
                        Download {cf.name.split(".").pop().toUpperCase()}
                      </button>
                      {showMenu && (
                        <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg z-20 border animate-fadeIn">
                          <button
                            onClick={() => {
                              handleDownload(cf);
                              setShowMenu(false);
                            }}
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100 transition"
                          >
                            💾 Save to Device
                          </button>
                          <button disabled className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-400 cursor-not-allowed">
                            ☁️ Save to Google Drive
                          </button>
                          <button disabled className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-400 cursor-not-allowed">
                            📦 Save to Dropbox
                          </button>
                          <button disabled className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-400 cursor-not-allowed">
                            🧩 Save to OneDrive
                          </button>
                          <button disabled className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-400 cursor-not-allowed">
                            🔗 Generate QR Code
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleConvertMore}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold"
              >
                Convert More
              </button>
              <button
                onClick={resetConverter}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg font-bold"
              >
                Clear All
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 hover-lift border-t-4 border-indigo-500">
            <div className="mb-4 sm:mb-6">
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="mb-4 sm:mb-6">
                {files.length === 0 ? (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="rounded-lg sm:rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50/40 p-8 sm:p-12 text-center cursor-pointer transition-shadow hover:shadow-lg"
                    onClick={() => {
                      document.getElementById('fileInput')?.click();
                    }}
                  >
                    <div className="flex flex-col items-center justify-center gap-2 sm:gap-3">
                      <svg className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0l4-4m-4 4-4-4"></path>
                      </svg>
                      <div className="text-base sm:text-lg font-semibold text-indigo-700">Drop images here or click to choose</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 sm:gap-4 mb-4">
                    <div className="relative">
                      <button
                        onClick={() => setShowUploadMenu(!showUploadMenu)}
                        className="flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-indigo-100 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-200 transition-all text-xs sm:text-base"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        <span className="hidden sm:inline">Add More Files</span>
                        <span className="sm:hidden">Add Files</span>
                        <svg className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showUploadMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>
                      {showUploadMenu && (
                        <div className="absolute top-full left-0 mt-2 w-48 sm:w-64 bg-indigo-600 rounded-lg shadow-xl z-50 overflow-hidden">
                          <button
                            onClick={() => document.getElementById('fileInput')?.click()}
                            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-white hover:bg-indigo-700 transition-all text-xs sm:text-base"
                          >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            From Device
                          </button>
                          <button onClick={handleCloudFallback} className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-white hover:bg-indigo-700 transition-all text-xs sm:text-base">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"></path>
                            </svg>
                            From Dropbox
                          </button>
                          <button onClick={handleAddFromUrl} className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-white hover:bg-indigo-700 transition-all text-xs sm:text-base">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                            </svg>
                            From URL
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {files.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">Added Files ({files.length})</p>
                    <button onClick={() => setFiles([])} className="text-xs sm:text-sm text-red-500">Clear All</button>
                  </div>
                  <div className="space-y-2">
                    {files.map((f, idx) => (
                      <div key={`${f.name}-${idx}`} className="flex items-center justify-between p-2 rounded bg-white">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center border-2 border-dashed border-indigo-300 rounded overflow-hidden bg-white">
                            <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-800 text-xs sm:text-sm truncate">{f.name}</p>
                            <p className="text-xs text-gray-500">{f.formattedSize}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
                          <div className="relative">
                            <button
                              onClick={() => openFormatMenu(idx)}
                              className="px-2 sm:px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-xs sm:text-sm"
                            >
                              {f.outputFormat.toUpperCase()}
                            </button>
                            {showFormatMenuFor === idx && (
                              <div
                                className="absolute top-full left-0 mt-1 w-48 bg-white rounded shadow-lg z-50 border max-h-60 overflow-y-auto"
                                onMouseLeave={closeFormatMenu}
                              >
                                <input
                                  type="text"
                                  value={formatSearch}
                                  onChange={(e) => setFormatSearch(e.target.value)}
                                  placeholder="Search..."
                                  className="w-full px-2 py-1 text-sm border-b"
                                />
                                <div className="p-1">
                                  {filteredFormats.map((fmt) => (
                                    <button
                                      key={fmt.value}
                                      onClick={() => {
                                        setFileOutputFormat(idx, fmt.value);
                                        closeFormatMenu();
                                      }}
                                      className={`block w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 ${f.outputFormat === fmt.value ? 'bg-indigo-100 font-medium' : ''}`}
                                    >
                                      {fmt.name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveFile(idx)}
                            className="px-2 sm:px-3 py-1 bg-red-100 text-red-700 rounded text-xs sm:text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleConvert}
              disabled={files.length === 0 || isConverting}
              className={`w-full py-3 sm:py-4 rounded-lg text-white font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 ${files.length === 0 || isConverting ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                }`}
            >
              {isConverting ? (
                <>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Converting ({downloadProgress}%)...
                </>
              ) : (
                <>
                  Convert All
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </>
              )}
            </button>
            <div className="mt-6 sm:mt-8 bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded">
              <p className="text-xs sm:text-sm text-gray-700">
                Convert images directly in your browser with our <span className="font-semibold">Image Converter</span>.
              </p>
            </div>
          </div>
        )}

        {/*Left Vertical Ad (Top Spaced) */}
        <div className="hidden lg:block absolute left-4 top-[320px]">
          <div className="bg-blue-100 rounded-lg p-4 flex flex-col items-center justify-center w-[120px] h-[500px] shadow-md">
            {/* <p className="text-blue-800 text-sm font-semibold rotate-90 whitespace-nowrap">
      Ad Space 120x300
    </p> */}
            <p className="text-blue-600 text-xs mt-2 rotate-90 whitespace-nowrap">
              Left Skyscraper Banner
            </p>
          </div>
        </div>

        {/*Right Vertical Ad (Top Spaced) */}
        <div className="hidden lg:block absolute right-4 top-[320px]">
          <div className="bg-blue-100 rounded-lg p-4 flex flex-col items-center justify-center w-[120px] h-[500px] shadow-md">
            {/* <p className="text-blue-800 text-sm font-semibold rotate-90 whitespace-nowrap">
      Ad Space 120x300
    </p> */}
            <p className="text-blue-600 text-xs mt-2 rotate-90 whitespace-nowrap">
              Right Skyscraper Banner
            </p>
          </div>
        </div>
        {/* How to Convert Section */}
        <div className="mt-8 sm:mt-12 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 animate-fadeIn" style={{ animationDelay: '0.4s', opacity: 0 }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl">❓</span>
            How to Convert Images?
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl hover-lift">
              <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">1</span>
              <div>
                <p className="text-gray-700 text-sm sm:text-base">Click the <span className="font-bold text-indigo-600">"Add More Files"</span> button and select from Device, Dropbox, Google Drive, OneDrive, or URL.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg sm:rounded-xl hover-lift">
              <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">2</span>
              <div>
                <p className="text-gray-700 text-sm sm:text-base">Select a target image format from the <span className="font-bold text-purple-600">"Output"</span> drop-down list.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl hover-lift">
              <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">3</span>
              <div>
                <p className="text-gray-700 text-sm sm:text-base">Click on the <span className="font-bold text-green-600">"Convert"</span> button to start the conversion.</p>
              </div>
            </div>
          </div>
        </div>

        {/*UPDATED: Valuable Image Tools Section */}
        <div className="mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 animate-fadeIn" style={{ animationDelay: '0.5s', opacity: 0 }}>
          <button
            className="w-full flex items-center justify-between text-left group"
            onClick={() => setIsToolsOpen(!isToolsOpen)}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl">🛠️</span>
              Valuable Image Tools
            </h2>
            <svg
              className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-600 transition-transform duration-300 ${isToolsOpen ? 'rotate-180' : ''}`}
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
            <p className="text-gray-600 mt-4 mb-4 sm:mb-6 text-sm sm:text-base">Here is a list of image tools to further edit your images.</p>
            <div className="space-y-2 sm:space-y-3">
              {valuableTools.map((tool, index) => (
                <div
                  key={tool.name}
                  className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 hover-lift group"
                >
                  <span className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm bg-gradient-to-br ${getToolBgClass(tool.color)}`}>
                    {index + 1}
                  </span>
                  <div className="text-sm sm:text-base">
                    <a
                      href={tool.url}
                      className="font-bold text-indigo-600 hover:text-indigo-800 group-hover:underline"
                    >
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
          className="mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 animate-fadeIn"
          style={{ animationDelay: '0.5s', opacity: 0 }}
        >
          <button
            onClick={() => setIsConvertersOpen(!isConvertersOpen)}
            className="w-full flex items-center justify-between text-left group"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl">🔄</span>
              Specific Image Converters
            </h2>
            <svg
              className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-600 transition-transform duration-300 ${isConvertersOpen ? 'rotate-180' : ''}`}
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
            <p className="text-gray-600 mt-4 mb-4 sm:mb-6 text-sm sm:text-base">
              Convert your images between many popular formats using these online tools.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              <div className="space-y-2 sm:space-y-3">
                {[
                  'DJV Converter', 'ART Converter', 'DDS Converter', 'PCX Converter', 'EMZ Converter',
                  'DJVU Converter', 'JXL Converter', 'JFIF Converter', 'X3F Converter', 'NEF Converter'
                ].map(name => (
                  <a
                    key={name}
                    href="#"
                    className="block p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 text-indigo-600 hover:text-indigo-800 font-medium text-xs sm:text-sm transition-all duration-300 group hover-lift"
                  >
                    {name}
                  </a>
                ))}
              </div>
              <div className="space-y-2 sm:space-y-3">
                {[
                  'EPS Converter', 'DPX Converter', 'HEIC Converter', 'TIF Converter', 'TGA Converter',
                  'CBZ Converter', 'ICO Converter', 'PSB Converter', 'Panasonic RAW Converter', 'RWL Converter'
                ].map(name => (
                  <a
                    key={name}
                    href="#"
                    className="block p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 text-indigo-600 hover:text-indigo-800 font-medium text-xs sm:text-sm transition-all duration-300 group hover-lift"
                  >
                    {name}
                  </a>
                ))}
              </div>
              <div className="space-y-2 sm:space-y-3">
                {[
                  'PPM Converter', 'WMZ Converter', 'AVIF Converter', 'JPEG Converter', 'DIB Converter',
                  'HEIF Converter', 'CBR Converter', 'ARW Converter', 'NRW Converter', 'Sigma RAW Converter'
                ].map(name => (
                  <a
                    key={name}
                    href="#"
                    className="block p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 text-indigo-600 hover:text-indigo-800 font-medium text-xs sm:text-sm transition-all duration-300 group hover-lift"
                  >
                    {name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>,
              title: 'Fast Conversion',
              desc: 'Convert images in seconds with optimized processing',
              color: 'blue'
            },
            {
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>,
              title: 'Secure',
              desc: 'Your images are processed locally in your browser',
              color: 'green'
            },
            {
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>,
              title: 'High Quality',
              desc: 'Maintain image quality during format conversion',
              color: 'purple'
            }
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 text-center hover-lift animate-fadeIn"
              style={{ animationDelay: `${0.3 + index * 0.1}s`, opacity: 0 }}
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-${feature.color}-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                <svg className={`w-6 h-6 sm:w-7 sm:h-7 text-${feature.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="font-bold text-lg sm:text-xl mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-lg text-gray-800">Advanced Options</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="bg-gray-50 p-4 rounded-xl border">
                <h4 className="font-semibold mb-3 text-gray-800">Image Options</h4>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resize Output Image</label>
                  <select
                    value={settings.resize}
                    onChange={(e) => setSettings((prev) => ({ ...prev, resize: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="keep-original">Keep original size</option>
                    <option value="custom">Custom Size</option>
                    <option value="percent">Percentage</option>
                  </select>
                  {settings.resize === 'custom' && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="number"
                        min="1"
                        placeholder="Width"
                        value={settings.width}
                        onChange={(e) => setSettings((prev) => ({ ...prev, width: e.target.value }))}
                        className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="Height"
                        value={settings.height}
                        onChange={(e) => setSettings((prev) => ({ ...prev, height: e.target.value }))}
                        className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                  {settings.resize === 'percent' && (
                    <input
                      type="number"
                      min="1"
                      max="200"
                      placeholder="Percent (e.g., 50)"
                      value={settings.width}
                      onChange={(e) => setSettings((prev) => ({ ...prev, width: e.target.value }))}
                      className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={settings.bgColor}
                      onChange={(e) => setSettings((prev) => ({ ...prev, bgColor: e.target.value }))}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="#FFFFFF"
                    />
                    <input
                      type="color"
                      value={settings.bgColor}
                      onChange={(e) => setSettings((prev) => ({ ...prev, bgColor: e.target.value }))}
                      className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compress Output Image</label>
                  <select
                    value={settings.compression}
                    onChange={(e) => setSettings((prev) => ({ ...prev, compression: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="none">No Compression</option>
                    <option value="low">Low Quality</option>
                    <option value="medium">Medium Quality</option>
                    <option value="high">High Quality</option>
                  </select>
                </div>
                <div className="flex items-start gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="autoOrient"
                    checked={settings.autoOrient}
                    onChange={(e) => setSettings((prev) => ({ ...prev, autoOrient: e.target.checked }))}
                    className="mt-1 w-4 h-4 accent-indigo-600"
                  />
                  <label htmlFor="autoOrient" className="text-sm text-gray-700">
                    Correctly orient the image using EXIF data.
                  </label>
                </div>
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="stripMetadata"
                    checked={settings.stripMetadata}
                    onChange={(e) => setSettings((prev) => ({ ...prev, stripMetadata: e.target.checked }))}
                    className="mt-1 w-4 h-4 accent-indigo-600"
                  />
                  <label htmlFor="stripMetadata" className="text-sm text-gray-700">
                    Strip EXIF, profiles, and comments to reduce file size.
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
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
                      autoOrient: true,
                      stripMetadata: true,
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

      {/* Floating Chat */}
      <div className="fixed bottom-6 left-6 z-60">
        {showChat && (
          <div className="mb-3 w-80 max-w-xs bg-white rounded-2xl shadow-2xl border overflow-hidden flex flex-col" role="dialog" aria-label="ImageBot chat">
            <div className="flex items-center justify-between px-4 py-3 bg-indigo-600 text-white">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 11c1-4 5-6 9-6s8 2 9 6v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 11s1-2 4-2 4 2 4 2M9 14v.5M15 14v.5" />
                </svg>
                <span className="font-semibold">ImageBot</span>
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
        <button
          onClick={handleChatToggle}
          aria-label={showChat ? 'Close chat' : 'Open chat'}
          className="w-14 h-14 rounded-full bg-indigo-600 shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform"
          title="Chat"
        >
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