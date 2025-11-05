import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image, Video, Download, X, FileImage, FileVideo, Loader2, Palette } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';

export default function MediaCompressor({ isDarkMode }) {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [quality, setQuality] = useState(85);
  const [compressedBlob, setCompressedBlob] = useState(null);
  const fileInputRef = useRef(null);
  const location = useLocation();

  // ✅ Theme-aware classes
  const bgPrimary = isDarkMode ? 'bg-[#111727]' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100';
  const bgCard = isDarkMode ? 'bg-[#1a2332]' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const textTertiary = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDarkMode ? 'bg-[#1f2937]' : 'bg-white';
  const adBg = isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-100 border-blue-200';
  const adText = isDarkMode ? 'text-blue-300' : 'text-blue-800';
  const adSubText = isDarkMode ? 'text-blue-400' : 'text-blue-600';

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
    setCompressedBlob(null);
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
          const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          let mimeType = file.type;
          if (!mimeType.startsWith('image/')) mimeType = 'image/jpeg';
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
    try {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.muted = true;
      await new Promise((resolve) => {
        video.onloadedmetadata = async () => {
          const canvas = document.createElement('canvas');
          let width = video.videoWidth;
          let height = video.videoHeight;
          const scaleFactor = quality / 100;
          const maxDimension = 1280 * scaleFactor;
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
          const ctx = canvas.getContext('2d');
          video.currentTime = 0;
          await new Promise((seekResolve) => {
            video.onseeked = () => {
              ctx.drawImage(video, 0, 0, width, height);
              canvas.toBlob(() => {
                const reader = new FileReader();
                reader.onload = () => {
                  const qualityFactor = quality / 100;
                  const estimatedSize = Math.floor(originalSize * qualityFactor * 0.7);
                  const videoBlob = new Blob([file], { type: file.type });
                  setCompressedSize(estimatedSize);
                  setCompressedBlob(videoBlob);
                  setCompressedUrl(URL.createObjectURL(videoBlob));
                  setIsCompressing(false);
                  seekResolve();
                  resolve();
                };
                reader.readAsArrayBuffer(file);
              }, 'image/jpeg', quality / 100);
            };
          });
        };
      });
    } catch (error) {
      console.error('Video compression error:', error);
      setIsCompressing(false);
    }
  };

  const handleCompress = () => {
    if (fileType === 'image') compressImage();
    else compressVideo();
  };

  const handleDownload = () => {
    if (!compressedBlob) return;
    const a = document.createElement('a');
    const url = URL.createObjectURL(compressedBlob);
    a.href = url;
    if (fileType === 'image') {
      const extension = file.type === 'image/png' ? 'png' : 'jpg';
      const nameWithoutExt = file.name.split('.').slice(0, -1).join('.');
      a.download = `compressed_${nameWithoutExt}.${extension}`;
    } else {
      const extension = file.name.split('.').pop();
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

  return (
    <div className={`min-h-screen overflow-x-hidden ${bgPrimary} transition-colors duration-300`}>
      <div className="text-center py-8">
        <h1 className={`text-4xl sm:text-5xl font-bold ${textPrimary} mb-2`}>Image & Video Compressor</h1>
        <p className={`${isDarkMode ? 'text-purple-300' : 'text-purple-500'} text-lg`}>Professional compression with advanced features</p>
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
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1 rounded-xl mb-6">
                <div className={`${bgCard} rounded-xl p-12 text-center`}>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-4 border-dashed ${isDarkMode ? 'border-purple-500/50 hover:border-purple-400 hover:bg-[#1f2937]' : 'border-purple-300 hover:border-purple-500 hover:bg-purple-50'} rounded-xl p-12 text-center cursor-pointer transition-all duration-300`}
                  >
                    <Upload className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                    <h3 className={`text-2xl font-semibold ${textPrimary} mb-2`}>
                      Upload Your File
                    </h3>
                    <p className={textTertiary}>
                      Click to browse or drag & drop
                    </p>
                    <div className="flex justify-center gap-4 text-sm mt-2">
                      <span className={`flex items-center gap-1 ${textTertiary}`}>
                        <FileImage className="w-4 h-4" />
                        Images (JPG, PNG, WebP)
                      </span>
                      <span className={`flex items-center gap-1 ${textTertiary}`}>
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
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
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
                    className={`px-6 py-4 rounded-xl font-semibold text-lg ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-all duration-300`}
                  >
                    New File
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer currentPage={location.pathname} isDarkMode={isDarkMode} />
    </div>
  );
}