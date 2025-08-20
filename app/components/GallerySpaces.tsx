'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SpaceImage {
  src: string;
  alt: string;
}

interface GallerySpace {
  id: string;
  title: string;
  description: string;
  images: SpaceImage[];
}

const gallerySpaces: GallerySpace[] = [
  {
    id: 'exterior',
    title: '외부 전경',
    description: '스페이스 458의 외관과 주변 환경',
    images: [
      { src: '/images/out-1.jpg.webp', alt: '스페이스 458 외부 전경' }
    ]
  },
  {
    id: '1f-gallery',
    title: '1층 갤러리 공간',
    description: '메인 전시를 위한 1층 갤러리 공간',
    images: [
      { src: '/images/1f-g-1.jpg.webp', alt: '1층 갤러리 공간 1' },
      { src: '/images/1f-g-2.jpg.webp', alt: '1층 갤러리 공간 2' },
      { src: '/images/1f-g-3.jpg.webp', alt: '1층 갤러리 공간 3' }
    ]
  },
  {
    id: '1f-lounge',
    title: '1층 라운지/전시 공간',
    description: '관람객들이 휴식을 취하고 작품을 감상할 수 있는 1층 라운지',
    images: [
      { src: '/images/1f-c-1.jpg.webp', alt: '1층 라운지/전시 공간 1' },
      { src: '/images/1f-c-2.jpg.webp', alt: '1층 라운지/전시 공간 2' },
      { src: '/images/1f-c-3.jpg.webp', alt: '1층 라운지/전시 공간 3' }
    ]
  },
  {
    id: '2f-lounge',
    title: '2층 라운지/전시 공간',
    description: '다양한 작품을 전시할 수 있는 2층 라운지 공간',
    images: [
      { src: '/images/2f-c-1.jpg.webp', alt: '2층 라운지/전시 공간 1' },
      { src: '/images/2f-c-2.jpg.webp', alt: '2층 라운지/전시 공간 2' },
      { src: '/images/2f-c-3.jpg.webp', alt: '2층 라운지/전시 공간 3' }
    ]
  },
  {
    id: '2f-classroom',
    title: '2층 강의실/전시 공간',
    description: '워크샵과 강의, 소규모 전시를 위한 2층 다목적 공간',
    images: [
      { src: '/images/2f-g-1.jpg.webp', alt: '2층 강의실/전시 공간 1' },
      { src: '/images/2f-g-2.jpg.webp', alt: '2층 강의실/전시 공간 2' },
      { src: '/images/2f-g-3.jpg.webp', alt: '2층 강의실/전시 공간 3' }
    ]
  }
];

interface CarouselProps {
  images: SpaceImage[];
  spaceTitle: string;
}

function ImageCarousel({ images, spaceTitle }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 1) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
        <Image
          src={images[0].src}
          alt={images[0].alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg group">
      <Image
        src={images[currentIndex].src}
        alt={images[currentIndex].alt}
        fill
        className="object-cover transition-opacity duration-300"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      
      {/* Navigation Arrows */}
      <button
        onClick={prevImage}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
        aria-label="이전 이미지"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextImage}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
        aria-label="다음 이미지"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`${index + 1}번째 이미지로 이동`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-sm font-light">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

export default function GallerySpaces() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light tracking-wider mb-4">
            GALLERY SPACES
          </h2>
          <p className="text-gray-600 font-light max-w-2xl mx-auto">
            스페이스 458의 다양한 공간들을 둘러보세요. 각 공간은 고유한 특성을 가지고 있으며, 
            다양한 형태의 예술 작품과 프로그램을 선보입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {gallerySpaces.map((space) => (
            <div key={space.id} className="space-y-6">
              <ImageCarousel images={space.images} spaceTitle={space.title} />
              
              <div className="space-y-3">
                <h3 className="text-xl font-light tracking-wide text-gray-900">
                  {space.title}
                </h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  {space.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}