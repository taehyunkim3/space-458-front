'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Exhibition {
  id: number;
  title: string;
  artist: string;
  startDate: string;
  endDate: string;
  status: 'CURRENT' | 'UPCOMING' | 'PAST';
  poster: string;
  description: string;
  curator?: string;
  createdAt: string;
}

export default function ExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchExhibitions = async () => {
    try {
      const response = await fetch('/api/admin/exhibitions');
      if (!response.ok) throw new Error('Failed to fetch exhibitions');
      const data = await response.json();
      setExhibitions(data);
    } catch (error) {
      setError('전시를 불러오는데 실패했습니다.');
      console.error('Error fetching exhibitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteExhibition = async (id: number) => {
    if (!confirm('정말로 이 전시를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/admin/exhibitions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete exhibition');

      setExhibitions(prev => prev.filter(exhibition => exhibition.id !== id));
    } catch (error) {
      setError('전시 삭제에 실패했습니다.');
      console.error('Error deleting exhibition:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CURRENT': return '현재 전시';
      case 'UPCOMING': return '예정 전시';
      case 'PAST': return '지난 전시';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CURRENT': return 'bg-green-100 text-green-800';
      case 'UPCOMING': return 'bg-blue-100 text-blue-800';
      case 'PAST': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchExhibitions();
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
            전시 관리
          </h1>
          <p className="mt-2 text-gray-600 font-light">
            갤러리 전시 정보를 관리하세요
          </p>
        </div>
        <Link
          href="/admin/exhibitions/new"
          className="bg-gray-900 text-white px-6 py-3 hover:bg-gray-800 transition-colors font-light tracking-wide"
        >
          새 전시 추가
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded font-light">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        {exhibitions.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-500 font-light">등록된 전시가 없습니다</p>
            <Link
              href="/admin/exhibitions/new"
              className="mt-4 inline-block text-gray-900 hover:text-gray-600 font-light"
            >
              첫 번째 전시를 추가해보세요
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    포스터
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    전시 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    기간
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
                {exhibitions.map((exhibition) => (
                  <tr key={exhibition.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-16 h-24 rounded overflow-hidden">
                        <Image
                          src={exhibition.poster}
                          alt={exhibition.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-light text-gray-900">{exhibition.title}</div>
                        <div className="text-sm text-gray-500 font-light">{exhibition.artist}</div>
                        {exhibition.curator && (
                          <div className="text-xs text-gray-400 font-light">기획: {exhibition.curator}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-light">
                      <div>
                        <div>{formatDate(exhibition.startDate)}</div>
                        <div className="text-xs text-gray-500">~ {formatDate(exhibition.endDate)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-light ${getStatusColor(exhibition.status)}`}>
                        {getStatusText(exhibition.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-light">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/exhibitions/${exhibition.id}/edit`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          수정
                        </Link>
                        <button
                          onClick={() => deleteExhibition(exhibition.id)}
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