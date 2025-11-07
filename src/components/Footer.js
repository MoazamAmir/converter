// Footer.jsx
import React from 'react';

// Tool ke anusaar title aur description
const toolTitleMap = {
  '/': 'Image Converter Pro',
  '/tools/image-resizer': 'Image Resizer Pro',
  '/tools/crop-image': 'Crop Image Pro',
  '/tools/image-compressor': 'ⵋe Image Compressor Pro',
  '/tools/color-picker': 'Color Picker Pro',
  '/tools/rotate-image': 'Rotate Image Pro',
  '/tools/collage-maker': 'Collage Maker Pro',
};

const toolDescriptionMap = {
  '/': 'Convert images between JPG, PNG, WebP, and more formats instantly in your browser.',
  '/tools/image-resizer': 'Resize your images to any dimension with precision and speed.',
  '/tools/crop-image': 'Easily crop unwanted parts from your images with intuitive controls.',
  '/tools/image-compressor': 'Compress images up to 90% without losing visible quality.',
  '/tools/color-picker': 'Pick colors from screen, images, or palette with professional-grade accuracy.',
  '/tools/rotate-image': 'Rotate, flip, or orient your images perfectly in seconds.',
  '/tools/collage-maker': 'Create stunning photo collages from multiple images in custom layouts.',
};

// Theme-dependent classes
const getThemeClasses = (isDarkMode) => ({
  bgSecondary: isDarkMode ? 'bg-[#111727]' : 'bg-white',
  borderColor: isDarkMode ? 'border-gray-800' : 'border-gray-200',
  textPrimary: isDarkMode ? 'text-white' : 'text-[#111727]',
  textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
  textTertiary: isDarkMode ? 'text-gray-500' : 'text-gray-500',
});

export default function Footer({ currentPage = '/', isDarkMode = false }) {
  const title = toolTitleMap[currentPage] || 'Image Tools Pro';
  const description = toolDescriptionMap[currentPage] || 'Professional tools for all your image editing needs.';
  const { bgSecondary, borderColor, textPrimary, textSecondary, textTertiary } = getThemeClasses(isDarkMode);

  // SVG Icon Component (Palette)
  const Palette = ({ size = 20, className = '' }) => (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 21a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7z" />
    </svg>
  );

  return (
    <footer className={`${bgSecondary} backdrop-blur-md border-t ${borderColor} mt-20 py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand + Dynamic Description */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Palette className="text-white" size={22} />
              </div> */}
              <div>
                <h3 className={`text-lg font-bold ${textPrimary}`}>{title}</h3>
                <p className={`text-xs ${textTertiary}`}>Professional Tool</p>
              </div>
            </div>
            <p className={`text-sm ${textTertiary} text-center md:text-left`}>
              {description}
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className={`text-sm font-semibold ${textSecondary} mb-4 uppercase tracking-wide`}>
              Tools
            </h4>
            <ul className={`space-y-2 text-sm ${textTertiary}`}>
              <li className="hover:text-blue-400 transition cursor-pointer">Image Conversion</li>
              <li className="hover:text-blue-400 transition cursor-pointer">Batch Processing</li>
              <li className="hover:text-blue-400 transition cursor-pointer">High Quality Output</li>
              <li className="hover:text-blue-400 transition cursor-pointer">Privacy Guaranteed</li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className={`text-sm font-semibold ${textSecondary} mb-4 uppercase tracking-wide`}>
              Resources
            </h4>
            <ul className={`space-y-2 text-sm ${textTertiary}`}>
              <li className="hover:text-blue-400 transition cursor-pointer">Documentation</li>
              {/* <li className="hover:text-blue-400 transition cursor-pointer">Tutorials</li> */}
              <li className="hover:text-blue-400 transition cursor-pointer">Support</li>
              <li className="hover:text-blue-400 transition cursor-pointer">Privacy Policy</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t ${borderColor} pt-6`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={`text-sm ${textTertiary}`}>
              © {new Date().getFullYear()} {title}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['facebook', 'twitter', 'instagram'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className={`${textTertiary} hover:text-blue-400 transition`}
                  aria-label={social}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}