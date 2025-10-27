import React, { useState, useRef, useEffect } from 'react';
import { Shield, Scissors, Ruler, Image as ImageIcon, Globe, Heart } from "lucide-react";

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
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
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

    canvas.width = cropSettings.width;
    canvas.height = cropSettings.height;

    const img = new Image(); // ✅ Now correctly uses window.Image
    img.crossOrigin = 'anonymous';
    img.onload = () => {
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

  const features = [
    {
      icon: <Scissors className="w-10 h-10 text-white mb-4" />,
      title: "Quick and Easy to Use",
      description: "Crop images easily by drawing a crop rectangle on them. No need to upload. We crop photos right on your browser.",
    },
    {
      icon: <Ruler className="w-10 h-10 text-white mb-4" />,
      title: "Crop Image to Any Size",
      description: "Crop your image to an exact pixel size to share them without leaving out parts or distorting them.",
    },
    {
      icon: <ImageIcon className="w-10 h-10 text-white mb-4" />,
      title: "Crop to Any Aspect Ratio",
      description: "Choose from many different crop aspect ratios to get the best composition for your photo.",
    },
    {
      icon: <Shield className="w-10 h-10 text-white mb-4" />,
      title: "Privacy Protected",
      description: "We crop image files right on the browser. Since your images never get uploaded to our servers, no one can access them.",
    },
    {
      icon: <Globe className="w-10 h-10 text-white mb-4" />,
      title: "Online Tool",
      description: "This image cropper works on Windows, Mac, Linux, or any device with a web browser.",
    },
    {
      icon: <Heart className="w-10 h-10 text-white mb-4" />,
      title: "100% Free",
      description: "This photo cropper is entirely free to use. No registrations, limits, or watermarks.",
    },
  ];

  if (!selectedImage) {
    return (
      <div className="min-h-screen bg-[#1a1a1a]">
        <header className="bg-[#1a1a1a] border-b border-gray-800 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded"></div>
              <span className="text-white text-xl font-semibold">ImageResizer</span>
            </div>
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
                    <span>📁</span>
                    Select Image
                    <span className="ml-2">▼</span>
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
            <p className="text-blue-600 text-xs mt-2 rotate-90 whitespace-nowrap">
              Left Skyscraper Banner
            </p>
          </div>
        </div>

        <div className="hidden lg:block absolute right-4 top-[390px]">
          <div className="bg-blue-100 rounded-lg p-4 flex flex-col items-center justify-center w-[120px] h-[500px] shadow-md">
            <p className="text-blue-600 text-xs mt-2 rotate-90 whitespace-nowrap">
              Right Skyscraper Banner
            </p>
          </div>
        </div>

        <div className="text-white py-16 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center">
            {features.map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col items-center">
                  {item.icon}
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 sm:mt-12 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 transition-opacity duration-700 opacity-100 max-w-3xl sm:max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 justify-center">
            <span className="text-2xl sm:text-3xl">❓</span>
            How To Crop an Image?
          </h2>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl hover:shadow-md transition">
              <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">1</span>
              <p className="text-gray-700 text-sm sm:text-base">
                Click the <span className="font-bold text-indigo-600">"Select Image"</span> button to load your image.
              </p>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg sm:rounded-xl hover:shadow-md transition">
              <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">2</span>
              <p className="text-gray-700 text-sm sm:text-base">
                Draw a crop rectangle on the image.
              </p>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl hover:shadow-md transition">
              <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">3</span>
              <p className="text-gray-700 text-sm sm:text-base">
                Click the <span className="font-bold text-green-600">"Crop Image"</span> button to crop your image.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-20 px-6 pb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Crop Images Free with Our Online Photo Cropper
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#2a2a2a] border border-gray-700 rounded-xl p-8 hover:border-gray-600 transition-colors">
              <div className="flex flex-col items-center text-center">
                <Globe className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Customizable Cropping for Any Need</h3>
                <p className="text-gray-400 leading-relaxed">
                  Choose from predefined aspect ratios or customize your own to fit your needs. Our tool makes it simple to get the right size for Instagram stories, Facebook banners, or any unique dimensions you require.
                </p>
              </div>
            </div>

            <div className="bg-[#2a2a2a] border border-gray-700 rounded-xl p-8 hover:border-gray-600 transition-colors">
              <div className="flex flex-col items-center text-center">
                <Shield className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Secure and Reliable Cropping</h3>
                <p className="text-gray-400 leading-relaxed">
                  Our commitment extends beyond providing tools; we ensure that every cropped image maintains the highest quality. Enjoy peace of mind knowing that our cropping tool handles your photos securely, preserving their resolution and detail while ensuring your data remains confidential.
                </p>
              </div>
            </div>

            <div className="bg-[#2a2a2a] border border-gray-700 rounded-xl p-8 hover:border-gray-600 transition-colors">
              <div className="flex flex-col items-center text-center">
                <Ruler className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Precise Cropping for Perfect Results</h3>
                <p className="text-gray-400 leading-relaxed">
                  Adjust your photos with precision using our free online photo tool. Tailor every picture to fit exactly where you need it to, for profile pictures, custom content, or precise project specifications. Our tool allows you to define the dimensions, ensuring each crop is pixel-perfect effortlessly.
                </p>
              </div>
            </div>

            <div className="bg-[#2a2a2a] border border-gray-700 rounded-xl p-8 hover:border-gray-600 transition-colors">
              <div className="flex flex-col items-center text-center">
                <ImageIcon className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Versatile Format Support</h3>
                <p className="text-gray-400 leading-relaxed">
                  Our image cropper handles various file types, ensuring you can work with nearly any image you have. Whether it's a JPG, PNG, JPEG, or WEBP, our tool provides seamless support so you can crop and adjust your photos without worrying about compatibility.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-40 flex flex-col md:flex-row items-center gap-10 px-6">
          <div className="flex-1 flex justify-center">
            <img
              src="/assets/Crop-Image-Feature.png"
              alt="Interactive Cropping Interface"
              className="rounded-xl shadow-lg w-full max-w-md"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-4">
              Interactive Cropping Interface
            </h2>
            <p className="text-gray-400 leading-relaxed">
              With our cropping tool, you can see your photo changes instantly and there's no need to download and check each edit. If entering dimensions isn't your style, simply drag and drop the interactive crop box, or resize it directly by adjusting the width or height handles.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-40 flex flex-col md:flex-row items-center gap-10 px-6 pb-20">
          <div className="flex-1 text-center md:text-left order-2 md:order-1">
            <h2 className="text-3xl font-bold text-white mb-4">
              Perfect Your Images with Custom Ratios for Social Media and Print
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Choose from a wide selection of predefined ratios specifically tailored for social media and print. Whether you're optimizing images for an Instagram story, designing a Twitter header, or preparing a print layout for an A4 flyer, our tool ensures your photos fit perfectly across all platforms and mediums.
            </p>
          </div>
          <div className="flex-1 flex justify-center order-1 md:order-2">
            <img
              src="/assets/Crop-Image-Feature-2.png"
              alt="Custom Ratios"
              className="rounded-xl shadow-lg w-full max-w-md"
            />
          </div>
        </div>

        <footer className="glass-effect mt-16 py-8 border-t-2 border-gray-200">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <span className="font-bold text-white">Image Converter Pro</span>
            </div>
            <p className="text-white">© {new Date().getFullYear()} All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

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
                setCropSettings({ width: 200, height: 200, positionX: 50, positionY: 50 });
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
                    setCropSettings({
                      ...cropSettings,
                      positionX: Math.max(0, Math.min(val, imageDimensions.width - cropSettings.width))
                    });
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
                    setCropSettings({
                      ...cropSettings,
                      positionY: Math.max(0, Math.min(val, imageDimensions.height - cropSettings.height))
                    });
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

        <div className="flex-1 bg-[#1a1a1a] p-8 overflow-auto flex flex-col items-center justify-center">
          <div className="text-center mt-5 mb-5">
            <div className="bg-blue-100 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center min-h-[80px] mx-auto w-[300px] sm:w-[400px] md:w-[700px] shadow-md">
              <p className="text-blue-800 text-sm sm:text-base font-semibold">Ad Space 728x90</p>
              <p className="text-blue-600 text-xs sm:text-sm mt-1">Leaderboard Banner Ad Here</p>
            </div>
          </div>

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
                <div
                  className="absolute w-2 h-2 bg-blue-500 border border-white cursor-nw-resize"
                  style={{ left: '-6px', top: '-6px' }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, 'nw');
                  }}
                />
                <div
                  className="absolute w-2 h-2 bg-blue-500 border border-white cursor-ne-resize"
                  style={{ right: '-6px', top: '-6px' }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, 'ne');
                  }}
                />
                <div
                  className="absolute w-2 h-2 bg-blue-500 border border-white cursor-sw-resize"
                  style={{ left: '-6px', bottom: '-6px' }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, 'sw');
                  }}
                />
                <div
                  className="absolute w-2 h-2 bg-blue-500 border border-white cursor-se-resize"
                  style={{ right: '-6px', bottom: '-6px' }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, 'se');
                  }}
                />
                <div
                  className="absolute w-2 h-2 bg-blue-500 border border-white cursor-n-resize"
                  style={{ left: '50%', top: '-6px', transform: 'translateX(-50%)' }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, 'n');
                  }}
                />
                <div
                  className="absolute w-2 h-2 bg-blue-500 border border-white cursor-s-resize"
                  style={{ left: '50%', bottom: '-6px', transform: 'translateX(-50%)' }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, 's');
                  }}
                />
                <div
                  className="absolute w-2 h-2 bg-blue-500 border border-white cursor-w-resize"
                  style={{ left: '-6px', top: '50%', transform: 'translateY(-50%)' }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, 'w');
                  }}
                />
                <div
                  className="absolute w-2 h-2 bg-blue-500 border border-white cursor-e-resize"
                  style={{ right: '-6px', top: '50%', transform: 'translateY(-50%)' }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, 'e');
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}