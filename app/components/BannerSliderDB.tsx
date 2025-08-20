'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  type: string;
  order: number;
  active: boolean;
}

export default function BannerSliderDB() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/banners');
        if (response.ok) {
          const data = await response.json();
          setBanners(data);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);


  if (loading) {
    return (
      <div className="h-screen w-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="h-screen w-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-light tracking-wider mb-4 text-gray-900">
            SPACE 458
          </h1>
          <p className="text-lg md:text-xl font-light tracking-wide text-gray-600">
            동시대 예술 플랫폼
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={banners.length > 1}
        className="h-full w-full"
      >
        {banners.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <Image
                src={`/api/images/banners/${slide.id}`}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
              
              <div className="absolute inset-0 bg-black/20" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h1 className="text-4xl md:text-6xl font-light tracking-wider mb-4">
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p className="text-lg md:text-xl font-light tracking-wide opacity-90">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.link && (
                    <Link
                      href={slide.link}
                      className="inline-block mt-8 px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 text-sm tracking-widest font-light"
                    >
                      더 보기
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {banners.length > 1 && (
        <>
          <div className="swiper-button-prev !text-white !w-8 !h-8 after:!text-xl after:!font-light"></div>
          <div className="swiper-button-next !text-white !w-8 !h-8 after:!text-xl after:!font-light"></div>
          <div className="swiper-pagination !bottom-8"></div>
        </>
      )}
    </div>
  );
}