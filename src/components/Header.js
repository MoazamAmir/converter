import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const valuableTools = [
  { name: 'Image Converter', url: '/' },
  { name: 'Image Resizer', url: '/tools/image-resizer' },
  { name: 'Crop Image', url: '/tools/crop-image' },
  { name: 'Xe Image Compressor', url: '/tools/image-compressor' },
  { name: 'Color Picker', url: '/tools/color-picker' },
  { name: 'Rotate Image', url: '/tools/rotate-image' },
  { name: 'Collage Maker', url: '/tools/collage-maker' },
];

const toolTitleMap = {
  '/': 'Image Converter Pro',
  '/tools/image-resizer': 'Image Resizer Pro',
  '/tools/crop-image': 'Crop Image Pro',
  '/tools/image-compressor': 'Xe Image Compressor Pro',
  '/tools/color-picker': 'Color Picker Pro',
  '/tools/rotate-image': 'Rotate Image Pro',
  '/tools/collage-maker': 'Collage Maker Pro',
};

const toolIconMap = {
  '/': 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  '/tools/image-resizer': 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4',
  '/tools/crop-image': 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
  '/tools/image-compressor': 'M19 14l-7 7m0 0l-7-7m7 7V3',
  '/tools/color-picker': 'M7 21a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7z',
  '/tools/rotate-image': 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  '/tools/collage-maker': 'M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z',
};

export default function Header({ isDarkMode, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Body scroll ko control karna jab menu open ho
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const currentTitle = toolTitleMap[location.pathname] || 'Image Tools Pro';
  const currentIconPath = toolIconMap[location.pathname] || toolIconMap['/'];

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b-4 transition-colors duration-300 ${isDarkMode
            ? 'bg-[#111727] border-indigo-600 text-white'
            : 'bg-white border-indigo-500 text-[#111727]'
          } shadow-lg`}
      >
        <div className="w-full px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-all ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Center: Title */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 lg:flex-initial justify-center lg:justify-start">
              <h1 className="font-bold text-lg sm:text-xl md:text-2xl" style={{ color: "#6C46FF" }}>
                Pro Image Toolkit
              </h1>

            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-4 xl:gap-6 flex-1 justify-center">
              {valuableTools.map((tool) => {
                const isActive = location.pathname === tool.url;
                return (
                  <button
                    key={tool.url}
                    onClick={() => navigate(tool.url)}
                    className={`relative pb-1 text-xs xl:text-sm ${isActive
                        ? (isDarkMode ? 'text-white font-semibold' : 'text-[#111727] font-semibold')
                        : isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      } hover:text-indigo-400 transition-colors whitespace-nowrap`}
                  >
                    {tool.name}
                    {isActive && (
                      <span
                        className={`absolute bottom-0 left-0 w-full h-0.5 ${isDarkMode ? 'bg-white' : 'bg-[#111727]'
                          }`}
                      ></span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Desktop Buttons */}
            <div className="hidden lg:flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'
                  }`}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <button className={`px-3 py-2 border rounded hover:bg-opacity-80 text-sm ${isDarkMode ? 'text-white border-gray-600 hover:bg-gray-800' : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}>
                Login
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                Signup
              </button>
            </div>

            {/* Empty spacer for mobile */}
            <div className="lg:hidden w-10"></div>
          </div>
        </div>

        {/* Mobile Menu - Full Screen with New Design */}
        {isMenuOpen && (
          <div className={`lg:hidden fixed inset-0 top-[72px] z-50 ${isDarkMode ? 'bg-[#0f1419]' : 'bg-white'
            }`}>
            <div className="h-full overflow-y-auto">
              <div className="px-4 py-6">

                {/* Tools Grid */}
                <div className="mb-8">
                  <h2 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                    Tools
                  </h2>
                  <div className="space-y-2">
                    {valuableTools.map((tool) => {
                      const isActive = location.pathname === tool.url;
                      return (
                        <button
                          key={tool.url}
                          onClick={() => {
                            navigate(tool.url);
                            setIsMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${isActive
                              ? (isDarkMode
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                                : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-300/50')
                              : (isDarkMode
                                ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/70'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100')
                            }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive
                              ? 'bg-white/20'
                              : (isDarkMode ? 'bg-gray-700' : 'bg-white')
                            }`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d={toolIconMap[tool.url] || toolIconMap['/']} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <span className="font-medium text-left">{tool.name}</span>
                          {isActive && (
                            <svg className="w-5 h-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Settings Section */}
                <div className="mb-8">
                  <h2 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                    Settings
                  </h2>

                  {/* Theme Toggle Card */}
                  <button
                    onClick={toggleTheme}
                    className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all ${isDarkMode
                        ? 'bg-gray-800/50 text-white hover:bg-gray-700/70'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-white'
                        }`}>
                        {isDarkMode ? (
                          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'
                        }`}></div>
                    </div>
                  </button>
                </div>

                {/* Account Section */}
                <div>
                  <h2 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                    Account
                  </h2>
                  <div className="space-y-3">
                    <button className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-semibold transition-all ${isDarkMode
                        ? 'text-white border-gray-600 hover:bg-gray-800 hover:border-gray-500'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                      }`}>
                      Login
                    </button>
                    <button className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 text-sm font-semibold shadow-lg shadow-indigo-500/30 transition-all">
                      Sign Up Free
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}