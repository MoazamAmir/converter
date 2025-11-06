import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
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

export default function ImageEditor({ isDarkMode }) {
  const [image, setImage] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const location = useLocation();

  // ✅ Theme-aware classes
  const bgPrimary = isDarkMode ? 'bg-[#111727]' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100';
  const bgCard = isDarkMode ? 'bg-[#1a2332]' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const textTertiary = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const buttonBg = isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800';
  const adBg = isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-100 border-blue-200';
  const adText = isDarkMode ? 'text-blue-300' : 'text-blue-800';
  const adSubText = isDarkMode ? 'text-blue-400' : 'text-blue-600';

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
    <div className={`min-h-screen overflow-x-hidden ${bgPrimary} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4">
        {!image ? (
          // Upload Screen
          <div className="max-w-7xl mx-auto py-5">
            <div className="text-center py-8">
              <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center`}>Rotate Image Pro</h1>
              <p className={`${isDarkMode ? 'text-purple-300' : 'text-purple-500'} text-lg`}>Professional editing with advanced features</p>
            </div>

            <div className="max-w-4xl mx-auto mt-5">
              {/* Ad Banner */}
              <div className="text-center mt-5">
                <div className={`rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center min-h-[90px] mx-auto w-full max-w-[728px] shadow-md border ${adBg}`}>
                  <p className={`text-sm sm:text-base font-semibold ${adText}`}>Advertisement Space 728x90</p>
                  <p className={`text-xs sm:text-sm mt-1 ${adSubText}`}>Your Banner Ad Here</p>
                </div>
              </div>

              {/* Upload Area */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1 rounded-xl mb-6 mt-8">
                <div className={`${bgCard} rounded-xl p-12 text-center`}>
                  <div className={`border-4 border-dashed rounded-xl p-16 ${isDarkMode ? 'border-white/20' : 'border-gray-300'}`}>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
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

            {/* Sidebar Ads */}
            <div className="hidden lg:block absolute left-4 top-[390px]">
              <div className={`rounded-lg p-4 w-[110px] h-[500px] shadow-md border ${adBg}`}>
                <p className={`text-xs mt-2 rotate-90 whitespace-nowrap ${adSubText}`}>Left Skyscraper Banner</p>
              </div>
            </div>
            <div className="hidden lg:block absolute right-4 top-[390px]">
              <div className={`rounded-lg p-4 w-[110px] h-[500px] shadow-md border ${adBg}`}>
                <p className={`text-xs mt-2 rotate-90 whitespace-nowrap ${adSubText}`}>Right Skyscraper Banner</p>
              </div>
            </div>
          </div>
        ) : (
          // Editor View
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-6">
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
                    className={`relative inline-block rounded-xl p-6 shadow-xl ${isDarkMode ? 'bg-[#1f2937]' : 'bg-gray-100'}`}
                  >
                    <canvas
                      ref={canvasRef}
                      onMouseDown={handleMouseDown}
                      className="max-w-full h-auto rounded-lg border-2 border-white/20 cursor-grab active:cursor-grabbing"
                      style={{ maxWidth: '800px', maxHeight: '600px' }}
                    />
                    <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs ${textTertiary}`}>
                      Drag to rotate
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className={`text-sm ${textTertiary}`}>
                    Rotation: {rotation.toFixed(1)}° | Scale: {(scale * 100).toFixed(0)}% |
                    Flip: {flipH ? 'H' : ''}{flipV ? 'V' : ''}{!flipH && !flipV ? 'None' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer currentPage={location.pathname} isDarkMode={isDarkMode} />
    </div>
  );
}