'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
}

export default function RecentExhibitionsDB() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await fetch('/api/exhibitions');
        if (response.ok) {
          const data = await response.json();
          // Show current and upcoming exhibitions first
          const currentExhibitions = data.filter((ex: Exhibition) => ex.status === 'CURRENT');
          const upcomingExhibitions = data.filter((ex: Exhibition) => ex.status === 'UPCOMING');
          const recentExhibitions = [...currentExhibitions, ...upcomingExhibitions].slice(0, 3);
          setExhibitions(recentExhibitions);
        }
      } catch (error) {
        console.error('Error fetching exhibitions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CURRENT':
        return '현재 전시';
      case 'UPCOMING':
        return '예정 전시';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light tracking-wider mb-4">
              EXHIBITIONS
            </h2>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light tracking-wider mb-4">
            EXHIBITIONS
          </h2>
          <p className="text-gray-600 font-light">
            최신 전시와 예정된 전시를 만나보세요
          </p>
        </div>

        {exhibitions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 font-light">현재 진행 중인 전시가 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {exhibitions.map((exhibition) => (
                <div key={exhibition.id} className="group">
                  <Link href={`/exhibitions/${exhibition.id}`}>
                    <div className="relative aspect-[3/4] mb-4 overflow-hidden">
                      <Image
                        src={exhibition.poster}
                        alt={exhibition.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-black/70 text-white px-3 py-1 text-xs font-light tracking-wide">
                          {getStatusText(exhibition.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-light tracking-wide group-hover:text-gray-600 transition-colors">
                        {exhibition.title}
                      </h3>
                      <p className="text-gray-600 text-sm font-light">
                        {exhibition.artist}
                      </p>
                      <p className="text-gray-500 text-sm font-light">
                        {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
                      </p>
                      {exhibition.curator && (
                        <p className="text-gray-500 text-xs font-light">
                          기획: {exhibition.curator}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/exhibitions"
                className="inline-block px-8 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300 text-sm tracking-widest font-light"
              >
                모든 전시 보기
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}