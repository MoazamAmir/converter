import React, { useState, useRef } from 'react';
import { Download, Upload, Trash2, Layers, ImagePlus, Palette, Sliders, RotateCw, ZoomIn, Sparkles, Moon, Sun } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';

const CollageApp = ({ isDarkMode = false }) => {
  const [images, setImages] = useState([]);
  const [layout, setLayout] = useState({
    name: '2×2',
    cols: 2,
    rows: 2,
    type: 'grid'
  });
  const [spacing, setSpacing] = useState(10);
  const [backgroundColor, setBackgroundColor] = useState('#F59E0B');
  const [collageImages, setCollageImages] = useState([]);
  const [roundness, setRoundness] = useState(20);
  const fileInputRef = useRef(null); // This will now reference a real input
  const colorPickerRef = useRef(null);
  const location = useLocation();

  // Theme classes based on prop
  const bgPrimary = isDarkMode ? 'bg-[#111727]' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100';
  const bgCard = isDarkMode ? 'bg-[#1a2332]' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const textTertiary = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDarkMode ? 'bg-[#1f2937]' : 'bg-white';
  const buttonBg = isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800';
  const adBg = isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-100 border-blue-200';
  const adText = isDarkMode ? 'text-blue-300' : 'text-blue-800';
  const adSubText = isDarkMode ? 'text-blue-400' : 'text-blue-600';
  const emptySlotBg = isDarkMode ? 'bg-[#1f2937]' : 'bg-gradient-to-br from-gray-50 to-gray-100';
  const emptySlotHover = isDarkMode ? 'hover:bg-[#1a2332]' : 'hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200';

  const layouts = [
    // Grid layouts
    { name: '1×1', cols: 1, rows: 1, type: 'grid' },
    { name: '1×2', cols: 1, rows: 2, type: 'grid' },
    { name: '2×1', cols: 2, rows: 1, type: 'grid' },
    { name: '2×2', cols: 2, rows: 2, type: 'grid' },
    { name: '3×2', cols: 3, rows: 2, type: 'grid' },
    { name: '2×3', cols: 2, rows: 3, type: 'grid' },
    { name: '3×3', cols: 3, rows: 3, type: 'grid' },
    { name: '4×3', cols: 4, rows: 3, type: 'grid' },
    { name: '3×4', cols: 3, rows: 4, type: 'grid' },

    // Freeform layouts
    {
      name: 'Overlap',
      type: 'freeform',
      positions: [
        { x: 0.1, y: 0.1, width: 0.35, height: 0.35, rotation: -5 },
        { x: 0.3, y: 0.2, width: 0.35, height: 0.35, rotation: 5 },
        { x: 0.5, y: 0.15, width: 0.35, height: 0.35, rotation: -3 }
      ]
    },
    {
      name: 'Stack',
      type: 'freeform',
      positions: [
        { x: 0.1, y: 0.1, width: 0.8, height: 0.6, rotation: 0 },
        { x: 0.25, y: 0.2, width: 0.55, height: 0.45, rotation: 3 },
        { x: 0.35, y: 0.3, width: 0.35, height: 0.35, rotation: -3 }
      ]
    },
    {
      name: 'Diagonal',
      type: 'freeform',
      positions: [
        { x: 0.05, y: 0.05, width: 0.3, height: 0.3, rotation: 0 },
        { x: 0.35, y: 0.35, width: 0.3, height: 0.3, rotation: 0 },
        { x: 0.65, y: 0.65, width: 0.3, height: 0.3, rotation: 0 }
      ]
    },
    {
      name: 'Tilted',
      type: 'freeform',
      positions: [
        { x: 0.1, y: 0.1, width: 0.3, height: 0.3, rotation: 12 },
        { x: 0.35, y: 0.25, width: 0.3, height: 0.3, rotation: -8 },
        { x: 0.6, y: 0.15, width: 0.3, height: 0.3, rotation: 5 }
      ]
    },
    {
      name: 'Cluster',
      type: 'freeform',
      positions: [
        { x: 0.15, y: 0.1, width: 0.25, height: 0.25, rotation: 5 },
        { x: 0.25, y: 0.28, width: 0.25, height: 0.25, rotation: -8 },
        { x: 0.45, y: 0.18, width: 0.25, height: 0.25, rotation: 10 },
        { x: 0.35, y: 0.05, width: 0.25, height: 0.25, rotation: -5 }
      ]
    },
    {
      name: 'BigSmall',
      type: 'freeform',
      positions: [
        { x: 0.05, y: 0.05, width: 0.65, height: 0.75, rotation: 0 },
        { x: 0.72, y: 0.1, width: 0.22, height: 0.22, rotation: 8 },
        { x: 0.72, y: 0.38, width: 0.22, height: 0.22, rotation: -8 },
        { x: 0.72, y: 0.66, width: 0.22, height: 0.22, rotation: 5 }
      ]
    },
    {
      name: 'VStack',
      type: 'freeform',
      positions: [
        { x: 0.1, y: 0.05, width: 0.8, height: 0.22, rotation: 0 },
        { x: 0.1, y: 0.32, width: 0.8, height: 0.22, rotation: 0 },
        { x: 0.1, y: 0.59, width: 0.8, height: 0.22, rotation: 0 }
      ]
    },
    {
      name: 'Scatter',
      type: 'freeform',
      positions: [
        { x: 0.05, y: 0.05, width: 0.22, height: 0.22, rotation: 8 },
        { x: 0.32, y: 0.08, width: 0.22, height: 0.22, rotation: -5 },
        { x: 0.6, y: 0.05, width: 0.22, height: 0.22, rotation: 12 },
        { x: 0.1, y: 0.38, width: 0.22, height: 0.22, rotation: -10 },
        { x: 0.42, y: 0.45, width: 0.22, height: 0.22, rotation: 3 },
        { x: 0.65, y: 0.38, width: 0.22, height: 0.22, rotation: -7 }
      ]
    },
    {
      name: 'Mixed',
      type: 'freeform',
      positions: [
        { x: 0.05, y: 0.05, width: 0.4, height: 0.5, rotation: -3 },
        { x: 0.5, y: 0.05, width: 0.45, height: 0.3, rotation: 2 },
        { x: 0.5, y: 0.4, width: 0.2, height: 0.25, rotation: 8 },
        { x: 0.75, y: 0.4, width: 0.2, height: 0.25, rotation: -5 }
      ]
    }
  ];

  const colorPresets = [
    '#000000', '#FFFFFF', '#F59E0B', '#EF4444', '#10B981', '#3B82F6', 
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
  ];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: Date.now() + Math.random(),
          src: event.target.result,
          name: file.name
        };
        setImages(prev => [...prev, newImage]);
        addToCollage(newImage);
      };
      reader.readAsDataURL(file);
    });
  };

  const addToCollage = (image) => {
    if (layout.type === 'grid') {
      const totalSlots = layout.cols * layout.rows;
      if (collageImages.length < totalSlots) {
        setCollageImages(prev => [...prev, image]);
      }
    } else {
      if (collageImages.length < layout.positions.length) {
        setCollageImages(prev => [...prev, image]);
      }
    }
  };

  const removeFromCollage = (index, e) => {
    e.stopPropagation();
    setCollageImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    setCollageImages([]);
  };

  const clearAll = () => {
    setCollageImages([]);
    setImages([]);
  };

  const downloadCollage = async () => {
    if (collageImages.length === 0) {
      alert('Please upload images first!');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 1920;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const padding = 80;
    const availableWidth = width - (2 * padding);
    const availableHeight = height - (2 * padding);

    const imagePromises = collageImages.map((imgData, index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          let x, y, cellWidth, cellHeight, rotation;

          if (layout.type === 'grid') {
            const row = Math.floor(index / layout.cols);
            const col = index % layout.cols;
            cellWidth = (availableWidth - (spacing * (layout.cols - 1))) / layout.cols;
            cellHeight = (availableHeight - (spacing * (layout.rows - 1))) / layout.rows;
            x = padding + col * (cellWidth + spacing);
            y = padding + row * (cellHeight + spacing);
            rotation = 0;
          } else {
            const pos = layout.positions[index];
            if (!pos) {
              resolve();
              return;
            }
            cellWidth = pos.width * availableWidth;
            cellHeight = pos.height * availableHeight;
            x = padding + pos.x * availableWidth;
            y = padding + pos.y * availableHeight;
            rotation = pos.rotation || 0;
          }

          ctx.save();
          ctx.translate(x + cellWidth / 2, y + cellHeight / 2);
          ctx.rotate(rotation * Math.PI / 180);
          ctx.translate(-cellWidth / 2, -cellHeight / 2);

          const imgAspect = img.width / img.height;
          const cellAspect = cellWidth / cellHeight;
          let drawWidth, drawHeight, drawX, drawY;

          if (imgAspect > cellAspect) {
            drawHeight = cellHeight;
            drawWidth = drawHeight * imgAspect;
            drawX = -(drawWidth - cellWidth) / 2;
            drawY = 0;
          } else {
            drawWidth = cellWidth;
            drawHeight = drawWidth / imgAspect;
            drawX = 0;
            drawY = -(drawHeight - cellHeight) / 2;
          }

          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          ctx.restore();
          resolve();
        };
        img.src = imgData.src;
      });
    });

    await Promise.all(imagePromises);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `collage-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const totalSlots = layout.type === 'grid'
    ? layout.cols * layout.rows
    : layout.positions?.length || 0;

  return (
    <div className={`min-h-screen ${bgPrimary} p-4 sm:p-6 transition-colors duration-300`}>
      {/* Hidden file input — THIS FIXES THE ERROR */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        multiple
        className="hidden"
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 lg:h-[calc(150vh-200px)] lg:overflow-y-auto lg:pr-2 space-y-4">
            {/* Action Buttons */}
            <div className={`${bgCard} shadow-xl rounded-3xl p-5 sm:p-6 border-2 ${borderColor} space-y-3`}>
              <button
                onClick={downloadCollage}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 sm:px-6 py-3 sm:py-4 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 font-bold"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
              <button
                onClick={clearAll}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white px-5 sm:px-6 py-3 sm:py-4 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 font-bold"
              >
                <Trash2 className="w-5 h-5" />
                Clear All
              </button>
            </div>

            {/* Layout Selection */}
            <div className={`${bgCard} shadow-xl rounded-3xl p-5 sm:p-6 border-2 ${borderColor}`}>
              <h3 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${textPrimary} flex items-center gap-2`}>
                <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Layouts
              </h3>
              <div className="grid grid-cols-3 gap-1 sm:gap-2">
                {layouts.map((l, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLayoutChange(l)}
                    className={`px-2 sm:px-3 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                      layout.name === l.name
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                        : isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Spacing Control */}
            <div className={`${bgCard} shadow-xl rounded-3xl p-5 sm:p-6 border-2 ${borderColor}`}>
              <h3 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${textPrimary} flex items-center gap-2`}>
                <Sliders className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Spacing
              </h3>
              <input
                type="range"
                min="0"
                max="50"
                value={spacing}
                onChange={(e) => setSpacing(Number(e.target.value))}
                className="w-full h-2 sm:h-3 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full appearance-none cursor-pointer mb-3"
              />
              <div className="text-center">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold text-sm sm:text-base">
                  {spacing}px
                </span>
              </div>
            </div>

            {/* Corner Radius Control */}
            <div className={`${bgCard} shadow-xl rounded-3xl p-5 sm:p-6 border-2 ${borderColor}`}>
              <h3 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${textPrimary} flex items-center gap-2`}>
                <RotateCw className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Corner Radius
              </h3>
              <input
                type="range"
                min="0"
                max="50"
                value={roundness}
                onChange={(e) => setRoundness(Number(e.target.value))}
                className="w-full h-2 sm:h-3 bg-gradient-to-r from-orange-300 to-red-300 rounded-full appearance-none cursor-pointer mb-3"
              />
              <div className="text-center">
                <span className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold text-sm sm:text-base">
                  {roundness}px
                </span>
              </div>
            </div>

            {/* Background Color */}
            <div className={`${bgCard} shadow-xl rounded-3xl p-5 sm:p-6 border-2 ${borderColor}`}>
              <h3 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${textPrimary} flex items-center gap-2`}>
                <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Background
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl shadow-lg border-3 ${borderColor} cursor-pointer transform hover:scale-105 transition-all duration-300`}
                    style={{ backgroundColor }}
                    onClick={() => colorPickerRef.current.click()}
                  />
                  <div>
                    <div className={`text-xs sm:text-sm ${textSecondary} font-medium`}>Current</div>
                    <div className={`font-bold ${textPrimary} text-sm sm:text-base`}>{backgroundColor}</div>
                  </div>
                </div>
                <input
                  type="color"
                  ref={colorPickerRef}
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="hidden"
                />
                <div className="grid grid-cols-6 gap-1 sm:gap-2">
                  {colorPresets.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setBackgroundColor(color)}
                      className={`h-8 sm:h-10 rounded-xl shadow-md hover:scale-105 transition-all duration-300 border-2 ${
                        backgroundColor === color 
                          ? 'border-purple-600 scale-105 ring-1 ring-purple-500' 
                          : borderColor
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Canvas */}
          <div className="lg:col-span-3">
            <div className={`${bgCard} shadow-2xl rounded-3xl p-6 sm:p-8 border-2 ${borderColor}`}>
              <div
                className="w-full aspect-video rounded-2xl p-6 sm:p-8 transition-all duration-500 relative mx-auto"
                style={{ backgroundColor, maxWidth: '100%' }}
              >
                {layout.type === 'grid' ? (
                  <div
                    className="grid w-full h-full"
                    style={{
                      gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                      gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
                      gap: `${spacing}px`
                    }}
                  >
                    {Array.from({ length: totalSlots }).map((_, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          if (!collageImages[index] && fileInputRef.current) {
                            fileInputRef.current.click();
                          }
                        }}
                        className={`relative bg-opacity-90 shadow-xl overflow-hidden group transform hover:scale-105 transition-all duration-300 cursor-pointer ${isDarkMode ? 'bg-[#1f2937]' : 'bg-white'}`}
                        style={{ borderRadius: `${roundness}px` }}
                      >
                        {collageImages[index] ? (
                          <>
                            <img
                              src={collageImages[index].src}
                              alt={`Slot ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <button
                              onClick={(e) => removeFromCollage(index, e)}
                              className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-300 transform hover:scale-110 shadow-lg z-10"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </>
                        ) : (
                          <div className={`w-full h-full flex flex-col items-center justify-center transition-all duration-300 ${emptySlotBg} ${emptySlotHover}`}>
                            <ImagePlus className="w-12 h-12 sm:w-16 sm:h-16 mb-1 sm:mb-2 animate-bounce" />
                            <span className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Click to Upload</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full relative">
                    {layout.positions.map((pos, index) => (
                      <div
                        key={index}
                        className={`absolute transition-all duration-300 cursor-pointer ${
                          collageImages[index] ? 'group' : ''
                        }`}
                        style={{
                          left: `${pos.x * 100}%`,
                          top: `${pos.y * 100}%`,
                          width: `${pos.width * 100}%`,
                          height: `${pos.height * 100}%`,
                          transform: `rotate(${pos.rotation || 0}deg)`,
                          transformOrigin: 'center'
                        }}
                        onClick={() => {
                          if (!collageImages[index] && fileInputRef.current) {
                            fileInputRef.current.click();
                          }
                        }}
                      >
                        {collageImages[index] ? (
                          <>
                            <img
                              src={collageImages[index].src}
                              alt={`Freeform ${index + 1}`}
                              className="w-full h-full object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105"
                              style={{ borderRadius: `${roundness}px` }}
                            />
                            <button
                              onClick={(e) => removeFromCollage(index, e)}
                              className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-300 transform hover:scale-110 shadow-lg z-20"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </>
                        ) : (
                          <div className={`w-full h-full flex flex-col items-center justify-center ${emptySlotBg} ${emptySlotHover} shadow-xl transition-all duration-300`}
                            style={{ borderRadius: `${roundness}px` }}
                          >
                            <ImagePlus className="w-12 h-12 sm:w-16 sm:h-16 mb-1 sm:mb-2 animate-bounce" />
                            <span className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Click to Upload</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-4 sm:mt-6 flex justify-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-lg">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-bold text-sm sm:text-base">
                    {collageImages.length} / {totalSlots} images
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer currentPage={location.pathname} isDarkMode={isDarkMode} />
    </div>
  );
};

export default CollageApp;