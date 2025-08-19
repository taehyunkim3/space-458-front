'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NewsItem {
  id: number;
  title: string;
  type: 'NOTICE' | 'PRESS' | 'EVENT' | 'WORKSHOP';
  date: string;
  content: string;
  image?: string;
  link?: string;
  featured: boolean;
  createdAt: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/admin/news');
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      setNews(data);
    } catch (error) {
      setError('뉴스를 불러오는데 실패했습니다.');
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNews = async (id: number) => {
    if (!confirm('정말로 이 뉴스를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete news');

      setNews(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      setError('뉴스 삭제에 실패했습니다.');
      console.error('Error deleting news:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'NOTICE': return '공지사항';
      case 'PRESS': return '보도자료';
      case 'EVENT': return '이벤트';
      case 'WORKSHOP': return '워크숍';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'NOTICE': return 'bg-blue-100 text-blue-800';
      case 'PRESS': return 'bg-green-100 text-green-800';
      case 'EVENT': return 'bg-purple-100 text-purple-800';
      case 'WORKSHOP': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchNews();
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
            뉴스 관리
          </h1>
          <p className="mt-2 text-gray-600 font-light">
            갤러리 뉴스와 이벤트를 관리하세요
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="bg-gray-900 text-white px-6 py-3 hover:bg-gray-800 transition-colors font-light tracking-wide"
        >
          새 뉴스 추가
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded font-light">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        {news.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-gray-500 font-light">등록된 뉴스가 없습니다</p>
            <Link
              href="/admin/news/new"
              className="mt-4 inline-block text-gray-900 hover:text-gray-600 font-light"
            >
              첫 번째 뉴스를 추가해보세요
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    타입
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    날짜
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    주요 소식
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {news.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {item.image && (
                          <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-light text-gray-900 line-clamp-2">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-500 font-light mt-1 line-clamp-1">
                            {item.content.substring(0, 100)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-light ${getTypeColor(item.type)}`}>
                        {getTypeText(item.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-light">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.featured ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-light bg-yellow-100 text-yellow-800">
                          주요 소식
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-light">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/news/${item.id}/edit`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          수정
                        </Link>
                        <button
                          onClick={() => deleteNews(item.id)}
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