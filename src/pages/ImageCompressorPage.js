import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image, Video, Download, X, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
export default function MediaCompressor({ isDarkMode = false }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [quality, setQuality] = useState(80);
  const [compressedBlob, setCompressedBlob] = useState(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  // Theme-aware classes
  const bgPrimary = isDarkMode ? 'bg-[#111727]' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100';
  const bgCard = isDarkMode ? 'bg-[#1a2332]' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const textTertiary = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const adBg = isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-100 border-blue-200';
  const adText = isDarkMode ? 'text-blue-300' : 'text-blue-800';
  const adSubText = isDarkMode ? 'text-blue-400' : 'text-blue-600';

  // File select handler (for both input and drag & drop)
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const isImage = selectedFile.type.startsWith('image/');
    const isVideo = selectedFile.type.startsWith('video/');

    if (!isImage && !isVideo) {
      alert('Please upload only image or video files!');
      return;
    }

    setFile(selectedFile);
    setFileType(isImage ? 'image' : 'video');
    setOriginalSize(selectedFile.size);
    setCompressedUrl(null);
    setCompressedSize(0);
    setCompressedBlob(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    const isImage = droppedFile.type.startsWith('image/');
    const isVideo = droppedFile.type.startsWith('video/');

    if (!isImage && !isVideo) {
      alert('Please upload only image or video files!');
      return;
    }

    setFile(droppedFile);
    setFileType(isImage ? 'image' : 'video');
    setOriginalSize(droppedFile.size);
    setCompressedUrl(null);
    setCompressedSize(0);
    setCompressedBlob(null);
  };

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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const compressImage = async () => {
    setIsCompressing(true);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          
          // Detect original format
          const isPNG = file.type === 'image/png';
          const isJPEG = file.type === 'image/jpeg' || file.type === 'image/jpg';
          const isWEBP = file.type === 'image/webp';
          
          const ctx = canvas.getContext('2d', { alpha: isPNG });

          // Keep original dimensions for better quality
          let { width, height } = img;
          
          // Only resize if image is extremely large (over 4K)
          const maxDimension = 3840;
          if (width > maxDimension || height > maxDimension) {
            const scale = Math.min(maxDimension / width, maxDimension / height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }

          canvas.width = width;
          canvas.height = height;

          // Handle transparency/background based on format
          if (isPNG) {
            ctx.clearRect(0, 0, width, height);
          } else if (isJPEG) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          // Enable high-quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw image
          ctx.drawImage(img, 0, 0, width, height);

          // Maintain original format
          let outputMimeType = file.type;
          if (isPNG) {
            outputMimeType = 'image/png';
          } else if (isJPEG) {
            outputMimeType = 'image/jpeg';
          } else if (isWEBP) {
            outputMimeType = 'image/webp';
          } else {
            // Default to JPEG for unknown formats
            outputMimeType = 'image/jpeg';
          }

          // For PNG: Use aggressive compression strategies
           if (isPNG) {
            // Try multiple compression attempts with different strategies
            const attemptPNGCompression = async () => {
              let pngWidth = width;
              let pngHeight = height;
              
              // PNG ke liye scale factors try karo
              const scalingAttempts = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3];
              
              for (let scale of scalingAttempts) {
                pngWidth = Math.round(width * scale);
                pngHeight = Math.round(height * scale);
                
                // Create new canvas with scaled dimensions
                const pngCanvas = document.createElement('canvas');
                pngCanvas.width = pngWidth;
                pngCanvas.height = pngHeight;
                const pngCtx = pngCanvas.getContext('2d', { alpha: true });
                
                pngCtx.clearRect(0, 0, pngWidth, pngHeight);
                pngCtx.imageSmoothingEnabled = true;
                pngCtx.imageSmoothingQuality = 'high';
                pngCtx.drawImage(img, 0, 0, pngWidth, pngHeight);
                
                // Convert to blob
                const blob = await new Promise(resolve => {
                  pngCanvas.toBlob(resolve, 'image/png');
                });
                
                // Agar compressed size original se chhoti ho gai to use karo
                if (blob && blob.size < originalSize) {
                  setCompressedSize(blob.size);
                  setCompressedBlob(blob);
                  setCompressedUrl(URL.createObjectURL(blob));
                  setIsCompressing(false);
                  resolve();
                  return;
                }
              }
              
              // Agar koi bhi scaling se compress nahi hua to original file use karo
              setCompressedSize(originalSize);
              setCompressedBlob(file);
              setCompressedUrl(URL.createObjectURL(file));
              setIsCompressing(false);
              resolve();
            };
            
            attemptPNGCompression();
          } else {
            // For JPEG/WebP: Use standard compression
            let outputQuality = Math.max(0.7, quality / 100);
            
            const tryCompress = (currentQuality) => {
              canvas.toBlob(
                (blob) => {
                  if (!blob) {
                    setCompressedSize(originalSize);
                    setCompressedBlob(file);
                    setCompressedUrl(URL.createObjectURL(file));
                    setIsCompressing(false);
                    resolve();
                    return;
                  }

                  // If compressed size is larger, try with lower quality
                  if (blob.size >= originalSize && currentQuality > 0.3) {
                    tryCompress(currentQuality - 0.1);
                    return;
                  }

                  // Check if compression was successful
                  if (blob.size >= originalSize) {
                    setCompressedSize(originalSize);
                    setCompressedBlob(file);
                    setCompressedUrl(URL.createObjectURL(file));
                  } else {
                    setCompressedSize(blob.size);
                    setCompressedBlob(blob);
                    setCompressedUrl(URL.createObjectURL(blob));
                  }
                  
                  setIsCompressing(false);
                  resolve();
                },
                outputMimeType,
                currentQuality
              );
            };
            
            tryCompress(outputQuality);
          }
        };
        
        img.onerror = () => {
          setIsCompressing(false);
          alert('Image load karne mein error ayi!');
          resolve();
        };
        img.src = e.target.result;
      };
      
      reader.onerror = () => {
        setIsCompressing(false);
        alert('File read karne mein error ayi!');
        resolve();
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCompress = () => {
    if (fileType === 'image') compressImage();
    // else compressVideo();
  };

  const handleDownload = () => {
    if (!compressedBlob) return;

    const a = document.createElement('a');
    const url = URL.createObjectURL(compressedBlob);
    a.href = url;

    // Get file extension from original file or blob type
    let extension = file.name.split('.').pop().toLowerCase();
    
    // If compressed blob is same as original, keep original name
    if (compressedSize >= originalSize) {
      a.download = file.name;
    } else {
      // Use appropriate extension based on blob type
      if (compressedBlob.type === 'image/png') {
        extension = 'png';
      } else if (compressedBlob.type === 'image/jpeg') {
        extension = 'jpg';
      } else if (compressedBlob.type === 'image/webp') {
        extension = 'webp';
      }
      
      const nameWithoutExt = file.name.split('.').slice(0, -1).join('.');
      a.download = `compressed_${nameWithoutExt}.${extension}`;
    }

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setFile(null);
    setFileType(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setCompressedUrl(null);
    setCompressedBlob(null);
    setIsCompressing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const compressionPercentage = originalSize > 0 && compressedSize > 0
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [compressedUrl]);

  const features = [
    {
      title: 'Perfect Quality',
      description: 'We intelligently apply compression to retain image quality while drastically reducing image size.'
    },
    {
      title: 'Best Compression',
      description: 'Compress your images by up to 80% or more by applying lossy compression and other optimizations.'
    },
    {
      title: 'Easy To Use',
      description: 'Simply upload your images and watch our tool do its magic. Even large images are compressed within seconds'
    },
    {
      title: 'Image Formats',
      description: 'Our image compressor can compress JPEG and PNG images. You can compress up to 50 images at a time.'
    },
    {
      title: 'Privacy Guaranteed',
      description: 'We care about file privacy. Images are uploaded via a secure 256-bit encrypted SSL connection and deleted automatically within 6 hours.'
    },
    {
      title: "It's Free",
      description: 'Since 2012 we have compressed millions of images for free! There is no software to install, registrations, or watermarks.'
    },
  ];

  return (
    <div className={`min-h-screen overflow-x-hidden ${bgPrimary} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center">Image & Video Compressor</h1>
          <p className={`text-lg ${textTertiary}`}>Professional compression with advanced features</p>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          {!file ? (
            <div className="max-w-7xl mx-auto">
              {/* Ad Banner */}
              <div className="text-center mt-5">
                <div className={`rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center min-h-[90px] mx-auto w-full max-w-[728px] shadow-md border ${adBg}`}>
                  <p className={`text-sm sm:text-base font-semibold ${adText}`}>Advertisement Space 728x90</p>
                  <p className={`text-xs sm:text-sm mt-1 ${adSubText}`}>Your Banner Ad Here</p>
                </div>
              </div>

              {/* Upload Area */}
              <div className="max-w-4xl mx-auto mt-10">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1 rounded-lg mb-6">
                  <div className={`${bgCard} rounded-lg p-12 text-center`}>
                    <div
                      onClick={() => fileInputRef.current.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-4 border-dashed rounded-lg p-16 transition-all duration-300 cursor-pointer ${
                        isDragging
                          ? isDarkMode
                            ? 'border-blue-400 bg-blue-900/20'
                            : 'border-blue-500 bg-blue-50'
                          : isDarkMode
                          ? 'border-white/20'
                            : 'border-white/30'
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*,video/*"
                        className="hidden"
                      />
                      <Upload className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                      <h3 className={`text-2xl font-semibold ${textPrimary} mb-2`}>
                        Upload or Drop Image
                      </h3>
                      <p className={`mt-6 ${isDarkMode ? 'text-white/80' : 'text-gray-800'} text-lg`}>
                        Drag & drop an image here, or click to browse
                      </p>
                      <p className={`mt-3 ${textTertiary} text-sm`}>
                        Max file size: 10 MB. <span className="underline cursor-pointer">Sign up</span> for more.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-16 max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((item, index) => (
                      <div
                        key={index}
                        className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border ${borderColor} ${bgCard}`}
                      >
                        <div className="flex flex-col items-center">
                          <h3 className={`text-lg font-semibold mb-2 ${textPrimary}`}>{item.title}</h3>
                          <p className={`text-sm leading-relaxed ${textTertiary}`}>{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`mt-8 sm:mt-12 ${bgCard} rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 transition-opacity duration-700 opacity-100`}>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <span className="text-2xl sm:text-3xl">❓</span> How to Compress Images?
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl hover-lift">
                      <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">1</span>
                      <div>
                        <p className="text-gray-700 text-sm sm:text-base">Click the <span className="font-bold text-indigo-600">"Upload or Drop Image"</span> button and select your image from your device.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg sm:rounded-xl hover-lift">
                      <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">2</span>
                      <div>
                        <p className="text-gray-700 text-sm sm:text-base">Adjust the <span className="font-bold text-purple-600">"Compression Quality"</span> slider to your desired level.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl hover-lift">
                      <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">3</span>
                      <div>
                        <p className="text-gray-700 text-sm sm:text-base">Click on the <span className="font-bold text-green-600">"Compress Now"</span> button and download your compressed image.</p>
                      </div>
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
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-semibold ${textPrimary} flex items-center gap-2`}>
                    {fileType === 'image' ? (
                      <>
                        <Image className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                        Image Preview
                      </>
                    ) : (
                      <>
                        <Video className={`w-6 h-6 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`} />
                        Video Preview
                      </>
                    )}
                  </h3>
                  <button
                    onClick={handleReset}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className={`${isDarkMode ? 'bg-[#1f2937]' : 'bg-gray-100'} rounded-xl p-4 mb-4 flex items-center justify-center min-h-[300px]`}>
                  {fileType === 'image' ? (
                    <img
                      src={compressedUrl || URL.createObjectURL(file)}
                      alt="Preview"
                      className="max-w-full max-h-[400px] rounded-lg shadow-lg object-contain"
                    />
                  ) : (
                    <video
                      src={compressedUrl || URL.createObjectURL(file)}
                      controls
                      className="max-w-full max-h-[400px] rounded-lg shadow-lg"
                    />
                  )}
                </div>

                <div className={`${isDarkMode ? 'bg-[#1f2937]' : 'bg-gray-100'} rounded-xl p-4 mb-4`}>
                  <p className={`text-sm ${textTertiary} mb-1`}>File Name:</p>
                  <p className={`font-medium ${textPrimary} truncate`}>{file.name}</p>
                </div>

                {!compressedUrl && (
                  <div className="mb-6">
                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                      Compression Quality: {quality}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(parseInt(e.target.value))}
                      className={`w-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg appearance-none cursor-pointer accent-purple-600`}
                    />
                    <div className={`flex justify-between text-xs ${textTertiary} mt-1`}>
                      <span>More Compression</span>
                      <span>Better Quality</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'} rounded-xl p-4`}>
                  <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-600'} mb-1`}>Original Size</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    {formatFileSize(originalSize)}
                  </p>
                </div>

                <div className={`${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'} rounded-xl p-4`}>
                  <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-600'} mb-1`}>Compressed Size</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                    {compressedSize > 0 ? formatFileSize(compressedSize) : '--'}
                  </p>
                </div>
              </div>

              {compressedSize > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-400 to-green-600 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">Size Reduction</span>
                    <span className="text-3xl font-bold">{compressionPercentage}%</span>
                  </div>
                  <div className="mt-2 bg-white/30 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${compressionPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                {!compressedUrl ? (
                  <button
                    onClick={handleCompress}
                    disabled={isCompressing}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isCompressing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Compressing...
                      </>
                    ) : (
                      'Compress Now'
                    )}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleDownload}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </button>
                    <button
                      onClick={handleReset}
                      className={`px-6 py-4 rounded-xl font-semibold text-lg ${
                        isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } transition-all duration-300`}
                    >
                      New File
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer currentPage={location.pathname} isDarkMode={isDarkMode} />
    </div>
  );
}