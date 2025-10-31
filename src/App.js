import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useConverter from './hooks/useConverter';
import ConverterUI from './components/ConverterUI';
import ImageResizerPage from './pages/ImageResizerPage';
import CropImagePage from './pages/CropImagePage';
import ImageCompressorPage from './pages/ImageCompressorPage';
import ColorPickerPage from './pages/ColorPickerPage';
import RotateImagePage from './pages/RotateImagePage';
import CollageMakerPage from './pages/CollageMakerPage';

function App() {
  const vm = useConverter();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ConverterUI {...vm} />} />
        <Route path="/tools/image-resizer" element={<ImageResizerPage />} />
        <Route path="/tools/crop-image" element={<CropImagePage />} />
        <Route path="/tools/image-compressor" element={<ImageCompressorPage />} />
        <Route path="/tools/color-picker" element={<ColorPickerPage />} />
        <Route path="/tools/rotate-image" element={<RotateImagePage />} />
        <Route path="/tools/collage-maker" element={<CollageMakerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;