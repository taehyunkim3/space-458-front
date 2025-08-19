'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewBannerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    link: '',
    type: 'image',
    order: 0,
    active: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!imageFile) {
      setError('이미지를 선택해주세요.');
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('subtitle', formData.subtitle);
      submitData.append('link', formData.link);
      submitData.append('type', formData.type);
      submitData.append('order', formData.order.toString());
      submitData.append('active', formData.active.toString());
      submitData.append('image', imageFile);

      const response = await fetch('/api/admin/banners', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create banner');
      }

      router.push('/admin/banners');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage || '배너 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/banners"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-3xl font-light tracking-wider text-gray-900">
          새 배너 추가
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded font-light">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-light text-gray-700 mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
                />
              </div>

              <div>
                <label htmlFor="subtitle" className="block text-sm font-light text-gray-700 mb-2">
                  부제목
                </label>
                <input
                  type="text"
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
                />
              </div>

              <div>
                <label htmlFor="link" className="block text-sm font-light text-gray-700 mb-2">
                  링크 URL
                </label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-light text-gray-700 mb-2">
                    타입
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
                  >
                    <option value="image">이미지</option>
                    <option value="video">동영상</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="order" className="block text-sm font-light text-gray-700 mb-2">
                    순서
                  </label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
                />
                <label htmlFor="active" className="ml-2 text-sm font-light text-gray-700">
                  활성화
                </label>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-6">
              <div>
                <label htmlFor="image" className="block text-sm font-light text-gray-700 mb-2">
                  배너 이미지 * (권장: 1920x1080)
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
                />
                <p className="mt-1 text-xs text-gray-500 font-light">
                  JPEG, PNG, WebP 파일만 업로드 가능 (최대 10MB)
                </p>
              </div>

              {imagePreview && (
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-2">
                    미리보기
                  </label>
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin/banners"
              className="px-6 py-2 border border-gray-300 text-gray-700 hover:border-gray-400 transition-colors font-light"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors font-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}