import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useConverter from './hooks/useConverter';
import ConverterUI from './components/ConverterUI';
import ImageResizerPage from './pages/ImageResizerPage';
import CropImagePage from './pages/CropImagePage';
import ImageCompressorPage from './pages/ImageCompressorPage';
import ColorPickerPage from './pages/ColorPickerPage';
import ImageEnlargerPage from './pages/ImageEnlargerPage';
import CollageMakerPage from './pages/CollageMakerPage';

function App() {
  const vm = useConverter(); // Get all state & handlers

  return (
    <BrowserRouter>
      <Routes>
        {/* Pass `vm` props to ConverterUI */}
        <Route path="/" element={<ConverterUI {...vm} />} />

        {/* Tool pages — no props needed (standalone) */}
        <Route path="/pages/image-resizer" element={<ImageResizerPage />} />
        <Route path="/pages/crop-image" element={<CropImagePage />} />
        <Route path="/pages/image-compressor" element={<ImageCompressorPage />} />
        <Route path="/pages/color-picker" element={<ColorPickerPage />} />
        <Route path="/pages/image-enlarger" element={<ImageEnlargerPage />} />
        <Route path="/pages/collage-maker" element={<CollageMakerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;