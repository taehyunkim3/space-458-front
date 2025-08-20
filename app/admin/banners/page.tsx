'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  type: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/banners');
      if (!response.ok) throw new Error('Failed to fetch banners');
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      setError('배너를 불러오는데 실패했습니다.');
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (id: number) => {
    if (!confirm('정말로 이 배너를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete banner');

      setBanners(prev => prev.filter(banner => banner.id !== id));
    } catch (error) {
      setError('배너 삭제에 실패했습니다.');
      console.error('Error deleting banner:', error);
    }
  };

  const toggleBannerStatus = async (id: number, currentActive: boolean) => {
    try {
      const formData = new FormData();
      const banner = banners.find(b => b.id === id);
      if (!banner) return;

      formData.append('title', banner.title);
      formData.append('subtitle', banner.subtitle || '');
      formData.append('link', banner.link || '');
      formData.append('type', banner.type);
      formData.append('order', banner.order.toString());
      formData.append('active', (!currentActive).toString());

      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to update banner');

      const updatedBanner = await response.json();
      setBanners(prev => prev.map(banner => 
        banner.id === id ? updatedBanner : banner
      ));
    } catch (error) {
      setError('배너 상태 변경에 실패했습니다.');
      console.error('Error updating banner:', error);
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
    } catch (error) {
      setError('이미지 다운로드에 실패했습니다.');
      console.error('Error downloading image:', error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-wider text-gray-900">
            배너 관리
          </h1>
          <p className="mt-2 text-gray-600 font-light">
            홈페이지 메인 배너를 관리하세요
          </p>
        </div>
        <Link
          href="/admin/banners/new"
          className="bg-gray-900 text-white px-6 py-3 hover:bg-gray-800 transition-colors font-light tracking-wide"
        >
          새 배너 추가
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded font-light">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        {banners.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 font-light">등록된 배너가 없습니다</p>
            <Link
              href="/admin/banners/new"
              className="mt-4 inline-block text-gray-900 hover:text-gray-600 font-light"
            >
              첫 번째 배너를 추가해보세요
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    미리보기
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    순서
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-20 h-12 rounded overflow-hidden">
                        <Image
                          src={`/api/images/banners/${banner.id}`}
                          alt={banner.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-light text-gray-900">{banner.title}</div>
                        {banner.subtitle && (
                          <div className="text-sm text-gray-500 font-light">{banner.subtitle}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-light">
                      {banner.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleBannerStatus(banner.id, banner.active)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-light ${
                          banner.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {banner.active ? '활성' : '비활성'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-light">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/banners/${banner.id}/edit`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          수정
                        </Link>
                        <button
                          onClick={() => downloadImage(`/api/images/banners/${banner.id}`, `banner-${banner.id}.webp`)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          다운로드
                        </button>
                        <button
                          onClick={() => deleteBanner(banner.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}