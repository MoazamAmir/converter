import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const valuableTools = [
  { name: 'Image Converter', url: '/' },
  { name: 'Image Resizer', url: '/tools/image-resizer' },
  { name: 'Crop Image', url: '/tools/crop-image' },
  { name: 'Image Compressor', url: '/tools/image-compressor' },
  { name: 'Color Picker', url: '/tools/color-picker' },
  { name: 'Rotate Image', url: '/tools/rotate-image' },
  { name: 'Collage Maker', url: '/tools/collage-maker' },
];

const toolTitleMap = {
  '/': 'Image Converter Pro',
  '/tools/image-resizer': 'Image Resizer Pro',
  '/tools/crop-image': 'Crop Image Pro',
  '/tools/image-compressor': 'Image Compressor Pro',
  '/tools/color-picker': 'Color Picker Pro',
  '/tools/rotate-image': 'Rotate Image Pro',
  '/tools/collage-maker': 'Collage Maker Pro',
};

const toolIconMap = {
  '/': 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  '/tools/image-resizer': 'M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-3 0V4M7 20v-2a1 1 0 011-1h8a1 1 0 011 1v2M4 12H2a1 1 0 00-1 1v6a1 1 0 001 1h2',
  '/tools/crop-image': 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
  '/tools/image-compressor': 'M12 5v14m7-7H5',
  '/tools/color-picker': 'M7 21a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7z',
  '/tools/rotate-image': 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  '/tools/collage-maker': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l3.414 3.414A1 1 0 0117 7.414V19a2 2 0 01-2 2z',
};

export default function Header({ isDarkMode, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentTitle = toolTitleMap[location.pathname] || 'Image Tools Pro';
  const currentIconPath = toolIconMap[location.pathname] || toolIconMap['/'];

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b-4 transition-colors duration-300 ${
          isDarkMode
            ? 'bg-[#111727] border-indigo-600 text-white'
            : 'bg-white border-indigo-500 text-[#111727]'
        } shadow-lg`}
      >
        <div className="w-full px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">

            {/* Mobile Menu Button - Start par */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
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

            {/* Center: Logo + Title - Mobile par center, Desktop par left */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 lg:flex-initial justify-center lg:justify-start">
              {/* Logo - Bara size */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d={currentIconPath} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {/* Title - Bara text */}
              <h1 className="font-bold text-lg sm:text-xl md:text-2xl">{currentTitle}</h1>
            </div>

            {/* Center: Navigation - Desktop par center ma, mobile par hidden */}
            <nav className="hidden lg:flex gap-4 xl:gap-6 flex-1 justify-center">
              {valuableTools.map((tool) => {
                const isActive = location.pathname === tool.url;
                return (
                  <button
                    key={tool.url}
                    onClick={() => navigate(tool.url)}
                    className={`relative pb-1 text-xs xl:text-sm ${
                      isActive
                        ? (isDarkMode ? 'text-white font-semibold' : 'text-[#111727] font-semibold')
                        : isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    } hover:text-indigo-400 transition-colors whitespace-nowrap`}
                  >
                    {tool.name}
                    {isActive && (
                      <span
                        className={`absolute bottom-0 left-0 w-full h-0.5 ${
                          isDarkMode ? 'bg-white' : 'bg-[#111727]'
                        }`}
                      ></span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right: Theme Toggle + Buttons - Desktop par visible, Mobile par hidden */}
            <div className="hidden lg:flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${
                  isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'
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

              {/* Login/Signup Buttons */}
              <button className={`px-3 py-2 border rounded hover:bg-opacity-80 text-sm ${
                isDarkMode ? 'text-white border-gray-600 hover:bg-gray-800' : 'text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}>
                Login
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                Signup
              </button>
            </div>

            {/* Empty spacer for mobile to balance layout */}
            <div className="lg:hidden w-10"></div>
          </div>
        </div>

        {/* Mobile Menu Dropdown - Scrollable */}
        {isMenuOpen && (
          <div className={`lg:hidden border-t max-h-[calc(100vh-80px)] overflow-y-auto ${
            isDarkMode ? 'border-gray-700 bg-[#1a2332]' : 'border-gray-200 bg-gray-50'
          }`}>
            <nav className="flex flex-col py-2">
              {/* Tools List */}
              {valuableTools.map((tool) => {
                const isActive = location.pathname === tool.url;
                return (
                  <button
                    key={tool.url}
                    onClick={() => {
                      navigate(tool.url);
                      setIsMenuOpen(false);
                    }}
                    className={`px-4 py-3 text-left text-sm ${
                      isActive
                        ? (isDarkMode ? 'bg-indigo-600 text-white font-semibold' : 'bg-indigo-100 text-indigo-700 font-semibold')
                        : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    } transition-colors`}
                  >
                    {tool.name}
                  </button>
                );
              })}
              
              {/* Divider */}
              <div className={`my-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>

              {/* Theme Toggle in Mobile Menu */}
              <button
                onClick={toggleTheme}
                className={`mx-4 mb-2 px-4 py-3 rounded-lg flex items-center justify-between text-sm ${
                  isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                {isDarkMode ? (
                  <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Mobile Login/Signup buttons */}
              <div className="flex flex-col gap-2 px-4 pb-3">
                <button className={`px-4 py-3 border rounded-lg text-sm font-medium ${
                  isDarkMode ? 'text-white border-gray-600 hover:bg-gray-700' : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}>
                  Login
                </button>
                <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                  Signup
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}