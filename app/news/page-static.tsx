'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { newsItems } from '../data/news';

export default function NewsPage() {
  const [filter, setFilter] = useState<'all' | 'notice' | 'press' | 'event' | 'workshop'>('all');

  const filteredNews = filter === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.type === filter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'notice':
        return '공지사항';
      case 'press':
        return '보도자료';
      case 'event':
        return '이벤트';
      case 'workshop':
        return '워크숍';
      default:
        return '';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'notice':
        return 'bg-blue-600';
      case 'press':
        return 'bg-green-600';
      case 'event':
        return 'bg-purple-600';
      case 'workshop':
        return 'bg-orange-600';
      default:
        return 'bg-gray-600';
    }
  };

  const filterButtons = [
    { key: 'all', label: '전체' },
    { key: 'notice', label: '공지사항' },
    { key: 'press', label: '보도자료' },
    { key: 'event', label: '이벤트' },
    { key: 'workshop', label: '워크숍' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <Image
          src="https://via.placeholder.com/1920x800/f3f4f6/6b7280?text=News+Events"
          alt="News & Events"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-light text-white tracking-wider">
            NEWS & EVENTS
          </h1>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {filterButtons.map((button) => (
              <button
                key={button.key}
                onClick={() => setFilter(button.key as typeof filter)}
                className={`px-6 py-2 text-sm font-light tracking-wide transition-colors duration-300 ${
                  filter === button.key
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900'
                }`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured News */}
      {filter === 'all' && (
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-light tracking-wider mb-4">
                주요 소식
              </h2>
              <p className="text-gray-600 font-light">
                스페이스458의 주요 소식을 만나보세요
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {newsItems.filter(item => item.featured).map((item) => (
                <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {item.image && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`${getTypeColor(item.type)} text-white px-3 py-1 text-xs font-light tracking-wide`}>
                          {getTypeText(item.type)}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-gray-500 text-sm font-light">
                        {formatDate(item.date)}
                      </p>
                      {!item.image && (
                        <span className={`${getTypeColor(item.type)} text-white px-3 py-1 text-xs font-light tracking-wide`}>
                          {getTypeText(item.type)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-light tracking-wide mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 font-light leading-relaxed">
                      {item.content}
                    </p>
                    {item.link && (
                      <div className="mt-4">
                        <Link
                          href={item.link}
                          className="text-gray-900 hover:text-gray-600 transition-colors font-light text-sm tracking-wide"
                        >
                          자세히 보기 →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All News */}
      <section className={`py-20 ${filter === 'all' ? 'bg-white' : 'bg-gray-50'}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filter !== 'all' && (
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-light tracking-wider mb-4">
                {filterButtons.find(b => b.key === filter)?.label}
              </h2>
            </div>
          )}

          {filteredNews.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 font-light">해당하는 소식이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {(filter === 'all' ? filteredNews.filter(item => !item.featured) : filteredNews).map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row gap-6">
                    {item.image && (
                      <div className="md:w-1/3">
                        <div className="relative aspect-[16/9] overflow-hidden rounded">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      </div>
                    )}
                    <div className={`${item.image ? 'md:w-2/3' : 'w-full'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className={`${getTypeColor(item.type)} text-white px-3 py-1 text-xs font-light tracking-wide`}>
                            {getTypeText(item.type)}
                          </span>
                          <p className="text-gray-500 text-sm font-light">
                            {formatDate(item.date)}
                          </p>
                        </div>
                      </div>
                      <h3 className="text-xl font-light tracking-wide mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-700 font-light leading-relaxed mb-4">
                        {item.content}
                      </p>
                      {item.link && (
                        <Link
                          href={item.link}
                          className="text-gray-900 hover:text-gray-600 transition-colors font-light text-sm tracking-wide"
                        >
                          자세히 보기 →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}