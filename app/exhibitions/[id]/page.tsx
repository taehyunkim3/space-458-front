import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { exhibitions } from '../../data/exhibitions';

interface ExhibitionDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return exhibitions.map((exhibition) => ({
    id: exhibition.id.toString(),
  }));
}

export async function generateMetadata({ params }: ExhibitionDetailPageProps) {
  const { id } = await params;
  const exhibition = exhibitions.find(ex => ex.id === parseInt(id));
  
  if (!exhibition) {
    return {
      title: 'Exhibition Not Found | Space 458',
    };
  }

  return {
    title: `${exhibition.title} | Space 458`,
    description: exhibition.description,
  };
}

export default async function ExhibitionDetailPage({ params }: ExhibitionDetailPageProps) {
  const { id } = await params;
  const exhibition = exhibitions.find(ex => ex.id === parseInt(id));

  if (!exhibition) {
    notFound();
  }

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
      case 'current':
        return '현재 전시';
      case 'upcoming':
        return '예정 전시';
      case 'past':
        return '지난 전시';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-green-600';
      case 'upcoming':
        return 'bg-blue-600';
      case 'past':
        return 'bg-gray-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="py-6 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/exhibitions"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors font-light text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            전시 목록으로 돌아가기
          </Link>
        </div>
      </div>

      {/* Exhibition Header */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Poster */}
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={`/api/images/exhibitions/${exhibition.id}?type=poster`}
                alt={exhibition.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute top-4 left-4">
                <span className={`${getStatusColor(exhibition.status)} text-white px-4 py-2 text-sm font-light tracking-wide`}>
                  {getStatusText(exhibition.status)}
                </span>
              </div>
            </div>

            {/* Exhibition Info */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-4">
                  {exhibition.title}
                </h1>
                <p className="text-xl text-gray-600 font-light mb-2">
                  {exhibition.artist}
                </p>
                {exhibition.curator && (
                  <p className="text-gray-500 font-light">
                    기획: {exhibition.curator}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-light tracking-wide mb-2">전시 기간</h3>
                  <p className="text-gray-700 font-light">
                    {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-light tracking-wide mb-2">장소</h3>
                  <p className="text-gray-700 font-light">
                    Space 458 Gallery<br />
                    서울특별시 강남구 청담동 458
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-light tracking-wide mb-2">관람료</h3>
                  <p className="text-gray-700 font-light">무료</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-light tracking-wide mb-4">전시 소개</h3>
                <p className="text-gray-700 font-light leading-relaxed">
                  {exhibition.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exhibition Images */}
      {exhibition.images.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-light tracking-wider mb-4">
                전시 전경
              </h2>
              <p className="text-gray-600 font-light">
                전시 공간에서의 작품들을 감상해보세요
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {exhibition.images.map((image, index) => (
                <div key={index} className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={`/api/images/exhibitions/${exhibition.id}?type=${index}`}
                    alt={`${exhibition.title} 전시 전경 ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Actions */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-light tracking-wider mb-8">
            더 많은 정보
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300 text-sm tracking-wide font-light"
            >
              갤러리 방문 문의
            </Link>
            <Link
              href="/exhibitions"
              className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors duration-300 text-sm tracking-wide font-light"
            >
              다른 전시 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}