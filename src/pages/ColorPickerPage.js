import React, { useState, useRef, useEffect } from 'react';
import { Copy, Upload, Palette, Image as ImageIcon, Check, Star, Moon, Sun, Pipette, X } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { Shield, Scissors, Ruler, Globe, Heart } from "lucide-react";

export default function ColorPickerPage() {
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
  const [isDarkMode, setIsDarkMode] = useState(true);

  const canvasRef = useRef(null);
  const imageRef = useRef(null);

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

  const hexToHSL = (hex) => {
    if (hex.length === 4) {
      hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
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

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
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
    if (!result) return [0, 0, 0];
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ];
  };

  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
  };

  const calculateContrastRatio = (color1, color2) => {
    const luminance = (r, g, b) => {
      const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const lum1 = luminance(...hexToRGB(color1));
    const lum2 = luminance(...hexToRGB(color2));

    const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
    return parseFloat(ratio.toFixed(2));
  };

  const rgbToCMYK = (r, g, b) => {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, m, y);

    if (k === 1) {
      c = m = y = 0;
    } else {
      c = ((c - k) / (1 - k));
      m = ((m - k) / (1 - k));
      y = ((y - k) / (1 - k));
    }

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  const generateShades = (baseHex, steps = 11) => {
    const hsl = hexToHSL(baseHex);
    const shades = [];
    for (let i = 0; i < steps; i++) {
      const blackPercent = (i / (steps - 1)) * 100;
      const newL = Math.max(0, hsl.l * (1 - blackPercent / 100));
      const hex = hslToHex(hsl.h, hsl.s, newL);
      shades.push(hex);
    }
    return shades;
  };

  const generateTints = (baseHex, steps = 11) => {
    const hsl = hexToHSL(baseHex);
    const tints = [];
    for (let i = 0; i < steps; i++) {
      const whitePercent = (i / (steps - 1)) * 100;
      const newL = Math.min(100, hsl.l + (100 - hsl.l) * (whitePercent / 100));
      const hex = hslToHex(hsl.h, hsl.s, newL);
      tints.push(hex);
    }
    return tints;
  };

  const generateHarmonies = (baseHex) => {
    const hsl = hexToHSL(baseHex);
    const { h, s, l } = hsl;

    return {
      Complementary: [
        baseHex,
        hslToHex((h + 180) % 360, s, l)
      ],
      Triadic: [
        baseHex,
        hslToHex((h + 120) % 360, s, l),
        hslToHex((h + 240) % 360, s, l)
      ],
      Tetradic: [
        baseHex,
        hslToHex((h + 90) % 360, s, l),
        hslToHex((h + 180) % 360, s, l),
        hslToHex((h + 270) % 360, s, l)
      ],
      Analogous: [
        baseHex,
        hslToHex((h + 30) % 360, s, l),
        hslToHex((h + 60) % 360, s, l),
        hslToHex((h + 90) % 360, s, l)
      ],
      'Mono Chromatic': [
        baseHex,
        hslToHex(h, s, Math.max(0, l - 20)),
        hslToHex(h, s, Math.min(100, l + 20)),
        hslToHex(h, s, Math.max(0, l - 40))
      ]
    };
  };

  useEffect(() => {
    const ratio = calculateContrastRatio(textColor, bgColor);
    setContrastRatio(ratio);

    const smallTextResult = ratio >= 4.5 ? 'Good' : ratio >= 3 ? 'Fair' : 'Very Bad';
    const largeTextResult = ratio >= 3 ? 'Good' : ratio >= 2.1 ? 'Fair' : 'Very Bad';

    setContrastResult({
      small: smallTextResult,
      large: largeTextResult
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
      const pixels = imageData.data;
      const colorMap = {};

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const hex = rgbToHex(r, g, b);
        colorMap[hex] = (colorMap[hex] || 0) + 1;
      }

      const sortedColors = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([color]) => color);

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
  const rgb = {
    r: parseInt(hexValue.slice(1, 3), 16),
    g: parseInt(hexValue.slice(3, 5), 16),
    b: parseInt(hexValue.slice(5, 7), 16)
  };
  const cmyk = rgbToCMYK(rgb.r, rgb.g, rgb.b);

  const getFormatValue = () => {
    switch (activeFormat) {
      case 'RGB':
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      case 'HSV':
        return `hsv(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`;
      case 'HSL':
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      case 'CMYK':
        return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
      default:
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
  };

  const harmonies = generateHarmonies(hexValue);
  const currentHarmonyColors = harmonies[activeHarmony] || [];
  const shades = generateShades(hexValue);
  const tints = generateTints(hexValue);
  const features = [
    {
      icon: <Scissors className="w-10 h-10 mb-4" />,
      title: "Quick and Easy to Use",
      description: "Crop images easily by drawing a crop rectangle on them. No need to upload. We crop photos right on your browser.",
    },
    {
      icon: <Ruler className="w-10 h-10 mb-4" />,
      title: "Crop Image to Any Size",
      description: "Crop your image to an exact pixel size to share them without leaving out parts or distorting them.",
    },
    {
      icon: <ImageIcon className="w-10 h-10 mb-4" />,
      title: "Crop to Any Aspect Ratio",
      description: "Choose from many different crop aspect ratios to get the best composition for your photo.",
    },
    {
      icon: <Shield className="w-10 h-10 mb-4" />,
      title: "Privacy Protected",
      description: "We crop image files right on the browser. Since your images never get uploaded to our servers, no one can access them.",
    },
    {
      icon: <Globe className="w-10 h-10 mb-4" />,
      title: "Online Tool",
      description: "This image cropper works on Windows, Mac, Linux, or any device with a web browser.",
    },
    {
      icon: <Heart className="w-10 h-10 mb-4" />,
      title: "100% Free",
      description: "This photo cropper is entirely free to use. No registrations, limits, or watermarks.",
    },
  ];

  return (
    <div className={`min-h-screen ${bgPrimary}`}>
      

      <div className="flex flex-col lg:flex-row">
        <div className={`w-full lg:w-96 ${borderColor} backdrop-blur-sm lg:border-r ${borderColor} p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-screen overflow-y-auto`}>
          <div className={`${inputBg} rounded-xl p-1.5 flex gap-1`}>
            <button
              onClick={() => setActiveTab('color-picker')}
              className={`flex-1 px-2 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm ${activeTab === 'color-picker'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                : `${textTertiary} hover:text-white ${hoverBg}`
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
                : `${textTertiary} hover:text-white ${hoverBg}`
                }`}
            >
              <ImageIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Image Picker</span>
              <span className="sm:hidden">Image</span>
            </button>
          </div>

          <div className={`${bgCard} backdrop-blur-sm rounded-xl p-4 sm:p-5 border ${borderColor} space-y-3`}>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Pick a color on your screen</h2>
            <button
              onClick={startLivePicker}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-105 transform"
            >
              <Pipette size={20} />
              <span>Pick color</span>
            </button>
            {/* <p className="text-xs sm:text-sm text-gray-400">
      Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-xs font-mono">i</kbd> to pick color
    </p> */}
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
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                    setHexValue(val.toUpperCase());
                  }
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
                    : `${buttonBg} ${textTertiary} hover:text-white ${hoverBg}`
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
                <div className="text-center mt-5">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center h-[120px] mx-auto w-[770px] shadow-md border border-blue-200 dark:border-blue-800">
                    <p className="text-blue-800 dark:text-blue-300 text-sm sm:text-base font-semibold">Advertisement Space 970x90</p>
                    <p className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm mt-1">Your Banner Ad Here</p>
                  </div>
                </div>
              </div>

              <div className="w-full" style={{ display: 'flex', justifyContent: 'center' }}>
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
                <label className={`flex flex-col items-center justify-center w-full h-[400px] sm:h-[500px] border-3 border-dashed ${borderColor} rounded-2xl cursor-pointer ${bgCard} ${hoverBg} hover:border-blue-500 transition-all backdrop-blur-sm`}>
                  <div className="flex flex-col items-center justify-center px-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
                      <Upload size={32} className="sm:w-10 sm:h-10 text-white" />
                    </div>
                    <p className={`mb-2 text-xl sm:text-2xl font-bold ${textPrimary} text-center`}>Upload an Image</p>
                    <p className={`text-sm ${textTertiary} text-center`}>Click or drag and drop</p>
                    <p className={`text-xs ${textTertiary} mt-2 text-center`}>PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
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
                      onClick={() => {
                        setUploadedImage(null);
                        setImageColors([]);
                      }}
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
                          <div
                            key={index}
                            onClick={() => setHexValue(color)}
                            className="group relative cursor-pointer"
                          >
                            <div
                              className={`h-20 sm:h-24 rounded-xl shadow-lg hover:scale-110 hover:shadow-2xl transition-all border-2 ${borderColor}`}
                              style={{
                                backgroundColor: color,
                                boxShadow: `0 4px 12px ${color}40`
                              }}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 pb-12 space-y-10">
        <div className={`${bgCard} backdrop-blur-sm rounded-xl p-5 border ${borderColor}`}>
          <h2 className={`text-sm font-semibold mb-3 ${textSecondary} uppercase tracking-wide`}>
            Color Variations
          </h2>
          <p className={`text-xs ${textTertiary} mb-4`}>
            Shades are generated by adding pure black in 10% increments. Tints are
            generated by adding pure white in 10% increments.
          </p>

          <div className="mb-6">
            <h3 className={`text-xs font-semibold mb-2 ${textSecondary}`}>Shades</h3>
            <div className="flex items-center gap-1 mb-2">
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((percent) => (
                <div
                  key={percent}
                  className={`flex-1 text-xs ${textTertiary} text-center`}
                >
                  {percent}%
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 mb-2">
              {shades.map((color, index) => (
                <div
                  key={index}
                  onClick={() => navigator.clipboard.writeText(color)}
                  className={`flex-1 h-12 rounded-lg cursor-pointer hover:scale-105 transition-transform border ${borderColor} flex items-center justify-center`}
                  style={{ backgroundColor: color }}
                  title={`Click to copy ${color}`}
                >
                  <Copy
                    size={16}
                    className="text-white opacity-0 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {shades.map((color, index) => (
                <div
                  key={index}
                  className={`flex-1 text-xs ${textTertiary} text-center font-mono`}
                >
                  {color}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`text-xs font-semibold mb-2 ${textSecondary}`}>Tints</h3>
            <div className="flex items-center gap-1 mb-2">
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((percent) => (
                <div
                  key={percent}
                  className={`flex-1 text-xs ${textTertiary} text-center`}
                >
                  {percent}%
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 mb-2">
              {tints.map((color, index) => (
                <div
                  key={index}
                  onClick={() => navigator.clipboard.writeText(color)}
                  className={`flex-1 h-12 rounded-lg cursor-pointer hover:scale-105 transition-transform border ${borderColor} flex items-center justify-center`}
                  style={{ backgroundColor: color }}
                  title={`Click to copy ${color}`}
                >
                  <Copy
                    size={16}
                    className="text-white opacity-0 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {tints.map((color, index) => (
                <div
                  key={index}
                  className={`flex-1 text-xs ${textTertiary} text-center font-mono`}
                >
                  {color}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`${bgCard} backdrop-blur-sm rounded-xl p-5 border ${borderColor}`}>
          <h2 className={`text-sm font-semibold mb-3 ${textSecondary} uppercase tracking-wide`}>
            Color Harmonies
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {["Complementary", "Triadic", "Tetradic", "Analogous", "Mono Chromatic"].map(
              (harmony) => (
                <button
                  key={harmony}
                  onClick={() => setActiveHarmony(harmony)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeHarmony === harmony
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : `${buttonBg} ${textTertiary} hover:text-white ${hoverBg}`
                    }`}
                >
                  {harmony}
                </button>
              )
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentHarmonyColors.map((color, index) => (
              <div
                key={index}
                onClick={() => {
                  navigator.clipboard.writeText(color);
                  copyToClipboard(color, 'color');
                }}
                className="group relative cursor-pointer"
              >
                <div
                  className={`h-24 rounded-xl shadow-lg hover:scale-110 hover:shadow-2xl transition-all border-2 ${borderColor}`}
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 4px 12px ${color}40`,
                  }}
                />
                <p className={`text-xs text-center mt-2 font-mono ${textTertiary} group-hover:text-white transition font-semibold`}>
                  {color}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className={`${bgCard} backdrop-blur-sm rounded-xl p-5 border ${borderColor}`}>
          <h2 className={`text-sm font-semibold mb-3 ${textSecondary} uppercase tracking-wide`}>
            Color Contrast Checker
          </h2>
          <p className={`text-xs ${textTertiary} mb-4`}>
            Evaluate the contrast between "Text Color" and "Background Color".
            Adjust values for optimal readability.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${textSecondary}`}>
                Text Color
              </label>
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
                <button
                  onClick={() => setTextColor(hexValue)}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition text-xs font-semibold whitespace-nowrap"
                  title="Use selected color"
                >
                  Use Selected
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${textSecondary}`}>
                Background Color
              </label>
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
                <button
                  onClick={() => setBgColor(hexValue)}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition text-xs font-semibold whitespace-nowrap"
                  title="Use selected color"
                >
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
                <div className={`text-xs font-semibold ${textPrimary} mb-1`}>
                  Small Text
                </div>
                <div className={`text-xs ${textPrimary}`}>
                  Result: {contrastResult.small}
                </div>
              </div>

              <div className={`${buttonBg} p-3 rounded`}>
                <div className={`text-xs font-semibold ${textPrimary} mb-1`}>
                  Large Text
                </div>
                <div className={`text-xs ${textPrimary}`}>
                  Result: {contrastResult.large}
                </div>
              </div>
            </div>
          </div>

          <div className={`text-xs ${textTertiary} mb-3`}>
            {contrastRatio < 3 &&
              "Very Bad contrast for small text (below 18pt) and Very Bad contrast for large text (above 18pt or bold above 14pt)"}
            {contrastRatio >= 3 &&
              contrastRatio < 4.5 &&
              "Fair contrast. May need improvement for accessibility."}
            {contrastRatio >= 4.5 &&
              "Good contrast! Meets WCAG AA standards for normal text."}
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

      <div className={`${textPrimary} py-16 px-6`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center">
          {features.map((item, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${bgCard}`}
            >
              <div className="flex flex-col items-center">
                <div className={isDarkMode ? 'text-white' : 'text-blue-600'}>
                  {item.icon}
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${textPrimary}`}>{item.title}</h3>
                <p className={`${textTertiary} text-sm leading-relaxed`}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`mt-8 sm:mt-5 ${isDarkMode ? 'bg-white' : 'bg-gray-50'} rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 transition-opacity duration-700 opacity-100 max-w-3xl sm:max-w-2xl mx-auto`}>
        <h2 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-gray-800' : 'text-gray-900'} mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 justify-center`}>
          <span className="text-2xl sm:text-3xl">❓</span>
          How to pick a color from an image?
        </h2>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl hover:shadow-md transition">
            <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">1</span>
            <p className="text-gray-700 text-sm sm:text-base">
              Upload your image or open the color wheel.
            </p>
          </div>

          <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg sm:rounded-xl hover:shadow-md transition">
            <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">2</span>
            <p className="text-gray-700 text-sm sm:text-base">
              Mouse hover and click to select the exact pixel.
            </p>
          </div>

          <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl hover:shadow-md transition">
            <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">3</span>
            <p className="text-gray-700 text-sm sm:text-base">
              Copy the color code in HEX/HTML, RGB…etc.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto py-10 px-4">
        <h2 className={`text-sm font-semibold ${textSecondary} uppercase tracking-wide mb-2`}>
          Color Harmony
        </h2>
        <p className={`text-xs ${textTertiary}`}>
          Color Harmony refers to matching and harmonious colors that are aesthetically pleasing when combined together. They are derived by geometric relationships within the color wheel. Our color picker can automatically generate these based on the color you pick.
        </p>
      </div>

      <div className="max-w-6xl mx-auto mt-40 flex flex-col md:flex-row items-center gap-10 px-6">
        <div className="flex-1 flex justify-center">
          <img
            src="/assets/image1.webp"
            alt="Interactive Cropping Interface"
            className="rounded-xl shadow-lg w-full max-w-md"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className={`text-3xl font-bold ${textPrimary} mb-4`}>
            Complementary Colors
          </h2>
          <p className={`${textTertiary} leading-relaxed`}>
            Complementary color is the color that is positioned directly opposite of a given color in the color wheel. This combination of colors has high contrast and visual tension.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-40 flex flex-col md:flex-row items-center gap-10 px-6 pb-20">
        <div className="flex-1 text-center md:text-left order-2 md:order-1">
          <h2 className={`text-3xl font-bold ${textPrimary} mb-4`}>
            Triadic Colors
          </h2>
          <p className={`${textTertiary} leading-relaxed`}>
            Three colors spaced evenly around the color wheel are known as triadic colors. These combinations give you high contrast while still being easy on the eye.
          </p>
        </div>
        <div className="flex-1 flex justify-center order-1 md:order-2">
          <img
            src="/assets/image2.webp"
            alt="Custom Ratios"
            className="rounded-xl shadow-lg w-full max-w-md"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-40 flex flex-col md:flex-row items-center gap-10 px-6">
        <div className="flex-1 flex justify-center">
          <img
            src="/assets/image3.webp"
            alt="Interactive Cropping Interface"
            className="rounded-xl shadow-lg w-full max-w-md"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className={`text-3xl font-bold ${textPrimary} mb-4`}>
            Tetradic Colors
          </h2>
          <p className={`${textTertiary} leading-relaxed`}>
            This color combination consists of two sets of complementary colors 60 degrees apart in the color wheel. Aggressive and vibrant, best for flashier subjects.
          </p>
        </div>
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
                    ColorPicker Pro
                  </h3>
                  <p className={`text-xs ${textTertiary}`}>Professional Tool</p>
                </div>
              </div>
              <p className={`text-sm ${textTertiary} text-center md:text-left`}>
                Your ultimate color picking and design tool for professional workflows.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h4 className={`text-sm font-semibold ${textSecondary} mb-4 uppercase tracking-wide`}>
                Features
              </h4>
              <ul className={`space-y-2 text-sm ${textTertiary}`}>
                <li className="hover:text-blue-400 transition cursor-pointer">Color Picker</li>
                <li className="hover:text-blue-400 transition cursor-pointer">Image Extractor</li>
                <li className="hover:text-blue-400 transition cursor-pointer">Color Harmonies</li>
                <li className="hover:text-blue-400 transition cursor-pointer">Contrast Checker</li>
              </ul>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h4 className={`text-sm font-semibold ${textSecondary} mb-4 uppercase tracking-wide`}>
                Resources
              </h4>
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
              <p className={`text-sm ${textTertiary}`}>
                © {new Date().getFullYear()} ColorPicker Pro. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className={`${textTertiary} hover:text-blue-400 transition`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className={`${textTertiary} hover:text-blue-400 transition`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className={`${textTertiary} hover:text-blue-400 transition`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

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