import React, { useState, useRef } from 'react';
import { Download, Trash2, Layers, ImagePlus, Palette, Sliders, RotateCw, Upload, Image as ImageIcon } from 'lucide-react'; // Added Upload, ImageIcon

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
  const [pendingSlotIndex, setPendingSlotIndex] = useState(null); 
  const [isDraggingOverLibrary, setIsDraggingOverLibrary] = useState(false);
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

  // ✅ Updated handleFileUpload to only add to library or assign to slot
  const handleFileUpload = (e, addToSlot = false, files = null) => {
    const uploadedFiles = files ? Array.from(files) : Array.from(e.target.files);
    if (uploadedFiles.length === 0) return;

    uploadedFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: Math.random().toString(36).substr(2, 9),
          src: event.target.result,
          name: file.name
        };

        setImages(prev => [...prev, newImage]);

        // Assign to slot only if explicitly requested AND it's the first file uploaded
        if (addToSlot && pendingSlotIndex !== null && index === 0) {
          setCollageImages(prev => {
            const updated = [...prev];
            updated[pendingSlotIndex] = newImage;
            return updated;
          });
          setPendingSlotIndex(null);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input for file selection
    if (e && e.target) {
      e.target.value = '';
    }
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
      // New images dropped directly onto a slot - assign the first file
      setPendingSlotIndex(dropIndex);
      handleFileUpload(null, true, files);
      return;
    }

    if (!draggedImage) return;

    const { image, fromIndex } = draggedImage;
    setCollageImages(prev => {
      const updated = [...prev];
      if (fromIndex !== null && fromIndex !== undefined) {
        // Moving image from one slot to another
        const temp = updated[dropIndex];
        updated[dropIndex] = updated[fromIndex];
        updated[fromIndex] = temp;
      } else {
        // Dropping image from library to slot
        updated[dropIndex] = image;
      }
      return updated;
    });
    setDraggedImage(null);
  };

  const handleLibraryDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingOverLibrary(true);
  };

  // ✅ Drag Leave for Library Dropzone
  const handleLibraryDragLeave = (e) => {
    e.stopPropagation();
    setIsDraggingOverLibrary(false);
  };

  // ✅ Drop for Library Dropzone (adds to library only)
  const handleLibraryDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverLibrary(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(null, false, files); // Add to library only
    }
  };

  // 🌟 IMAGE LIBRARY DRAG & DROP FUNCTIONS END 🌟

  // ✅ Updated to explicitly request slot assignment
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

  const sidebarSections = [

    {
      title: 'Layout & Shapes',
      icon: Layers,
      content: (
        <div className="space-y-4">
          <h4 className={`text-sm font-semibold ${textSecondary}`}>Select Layout</h4>
          <div className="grid grid-cols-3 gap-3">
            {layouts.map((l) => (
              <button
                key={l.name}
                onClick={() => handleLayoutChange(l)}
                className={`p-3 rounded-xl border-2 transition ${layout.name === l.name
                    ? 'border-purple-500 ring-4 ring-purple-500/30'
                    : `${borderColor} hover:border-purple-500`
                  } ${bgCard} ${textPrimary} text-sm font-medium`}
              >
                {l.name}
              </button>
            ))}
          </div>
          <h4 className={`text-sm font-semibold pt-2 ${textSecondary}`}>Border Roundness: {roundness}%</h4>
          <input
            type="range"
            min="0"
            max="50"
            value={roundness}
            onChange={(e) => setRoundness(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
          />
        </div>
      )
    },
    {
      title: 'Spacing & Color',
      icon: Palette,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className={`text-sm font-semibold ${textSecondary}`}>Spacing: {spacing}px</h4>
            <input
              type="range"
              min="0"
              max="50"
              value={spacing}
              onChange={(e) => setSpacing(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
            />
          </div>
          <div>
            <h4 className={`text-sm font-semibold ${textSecondary} mb-2`}>Background Color</h4>
            <div className="flex flex-wrap gap-2">
              {colorPresets.map(color => (
                <button
                  key={color}
                  style={{ backgroundColor: color }}
                  onClick={() => setBackgroundColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition ${backgroundColor === color ? 'border-white ring-2 ring-offset-2 ring-offset-transparent' : 'border-transparent hover:ring-2 hover:ring-offset-2 hover:ring-offset-transparent'}`}
                ></button>
              ))}
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer appearance-none bg-transparent border-none"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Actions',
      icon: Sliders,
      content: (
        <div className="space-y-3">
          <button
            onClick={clearAll}
            className="w-full px-4 py-2.5 flex items-center justify-center gap-2 rounded-xl transition bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            <Trash2 className="w-5 h-5" />
            Clear Collage
          </button>
          <button
            onClick={downloadCollage}
            className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all font-medium shadow-md"
          >
            <Download className="w-5 h-5 inline mr-2" />
            Download Collage
          </button>
        </div>
      )
    }
  ];


  return (
    <div className={`min-h-screen ${bgPrimary} p-4 sm:p-6 transition-colors duration-300`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileUpload(e, true)} // Only when user explicitly selects via slot click
        accept="image/*"
        multiple // Allow multiple file selection
        className="hidden"
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar / Tools */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-4 h-full">
            {sidebarSections.map((section, i) => (
              <div
                key={i}
                className={`${bgCard} backdrop-blur-sm rounded-xl shadow-lg border ${borderColor} p-5`}
              >
                <h3 className={`font-semibold mb-3 flex items-center gap-2 ${textPrimary}`}>
                  <section.icon className="w-5 h-5 text-purple-500" />
                  {section.title}
                </h3>
                {section.content}
              </div>
            ))}
          </div>

          {/* Canvas / Collage Area */}
          <div className="lg:col-span-3">
            <div
              style={{ backgroundColor: backgroundColor }}
              className={`relative w-full aspect-video p-10 rounded-xl shadow-2xl transition-all duration-500`}
            >
              {/* Collage Grid/Freeform */}
              <div
                className="absolute inset-10"
                style={{
                  display: layout.type === 'grid' ? 'grid' : 'block',
                  gridTemplateColumns: layout.type === 'grid' ? `repeat(${layout.cols}, 1fr)` : 'none',
                  gridTemplateRows: layout.type === 'grid' ? `repeat(${layout.rows}, 1fr)` : 'none',
                  gap: layout.type === 'grid' ? `${spacing}px` : '0px',
                }}
              >
                {Array.from({ length: totalSlots }).map((_, index) => {
                  const imgData = collageImages[index];
                  const isFreeform = layout.type === 'freeform';
                  const pos = isFreeform ? layout.positions?.[index] : null;

                  // Base styles for the slot
                  let slotStyle = {
                    borderRadius: `${roundness}px`,
                    overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    border: dragOverIndex === index ? '4px dashed #3B82F6' : 'none',
                  };

                  // Freeform positioning
                  if (isFreeform && pos) {
                    slotStyle = {
                      ...slotStyle,
                      position: 'absolute',
                      left: `${pos.x * 100}%`,
                      top: `${pos.y * 100}%`,
                      width: `${pos.width * 100}%`,
                      height: `${pos.height * 100}%`,
                      transform: `rotate(${pos.rotation || 0}deg)`,
                      zIndex: index + 1, // Stacking order
                    };
                  }

                  return (
                    <div
                      key={index}
                      style={slotStyle}
                      onClick={() => handleSlotClick(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`relative cursor-pointer transition ${!imgData && `${emptySlotBg} ${emptySlotHover}`
                        }`}
                    >
                      {imgData ? (
                        <>
                          <img
                            src={imgData.src}
                            alt={`Collage image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={(e) => removeFromCollage(index, e)}
                            className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full z-10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                          <ImagePlus className={`w-8 h-8 ${textSecondary}`} />
                          <p className={`text-xs mt-1 ${textSecondary}`}>
                            {dragOverIndex === index ? 'Drop Here' : 'Click or Drag Image'}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Info & Footer */}
              <div className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs ${textSecondary} opacity-70`}>
                Layout: {layout.name} | Slots: {totalSlots} | Roundness: {roundness}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer component (assuming it's available) */}
      {/* <Footer currentPage={location.pathname} isDarkMode={isDarkMode} /> */}
    </div>
  );
};

export default CollageApp;