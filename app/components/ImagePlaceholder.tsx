import { useState } from 'react';

interface ImagePlaceholderProps {
  width?: number;
  height?: number;
  text?: string;
  className?: string;
}

export default function ImagePlaceholder({ 
  width = 400, 
  height = 300, 
  text = 'Image Placeholder',
  className = ''
}: ImagePlaceholderProps) {
  const [error, setError] = useState(false);

  // Generate a simple placeholder image URL
  const placeholderUrl = `https://via.placeholder.com/${width}x${height}/f3f4f6/6b7280?text=${encodeURIComponent(text)}`;

  return (
    <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
      {error ? (
        <div className="text-center p-4">
          <svg 
            className="w-12 h-12 text-gray-400 mx-auto mb-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <p className="text-gray-500 text-sm font-light">{text}</p>
        </div>
      ) : (
        <img
          src={placeholderUrl}
          alt={text}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}