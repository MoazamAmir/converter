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
  // Each file now includes its own outputFormat
  const [files, setFiles] = useState([]); // { file, url, name, size, formattedSize, outputFormat }
  const [convertedFiles, setConvertedFiles] = useState([]); // Array of { name, url, blob, originalIndex }
  const [isConverting, setIsConverting] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showFormatMenuFor, setShowFormatMenuFor] = useState(null); // index of file whose format menu is open
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
      formattedSize: formatFileSize(size),
      outputFormat: 'png' // default per-file format
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

  const handleDragOver = (e) => e.preventDefault();

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
    const img = new Image();
    const imgLoadPromise = new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = URL.createObjectURL(file);
    });

    await imgLoadPromise;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let targetWidth = img.width;
    let targetHeight = img.height;

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
    ctx.fillStyle = settings.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const format = outputFormat.toLowerCase();

    // === Handle non-image formats ===
    if (['pdf', 'txt', 'csv', 'xls', 'doc', 'docx', 'svg'].includes(format)) {
      let blob, newFileName, newUrl;

      if (format === 'svg') {
        const svgData = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     width="${targetWidth}" height="${targetHeight}" viewBox="0 0 ${targetWidth} ${targetHeight}">
  <image width="${targetWidth}" height="${targetHeight}" 
         xlink:href="${canvas.toDataURL('image/png')}"/>
</svg>`;
        blob = new Blob([svgData], { type: 'image/svg+xml' });
        newFileName = file.name.replace(/\.[^/.]+$/, '.svg');
      } else if (format === 'pdf') {
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF({
          orientation: targetWidth > targetHeight ? 'l' : 'p',
          unit: 'px',
          format: [targetWidth, targetHeight],
        });
        pdf.addImage(imgData, 'JPEG', 0, 0, targetWidth, targetHeight);
        blob = pdf.output('blob');
        newFileName = file.name.replace(/\.[^/.]+$/, '.pdf');
      } else if (format === 'txt') {
        const textContent = `Image File: ${file.name}\nWidth: ${targetWidth}px\nHeight: ${targetHeight}px\nFile Size: ${formatFileSize(file.size)}\nFormat: ${file.type}`;
        blob = new Blob([textContent], { type: 'text/plain' });
        newFileName = file.name.replace(/\.[^/.]+$/, '.txt');
      } else if (format === 'csv') {
        const content = `File Name,Width,Height,File Size,Format\n${file.name},${targetWidth}px,${targetHeight}px,${formatFileSize(file.size)},${file.type}`;
        blob = new Blob([content], { type: 'text/csv' });
        newFileName = file.name.replace(/\.[^/.]+$/, '.csv');
      } else if (format === 'xls') {
        const content = `File Name\tWidth\tHeight\tFile Size\tFormat\n${file.name}\t${targetWidth}px\t${targetHeight}px\t${formatFileSize(file.size)}\t${file.type}`;
        blob = new Blob([content], { type: 'application/vnd.ms-excel' });
        newFileName = file.name.replace(/\.[^/.]+$/, '.xls');
      } else if (format === 'doc') {
        const rtf = `{\\rtf1\\ansi\\deff0\n{\\fonttbl{\\f0 Arial;}}\n\\viewkind4\\uc1\\pard\n{\\b IMAGE REPORT}\\par\nFile: ${file.name}\\par\nSize: ${formatFileSize(file.size)}\\par\n}`;
        blob = new Blob([rtf], { type: 'application/msword' });
        newFileName = file.name.replace(/\.[^/.]+$/, '.doc');
      } else if (['docx', 'word'].includes(format)) {
        const text = `IMAGE REPORT\nFile: ${file.name}\nSize: ${formatFileSize(file.size)}`;
        blob = new Blob([text], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        newFileName = file.name.replace(/\.[^/.]+$/, '.docx');
      }

      newUrl = URL.createObjectURL(blob);
      return { name: newFileName, url: newUrl, blob, originalIndex: index };
    }

    // === Standard image formats ===
    let mimeType = 'image/png';
    switch (format) {
      case 'jpg':
      case 'jpeg': mimeType = 'image/jpeg'; break;
      case 'png': mimeType = 'image/png'; break;
      case 'webp': mimeType = 'image/webp'; break;
      case 'bmp': mimeType = 'image/bmp'; break;
      case 'gif': mimeType = 'image/gif'; break;
      case 'ico': mimeType = 'image/x-icon'; break;
      default: mimeType = 'image/png';
    }

    let quality = 0.9;
    if (['image/jpeg', 'image/webp'].includes(mimeType)) {
      if (settings.compression === 'low') quality = 0.5;
      else if (settings.compression === 'medium') quality = 0.7;
    }

    const blobPromise = new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const newFileName = file.name.replace(/\.[^/.]+$/, `.${format}`);
        const newUrl = URL.createObjectURL(blob);
        resolve({ name: newFileName, url: newUrl, blob, originalIndex: index });
      }, mimeType, quality);
    });

    return blobPromise;
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

  // Cleanup
  useEffect(() => {
    return () => {
      files.forEach(f => URL.revokeObjectURL(f.url));
      convertedFiles.forEach(f => URL.revokeObjectURL(f.url));
    };
  }, [files, convertedFiles]);

  // === Chat State (unchanged) ===
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
        text: "I'm a demo assistant. Try uploading multiple images and assigning different output formats!"
      }]);
    }, 700);
  };
  const handleChatKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); sendChatMessage(); } };

  return {
    files,
    setFiles,
    convertedFiles,
    conversionFormat: null, // deprecated
    setConversionFormat: () => {}, // deprecated
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