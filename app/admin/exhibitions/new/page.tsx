'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { compressImage, validateImageFile, formatFileSize } from '../../../lib/imageUtils';

export default function NewExhibitionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    startDate: '',
    endDate: '',
    status: 'UPCOMING',
    description: '',
    curator: ''
  });
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [compressedPoster, setCompressedPoster] = useState<Blob | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [compressedImages, setCompressedImages] = useState<Blob[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState('');
  const [fileSizeInfo, setFileSizeInfo] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePosterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || '');
      return;
    }

    setError('');
    setPosterFile(file);
    setIsCompressing(true);
    
    try {
      setFileSizeInfo(`원본: ${formatFileSize(file.size)}`);
      
      const compressed = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 1200,
        quality: 0.9
      });
      
      setCompressedPoster(compressed);
      setFileSizeInfo(prev => `${prev} → 압축: ${formatFileSize(compressed.size)}`);
      
      const previewUrl = URL.createObjectURL(compressed);
      setPosterPreview(previewUrl);
    } catch (err) {
      setError('이미지 압축 중 오류가 발생했습니다.');
      console.error('Compression error:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles: File[] = [];
    for (const file of files) {
      const validation = validateImageFile(file);
      if (validation.valid) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      setError('유효한 이미지 파일을 선택해주세요.');
      return;
    }

    setError('');
    setImageFiles(validFiles);
    setIsCompressing(true);
    
    try {
      const compressed: Blob[] = [];
      const previews: string[] = [];
      
      for (const file of validFiles) {
        const compressedFile = await compressImage(file, {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.85
        });
        compressed.push(compressedFile);
        previews.push(URL.createObjectURL(compressedFile));
      }
      
      setCompressedImages(compressed);
      setImagePreviews(previews);
    } catch (err) {
      setError('이미지 압축 중 오류가 발생했습니다.');
      console.error('Compression error:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.artist || !formData.description) {
      setError('제목, 작가, 설명은 필수 입력 항목입니다.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const submitFormData = new FormData();
      submitFormData.append('title', formData.title);
      submitFormData.append('artist', formData.artist);
      submitFormData.append('startDate', formData.startDate);
      submitFormData.append('endDate', formData.endDate);
      submitFormData.append('status', formData.status);
      submitFormData.append('description', formData.description);
      submitFormData.append('curator', formData.curator);
      
      if (compressedPoster) {
        submitFormData.append('poster', compressedPoster, posterFile?.name || 'poster.webp');
      }
      
      compressedImages.forEach((image, index) => {
        submitFormData.append('images', image, imageFiles[index]?.name || `image-${index}.webp`);
      });

      const response = await fetch('/api/admin/exhibitions', {
        method: 'POST',
        body: submitFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '전시회 생성에 실패했습니다.');
      }

      router.push('/admin/exhibitions');
    } catch (err) {
      setError(err instanceof Error ? err.message : '전시회 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-light tracking-wide">새 전시회 등록</h1>
        <Link
          href="/admin/exhibitions"
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
              전시 제목 *
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
              작가 *
            </label>
            <input
              type="text"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시작일
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              종료일
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상태
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            >
              <option value="UPCOMING">예정</option>
              <option value="CURRENT">진행중</option>
              <option value="PAST">종료</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              기획자
            </label>
            <input
              type="text"
              name="curator"
              value={formData.curator}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            전시 설명 *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            포스터 이미지
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePosterChange}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
          />
          {fileSizeInfo && (
            <p className="text-sm text-gray-600 mt-1">{fileSizeInfo}</p>
          )}
          {isCompressing && (
            <p className="text-sm text-blue-600 mt-1">이미지 압축 중...</p>
          )}
          {posterPreview && (
            <div className="mt-4">
              <img
                src={posterPreview}
                alt="포스터 미리보기"
                className="max-w-xs h-auto rounded border"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            전시 이미지들
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
          />
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`이미지 미리보기 ${index + 1}`}
                  className="w-full h-32 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/exhibitions"
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