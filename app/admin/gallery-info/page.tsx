'use client';

import { useState, useEffect } from 'react';

interface GalleryInfo {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  instagram?: string;
}

export default function GalleryInfoPage() {
  const [galleryInfo, setGalleryInfo] = useState<GalleryInfo | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    hours: '',
    instagram: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchGalleryInfo = async () => {
    try {
      const response = await fetch('/api/admin/gallery-info');
      if (!response.ok) throw new Error('Failed to fetch gallery info');
      const data = await response.json();
      
      if (data) {
        setGalleryInfo(data);
        setFormData({
          name: data.name || '',
          description: data.description || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          hours: data.hours || '',
          instagram: data.instagram || ''
        });
      }
    } catch (error) {
      setError('갤러리 정보를 불러오는데 실패했습니다.');
      console.error('Error fetching gallery info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/gallery-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update gallery info');
      }

      const updatedInfo = await response.json();
      setGalleryInfo(updatedInfo);
      setSuccess('갤러리 정보가 성공적으로 업데이트되었습니다.');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.message || '갤러리 정보 업데이트에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchGalleryInfo();
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
      <div>
        <h1 className="text-3xl font-light tracking-wider text-gray-900">
          갤러리 정보 관리
        </h1>
        <p className="mt-2 text-gray-600 font-light">
          갤러리의 기본 정보를 관리하세요
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded font-light">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded font-light">
          {success}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-light text-gray-700 mb-2">
                갤러리 이름 *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
              />
            </div>

            <div>
              <label htmlFor="instagram" className="block text-sm font-light text-gray-700 mb-2">
                인스타그램 계정
              </label>
              <input
                type="text"
                id="instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
                placeholder="space458"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-light text-gray-700 mb-2">
              갤러리 소개 *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={8}
              required
              className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="address" className="block text-sm font-light text-gray-700 mb-2">
                주소 *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-light text-gray-700 mb-2">
                전화번호 *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-light text-gray-700 mb-2">
                이메일 *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
              />
            </div>

            <div>
              <label htmlFor="hours" className="block text-sm font-light text-gray-700 mb-2">
                운영 시간 *
              </label>
              <textarea
                id="hours"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                rows={3}
                required
                className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none font-light"
                placeholder="화요일 - 일요일: 10:00 - 19:00&#10;월요일 휴관 (공휴일 제외)"
              />
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors font-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}