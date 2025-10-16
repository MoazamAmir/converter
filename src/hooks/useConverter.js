import { useState, useEffect } from 'react';

// Helper to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function useConverter() {
  const [files, setFiles] = useState([]); // { file, url, name, size, formattedSize }
  const [activeIndex, setActiveIndex] = useState(0);
  const [convertedFile, setConvertedFile] = useState(null);
  const [conversionFormat, setConversionFormat] = useState('png');
  const [isConverting, setIsConverting] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [formatSearch, setFormatSearch] = useState('');

  // === NEW: Settings State ===
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isConvertersOpen, setIsConvertersOpen] = useState(false);
  const [settings, setSettings] = useState({
    resize: 'keep-original',
    width: '',
    height: '',
    bgColor: '#FFFFFF',
    compression: 'none',
    autoOrient: true,
    stripMetadata: true
  });

  // Helper to create consistent file item
  const createFileItem = (file, customUrl = null, customName = null) => {
    const url = customUrl || URL.createObjectURL(file);
    const name = customName || file.name;
    const size = file.size;
    return {
      file,
      url,
      name,
      size,
      formattedSize: formatFileSize(size)
    };
  };

  const addFileObject = (fileObj) => {
    const newItem = createFileItem(
      fileObj.file,
      fileObj.url,
      fileObj.name
    );
    setFiles((prev) => [...prev, newItem]);
    setShowUploadMenu(false);
    setActiveIndex((prev) => prev + (prev === null ? 0 : 1));
  };

  const handleFileChange = (e) => {
    const inputFiles = Array.from(e.target.files || []);
    const imageFiles = inputFiles.filter((f) => f.type && f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      alert('Please select valid image files');
      return;
    }
    const items = imageFiles.map((f) => createFileItem(f));
    setFiles((prev) => [...prev, ...items]);
    setShowUploadMenu(false);
    setActiveIndex((prev) => prev + (prev === null ? 0 : 1));
    e.target.value = '';
  };

  // drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const inputFiles = Array.from(e.dataTransfer?.files || []);
    const imageFiles = inputFiles.filter((f) => f.type && f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      alert('Please drop valid image files');
      return;
    }
    const items = imageFiles.map((f) => createFileItem(f));
    setFiles((prev) => [...prev, ...items]);
    setShowUploadMenu(false);
    setActiveIndex((prev) => prev + (prev === null ? 0 : 1));
  };

  const handleAddFromUrl = async () => {
    const url = prompt('Enter image URL:');
    if (!url) return;
    try {
      setShowUploadMenu(false);
      const res = await fetch(url);
      if (!res.ok) throw new Error('Could not fetch image');
      const blob = await res.blob();
      if (!blob.type.startsWith('image/')) {
        alert('URL did not return an image');
        return;
      }
      const filename = url.split('/').pop().split('?')[0] || `image-${Date.now()}`;
      const file = new File([blob], filename, { type: blob.type });
      addFileObject({
        file,
        url: URL.createObjectURL(blob),
        name: filename
      });
    } catch (err) {
      console.error(err);
      alert('Failed to add image from URL');
    }
  };

  const handleCloudFallback = () => {
    const el = document.getElementById('fileInput');
    if (el) el.click();
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => {
      const newArr = prev.slice();
      const removed = newArr.splice(index, 1)[0];
      if (removed && removed.url) {
        try { URL.revokeObjectURL(removed.url); } catch {}
      }
      return newArr;
    });
    setConvertedFile(null);
    setActiveIndex((prevIdx) => {
      if (files.length <= 1) return 0;
      if (index < prevIdx) return Math.max(prevIdx - 1, 0);
      if (index === prevIdx) return 0;
      return prevIdx;
    });
  };

  const selectedFile = files[activeIndex] ? files[activeIndex].file : null;
  const selectedFileMeta = files[activeIndex] || null;

  const handleConvert = async () => {
    if (!selectedFile) {
      alert('Please select an image first');
      return;
    }

    setIsConverting(true);
    setDownloadProgress(0);

    try {
      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let targetWidth = img.width;
        let targetHeight = img.height;

        // Apply resize settings
        if (settings.resize === 'custom' && settings.width && settings.height) {
          targetWidth = parseInt(settings.width, 10);
          targetHeight = parseInt(settings.height, 10);
        } else if (settings.resize === 'percent' && settings.width) {
          const scale = parseFloat(settings.width) / 100;
          targetWidth = Math.round(img.width * scale);
          targetHeight = Math.round(img.height * scale);
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Fill background color (for transparency)
        ctx.fillStyle = settings.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw image
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Determine MIME type
        let mimeType;
        const format = conversionFormat.toLowerCase();
        switch (format) {
          case 'jpg':
          case 'jpeg':
            mimeType = 'image/jpeg';
            break;
          case 'png':
            mimeType = 'image/png';
            break;
          case 'webp':
            mimeType = 'image/webp';
            break;
          case 'bmp':
            mimeType = 'image/bmp';
            break;
          case 'gif':
            mimeType = 'image/gif';
            break;
          case 'ico':
            mimeType = 'image/x-icon';
            break;
          case 'tiff':
            mimeType = 'image/tiff';
            break;
          case 'pdf':
            mimeType = 'image/png'; // fallback
            break;
          default:
            mimeType = 'image/png';
        }

        // Determine quality
        let quality = 0.9;
        if (mimeType === 'image/jpeg' || mimeType === 'image/webp') {
          if (settings.compression === 'low') quality = 0.5;
          else if (settings.compression === 'medium') quality = 0.7;
          else if (settings.compression === 'high') quality = 0.9;
          else quality = 0.9;
        }

        // Simulate progress
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 10;
          setDownloadProgress(progress);
          if (progress >= 100) {
            clearInterval(progressInterval);
          }
        }, 100);

        canvas.toBlob((blob) => {
          if (blob) {
            const newFileName = selectedFile.name.replace(/\.[^/.]+$/, `.${format}`);
            const newUrl = URL.createObjectURL(blob);

            if (convertedFile && convertedFile.url) {
              try { URL.revokeObjectURL(convertedFile.url); } catch {}
            }

            setConvertedFile({
              name: newFileName,
              url: newUrl,
              blob: blob
            });

            setTimeout(() => {
              setIsConverting(false);
              setShowResults(true);
            }, 1200);
          }
        }, mimeType, quality);
      };

      img.onerror = () => {
        alert('Error loading image for conversion');
        setIsConverting(false);
      };
    } catch (error) {
      console.error('Conversion error:', error);
      alert('An error occurred during conversion');
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedFile) return;

    const link = document.createElement('a');
    link.href = convertedFile.url;
    link.download = convertedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConvertMore = () => {
    resetConverter();
  };

  const resetConverter = () => {
    files.forEach((f) => {
      try { URL.revokeObjectURL(f.url); } catch {}
    });
    if (convertedFile && convertedFile.url) {
      try { URL.revokeObjectURL(convertedFile.url); } catch {}
    }
    setFiles([]);
    setActiveIndex(0);
    setConvertedFile(null);
    setIsConverting(false);
    setShowResults(false);
    setDownloadProgress(0);
  };

  const formats = [
    { name: 'BMP', value: 'bmp' },
    { name: 'EPS', value: 'eps' },
    { name: 'GIF', value: 'gif' },
    { name: 'ICO', value: 'ico' },
    { name: 'JPEG', value: 'jpeg' },
    { name: 'JPG', value: 'jpg' },
    { name: 'ODD', value: 'odd' },
    { name: 'PNG', value: 'png' },
    { name: 'PSD', value: 'psd' },
    { name: 'SVG', value: 'svg' },
    { name: 'TGA', value: 'tga' },
    { name: 'TIFF', value: 'tiff' },
    { name: 'WebP', value: 'webp' }
  ];

  const filteredFormats = formats.filter(f => 
    f.name.toLowerCase().includes(formatSearch.toLowerCase()) ||
    f.value.toLowerCase().includes(formatSearch.toLowerCase())
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      files.forEach((f) => {
        try { URL.revokeObjectURL(f.url); } catch {}
      });
      if (convertedFile && convertedFile.url) {
        try { URL.revokeObjectURL(convertedFile.url); } catch {}
      }
    };
  }, [files, convertedFile]);

  // Chat UI state & handlers
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, from: 'bot', text: 'Hi! I am ImageBot. Click the cat to start chatting.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleChatToggle = () => {
    setShowChat((s) => !s);
  };

  const sendChatMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    const userMsg = { id: Date.now(), from: 'user', text };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    // simulated bot reply
    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        from: 'bot',
        text:
          "I'm a demo assistant. I can't perform actions outside this page, but I can help with tips: try uploading an image and selecting an output format."
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 700);
  };

  const handleChatKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendChatMessage();
    }
  };

  return {
    files,
    setFiles,
    activeIndex,
    setActiveIndex,
    convertedFile,
    conversionFormat,
    setConversionFormat,
    isConverting,
    isToolsOpen,
    setIsToolsOpen,
    showUploadMenu,
    setShowUploadMenu,
    showFormatMenu,
    setShowFormatMenu,
    formatSearch,
    setFormatSearch,
    showDropdown,
    setShowDropdown,
    isSettingsOpen,
    setIsSettingsOpen,
    showResults,
    setShowResults,
    downloadProgress,
    setDownloadProgress,
    isConvertersOpen,
    setIsConvertersOpen,
    settings,
    setSettings,
    addFileObject,
    handleFileChange,
    handleDragOver,
    handleDrop,
    handleAddFromUrl,
    handleCloudFallback,
    handleRemoveFile,
    selectedFile,
    selectedFileMeta,
    handleConvert,
    handleDownload,
    handleConvertMore,
    resetConverter,
    formats,
    filteredFormats,
    handleChatToggle,
    showChat,
    setShowChat,
    chatMessages,
    setChatMessages,
    chatInput,
    setChatInput,
    sendChatMessage,
    handleChatKeyDown,
  };
}