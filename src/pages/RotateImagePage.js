import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  RotateCw,
  RotateCcw,
  Download,
  ZoomIn,
  ZoomOut,
  FlipHorizontal,
  FlipVertical,
  Undo,
  Redo,
  Image as ImageIcon,
  Palette,
} from 'lucide-react';

export default function ImageEditor() {
  const [image, setImage] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null); // For drag bounds

  // ✅ Fix dark mode background
  const bgPrimary = isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#1a1a1a]';
  const bgSecondary = isDarkMode ? 'bg-slate-900/80' : 'bg-white/95';
  const bgCard = isDarkMode ? 'bg-slate-800/50' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-gray-700';
  const textTertiary = isDarkMode ? 'text-slate-400' : 'text-gray-500';
  const borderColor = isDarkMode ? 'border-slate-700/50' : 'border-gray-200';
  const hoverBg = isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-100';
  const inputBg = isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100';
  const buttonBg = isDarkMode ? 'bg-slate-700/50' : 'bg-gray-200';

  // Mouse rotation state
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);

  const saveToHistory = (state) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          const initialState = { rotation: 0, scale: 1, flipH: false, flipV: false, brightness: 100, contrast: 100 };
          resetState(initialState);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const resetState = (state) => {
    setRotation(state.rotation);
    setScale(state.scale);
    setFlipH(state.flipH);
    setFlipV(state.flipV);
    setBrightness(state.brightness);
    setContrast(state.contrast);
    setHistory([state]);
    setHistoryIndex(0);
  };

  const drawImage = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const maxWidth = 800;
    const maxHeight = 600;
    let width = image.width;
    let height = image.height;

    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale * (flipH ? -1 : 1), scale * (flipV ? -1 : 1));
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    ctx.drawImage(image, -width / 2, -height / 2, width, height);

    ctx.restore();
  };

  useEffect(() => {
    drawImage();
  }, [image, rotation, scale, flipH, flipV, brightness, contrast]);

  // ✅ Mouse Rotation Handlers
  const getAngle = (clientX, clientY) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;
    return Math.atan2(y, x);
  };

  const handleMouseDown = (e) => {
    if (!canvasRef.current) return;
    setIsDragging(true);
    const rect = canvasRef.current.getBoundingClientRect();
    setCenterX(rect.left + rect.width / 2);
    setCenterY(rect.top + rect.height / 2);
    setStartAngle(getAngle(e.clientX, e.clientY) - (rotation * Math.PI) / 180);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newAngleRad = getAngle(e.clientX, e.clientY) - startAngle;
    let newAngleDeg = (newAngleRad * 180) / Math.PI;
    // Normalize to 0–360
    newAngleDeg = ((newAngleDeg % 360) + 360) % 360;
    setRotation(newAngleDeg);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      saveToHistory({ rotation, scale, flipH, flipV, brightness, contrast });
    }
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, startAngle, rotation, scale, flipH, flipV, brightness, contrast]);

  // Rest of your functions (rotateRight, zoomIn, etc.) remain unchanged
  const rotateRight = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    saveToHistory({ rotation: newRotation, scale, flipH, flipV, brightness, contrast });
  };

  const rotateLeft = () => {
    const newRotation = (rotation - 90 + 360) % 360;
    setRotation(newRotation);
    saveToHistory({ rotation: newRotation, scale, flipH, flipV, brightness, contrast });
  };

  const handleFlipH = () => {
    const newFlipH = !flipH;
    setFlipH(newFlipH);
    saveToHistory({ rotation, scale, flipH: newFlipH, flipV, brightness, contrast });
  };

  const handleFlipV = () => {
    const newFlipV = !flipV;
    setFlipV(newFlipV);
    saveToHistory({ rotation, scale, flipH, flipV: newFlipV, brightness, contrast });
  };

  const zoomIn = () => {
    const newScale = Math.min(scale + 0.1, 3);
    setScale(newScale);
    saveToHistory({ rotation, scale: newScale, flipH, flipV, brightness, contrast });
  };

  const zoomOut = () => {
    const newScale = Math.max(scale - 0.1, 0.1);
    setScale(newScale);
    saveToHistory({ rotation, scale: newScale, flipH, flipV, brightness, contrast });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      resetState(state);
      setHistoryIndex(newIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      resetState(state);
      setHistoryIndex(newIndex);
    }
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className={`min-h-screen ${bgPrimary} transition-colors duration-300`}>
     
      <div className="max-w-7xl mx-auto">
        {!image ? (
          // Upload Screen
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="text-center py-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">Rotate Image Pro</h1>
              <p className="text-purple-200 text-lg">Professional editing with advanced features</p>
            </div>

            <div className="max-w-4xl mx-auto mt-5">
              <div className="text-center mt-5">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center min-h-[90px] mx-auto w-full max-w-[728px] shadow-md border border-blue-200 dark:border-blue-800">
                <p className="text-blue-800 dark:text-blue-300 text-sm sm:text-base font-semibold">Advertisement Space 728x90</p>
                <p className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm mt-1">Your Banner Ad Here</p>
              </div>
            </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1 rounded-xl mb-6 mt-8">
                <div className={`${bgCard} rounded-xl p-12 text-center`}>
                  <div
                    className={`border-4 border-dashed ${isDarkMode ? 'border-white/30' : 'border-gray-300'} rounded-xl p-16`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 font-semibold text-lg inline-flex items-center gap-2 transition-transform hover:scale-105"
                    >
                      📁 Select Image
                    </button>
                    <p className={`mt-6 ${textPrimary} text-lg`}>or drag and drop an image here</p>
                    <p className={`mt-3 ${textTertiary} text-sm`}>
                      Max file size: 10 MB. <span className="underline cursor-pointer">Sign up</span> for more.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block absolute left-4 top-[390px]">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center min-h-[90px] mx-auto w-full w-[110px] h-[500px] shadow-md border border-blue-200 dark:border-blue-800">
                <p className="text-blue-600 text-xs mt-2 rotate-90 whitespace-nowrap">Left Skyscraper Banner</p>
              </div>
            </div>

            <div className="hidden lg:block absolute right-4 top-[390px]">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center min-h-[90px] mx-auto w-full w-[110px] h-[500px] shadow-md border border-blue-200 dark:border-blue-800">
                <p className="text-blue-600 text-xs mt-2 rotate-90 whitespace-nowrap">Right Skyscraper Banner</p>
              </div>
            </div>
          </div>
        ) : (
          // Editor View
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 sm:px-6 py-6">
            {/* Sidebar */}
            <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
              {[
                {
                  title: 'Upload Image',
                  icon: ImageIcon,
                  content: (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all font-medium shadow-md"
                    >
                      <Upload className="w-5 h-5 inline mr-2" />
                      New Image
                    </button>
                  ),
                },
                {
                  title: 'Transform',
                  content: (
                    <div className="space-y-2">
                      {[
                        { label: 'Rotate Left', icon: RotateCcw, onClick: rotateLeft },
                        { label: 'Rotate Right', icon: RotateCw, onClick: rotateRight },
                        { label: 'Flip Horizontal', icon: FlipHorizontal, onClick: handleFlipH },
                        { label: 'Flip Vertical', icon: FlipVertical, onClick: handleFlipV },
                      ].map((btn, i) => (
                        <button
                          key={i}
                          onClick={btn.onClick}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition ${hoverBg} ${textPrimary}`}
                        >
                          <btn.icon className="w-4 h-4" />
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  ),
                },
                {
                  title: 'Zoom',
                  content: (
                    <div className="space-y-2">
                      <button
                        onClick={zoomIn}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition ${hoverBg} ${textPrimary}`}
                      >
                        <ZoomIn className="w-4 h-4" />
                        Zoom In
                      </button>
                      <button
                        onClick={zoomOut}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition ${hoverBg} ${textPrimary}`}
                      >
                        <ZoomOut className="w-4 h-4" />
                        Zoom Out
                      </button>
                    </div>
                  ),
                },
                {
                  title: 'History',
                  content: (
                    <div className="space-y-2">
                      <button
                        onClick={handleUndo}
                        disabled={historyIndex <= 0}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition ${hoverBg} ${textPrimary} disabled:opacity-50`}
                      >
                        <Undo className="w-4 h-4" />
                        Undo
                      </button>
                      <button
                        onClick={handleRedo}
                        disabled={historyIndex >= history.length - 1}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition ${hoverBg} ${textPrimary} disabled:opacity-50`}
                      >
                        <Redo className="w-4 h-4" />
                        Redo
                      </button>
                    </div>
                  ),
                },
                {
                  title: 'Download',
                  content: (
                    <button
                      onClick={downloadImage}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all font-medium shadow-md"
                    >
                      <Download className="w-5 h-5 inline mr-2" />
                      Download Image
                    </button>
                  ),
                },
              ].map((section, i) => (
                <div
                  key={i}
                  className={`${bgCard} backdrop-blur-sm rounded-xl shadow-lg border ${borderColor} p-5`}
                >
                  <h3 className={`font-semibold mb-3 flex items-center gap-2 ${textPrimary}`}>
                    {section.icon && <section.icon className="w-5 h-5" />}
                    {section.title}
                  </h3>
                  {section.content}
                </div>
              ))}
            </div>

            {/* Canvas Area */}
            <div className="lg:col-span-9">
              <div className={`${bgCard} rounded-xl shadow-lg border ${borderColor} p-6`}>
                <div className="flex justify-center">
                  <div
                    ref={containerRef}
                    className="relative inline-block bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-xl"
                  >
                    <canvas
                      ref={canvasRef}
                      onMouseDown={handleMouseDown}
                      className="max-w-full h-auto rounded-lg border-2 border-white/20 cursor-grab active:cursor-grabbing"
                      style={{ maxWidth: '800px', maxHeight: '600px' }}
                    />
                    {/* Optional: Rotation hint */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                      Drag to rotate
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">
                    Rotation: {rotation.toFixed(1)}° | Scale: {(scale * 100).toFixed(0)}% |
                    Flip: {flipH ? 'H' : ''}{flipV ? 'V' : ''}{!flipH && !flipV ? 'None' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className={`${bgSecondary} backdrop-blur-md border-t ${borderColor} mt-20 py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Palette className="text-white" size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    RotateImage Pro
                  </h3>
                  <p className={`text-xs ${textTertiary}`}>Professional Tool</p>
                </div>
              </div>
              <p className={`text-sm ${textTertiary} text-center md:text-left`}>
                Your ultimate RotateImage and design tool for professional workflows.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h4 className={`text-sm font-semibold ${textSecondary} mb-4 uppercase tracking-wide`}>Features</h4>
              <ul className={`space-y-2 text-sm ${textTertiary}`}>
                <li className="hover:text-blue-400 transition cursor-pointer">Color Picker</li>
                <li className="hover:text-blue-400 transition cursor-pointer">Image Extractor</li>
                <li className="hover:text-blue-400 transition cursor-pointer">Color Harmonies</li>
                <li className="hover:text-blue-400 transition cursor-pointer">Contrast Checker</li>
              </ul>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h4 className={`text-sm font-semibold ${textSecondary} mb-4 uppercase tracking-wide`}>Resources</h4>
              <ul className={`space-y-2 text-sm ${textTertiary}`}>
                <li className="hover:text-blue-400 transition cursor-pointer">Documentation</li>
                <li className="hover:text-blue-400 transition cursor-pointer">Tutorials</li>
                <li className="hover:text-blue-400 transition cursor-pointer">Support</li>
                <li className="hover:text-blue-400 transition cursor-pointer">Privacy Policy</li>
              </ul>
            </div>
          </div>

          <div className={`border-t ${borderColor} pt-6`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className={`text-sm ${textTertiary}`}>© {new Date().getFullYear()} RotateImage Pro. All rights reserved.</p>
              <div className="flex items-center gap-6">
                {['facebook', 'twitter', 'linkedin'].map((s) => (
                  <a key={s} href="#" className={`${textTertiary} hover:text-blue-400 transition`}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={s === 'facebook' ? "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" : s === 'twitter' ? "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" : "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}