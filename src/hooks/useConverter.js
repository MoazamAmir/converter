import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

// Helper to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function useConverter() {
  const [files, setFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showFormatMenuFor, setShowFormatMenuFor] = useState(null);
  const [formatSearch, setFormatSearch] = useState('');
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

  const createFileItem = (file, customUrl = null, customName = null) => {
    const url = customUrl || URL.createObjectURL(file);
    const name = customName || file.name;
    const size = file.size;
    return {
      file,
      url,
      name,
      size,
      formattedSize: formatFileSize(size),
      outputFormat: 'png'
    };
  };

  const addFileObject = (fileObj) => {
    const newItem = createFileItem(fileObj.file, fileObj.url, fileObj.name);
    setFiles((prev) => [...prev, newItem]);
    setShowUploadMenu(false);
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
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const inputFiles = Array.from(e.dataTransfer?.files || []);
    const imageFiles = inputFiles.filter((f) => f.type && f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      alert('Please drop valid image files');
      return;
    }
    const items = imageFiles.map((f) => createFileItem(f));
    setFiles((prev) => [...prev, ...items]);
    setShowUploadMenu(false);
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
      const newArr = [...prev];
      const removed = newArr.splice(index, 1)[0];
      if (removed && removed.url) URL.revokeObjectURL(removed.url);
      return newArr;
    });
    setConvertedFiles([]);
  };

  const setFileOutputFormat = (index, format) => {
    setFiles(prev =>
      prev.map((f, i) =>
        i === index ? { ...f, outputFormat: format } : f
      )
    );
    setShowFormatMenuFor(null);
    setFormatSearch('');
  };

  const formats = [
    { name: 'BMP', value: 'bmp' },
    { name: 'CSV', value: 'csv' },
    { name: 'DOC', value: 'doc' },
    { name: 'DOCX', value: 'docx' },
    { name: 'EPS', value: 'eps' },
    { name: 'GIF', value: 'gif' },
    { name: 'ICO', value: 'ico' },
    { name: 'JPEG', value: 'jpeg' },
    { name: 'JPG', value: 'jpg' },
    { name: 'ODD', value: 'odd' },
    { name: 'PDF', value: 'pdf' },
    { name: 'PNG', value: 'png' },
    { name: 'PSD', value: 'psd' },
    { name: 'SVG', value: 'svg' },
    { name: 'TGA', value: 'tga' },
    { name: 'TIFF', value: 'tiff' },
    { name: 'TXT', value: 'txt' },
    { name: 'WebP', value: 'webp' },
    { name: 'XLS', value: 'xls' }
  ];

  const filteredFormats = formats.filter(f =>
    f.name.toLowerCase().includes(formatSearch.toLowerCase()) ||
    f.value.toLowerCase().includes(formatSearch.toLowerCase())
  );

  const convertSingleFile = async (fileItem, index) => {
    const { file, outputFormat } = fileItem;
    const format = outputFormat.toLowerCase();
    
    // For non-image formats (text-based)
    if (['txt', 'csv', 'xls', 'doc', 'docx'].includes(format)) {
      let blob, newFileName;
      
      if (format === 'txt') {
        const textContent = `Image File: ${file.name}\nFile Size: ${formatFileSize(file.size)}\nFormat: ${file.type}`;
        blob = new Blob([textContent], { type: 'text/plain' });
        newFileName = file.name.replace(/\.[^/.]+$/, '.txt');
      } else if (format === 'csv') {
        const content = `File Name,File Size,Format\n${file.name},${formatFileSize(file.size)},${file.type}`;
        blob = new Blob([content], { type: 'text/csv' });
        newFileName = file.name.replace(/\.[^/.]+$/, '.csv');
      } else if (format === 'xls') {
        const content = `File Name\tFile Size\tFormat\n${file.name}\t${formatFileSize(file.size)}\t${file.type}`;
        blob = new Blob([content], { type: 'application/vnd.ms-excel' });
        newFileName = file.name.replace(/\.[^/.]+$/, '.xls');
      } else if (format === 'doc') {
        const rtf = `{\\rtf1\\ansi\\deff0\n{\\fonttbl{\\f0 Arial;}}\n\\viewkind4\\uc1\\pard\n{\\b IMAGE REPORT}\\par\nFile: ${file.name}\\par\nSize: ${formatFileSize(file.size)}\\par\n}`;
        blob = new Blob([rtf], { type: 'application/msword' });
        newFileName = file.name.replace(/\.[^/.]+$/, '.doc');
      } else if (format === 'docx') {
        const text = `IMAGE REPORT\nFile: ${file.name}\nSize: ${formatFileSize(file.size)}`;
        blob = new Blob([text], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        newFileName = file.name.replace(/\.[^/.]+$/, '.docx');
      }
      
      if (blob) {
        const newUrl = URL.createObjectURL(blob);
        return { name: newFileName, url: newUrl, blob, originalIndex: index };
      }
    }

    // For image-based formats - simply convert format WITHOUT any resizing or quality loss
    // Check if we can do direct format conversion (same format or lossless conversion)
    const sourceFormat = file.type.split('/')[1]?.toLowerCase();
    
    // If converting to same format, just return the original file
    if (sourceFormat === format || 
        (sourceFormat === 'jpeg' && format === 'jpg') || 
        (sourceFormat === 'jpg' && format === 'jpeg')) {
      const newFileName = file.name.replace(/\.[^/.]+$/, `.${format}`);
      const newUrl = URL.createObjectURL(file);
      return { name: newFileName, url: newUrl, blob: file, originalIndex: index };
    }

    // For different formats, we need to use canvas
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = URL.createObjectURL(file);
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: true });

    // Set canvas to EXACT original dimensions - NO SCALING
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Disable image smoothing for pixel-perfect rendering
    ctx.imageSmoothingEnabled = false;

    // For transparent formats, preserve alpha channel
    if (['png', 'webp', 'gif'].includes(format)) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      // Only fill background for non-transparent formats if needed
      ctx.fillStyle = settings.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw image at exact 1:1 pixel mapping
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

    // Handle SVG format
    if (format === 'svg') {
      const imgData = canvas.toDataURL('image/png', 1.0);
      const svgData = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     width="${img.naturalWidth}" height="${img.naturalHeight}" viewBox="0 0 ${img.naturalWidth} ${img.naturalHeight}">
  <image width="${img.naturalWidth}" height="${img.naturalHeight}" xlink:href="${imgData}"/>
</svg>`;
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const newFileName = file.name.replace(/\.[^/.]+$/, '.svg');
      const newUrl = URL.createObjectURL(blob);
      return { name: newFileName, url: newUrl, blob, originalIndex: index };
    }

    // Handle PDF format
    if (format === 'pdf') {
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: img.naturalWidth > img.naturalHeight ? 'l' : 'p',
        unit: 'px',
        format: [img.naturalWidth, img.naturalHeight],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, img.naturalWidth, img.naturalHeight);
      const blob = pdf.output('blob');
      const newFileName = file.name.replace(/\.[^/.]+$/, '.pdf');
      const newUrl = URL.createObjectURL(blob);
      return { name: newFileName, url: newUrl, blob, originalIndex: index };
    }

    // Standard image formats with maximum quality
    let mimeType = 'image/png';
    switch (format) {
      case 'jpg':
      case 'jpeg': mimeType = 'image/jpeg'; break;
      case 'png': mimeType = 'image/png'; break;
      case 'webp': mimeType = 'image/webp'; break;
      case 'bmp': mimeType = 'image/bmp'; break;
      case 'gif': mimeType = 'image/gif'; break;
      case 'ico': mimeType = 'image/x-icon'; break;
      case 'tiff': mimeType = 'image/tiff'; break;
      default: mimeType = 'image/png';
    }

    // ALWAYS use maximum quality (1.0) to preserve file size
    const quality = 1.0;

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const newFileName = file.name.replace(/\.[^/.]+$/, `.${format}`);
        const newUrl = URL.createObjectURL(blob);
        resolve({ name: newFileName, url: newUrl, blob, originalIndex: index });
      }, mimeType, quality);
    });
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      alert('Please add at least one image');
      return;
    }

    setIsConverting(true);
    setDownloadProgress(0);
    setConvertedFiles([]);

    try {
      const promises = files.map((fileItem, idx) => convertSingleFile(fileItem, idx));
      const results = await Promise.all(promises);

      setConvertedFiles(results);
      setDownloadProgress(100);
      setShowResults(true);
    } catch (err) {
      console.error('Batch conversion error:', err);
      alert('Conversion failed for one or more files.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = (convertedFile) => {
    const link = document.createElement('a');
    link.href = convertedFile.url;
    link.download = convertedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConvertMore = () => resetConverter();

  const resetConverter = () => {
    files.forEach(f => URL.revokeObjectURL(f.url));
    convertedFiles.forEach(f => URL.revokeObjectURL(f.url));
    setFiles([]);
    setConvertedFiles([]);
    setIsConverting(false);
    setShowResults(false);
    setDownloadProgress(0);
  };

  useEffect(() => {
    return () => {
      files.forEach(f => URL.revokeObjectURL(f.url));
      convertedFiles.forEach(f => URL.revokeObjectURL(f.url));
    };
  }, [files, convertedFiles]);

  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, from: 'bot', text: 'Hi! I am ImageBot. Click the cat to start chatting.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleChatToggle = () => setShowChat(s => !s);
  const sendChatMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatMessages(p => [...p, { id: Date.now(), from: 'user', text }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(p => [...p, {
        id: Date.now() + 1,
        from: 'bot',
        text: "I'm a demo assistant. Images are converted at their original size with maximum quality!"
      }]);
    }, 700);
  };
  const handleChatKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); sendChatMessage(); } };

  return {
    files,
    setFiles,
    convertedFiles,
    conversionFormat: null,
    setConversionFormat: () => {},
    isConverting,
    isToolsOpen,
    setIsToolsOpen,
    showUploadMenu,
    setShowUploadMenu,
    showFormatMenuFor,
    setShowFormatMenuFor,
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
    handleConvert,
    handleDownload,
    handleConvertMore,
    resetConverter,
    formats,
    filteredFormats,
    setFileOutputFormat,
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