import React, { useState, useRef, useEffect } from 'react';
import { Copy, Upload, Palette, Image as ImageIcon, Check, Star, Moon, Sun, Pipette, X } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { Shield, Scissors, Ruler, Globe, Heart } from "lucide-react";
import Footer from '../components/Footer'; // Adjust path if needed
import { useLocation } from 'react-router-dom';

export default function ColorPickerPage({ isDarkMode }) {
  const [activeTab, setActiveTab] = useState('color-picker');
  const [hexValue, setHexValue] = useState('#A93A3A');
  const [activeFormat, setActiveFormat] = useState('HSL');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageColors, setImageColors] = useState([]);
  const [copiedHex, setCopiedHex] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState(false);
  const [activeHarmony, setActiveHarmony] = useState('Analogous');
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#EFD243');
  const [contrastRatio, setContrastRatio] = useState(0);
  const [contrastResult, setContrastResult] = useState({ small: 'Very Bad', large: 'Very Bad' });
  const [copiedColor, setCopiedColor] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const location = useLocation();
  // Theme-aware classes
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

  const startLivePicker = async () => {
    try {
      if ('EyeDropper' in window) {
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        setHexValue(result.sRGBHex.toUpperCase());
      } else {
        alert('Live Color Picker is not supported in your browser. Please use Chrome, Edge, or Opera (version 95+).');
      }
    } catch (err) {
      console.log('Color picking cancelled or failed');
    }
  };

  // ... (sab helper functions same rahenge: hexToHSL, hslToHex, etc.)
  const hexToHSL = (hex) => {
    if (hex.length === 4) hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) h = s = 0;
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  const hexToRGB = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0];
  };

  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
  };

  const calculateContrastRatio = (c1, c2) => {
    const lum = (r, g, b) => {
      const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };
    const l1 = lum(...hexToRGB(c1)), l2 = lum(...hexToRGB(c2));
    return parseFloat(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2));
  };

  const rgbToCMYK = (r, g, b) => {
    let c = 1 - r / 255, m = 1 - g / 255, y = 1 - b / 255;
    let k = Math.min(c, m, y);
    if (k === 1) c = m = y = 0;
    else { c = (c - k) / (1 - k); m = (m - k) / (1 - k); y = (y - k) / (1 - k); }
    return { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) };
  };

  const generateShades = (baseHex, steps = 11) => {
    const hsl = hexToHSL(baseHex);
    return Array.from({ length: steps }, (_, i) => {
      const newL = Math.max(0, hsl.l * (1 - (i / (steps - 1))));
      return hslToHex(hsl.h, hsl.s, newL);
    });
  };

  const generateTints = (baseHex, steps = 11) => {
    const hsl = hexToHSL(baseHex);
    return Array.from({ length: steps }, (_, i) => {
      const newL = Math.min(100, hsl.l + (100 - hsl.l) * (i / (steps - 1)));
      return hslToHex(hsl.h, hsl.s, newL);
    });
  };

  const generateHarmonies = (baseHex) => {
    const { h, s, l } = hexToHSL(baseHex);
    return {
      Complementary: [baseHex, hslToHex((h + 180) % 360, s, l)],
      Triadic: [baseHex, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)],
      Tetradic: [baseHex, hslToHex((h + 90) % 360, s, l), hslToHex((h + 180) % 360, s, l), hslToHex((h + 270) % 360, s, l)],
      Analogous: [baseHex, hslToHex((h + 30) % 360, s, l), hslToHex((h + 60) % 360, s, l), hslToHex((h + 90) % 360, s, l)],
      'Mono Chromatic': [baseHex, hslToHex(h, s, Math.max(0, l - 20)), hslToHex(h, s, Math.min(100, l + 20)), hslToHex(h, s, Math.max(0, l - 40))]
    };
  };

  useEffect(() => {
    const ratio = calculateContrastRatio(textColor, bgColor);
    setContrastRatio(ratio);
    setContrastResult({
      small: ratio >= 4.5 ? 'Good' : ratio >= 3 ? 'Fair' : 'Very Bad',
      large: ratio >= 3 ? 'Good' : ratio >= 2.1 ? 'Fair' : 'Very Bad'
    });
  }, [textColor, bgColor]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'hex') {
      setCopiedHex(true);
      setTimeout(() => setCopiedHex(false), 2000);
    } else if (type === 'color') {
      setCopiedColor(text);
      setTimeout(() => setCopiedColor(null), 2000);
    } else {
      setCopiedFormat(true);
      setTimeout(() => setCopiedFormat(false), 2000);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        extractColors(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractColors = (imageSrc) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const colorMap = {};
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i], g = imageData.data[i + 1], b = imageData.data[i + 2];
        const hex = rgbToHex(r, g, b);
        colorMap[hex] = (colorMap[hex] || 0) + 1;
      }
      const sortedColors = Object.entries(colorMap).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([c]) => c);
      setImageColors(sortedColors);
    };
    img.src = imageSrc;
  };

  const handleImageClick = (e) => {
    if (!imageRef.current || !canvasRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvasRef.current.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvasRef.current.height / rect.height));
    const ctx = canvasRef.current.getContext('2d');
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
    setHexValue(hex);
  };

  const hsl = hexToHSL(hexValue);
  const rgb = { r: parseInt(hexValue.slice(1, 3), 16), g: parseInt(hexValue.slice(3, 5), 16), b: parseInt(hexValue.slice(5, 7), 16) };
  const cmyk = rgbToCMYK(rgb.r, rgb.g, rgb.b);

  const getFormatValue = () => {
    switch (activeFormat) {
      case 'RGB': return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      case 'HSV': return `hsv(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`;
      case 'HSL': return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      case 'CMYK': return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
      default: return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
  };

  const harmonies = generateHarmonies(hexValue);
  const currentHarmonyColors = harmonies[activeHarmony] || [];
  const shades = generateShades(hexValue);
  const tints = generateTints(hexValue);

  const features = [
    { icon: <Scissors className="w-10 h-10 mb-4" />, title: "Quick and Easy to Use", description: "Crop images easily..." },
    { icon: <Ruler className="w-10 h-10 mb-4" />, title: "Crop Image to Any Size", description: "Crop your image to an exact pixel size..." },
    { icon: <ImageIcon className="w-10 h-10 mb-4" />, title: "Crop to Any Aspect Ratio", description: "Choose from many different crop aspect ratios..." },
    { icon: <Shield className="w-10 h-10 mb-4" />, title: "Privacy Protected", description: "We crop image files right on the browser..." },
    { icon: <Globe className="w-10 h-10 mb-4" />, title: "Online Tool", description: "This image cropper works on any device..." },
    { icon: <Heart className="w-10 h-10 mb-4" />, title: "100% Free", description: "This photo cropper is entirely free..." },
  ];

  return (
    <div className={`min-h-screen overflow-x-hidden ${bgPrimary} transition-colors duration-300`}>
      <div className="flex flex-col lg:flex-row">
        <div className={`w-full lg:w-96 ${borderColor} backdrop-blur-sm lg:border-r ${borderColor} p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-screen overflow-y-auto`}>
          <div className={`${inputBg} rounded-xl p-1.5 flex gap-1`}>
            <button
              onClick={() => setActiveTab('color-picker')}
              className={`flex-1 px-2 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm ${activeTab === 'color-picker'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                : `${textTertiary} hover:text-white ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                }`}
            >
              <Palette size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Color Picker</span>
              <span className="sm:hidden">Picker</span>
            </button>
            <button
              onClick={() => setActiveTab('image-picker')}
              className={`flex-1 px-2 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm ${activeTab === 'image-picker'
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30'
                : `${textTertiary} hover:text-white ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                }`}
            >
              <ImageIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Image Picker</span>
              <span className="sm:hidden">Image</span>
            </button>
          </div>
          <div className={`${bgCard} backdrop-blur-sm rounded-xl p-4 sm:p-5 border ${borderColor} space-y-3`}>
            <h2 className="text-2xl sm:text-1xl md:text-1xl font-bold bg-gradient-to-r from-indigo-200 to-purple-600 bg-clip-text text-transparent text-center">Pick a color on your screen</h2>
            <button
              onClick={startLivePicker}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-105 transform"
            >
              <Pipette size={20} />
              <span>Pick color</span>
            </button>
          </div>
          <div className={`${bgCard} backdrop-blur-sm rounded-xl p-4 sm:p-5 border ${borderColor}`}>
            <h2 className={`text-xs sm:text-sm font-semibold mb-3 ${textSecondary} uppercase tracking-wide`}>Selected Color</h2>
            <div
              className={`w-full h-24 sm:h-32 rounded-xl shadow-2xl transition-all duration-300 border ${borderColor}`}
              style={{
                backgroundColor: hexValue,
                boxShadow: `0 10px 40px ${hexValue}40`
              }}
            />
          </div>
          <div className={`${bgCard} backdrop-blur-sm rounded-xl p-4 sm:p-5 border ${borderColor}`}>
            <h2 className={`text-xs sm:text-sm font-semibold mb-3 ${textSecondary} uppercase tracking-wide`}>Hex Code</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={hexValue}
                onChange={(e) => {
                  let val = e.target.value;
                  if (!val.startsWith('#')) val = '#' + val;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) setHexValue(val.toUpperCase());
                }}
                className={`flex-1 ${inputBg} ${textPrimary} px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-mono text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border ${borderColor} transition`}
              />
              <button
                onClick={() => copyToClipboard(hexValue, 'hex')}
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all shadow-lg ${copiedHex
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                  }`}
              >
                {copiedHex ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
          <div className={`${bgCard} backdrop-blur-sm rounded-xl p-4 sm:p-5 border ${borderColor}`}>
            <h2 className={`text-xs sm:text-sm font-semibold mb-3 ${textSecondary} uppercase tracking-wide`}>Color Formats</h2>
            <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-4">
              {['RGB', 'HSV', 'HSL', 'CMYK'].map((format) => (
                <button
                  key={format}
                  onClick={() => setActiveFormat(format)}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold transition-all ${activeFormat === format
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : `${buttonBg} ${textTertiary} hover:text-white ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                    }`}
                >
                  {format}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={getFormatValue()}
                readOnly
                className={`flex-1 ${inputBg} ${textPrimary} px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-mono text-xs sm:text-sm border ${borderColor}`}
              />
              <button
                onClick={() => copyToClipboard(getFormatValue(), 'format')}
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all shadow-lg ${copiedFormat
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600'
                  }`}
              >
                {copiedFormat ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-x-auto">
          {activeTab === 'color-picker' ? (
            <div className="flex flex-col items-center w-full px-4">
              <div className="text-center mt-5 mb-5">
                <div className={`rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center h-[120px] mx-auto w-[770px] shadow-md border ${adBg}`}>
                  <p className={`text-sm sm:text-base font-semibold ${adText}`}>Advertisement Space 970x90</p>
                  <p className={`text-xs sm:text-sm mt-1 ${adSubText}`}>Your Banner Ad Here</p>
                </div>
              </div>
              <div className="w-full flex justify-center">
                <HexColorPicker
                  color={hexValue}
                  onChange={(newHex) => setHexValue(newHex)}
                  className={`rounded-2xl shadow-2xl border-2 ${borderColor}`}
                  style={{ height: '500px', width: '700px', maxWidth: '100%' }}
                />
              </div>
            </div>
          ) : (
            <div className="w-full max-w-5xl space-y-6">
              {!uploadedImage ? (
                <label className={`flex flex-col items-center justify-center w-full h-[400px] sm:h-[500px] border-3 border-dashed ${borderColor} rounded-2xl cursor-pointer ${bgCard} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} hover:border-blue-500 transition-all backdrop-blur-sm`}>
                  <div className="flex flex-col items-center justify-center px-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
                      <Upload size={32} className="sm:w-10 sm:h-10 text-white" />
                    </div>
                    <p className={`mb-2 text-xl sm:text-2xl font-bold ${textPrimary} text-center`}>Upload an Image</p>
                    <p className={`text-sm ${textTertiary} text-center`}>Click or drag and drop</p>
                    <p className={`text-xs ${textTertiary} mt-2 text-center`}>PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              ) : (
                <div className="space-y-6">
                  <div className={`relative rounded-2xl overflow-hidden shadow-2xl border-2 ${borderColor} ${bgCard}`}>
                    <img
                      ref={imageRef}
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full max-h-[350px] sm:max-h-[450px] object-contain cursor-crosshair"
                      onClick={handleImageClick}
                    />
                    <button
                      onClick={() => { setUploadedImage(null); setImageColors([]); }}
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 px-3 sm:px-5 py-2 sm:py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-lg font-semibold text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  {imageColors.length > 0 && (
                    <div className={`${bgCard} backdrop-blur-sm rounded-2xl p-4 sm:p-6 border ${borderColor}`}>
                      <h3 className={`text-lg sm:text-xl font-bold mb-4 ${textPrimary} flex items-center gap-2`}>
                        <Palette size={20} className="sm:w-6 sm:h-6 text-purple-400" />
                        Extracted Color Palette
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
                        {imageColors.map((color, index) => (
                          <div key={index} onClick={() => setHexValue(color)} className="group relative cursor-pointer">
                            <div
                              className={`h-20 sm:h-24 rounded-xl shadow-lg hover:scale-110 hover:shadow-2xl transition-all border ${borderColor}`}
                              style={{ backgroundColor: color, boxShadow: `0 4px 12px ${color}40` }}
                            />
                            <p className={`text-xs text-center mt-2 font-mono ${textTertiary} group-hover:text-white transition font-semibold`}>
                              {color}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 pb-12 space-y-10">
        <div className={`${bgCard} backdrop-blur-sm rounded-xl p-5 border ${borderColor}`}>
          <h2 className={`text-sm font-semibold mb-3 ${textSecondary} uppercase tracking-wide`}>Color Variations</h2>
          <p className={`text-xs ${textTertiary} mb-4`}>Shades are generated by adding pure black in 10% increments...</p>
          {/* ... shades & tints sections same as original */}
          <div className="mb-6">
            <h3 className={`text-xs font-semibold mb-2 ${textSecondary}`}>Shades</h3>
            <div className="flex items-center gap-1 mb-2">
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((p) => (
                <div key={p} className={`flex-1 text-xs ${textTertiary} text-center`}>{p}%</div>
              ))}
            </div>
            <div className="flex items-center gap-1 mb-2">
              {shades.map((color, i) => (
                <div
                  key={i}
                  onClick={() => navigator.clipboard.writeText(color)}
                  className={`flex-1 h-12 rounded-lg cursor-pointer hover:scale-105 transition-transform border ${borderColor} flex items-center justify-center`}
                  style={{ backgroundColor: color }}
                >
                  <Copy size={16} className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {shades.map((color, i) => (
                <div key={i} className={`flex-1 text-xs ${textTertiary} text-center font-mono`}>{color}</div>
              ))}
            </div>
          </div>
          <div>
            <h3 className={`text-xs font-semibold mb-2 ${textSecondary}`}>Tints</h3>
            <div className="flex items-center gap-1 mb-2">
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((p) => (
                <div key={p} className={`flex-1 text-xs ${textTertiary} text-center`}>{p}%</div>
              ))}
            </div>
            <div className="flex items-center gap-1 mb-2">
              {tints.map((color, i) => (
                <div
                  key={i}
                  onClick={() => navigator.clipboard.writeText(color)}
                  className={`flex-1 h-12 rounded-lg cursor-pointer hover:scale-105 transition-transform border ${borderColor} flex items-center justify-center`}
                  style={{ backgroundColor: color }}
                >
                  <Copy size={16} className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {tints.map((color, i) => (
                <div key={i} className={`flex-1 text-xs ${textTertiary} text-center font-mono`}>{color}</div>
              ))}
            </div>
          </div>
        </div>

        <div className={`${bgCard} backdrop-blur-sm rounded-xl p-5 border ${borderColor}`}>
          <h2 className={`text-sm font-semibold mb-3 ${textSecondary} uppercase tracking-wide`}>Color Harmonies</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {["Complementary", "Triadic", "Tetradic", "Analogous", "Mono Chromatic"].map((harmony) => (
              <button
                key={harmony}
                onClick={() => setActiveHarmony(harmony)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeHarmony === harmony
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : `${buttonBg} ${textTertiary} hover:text-white ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                  }`}
              >
                {harmony}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentHarmonyColors.map((color, i) => (
              <div key={i} onClick={() => copyToClipboard(color, 'color')} className="group relative cursor-pointer">
                <div
                  className={`h-24 rounded-xl shadow-lg hover:scale-110 hover:shadow-2xl transition-all border ${borderColor}`}
                  style={{ backgroundColor: color, boxShadow: `0 4px 12px ${color}40` }}
                />
                <p className={`text-xs text-center mt-2 font-mono ${textTertiary} group-hover:text-white transition font-semibold`}>
                  {color}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className={`${bgCard} backdrop-blur-sm rounded-xl p-5 border ${borderColor}`}>
          <h2 className={`text-sm font-semibold mb-3 ${textSecondary} uppercase tracking-wide`}>Color Contrast Checker</h2>
          <p className={`text-xs ${textTertiary} mb-4`}>Evaluate the contrast between "Text Color" and "Background Color"...</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${textSecondary}`}>Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className={`flex-1 ${inputBg} ${textPrimary} px-3 py-2 rounded-lg font-mono text-sm`}
                />
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className={`w-10 h-10 rounded border ${borderColor} cursor-pointer`}
                />
                <button onClick={() => setTextColor(hexValue)} className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition text-xs font-semibold whitespace-nowrap">
                  Use Selected
                </button>
              </div>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${textSecondary}`}>Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className={`flex-1 ${inputBg} ${textPrimary} px-3 py-2 rounded-lg font-mono text-sm`}
                />
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className={`w-10 h-10 rounded border ${borderColor} cursor-pointer`}
                />
                <button onClick={() => setBgColor(hexValue)} className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition text-xs font-semibold whitespace-nowrap">
                  Use Selected
                </button>
              </div>
            </div>
          </div>
          <div className={`${inputBg} rounded-lg p-4 mb-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xl font-bold ${textPrimary}`}>{contrastRatio}</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={`${star <= Math.floor(contrastRatio / 2)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-400"
                      }`}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={`${buttonBg} p-3 rounded`}>
                <div className={`text-xs font-semibold ${textPrimary} mb-1`}>Small Text</div>
                <div className={`text-xs ${textPrimary}`}>Result: {contrastResult.small}</div>
              </div>
              <div className={`${buttonBg} p-3 rounded`}>
                <div className={`text-xs font-semibold ${textPrimary} mb-1`}>Large Text</div>
                <div className={`text-xs ${textPrimary}`}>Result: {contrastResult.large}</div>
              </div>
            </div>
          </div>
          <div className={`text-xs ${textTertiary} mb-3`}>
            {contrastRatio < 3 && "Very Bad contrast..."}
            {contrastRatio >= 3 && contrastRatio < 4.5 && "Fair contrast..."}
            {contrastRatio >= 4.5 && "Good contrast! Meets WCAG AA standards..."}
            {contrastRatio >= 7 && " Excellent contrast! Meets WCAG AAA standards."}
          </div>
          <button
            onClick={() => {
              const bgHSL = hexToHSL(bgColor);
              const suggestedTextColor = bgHSL.l > 50 ? "#000000" : "#FFFFFF";
              setTextColor(suggestedTextColor);
            }}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
          >
            Adjust Text Color
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className={`${textPrimary} py-16 px-6`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center">
          {features.map((item, index) => (
            <div key={index} className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${bgCard}`}>
              <div className="flex flex-col items-center">
                {React.cloneElement(item.icon, { className: `w-10 h-10 mb-4 ${textPrimary}` })}
                <h3 className={`text-lg font-semibold mb-2 ${textPrimary}`}>{item.title}</h3>
                <p className={`${textTertiary} text-sm leading-relaxed`}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How To */}
      <div className={`mt-8 sm:mt-5 ${bgCard} rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 transition-opacity duration-700 opacity-100 max-w-3xl sm:max-w-2xl mx-auto`}>
        <h2 className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 justify-center`}>
          <span className="text-2xl sm:text-3xl">❓</span> How to pick a color from an image?
        </h2>
        <div className="space-y-3 sm:space-y-4">
          {[
            { step: 1, color: 'indigo', text: 'Upload your image or open the color wheel.' },
            { step: 2, color: 'purple', text: 'Mouse hover and click to select the exact pixel.' },
            { step: 3, color: 'green', text: 'Copy the color code in HEX/HTML, RGB…etc.' }
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 ${isDarkMode ? `bg-${item.color}-900/20` : `bg-${item.color}-50`} rounded-lg sm:rounded-xl hover:shadow-md transition`}
            >
              <span className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-${item.color}-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base`}>
                {item.step}
              </span>
              <p className={textPrimary}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Info Sections */}
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h2 className={`text-sm font-semibold ${textSecondary} uppercase tracking-wide mb-2`}>Color Harmony</h2>
        <p className={`text-xs ${textTertiary}`}>
          Color Harmony refers to matching and harmonious colors that are aesthetically pleasing...
        </p>
      </div>

      {[
        { img: '/assets/image1.webp', title: 'Complementary Colors', desc: 'Complementary color is...' },
        { img: '/assets/image2.webp', title: 'Triadic Colors', desc: 'Three colors spaced evenly...' },
        { img: '/assets/image3.webp', title: 'Tetradic Colors', desc: 'This color combination...' }
      ].map((item, idx) => (
        <div key={idx} className="max-w-6xl mx-auto mt-40 flex flex-col md:flex-row items-center gap-10 px-6 pb-20">
          <div className="flex-1 flex justify-center order-2 md:order-1">
            <img src={item.img} alt="" className="rounded-xl shadow-lg w-full max-w-md" />
          </div>
          <div className="flex-1 text-center md:text-left order-1 md:order-2">
            <h2 className={`text-3xl font-bold ${textPrimary} mb-4`}>{item.title}</h2>
            <p className={`${textTertiary} leading-relaxed`}>{item.desc}</p>
          </div>
        </div>
      ))}

      <Footer currentPage={location.pathname} isDarkMode={isDarkMode} />

      {/* Copied Notification */}
      {copiedColor && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce z-50">
          <Check size={20} />
          <div>
            <p className="font-semibold text-sm">Color Copied!</p>
            <p className="text-xs opacity-90">{copiedColor}</p>
          </div>
        </div>
      )}
    </div>
  );
}