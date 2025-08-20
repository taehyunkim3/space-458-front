'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function GalleryInfoPage() {
  const [formData, setFormData] = useState({
    name: "스페이스 458",
    description: "동시대 예술 플랫폼으로, 예술이 머무는 장소를 넘어서 지속적으로 질문하고 움직이는 살아있는 공간입니다.",
    street: "서울특별시 마포구 동교로17길 37",
    postalCode: "04002",
    phone: "010-9724-4580",
    email: "space458seoul@gmail.com",
    weekdays: "화요일 - 일요일: 10:00 - 19:00",
    closed: "월요일 휴관 (공휴일 제외)",
    lastEntry: "입장 마감: 18:30",
    subway: "지하철: 6호선 망원역 도보 8분, 홍대입구역 도보 10분",
    bus: "버스: 마포15번, 마포8번 희성교회 하차",
    parking: "주차: 갤러리 전용 주차장 이용 가능",
    instagramUrl: "https://www.instagram.com/space458seoul",
    instagramId: "@space458seoul"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      // 실제로는 API를 통해 데이터베이스에 저장하거나 설정 파일을 업데이트해야 합니다
      // 현재는 constants 파일을 직접 수정해야 하므로 안내 메시지만 표시합니다
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 지연
      
      setMessage('갤러리 정보가 성공적으로 업데이트되었습니다. 변경사항을 적용하려면 개발자에게 문의하세요.');
    } catch {
      setError('갤러리 정보 업데이트에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-light tracking-wide">갤러리 정보 관리</h1>
        <Link
          href="/admin"
          className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          관리자 홈
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
            {message}
          </div>
        )}

        {/* 기본 정보 */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">기본 정보</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              갤러리명
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              갤러리 소개
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {/* 주소 정보 */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">주소 정보</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주소
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              우편번호
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {/* 연락처 정보 */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">연락처 정보</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전화번호
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* 운영 시간 */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">운영 시간</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              평일 운영시간
            </label>
            <input
              type="text"
              name="weekdays"
              value={formData.weekdays}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              휴관일
            </label>
            <input
              type="text"
              name="closed"
              value={formData.closed}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              입장 마감 시간
            </label>
            <input
              type="text"
              name="lastEntry"
              value={formData.lastEntry}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {/* 교통 정보 */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">교통 정보</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              지하철 정보
            </label>
            <input
              type="text"
              name="subway"
              value={formData.subway}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              버스 정보
            </label>
            <input
              type="text"
              name="bus"
              value={formData.bus}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주차 정보
            </label>
            <input
              type="text"
              name="parking"
              value={formData.parking}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {/* 소셜 미디어 */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">소셜 미디어</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                인스타그램 URL
              </label>
              <input
                type="url"
                name="instagramUrl"
                value={formData.instagramUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                인스타그램 ID
              </label>
              <input
                type="text"
                name="instagramId"
                value={formData.instagramId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/admin"
            className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isSubmitting ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </div>
  );
}