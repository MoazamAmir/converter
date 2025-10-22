import React, { useState, useRef, useEffect } from 'react';

export default function CropImagePage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState('FreeForm');
  const [cropSettings, setCropSettings] = useState({
    width: 200,
    height: 200,
    positionX: 50,
    positionY: 50
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (selectedImage && imageRef.current) {
      const img = imageRef.current;
      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    }
  }, [selectedImage]);

  useEffect(() => {
    if (aspectRatio !== 'FreeForm' && aspectRatio !== 'Custom') {
      const ratios = {
        '1:1 Square': 1,
        '4:3': 4 / 3,
        '16:9': 16 / 9
      };
      const ratio = ratios[aspectRatio];
      if (ratio) {
        setCropSettings(prev => ({
          ...prev,
          height: Math.round(prev.width / ratio)
        }));
      }
    }
  }, [aspectRatio, cropSettings.width]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setCropSettings({
      width: 200,
      height: 200,
      positionX: 50,
      positionY: 50
    });
  };

  const getScale = () => {
    if (!imageRef.current) return 1;
    const displayWidth = imageRef.current.width;
    const naturalWidth = imageRef.current.naturalWidth;
    return naturalWidth / displayWidth;
  };

  const handleCropApply = () => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to crop dimensions
    canvas.width = cropSettings.width;
    canvas.height = cropSettings.height;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Draw the cropped portion
      ctx.drawImage(
        img,
        cropSettings.positionX,
        cropSettings.positionY,
        cropSettings.width,
        cropSettings.height,
        0,
        0,
        cropSettings.width,
        cropSettings.height
      );

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `cropped-image-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    };
    img.src = selectedImage;
  };

  const handleMouseDown = (e, handle = null) => {
    e.preventDefault();
    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
    } else {
      setIsDragging(true);
    }
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      cropX: cropSettings.positionX,
      cropY: cropSettings.positionY,
      cropW: cropSettings.width,
      cropH: cropSettings.height
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!imageRef.current) return;

      const scale = getScale();
      const deltaX = (e.clientX - dragStart.x) * scale;
      const deltaY = (e.clientY - dragStart.y) * scale;

      if (isDragging) {
        const newX = Math.max(0, Math.min(dragStart.cropX + deltaX, imageDimensions.width - cropSettings.width));
        const newY = Math.max(0, Math.min(dragStart.cropY + deltaY, imageDimensions.height - cropSettings.height));

        setCropSettings(prev => ({
          ...prev,
          positionX: Math.round(newX),
          positionY: Math.round(newY)
        }));
      } else if (isResizing && resizeHandle) {
        let newWidth = dragStart.cropW;
        let newHeight = dragStart.cropH;
        let newX = dragStart.cropX;
        let newY = dragStart.cropY;

        if (resizeHandle.includes('e')) {
          newWidth = Math.max(50, dragStart.cropW + deltaX);
        }
        if (resizeHandle.includes('w')) {
          newWidth = Math.max(50, dragStart.cropW - deltaX);
          newX = dragStart.cropX + deltaX;
        }
        if (resizeHandle.includes('s')) {
          newHeight = Math.max(50, dragStart.cropH + deltaY);
        }
        if (resizeHandle.includes('n')) {
          newHeight = Math.max(50, dragStart.cropH - deltaY);
          newY = dragStart.cropY + deltaY;
        }

        if (aspectRatio !== 'FreeForm' && aspectRatio !== 'Custom') {
          const ratios = {
            '1:1 Square': 1,
            '4:3': 4 / 3,
            '16:9': 16 / 9
          };
          const ratio = ratios[aspectRatio];
          if (ratio) {
            newHeight = newWidth / ratio;
          }
        }

        newX = Math.max(0, Math.min(newX, imageDimensions.width - newWidth));
        newY = Math.max(0, Math.min(newY, imageDimensions.height - newHeight));
        newWidth = Math.min(newWidth, imageDimensions.width - newX);
        newHeight = Math.min(newHeight, imageDimensions.height - newY);

        setCropSettings({
          width: Math.round(newWidth),
          height: Math.round(newHeight),
          positionX: Math.round(newX),
          positionY: Math.round(newY)
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeHandle, imageDimensions, cropSettings.width, cropSettings.height, aspectRatio]);

  if (!selectedImage) {
    return (
      <div className="min-h-screen bg-[#1a1a1a]">
        <header className="bg-[#1a1a1a] border-b border-gray-800 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded"></div>
              <span className="text-white text-xl font-semibold">ImageResizer</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <button className="text-gray-300 hover:text-white">Resize ▼</button>
              <button className="text-gray-300 hover:text-white">Crop ▼</button>
              <button className="text-gray-300 hover:text-white">Compress ▼</button>
              <button className="text-gray-300 hover:text-white">Convert ▼</button>
              <button className="text-gray-300 hover:text-white">More ▼</button>
              <button className="text-gray-300 hover:text-white">Pricing</button>
            </nav>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-white border border-gray-600 rounded hover:bg-gray-800">Login</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Signup</button>
            </div>
          </div>
        </header>

        <div className="bg-[#1a1a1a] px-6 py-3 border-b border-gray-800">
          <div className="max-w-7xl mx-auto text-sm text-gray-400">
            Home › Crop Image
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">Crop Image</h1>
            <p className="text-gray-400 text-lg">Quickly crop image files online for free!</p>
          </div>

          <div className="text-center mt-5">
            <div className="bg-blue-100 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center min-h-[80px] mx-auto w-[300px] sm:w-[400px] md:w-[700px] shadow-md">
              <p className="text-blue-800 text-sm sm:text-base font-semibold">Ad Space 728x90</p>
              <p className="text-blue-600 text-xs sm:text-sm mt-1">Leaderboard Banner Ad Here</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-10">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1 rounded-lg mb-6">
              <div className="bg-[#4a6cf7] rounded-lg p-12 text-center">
                <div className="border-4 border-dashed border-white/30 rounded-lg p-16">
                  <svg className="w-20 h-20 mx-auto text-white/80 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold text-lg inline-flex items-center gap-2"
                  >
                    <span>📁</span> Select Image <span className="ml-2">▼</span>
                  </button>
                  <p className="mt-6 text-white/90 text-lg">or, drag and drop an image here</p>
                  <p className="mt-3 text-white/70 text-sm">Max file size: 10 MB. <span className="underline cursor-pointer">Sign up</span> for more.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block absolute left-4 top-[390px]">
          <div className="bg-blue-100 rounded-lg p-4 flex flex-col items-center justify-center w-[120px] h-[500px] shadow-md">
            {/* <p className="text-blue-800 text-sm font-semibold rotate-90 whitespace-nowrap">
      Ad Space 120x300
    </p> */}
            <p className="text-blue-600 text-xs mt-2 rotate-90 whitespace-nowrap">
              Left Skyscraper Banner
            </p>
          </div>
        </div>

        <div className="hidden lg:block absolute right-4 top-[390px]">
          <div className="bg-blue-100 rounded-lg p-4 flex flex-col items-center justify-center w-[120px] h-[500px] shadow-md">
            {/* <p className="text-blue-800 text-sm font-semibold rotate-90 whitespace-nowrap">
      Ad Space 120x300
    </p> */}
            <p className="text-blue-600 text-xs mt-2 rotate-90 whitespace-nowrap">
              Right Skyscraper Banner
            </p>
          </div>
        </div>
      </div>
    );
  }

  const scale = imageRef.current ? imageRef.current.width / imageRef.current.naturalWidth : 1;

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <header className="bg-[#1a1a1a] border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded"></div>
            <span className="text-white text-xl font-semibold">ImageResizer</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedImage(null);
                setCropSettings({
                  width: 200,
                  height: 200,
                  positionX: 50,
                  positionY: 50
                });
              }}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              ← New Image
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        <div className="w-80 bg-[#0f0f0f] border-r border-gray-800 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-white font-bold text-xl mb-1">Crop Rectangle</h2>
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-400 text-xs mb-2 font-medium">Width (px)</label>
                <input
                  type="number"
                  value={cropSettings.width}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setCropSettings({ ...cropSettings, width: Math.min(val, imageDimensions.width) });
                  }}
                  className="w-full px-3 py-2.5 bg-[#2a2a2a] text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-2 font-medium">Height (px)</label>
                <input
                  type="number"
                  value={cropSettings.height}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setCropSettings({ ...cropSettings, height: Math.min(val, imageDimensions.height) });
                  }}
                  className="w-full px-3 py-2.5 bg-[#2a2a2a] text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-400 text-xs mb-2 font-medium">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#2a2a2a] text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option>FreeForm</option>
                <option>1:1 Square</option>
                <option>4:3</option>
                <option>16:9</option>
                <option>Custom</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-white font-bold text-lg mb-4">Crop Position</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-xs mb-2 font-medium">Position X (px)</label>
                <input
                  type="number"
                  value={cropSettings.positionX}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setCropSettings({ ...cropSettings, positionX: Math.max(0, Math.min(val, imageDimensions.width - cropSettings.width)) });
                  }}
                  className="w-full px-3 py-2.5 bg-[#2a2a2a] text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-2 font-medium">Position Y (px)</label>
                <input
                  type="number"
                  value={cropSettings.positionY}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setCropSettings({ ...cropSettings, positionY: Math.max(0, Math.min(val, imageDimensions.height - cropSettings.height)) });
                  }}
                  className="w-full px-3 py-2.5 bg-[#2a2a2a] text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mb-4 p-3 bg-[#2a2a2a] rounded">
            <div className="text-xs text-gray-400 mb-1">Original Image</div>
            <div className="text-white text-sm">{imageDimensions.width} × {imageDimensions.height} px</div>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-3 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#3a3a3a] mb-3 font-medium"
          >
            Reset
          </button>

          <button
            onClick={handleCropApply}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            Crop & Download →
          </button>
        </div>

        <div className="flex-1 bg-[#1a1a1a] p-8 overflow-auto flex items-center justify-center">
          
          <div
            ref={containerRef}
            className="relative inline-block"
            style={{ userSelect: 'none' }}
          >
            <img
              ref={imageRef}
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[calc(100vh-200px)] block"
              draggable={false}
            />

            {imageRef.current && (
              <div
                className="absolute border-2 border-blue-500 cursor-move"
                style={{
                  left: `${cropSettings.positionX / getScale()}px`,
                  top: `${cropSettings.positionY / getScale()}px`,
                  width: `${cropSettings.width / getScale()}px`,
                  height: `${cropSettings.height / getScale()}px`,
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                }}
                onMouseDown={(e) => handleMouseDown(e)}
              >
                {/* Corner handles */}
                <div
                  className="absolute w-3 h-3 bg-blue-500 border border-white cursor-nw-resize"
                  style={{ left: '-6px', top: '-6px' }}
                  onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'nw'); }}
                />
                <div
                  className="absolute w-3 h-3 bg-blue-500 border border-white cursor-ne-resize"
                  style={{ right: '-6px', top: '-6px' }}
                  onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'ne'); }}
                />
                <div
                  className="absolute w-3 h-3 bg-blue-500 border border-white cursor-sw-resize"
                  style={{ left: '-6px', bottom: '-6px' }}
                  onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'sw'); }}
                />
                <div
                  className="absolute w-3 h-3 bg-blue-500 border border-white cursor-se-resize"
                  style={{ right: '-6px', bottom: '-6px' }}
                  onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'se'); }}
                />

                {/* Edge handles */}
                <div
                  className="absolute w-3 h-3 bg-blue-500 border border-white cursor-n-resize"
                  style={{ left: '50%', top: '-6px', transform: 'translateX(-50%)' }}
                  onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'n'); }}
                />
                <div
                  className="absolute w-3 h-3 bg-blue-500 border border-white cursor-s-resize"
                  style={{ left: '50%', bottom: '-6px', transform: 'translateX(-50%)' }}
                  onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 's'); }}
                />
                <div
                  className="absolute w-3 h-3 bg-blue-500 border border-white cursor-w-resize"
                  style={{ left: '-6px', top: '50%', transform: 'translateY(-50%)' }}
                  onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'w'); }}
                />
                <div
                  className="absolute w-3 h-3 bg-blue-500 border border-white cursor-e-resize"
                  style={{ right: '-6px', top: '50%', transform: 'translateY(-50%)' }}
                  onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'e'); }}
                />
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}