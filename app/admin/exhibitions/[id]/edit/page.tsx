'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Exhibition {
  id: number;
  title: string;
  artist: string;
  startDate: string;
  endDate: string;
  status: string;
  poster: string;
  images: string[];
  description: string;
  curator: string | null;
}

export default function EditExhibitionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    startDate: '',
    endDate: '',
    status: 'upcoming',
    description: '',
    curator: ''
  });
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExhibition = async () => {
      try {
        const response = await fetch(`/api/admin/exhibitions/${id}`);
        if (!response.ok) {
          throw new Error('전시를 찾을 수 없습니다.');
        }
        const exhibitionData = await response.json();
        setExhibition(exhibitionData);
        setFormData({
          title: exhibitionData.title,
          artist: exhibitionData.artist,
          startDate: new Date(exhibitionData.startDate).toISOString().split('T')[0],
          endDate: new Date(exhibitionData.endDate).toISOString().split('T')[0],
          status: exhibitionData.status,
          description: exhibitionData.description,
          curator: exhibitionData.curator || ''
        });
        setPosterPreview(exhibitionData.poster);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchExhibition();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPosterPreview(e.target?.result as string);
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
      submitData.append('artist', formData.artist);
      submitData.append('startDate', formData.startDate);
      submitData.append('endDate', formData.endDate);
      submitData.append('status', formData.status);
      submitData.append('description', formData.description);
      submitData.append('curator', formData.curator);
      
      if (posterFile) {
        submitData.append('poster', posterFile);
      }

      const response = await fetch(`/api/admin/exhibitions/${id}`, {
        method: 'PUT',
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update exhibition');
      }

      router.push('/admin/exhibitions');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage || '전시 수정에 실패했습니다.');
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

  if (error && !exhibition) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-light">{error}</p>
        <Link
          href="/admin/exhibitions"
          className="mt-4 inline-block text-gray-600 hover:text-gray-900 font-light"
        >
          ← 전시 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/exhibitions"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-3xl font-light tracking-wider text-gray-900">
          전시 수정
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
                  전시 제목 *
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
                <label htmlFor="artist" className="block text-sm font-light text-gray-700 mb-2">
                  작가명 *
                </label>
                <input
                  type="text"
                  id="artist"
                  name="artist"
                  value={formData.artist}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-light text-gray-700 mb-2">
                    시작일 *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-light text-gray-700 mb-2">
                    종료일 *
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-light text-gray-700 mb-2">
                  상태
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
                >
                  <option value="upcoming">예정</option>
                  <option value="current">진행중</option>
                  <option value="past">종료</option>
                </select>
              </div>

              <div>
                <label htmlFor="curator" className="block text-sm font-light text-gray-700 mb-2">
                  큐레이터
                </label>
                <input
                  type="text"
                  id="curator"
                  name="curator"
                  value={formData.curator}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-light text-gray-700 mb-2">
                  전시 설명 *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
                />
              </div>
            </div>

            {/* Poster Upload */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-light text-gray-700 mb-2">
                  현재 포스터
                </label>
                {posterPreview && (
                  <div className="relative aspect-[3/4] w-full max-w-sm rounded-lg overflow-hidden border border-gray-200 mb-4">
                    <Image
                      src={posterPreview}
                      alt="Current poster"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="poster" className="block text-sm font-light text-gray-700 mb-2">
                  새 포스터 이미지 (권장: 400x600)
                </label>
                <input
                  type="file"
                  id="poster"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePosterChange}
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
              href="/admin/exhibitions"
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