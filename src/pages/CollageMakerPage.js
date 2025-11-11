import React, { useState, useRef } from 'react';
import { Download, Trash2, Layers, ImagePlus, Palette, Sliders, RotateCw } from 'lucide-react';

const CollageApp = ({ isDarkMode = false }) => {
  const initialLayout = { name: '2×2', cols: 2, rows: 2, type: 'grid' };
  const initialSlots = initialLayout.cols * initialLayout.rows;

  const [images, setImages] = useState([]);
  const [layout, setLayout] = useState(initialLayout);
  const [spacing, setSpacing] = useState(10);
  const [backgroundColor, setBackgroundColor] = useState('#F59E0B');
  const [collageImages, setCollageImages] = useState(Array(initialSlots).fill(null));
  const [roundness, setRoundness] = useState(20);
  const [draggedImage, setDraggedImage] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [pendingSlotIndex, setPendingSlotIndex] = useState(null); // 👈 NEW: track clicked slot
  const fileInputRef = useRef(null);
  const colorPickerRef = useRef(null);

  // Theme classes
  const bgPrimary = isDarkMode ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50';
  const bgCard = isDarkMode ? 'bg-gray-800/90 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm';
  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-purple-200';
  const emptySlotBg = isDarkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-purple-50 to-pink-50';
  const emptySlotHover = isDarkMode ? 'hover:bg-gray-700' : 'hover:from-purple-100 hover:to-pink-100';

  const layouts = [
    { name: '1×1', cols: 1, rows: 1, type: 'grid' },
    { name: '1×2', cols: 1, rows: 2, type: 'grid' },
    { name: '2×1', cols: 2, rows: 1, type: 'grid' },
    { name: '2×2', cols: 2, rows: 2, type: 'grid' },
    { name: '3×2', cols: 3, rows: 2, type: 'grid' },
    { name: '2×3', cols: 2, rows: 3, type: 'grid' },
    { name: '3×3', cols: 3, rows: 3, type: 'grid' },
    { name: '4×3', cols: 4, rows: 3, type: 'grid' },
    { name: '3×4', cols: 3, rows: 4, type: 'grid' },
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

  // ✅ Updated handleFileUpload with slot assignment
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const newImage = {
        id: Math.random().toString(36).substr(2, 9),
        src: event.target.result,
        name: file.name
      };

      // Always add to library
      setImages(prev => [...prev, newImage]);

      // If a slot was waiting, assign to it
      if (pendingSlotIndex !== null) {
        setCollageImages(prev => {
          const updated = [...prev];
          updated[pendingSlotIndex] = newImage;
          return updated;
        });
        setPendingSlotIndex(null);
      }
    };
    reader.readAsDataURL(file);

    // Extra files go only to library
    if (files.length > 1) {
      files.slice(1).forEach(f => {
        const r = new FileReader();
        r.onload = (ev) => {
          setImages(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            src: ev.target.result,
            name: f.name
          }]);
        };
        r.readAsDataURL(f);
      });
    }

    // Reset input
    e.target.value = '';
  };

  const totalSlots = layout.type === 'grid'
    ? layout.cols * layout.rows
    : layout.positions?.length || 0;

  const removeFromCollage = (index, e) => {
    e.stopPropagation();
    setCollageImages(prev => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
  };

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    const newTotalSlots = newLayout.type === 'grid'
      ? newLayout.cols * newLayout.rows
      : newLayout.positions?.length || 0;

    const newCollageImages = Array(newTotalSlots).fill(null);
    for (let i = 0; i < Math.min(collageImages.length, newTotalSlots); i++) {
      newCollageImages[i] = collageImages[i];
    }
    setCollageImages(newCollageImages);
  };

  const clearAll = () => {
    const currentTotalSlots = layout.type === 'grid'
      ? layout.cols * layout.rows
      : layout.positions?.length || 0;
    setCollageImages(Array(currentTotalSlots).fill(null));
    setImages([]);
  };

  const handleDragStart = (e, image, fromIndex) => {
    e.stopPropagation();
    setDraggedImage({ image, fromIndex });
    e.dataTransfer.effectAllowed = 'copyMove';
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload({ target: { files } });
      return;
    }

    if (!draggedImage) return;

    const { image, fromIndex } = draggedImage;
    setCollageImages(prev => {
      const updated = [...prev];
      if (fromIndex !== null && fromIndex !== undefined) {
        updated[dropIndex] = updated[fromIndex];
      } else {
        updated[dropIndex] = image;
      }
      return updated;
    });
    setDraggedImage(null);
  };

  const handleCanvasDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload({ target: { files } });
    }
  };

  // ✅ NEW: Handle slot click
  const handleSlotClick = (index) => {
    if (!collageImages[index]) {
      setPendingSlotIndex(index);
      fileInputRef.current?.click();
    }
  };

 const downloadCollage = async () => {
  if (collageImages.every(img => !img)) {
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

  // Pre-load all images using createImageBitmap
  const imageBitmaps = await Promise.all(
    collageImages.map(async (imgData) => {
      if (!imgData) return null;

      try {
        const response = await fetch(imgData.src);
        const blob = await response.blob();
        return await createImageBitmap(blob);
      } catch (e) {
        console.error('Failed to load image:', e);
        return null;
      }
    })
  );

  // Draw images to canvas
  imageBitmaps.forEach((imgBitmap, index) => {
    if (!imgBitmap) return;

    let x, y, cellWidth, cellHeight, rotation = 0;

    if (layout.type === 'grid') {
      const row = Math.floor(index / layout.cols);
      const col = index % layout.cols;
      cellWidth = (availableWidth - (spacing * (layout.cols - 1))) / layout.cols;
      cellHeight = (availableHeight - (spacing * (layout.rows - 1))) / layout.rows;
      x = padding + col * (cellWidth + spacing);
      y = padding + row * (cellHeight + spacing);
    } else {
      const pos = layout.positions[index];
      if (!pos) return;
      cellWidth = pos.width * availableWidth;
      cellHeight = pos.height * availableHeight;
      x = padding + pos.x * availableWidth;
      y = padding + pos.y * availableHeight;
      rotation = pos.rotation || 0;
    }

    ctx.save();
    ctx.translate(x + cellWidth / 2, y + cellHeight / 2);
    ctx.rotate(rotation * Math.PI / 180);

    // Create rounded rectangle path
    ctx.beginPath();
    const rad = roundness * (width / 1920);
    ctx.moveTo(-cellWidth / 2 + rad, -cellHeight / 2);
    ctx.lineTo(cellWidth / 2 - rad, -cellHeight / 2);
    ctx.quadraticCurveTo(cellWidth / 2, -cellHeight / 2, cellWidth / 2, -cellHeight / 2 + rad);
    ctx.lineTo(cellWidth / 2, cellHeight / 2 - rad);
    ctx.quadraticCurveTo(cellWidth / 2, cellHeight / 2, cellWidth / 2 - rad, cellHeight / 2);
    ctx.lineTo(-cellWidth / 2 + rad, cellHeight / 2);
    ctx.quadraticCurveTo(-cellWidth / 2, cellHeight / 2, -cellWidth / 2, cellHeight / 2 - rad);
    ctx.lineTo(-cellWidth / 2, -cellHeight / 2 + rad);
    ctx.quadraticCurveTo(-cellWidth / 2, -cellHeight / 2, -cellWidth / 2 + rad, -cellHeight / 2);
    ctx.closePath();
    ctx.clip();

    // Calculate image position to maintain aspect ratio and fill the cell
    const imgAspect = imgBitmap.width / imgBitmap.height;
    const cellAspect = cellWidth / cellHeight;
    let drawWidth, drawHeight, drawX, drawY;

    if (imgAspect > cellAspect) {
      // Image is wider than cell - fill height
      drawHeight = cellHeight;
      drawWidth = drawHeight * imgAspect;
      drawX = -drawWidth / 2;
      drawY = -drawHeight / 2;
    } else {
      // Image is taller than cell - fill width
      drawWidth = cellWidth;
      drawHeight = drawWidth / imgAspect;
      drawX = -drawWidth / 2;
      drawY = -drawHeight / 2;
    }

    // Draw the image
    ctx.drawImage(imgBitmap, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
  });

  const link = document.createElement('a');
  link.download = `collage-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div className={`min-h-screen ${bgPrimary} p-4 sm:p-6 transition-colors duration-300`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      // Note: removed "multiple" to simplify slot assignment (optional)
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Image Library */}
            {/* {images.length > 0 && (
              <div className={`${bgCard} shadow-xl rounded-3xl p-5 border-2 ${borderColor}`}>
                <h3 className={`text-lg font-bold mb-4 ${textPrimary} flex items-center gap-2`}>
                  <ImagePlus className="w-5 h-5 text-purple-600" />
                  Image Library ({images.length})
                </h3>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, img, null)}
                      className="relative aspect-square rounded-xl overflow-hidden cursor-move hover:scale-105 transition-transform shadow-lg border-2 border-purple-300"
                    >
                      <img
                        src={img.src}
                        alt={img.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {/* Action Buttons */}
            <div className={`${bgCard} shadow-xl rounded-3xl p-5 border-2 ${borderColor} space-y-3`}>
              <button
                onClick={downloadCollage}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 font-bold"
              >
                <Download className="w-5 h-5" />
                Download Collage
              </button>
              <button
                onClick={clearAll}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-4 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 font-bold"
              >
                <Trash2 className="w-5 h-5" />
                Clear All
              </button>
            </div>

            {/* Layout Selection */}
            <div className={`${bgCard} shadow-xl rounded-3xl p-5 border-2 ${borderColor}`}>
              <h3 className={`text-lg font-bold mb-4 ${textPrimary} flex items-center gap-2`}>
                <Layers className="w-5 h-5 text-purple-600" />
                Layouts
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {layouts.map((l, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLayoutChange(l)}
                    className={`px-3 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${layout.name === l.name
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                      : isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                        : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                      }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className={`${bgCard} shadow-xl rounded-3xl p-5 border-2 ${borderColor}`}>
              <h3 className={`text-lg font-bold mb-4 ${textPrimary} flex items-center gap-2`}>
                <Sliders className="w-5 h-5 text-purple-600" />
                Spacing
              </h3>
              <input
                type="range"
                min="0"
                max="50"
                value={spacing}
                onChange={(e) => setSpacing(Number(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full appearance-none cursor-pointer mb-3"
              />
              <div className="text-center">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl font-bold">
                  {spacing}px
                </span>
              </div>
            </div>

            <div className={`${bgCard} shadow-xl rounded-3xl p-5 border-2 ${borderColor}`}>
              <h3 className={`text-lg font-bold mb-4 ${textPrimary} flex items-center gap-2`}>
                <RotateCw className="w-5 h-5 text-purple-600" />
                Corner Radius
              </h3>
              <input
                type="range"
                min="0"
                max="50"
                value={roundness}
                onChange={(e) => setRoundness(Number(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-orange-300 to-red-300 rounded-full appearance-none cursor-pointer mb-3"
              />
              <div className="text-center">
                <span className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-xl font-bold">
                  {roundness}px
                </span>
              </div>
            </div>

            {/* Background Color */}
            <div className={`${bgCard} shadow-xl rounded-3xl p-5 border-2 ${borderColor}`}>
              <h3 className={`text-lg font-bold mb-4 ${textPrimary} flex items-center gap-2`}>
                <Palette className="w-5 h-5 text-purple-600" />
                Background
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-16 h-16 rounded-2xl shadow-lg border-3 ${borderColor} cursor-pointer transform hover:scale-105 transition-all duration-300`}
                    style={{ backgroundColor }}
                    onClick={() => colorPickerRef.current.click()}
                  />
                  <div>
                    <div className={`text-sm ${textSecondary} font-medium`}>Current</div>
                    <div className={`font-bold ${textPrimary}`}>{backgroundColor}</div>
                  </div>
                </div>
                <input
                  type="color"
                  ref={colorPickerRef}
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="hidden"
                />
                <div className="grid grid-cols-6 gap-2">
                  {colorPresets.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setBackgroundColor(color)}
                      className={`h-10 rounded-xl shadow-md hover:scale-105 transition-all duration-300 border-2 ${backgroundColor === color
                        ? 'border-purple-600 scale-105 ring-2 ring-purple-500'
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
            <div className={`${bgCard} shadow-2xl rounded-3xl p-8 border-2 ${borderColor}`}>
              <div
                className="w-full aspect-video rounded-2xl p-8 transition-all duration-500 relative mx-auto"
                style={{ backgroundColor }}
                onDragOver={handleCanvasDragOver}
                onDrop={handleCanvasDrop}
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
                        onClick={() => handleSlotClick(index)} // Updated
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`relative shadow-xl overflow-hidden group transform hover:scale-105 transition-all duration-300 cursor-pointer ${dragOverIndex === index ? 'ring-4 ring-purple-500' : ''
                          }`}
                        style={{ borderRadius: `${roundness}px` }}
                      >
                        {collageImages[index] ? (
                          <>
                            <img
                              src={collageImages[index].src}
                              alt={`Slot ${index + 1}`}
                              draggable
                              onDragStart={(e) => handleDragStart(e, collageImages[index], index)}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <button
                              onClick={(e) => removeFromCollage(index, e)}
                              className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-300 transform hover:scale-110 shadow-lg z-10"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <div className={`w-full h-full flex flex-col items-center justify-center transition-all duration-300 ${emptySlotBg} ${emptySlotHover}`}>
                            <ImagePlus className="w-16 h-16 mb-2 animate-bounce text-purple-400" />
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-purple-600'}`}>
                              Drop or Click
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full relative">
                    {layout.positions.map((_, index) => (
                      <div
                        key={index}
                        className={`absolute transition-all duration-300 cursor-pointer ${collageImages[index] ? 'group' : ''
                          } ${dragOverIndex === index ? 'ring-4 ring-purple-500' : ''}`}
                        style={{
                          left: `${layout.positions[index].x * 100}%`,
                          top: `${layout.positions[index].y * 100}%`,
                          width: `${layout.positions[index].width * 100}%`,
                          height: `${layout.positions[index].height * 100}%`,
                          transform: `rotate(${layout.positions[index].rotation || 0}deg)`,
                          transformOrigin: 'center',
                          zIndex: collageImages[index] ? 10 + index : 1
                        }}
                        onClick={() => handleSlotClick(index)} // ✅ Updated
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        {collageImages[index] ? (
                          <>
                            <img
                              src={collageImages[index].src}
                              alt={`Freeform ${index + 1}`}
                              draggable
                              onDragStart={(e) => handleDragStart(e, collageImages[index], index)}
                              className="w-full h-full object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105"
                              style={{ borderRadius: `${roundness}px` }}
                            />
                            <button
                              onClick={(e) => removeFromCollage(index, e)}
                              className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-300 transform hover:scale-110 shadow-lg z-20"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <div className={`w-full h-full flex flex-col items-center justify-center ${emptySlotBg} ${emptySlotHover} shadow-xl transition-all duration-300`}
                            style={{ borderRadius: `${roundness}px` }}
                          >
                            <ImagePlus className="w-16 h-16 mb-2 animate-bounce text-purple-400" />
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-purple-600'}`}>Drop or Click</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl shadow-lg">
                  <Layers className="w-5 h-5" />
                  <span className="font-bold">
                    {collageImages.filter(Boolean).length} / {totalSlots} images
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollageApp;