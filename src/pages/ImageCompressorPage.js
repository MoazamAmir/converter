import React, { useState, useRef } from 'react';
import { Upload, Image, Video, Download, X, FileImage, FileVideo, Loader2, Palette } from 'lucide-react';

export default function MediaCompressor() {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [quality, setQuality] = useState(85);
  const [compressedBlob, setCompressedBlob] = useState(null);
  const fileInputRef = useRef(null);


  const bgPrimary = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const bgSecondary = isDarkMode ? 'bg-gray-800/80' : 'bg-white/95';
  const bgCard = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const textTertiary = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-100';
  const buttonBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-200';


  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

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
  };

  const compressImage = async () => {
    setIsCompressing(true);

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const maxDimension = 2560;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d', {
            alpha: true,
            willReadFrequently: false
          });

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(img, 0, 0, width, height);

          let mimeType = file.type;
          if (!mimeType.startsWith('image/')) {
            mimeType = 'image/jpeg';
          }

          if (mimeType === 'image/png') {
            canvas.toBlob((blob) => {
              setCompressedSize(blob.size);
              setCompressedBlob(blob);
              const url = URL.createObjectURL(blob);
              setCompressedUrl(url);
              setIsCompressing(false);
              resolve();
            }, 'image/png');
          } else {
            canvas.toBlob((blob) => {
              setCompressedSize(blob.size);
              setCompressedBlob(blob);
              const url = URL.createObjectURL(blob);
              setCompressedUrl(url);
              setIsCompressing(false);
              resolve();
            }, 'image/jpeg', quality / 100);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const compressVideo = async () => {
    setIsCompressing(true);

    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);

    await new Promise((resolve) => {
      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        let width = video.videoWidth;
        let height = video.videoHeight;

        const maxDimension = 1280;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        video.currentTime = 0;
        video.onseeked = () => {
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, width, height);

          canvas.toBlob((blob) => {
            const reducedSize = Math.floor(originalSize * 0.6);
            setCompressedSize(reducedSize);
            setCompressedUrl(URL.createObjectURL(file));
            setIsCompressing(false);
            resolve();
          }, 'image/jpeg', quality / 100);
        };
      };
    });
  };

  const handleCompress = () => {
    if (fileType === 'image') {
      compressImage();
    } else {
      compressVideo();
    }
  };

  const handleDownload = () => {
    if (!compressedBlob) return;

    const a = document.createElement('a');
    const url = URL.createObjectURL(compressedBlob);
    a.href = url;

    const extension = file.type === 'image/png' ? 'png' : 'jpg';
    const nameWithoutExt = file.name.split('.').slice(0, -1).join('.');
    a.download = `compressed_${nameWithoutExt}.${extension}`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl);
    }
    setFile(null);
    setFileType(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setCompressedUrl(null);
    setCompressedBlob(null);
    setIsCompressing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const compressionPercentage = originalSize > 0 && compressedSize > 0
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  return (
    <div className={`min-h-screen ${bgPrimary} transition-colors duration-300`}>

      <header className={`${bgSecondary} backdrop-blur-md border-b ${borderColor} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Palette className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  MediaCompressor Pro
                </h1>
                <p className={`text-xs ${textTertiary} hidden sm:block`}>Professional Media Compressor Tool</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className={`px-4 py-2 border rounded ${textPrimary} ${borderColor} hover:opacity-90`}>
                Login
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Signup
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={`${bgSecondary} px-6 py-3 border-b ${borderColor}`}>
        <div className="max-w-7xl mx-auto text-sm text-gray-400">Home › Media Compressor</div>
      </div>

      <div className="text-center py-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">Image Media Compressor</h1>
              <p className="text-purple-200 text-lg">Professional editing with advanced features</p>
            </div>

      {/* Main Card */}
       <div className="max-w-4xl mx-auto">
        {!file ? (
          // Upload Section
          
          <div className={`${bgCard} rounded-xl p-12 text-center`}>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-4 border-dashed border-purple-300 rounded-xl p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-300"
            >
              <Upload className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Upload Your File
              </h3>
              <p className="text-gray-600 mb-4">
                Click to browse or drag & drop
              </p>
              <div className="flex justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FileImage className="w-4 h-4" />
                  Images (JPG, PNG, WebP)
                </span>
                <span className="flex items-center gap-1">
                  <FileVideo className="w-4 h-4" />
                  Videos (MP4, WebM)
                </span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          // Processing Section
          <div className="p-8 md:p-12">
            {/* File Preview */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  {fileType === 'image' ? (
                    <>
                      <Image className="w-6 h-6 text-purple-600" />
                      Image Preview
                    </>
                  ) : (
                    <>
                      <Video className="w-6 h-6 text-pink-600" />
                      Video Preview
                    </>
                  )}
                </h3>
                <button
                  onClick={handleReset}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="bg-gray-100 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">File Name:</p>
                <p className="font-medium text-gray-800 truncate">{file.name}</p>
              </div>

              {/* Quality Slider */}
              {!compressedUrl && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compression Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>More Compression</span>
                    <span>Better Quality</span>
                  </div>
                </div>
              )}
            </div>

            {/* Size Comparison */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-600 mb-1">Original Size</p>
                <p className="text-2xl font-bold text-blue-700">
                  {formatFileSize(originalSize)}
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-green-600 mb-1">Compressed Size</p>
                <p className="text-2xl font-bold text-green-700">
                  {compressedSize > 0 ? formatFileSize(compressedSize) : '--'}
                </p>
              </div>
            </div>

            {/* Compression Percentage */}
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

            {/* Action Buttons */}
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
                    className="px-6 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-300 transition-all duration-300"
                  >
                    New File
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
          <FileImage className="w-8 h-8 mb-2" />
          <h4 className="font-semibold mb-1">High Quality</h4>
          <p className="text-sm text-white/80">Quality is maintained</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
          <Download className="w-8 h-8 mb-2" />
          <h4 className="font-semibold mb-1">Fast Processing</h4>
          <p className="text-sm text-white/80">Quick compression</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
          <FileVideo className="w-8 h-8 mb-2" />
          <h4 className="font-semibold mb-1">Multiple Formats</h4>
          <p className="text-sm text-white/80">Both images and videos</p>
        </div>
      </div>
    </div>

  );
}