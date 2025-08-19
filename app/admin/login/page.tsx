'use client';

import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    getSession().then((session) => {
      if (session) {
        router.push('/admin');
      }
    });
  }, [router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [remainingTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (remainingTime > 0) {
      setError(`로그인이 일시적으로 제한되었습니다. ${remainingTime}초 후 다시 시도해주세요.`);
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        username: credentials.username,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes('Too many failed attempts')) {
          setError('로그인 시도가 5회 초과되었습니다. 1분 후 다시 시도해주세요.');
          setRemainingTime(60);
        } else {
          setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
      } else if (result?.ok) {
        router.push('/admin');
        router.refresh();
      }
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-light tracking-wider text-gray-900">
            SPACE 458
          </h1>
          <h2 className="mt-6 text-xl font-light text-gray-600">
            관리자 로그인
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                아이디
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={credentials.username}
                onChange={handleChange}
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 font-light"
                placeholder="아이디"
                disabled={isLoading || remainingTime > 0}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 font-light"
                placeholder="비밀번호"
                disabled={isLoading || remainingTime > 0}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center font-light">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || remainingTime > 0}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-light text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  로그인 중...
                </>
              ) : remainingTime > 0 ? (
                `${remainingTime}초 후 다시 시도`
              ) : (
                '로그인'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 font-light">
              관리자만 접근 가능합니다
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}