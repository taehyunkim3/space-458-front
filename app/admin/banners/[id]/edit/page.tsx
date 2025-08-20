'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { compressImage, validateImageFile, formatFileSize } from '../../../../lib/imageUtils';

interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  image: string;
  link: string | null;
  type: string;
  order: number;
  active: boolean;
}

export default function EditBannerPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [banner, setBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    link: '',
    type: 'image',
    order: 0,
    active: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<Blob | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState('');
  const [fileSizeInfo, setFileSizeInfo] = useState('');

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch(`/api/admin/banners/${id}`);
        if (!response.ok) {
          throw new Error('배너를 찾을 수 없습니다.');
        }
        const bannerData = await response.json();
        setBanner(bannerData);
        setFormData({
          title: bannerData.title,
          subtitle: bannerData.subtitle || '',
          link: bannerData.link || '',
          type: bannerData.type,
          order: bannerData.order,
          active: bannerData.active
        });
        setImagePreview(bannerData.image);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBanner();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || '');
      return;
    }

    setError('');
    setImageFile(file);
    setIsCompressing(true);
    
    try {
      // Show original file size
      setFileSizeInfo(`원본: ${formatFileSize(file.size)}`);
      
      // Compress image
      const compressed = await compressImage(file, 1920, 0.7);
      setCompressedFile(compressed);
      
      // Update file size info
      setFileSizeInfo(`원본: ${formatFileSize(file.size)} → 압축: ${formatFileSize(compressed.size)}`);
      
      // Create preview from compressed image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(compressed);
    } catch {
      setError('이미지 압축 중 오류가 발생했습니다.');
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      setError('이미지 다운로드에 실패했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('subtitle', formData.subtitle);
      submitData.append('link', formData.link);
      submitData.append('type', formData.type);
      submitData.append('order', formData.order.toString());
      submitData.append('active', formData.active.toString());
      
      if (compressedFile) {
        const compressedImageFile = new File([compressedFile], imageFile?.name || 'banner.webp', {
          type: 'image/webp'
        });
        submitData.append('image', compressedImageFile);
      }

      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'PUT',
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update banner');
      }

      router.push('/admin/banners');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage || '배너 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error && !banner) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-light">{error}</p>
        <Link
          href="/admin/banners"
          className="mt-4 inline-block text-gray-600 hover:text-gray-900 font-light"
        >
          ← 배너 목록으로 돌아가기
        </Link>
      </div>
    );
  }

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
          배너 수정
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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-light text-gray-700">
                    현재 배너 이미지
                  </label>
                  {banner && (
                    <button
                      type="button"
                      onClick={() => downloadImage(`/api/images/banners/${banner.id}`, `banner-${banner.id}.webp`)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-light"
                    >
                      다운로드
                    </button>
                  )}
                </div>
                {(imagePreview || banner) && (
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-gray-200 mb-4">
                    <Image
                      src={imagePreview || `/api/images/banners/${banner?.id}` || ''}
                      alt="Current banner"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-light text-gray-700 mb-2">
                  새 배너 이미지 (권장: 1920x1080)
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
                />
                <p className="mt-1 text-xs text-gray-500 font-light">
                  선택하지 않으면 기존 이미지를 유지합니다. JPEG, PNG, WebP 파일만 업로드 가능 (최대 50MB) - 자동으로 1920px로 압축됩니다
                </p>
                
                {isCompressing && (
                  <div className="mt-2 flex items-center text-sm text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    이미지 압축 중...
                  </div>
                )}
                
                {fileSizeInfo && (
                  <div className="mt-2 text-sm text-green-600 font-light">
                    {fileSizeInfo}
                  </div>
                )}
              </div>
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