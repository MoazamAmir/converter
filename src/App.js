// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useConverter from './hooks/useConverter';
import Header from './components/Header'; // ✅ Import new Header
import ConverterUI from './pages/ConverterUI';
import ImageResizerPage from './pages/ImageResizerPage';
import CropImagePage from './pages/CropImagePage';
import ImageCompressorPage from './pages/ImageCompressorPage';
import ColorPickerPage from './pages/ColorPickerPage';
import RotateImagePage from './pages/RotateImagePage';
import CollageMakerPage from './pages/CollageMakerPage';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <div className={isDarkMode ? 'bg-black text-white' : 'bg-[#fafbff] text-[#111727]'}>
      <BrowserRouter>
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<ConverterWrapper isDarkMode={isDarkMode} />} />
            <Route path="/tools/image-resizer" element={<ImageResizerPage isDarkMode={isDarkMode} />} />
            <Route path="/tools/crop-image" element={<CropImagePage isDarkMode={isDarkMode} />} />
            <Route path="/tools/image-compressor" element={<ImageCompressorPage isDarkMode={isDarkMode} />} />
            <Route path="/tools/color-picker" element={<ColorPickerPage isDarkMode={isDarkMode} />} />
            <Route path="/tools/rotate-image" element={<RotateImagePage isDarkMode={isDarkMode} />} />
            <Route path="/tools/collage-maker" element={<CollageMakerPage isDarkMode={isDarkMode} />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

function ConverterWrapper({ isDarkMode }) {
  const vm = useConverter();
  return <ConverterUI {...vm} isDarkMode={isDarkMode} />;
}

export default App;