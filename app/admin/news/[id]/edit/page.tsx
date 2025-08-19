'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface News {
  id: number;
  title: string;
  type: string;
  date: string;
  content: string;
  image: string | null;
  link: string | null;
  featured: boolean;
}

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [news, setNews] = useState<News | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'exhibition',
    date: '',
    content: '',
    link: '',
    featured: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/admin/news/${id}`);
        if (!response.ok) {
          throw new Error('뉴스를 찾을 수 없습니다.');
        }
        const newsData = await response.json();
        setNews(newsData);
        setFormData({
          title: newsData.title,
          type: newsData.type,
          date: new Date(newsData.date).toISOString().split('T')[0],
          content: newsData.content,
          link: newsData.link || '',
          featured: newsData.featured
        });
        if (newsData.image) {
          setImagePreview(newsData.image);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('type', formData.type);
      submitData.append('date', formData.date);
      submitData.append('content', formData.content);
      submitData.append('link', formData.link);
      submitData.append('featured', formData.featured.toString());
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'PUT',
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update news');
      }

      router.push('/admin/news');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage || '뉴스 수정에 실패했습니다.');
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

  if (error && !news) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-light">{error}</p>
        <Link
          href="/admin/news"
          className="mt-4 inline-block text-gray-600 hover:text-gray-900 font-light"
        >
          ← 뉴스 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/news"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-3xl font-light tracking-wider text-gray-900">
          뉴스 수정
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
                    <option value="exhibition">전시</option>
                    <option value="event">이벤트</option>
                    <option value="announcement">공지</option>
                    <option value="press">보도자료</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-light text-gray-700 mb-2">
                    날짜 *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="link" className="block text-sm font-light text-gray-700 mb-2">
                  외부 링크 URL
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

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
                />
                <label htmlFor="featured" className="ml-2 text-sm font-light text-gray-700">
                  메인에 노출
                </label>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-light text-gray-700 mb-2">
                  내용 *
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-6">
              {imagePreview && (
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-2">
                    현재 이미지
                  </label>
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-gray-200 mb-4">
                    <Image
                      src={imagePreview}
                      alt="Current image"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="image" className="block text-sm font-light text-gray-700 mb-2">
                  새 이미지 (권장: 800x600)
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
                />
                <p className="mt-1 text-xs text-gray-500 font-light">
                  선택하지 않으면 기존 이미지를 유지합니다. JPEG, PNG, WebP 파일만 업로드 가능 (최대 10MB)
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin/news"
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