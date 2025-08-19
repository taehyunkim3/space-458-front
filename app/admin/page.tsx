import { prisma } from '../lib/prisma';
import Link from 'next/link';

async function getDashboardStats() {
  const [bannerCount, exhibitionCount, newsCount] = await Promise.all([
    prisma.banner.count(),
    prisma.exhibition.count(),
    prisma.news.count(),
  ]);

  const recentExhibitions = await prisma.exhibition.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, artist: true, status: true }
  });

  const recentNews = await prisma.news.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, type: true, date: true }
  });

  return {
    stats: { bannerCount, exhibitionCount, newsCount },
    recentExhibitions,
    recentNews
  };
}

export default async function AdminDashboard() {
  const { stats, recentExhibitions, recentNews } = await getDashboardStats();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CURRENT': return '현재 전시';
      case 'UPCOMING': return '예정 전시';
      case 'PAST': return '지난 전시';
      default: return status;
    }
  };

  const getNewsTypeText = (type: string) => {
    switch (type) {
      case 'NOTICE': return '공지사항';
      case 'PRESS': return '보도자료';
      case 'EVENT': return '이벤트';
      case 'WORKSHOP': return '워크숍';
      default: return type;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light tracking-wider text-gray-900">
          관리자 대시보드
        </h1>
        <p className="mt-2 text-gray-600 font-light">
          Space 458 갤러리 콘텐츠를 관리하세요
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-light text-gray-600">배너</p>
              <p className="text-2xl font-light text-gray-900">{stats.bannerCount}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/banners" className="text-sm text-blue-600 hover:text-blue-800 font-light">
              관리하기 →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-light text-gray-600">전시</p>
              <p className="text-2xl font-light text-gray-900">{stats.exhibitionCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/exhibitions" className="text-sm text-green-600 hover:text-green-800 font-light">
              관리하기 →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-light text-gray-600">뉴스</p>
              <p className="text-2xl font-light text-gray-900">{stats.newsCount}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/news" className="text-sm text-purple-600 hover:text-purple-800 font-light">
              관리하기 →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Exhibitions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-light text-gray-900">최근 전시</h2>
              <Link href="/admin/exhibitions" className="text-sm text-gray-600 hover:text-gray-900 font-light">
                전체 보기
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentExhibitions.length === 0 ? (
                <p className="text-gray-500 font-light text-sm">등록된 전시가 없습니다.</p>
              ) : (
                recentExhibitions.map((exhibition) => (
                  <div key={exhibition.id} className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="text-sm font-light text-gray-900">{exhibition.title}</h3>
                      <p className="text-xs text-gray-500 font-light">{exhibition.artist}</p>
                    </div>
                    <span className="text-xs text-gray-500 font-light">
                      {getStatusText(exhibition.status)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent News */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-light text-gray-900">최근 뉴스</h2>
              <Link href="/admin/news" className="text-sm text-gray-600 hover:text-gray-900 font-light">
                전체 보기
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentNews.length === 0 ? (
                <p className="text-gray-500 font-light text-sm">등록된 뉴스가 없습니다.</p>
              ) : (
                recentNews.map((news) => (
                  <div key={news.id} className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="text-sm font-light text-gray-900">{news.title}</h3>
                      <p className="text-xs text-gray-500 font-light">
                        {getNewsTypeText(news.type)} • {formatDate(news.date)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-light text-gray-900 mb-6">빠른 작업</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/banners/new"
            className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-center"
          >
            <div className="text-blue-600 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-sm font-light text-gray-900">새 배너 추가</p>
          </Link>

          <Link
            href="/admin/exhibitions/new"
            className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-center"
          >
            <div className="text-green-600 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-sm font-light text-gray-900">새 전시 추가</p>
          </Link>

          <Link
            href="/admin/news/new"
            className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-center"
          >
            <div className="text-purple-600 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-sm font-light text-gray-900">새 뉴스 추가</p>
          </Link>

          <Link
            href="/admin/gallery-info"
            className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-center"
          >
            <div className="text-orange-600 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm font-light text-gray-900">갤러리 정보</p>
          </Link>
        </div>
      </div>
    </div>
  );
}