'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { compressImage, validateImageFile, formatFileSize } from '../../../lib/imageUtils';

export default function NewNewsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    type: 'NOTICE',
    date: new Date().toISOString().split('T')[0],
    content: '',
    link: '',
    featured: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<Blob | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState('');
  const [fileSizeInfo, setFileSizeInfo] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || '');
      return;
    }

    setError('');
    setImageFile(file);
    setIsCompressing(true);
    
    try {
      setFileSizeInfo(`원본: ${formatFileSize(file.size)}`);
      
      const compressed = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.85
      });
      
      setCompressedFile(compressed);
      setFileSizeInfo(prev => `${prev} → 압축: ${formatFileSize(compressed.size)}`);
      
      const previewUrl = URL.createObjectURL(compressed);
      setImagePreview(previewUrl);
    } catch (err) {
      setError('이미지 압축 중 오류가 발생했습니다.');
      console.error('Compression error:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      setError('제목과 내용은 필수 입력 항목입니다.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const submitFormData = new FormData();
      submitFormData.append('title', formData.title);
      submitFormData.append('type', formData.type);
      submitFormData.append('date', formData.date);
      submitFormData.append('content', formData.content);
      submitFormData.append('link', formData.link);
      submitFormData.append('featured', formData.featured.toString());
      
      if (compressedFile) {
        submitFormData.append('image', compressedFile, imageFile?.name || 'image.webp');
      }

      const response = await fetch('/api/admin/news', {
        method: 'POST',
        body: submitFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '뉴스 생성에 실패했습니다.');
      }

      router.push('/admin/news');
    } catch (err) {
      setError(err instanceof Error ? err.message : '뉴스 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-light tracking-wide">새 소식 등록</h1>
        <Link
          href="/admin/news"
          className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          목록으로
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            >
              <option value="NOTICE">공지사항</option>
              <option value="PRESS">보도자료</option>
              <option value="EVENT">이벤트</option>
              <option value="WORKSHOP">워크샵</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              날짜
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              링크 (선택)
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-sm font-medium text-gray-700">주요 소식으로 표시</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            내용 *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이미지
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
          />
          {fileSizeInfo && (
            <p className="text-sm text-gray-600 mt-1">{fileSizeInfo}</p>
          )}
          {isCompressing && (
            <p className="text-sm text-blue-600 mt-1">이미지 압축 중...</p>
          )}
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="이미지 미리보기"
                className="max-w-md h-auto rounded border"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/news"
            className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isCompressing}
            className="px-6 py-2 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isSubmitting ? '등록 중...' : '등록'}
          </button>
        </div>
      </form>
    </div>
  );
}