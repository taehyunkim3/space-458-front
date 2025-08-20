"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GALLERY_INFO } from "../constants/galleryInfo";
import emailjs from "@emailjs/browser";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "rental",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getInquiryTypeText = (type: string): string => {
    switch (type) {
      case "general":
        return "일반 문의";
      case "exhibition":
        return "전시 관련";
      case "rental":
        return "대관 문의";
      case "collaboration":
        return "협업 제안";
      case "workshop":
        return "워크숍 문의";
      case "press":
        return "언론 문의";
      default:
        return type;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // EmailJS 클라이언트 사이드 호출
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        from_phone: formData.phone || "연락처 미제공",
        inquiry_type: getInquiryTypeText(formData.type),
        subject: formData.subject,
        message: formData.message,
        to_email: "space458seoul@gmail.com",
      };

      const response = await emailjs.send(
        "service_y7vn47b",
        "template_6ws6auo",
        templateParams,
        "DiKPAnIMoQ7MkCWqU"
      );

      console.log("Email sent successfully:", response);

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        type: "general",
        subject: "",
        message: "",
      });
    } catch (err: unknown) {
      console.error("Email sending failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <Image
          src="/images/out-1.jpg.webp"
          alt="Contact"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-light text-white tracking-wider">
            CONTACT
          </h1>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Details */}
            <div>
              <h2 className="text-3xl md:text-4xl font-light tracking-wider mb-8">
                방문 정보
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-light tracking-wide mb-4">
                    주소
                  </h3>
                  <p className="text-gray-700 font-light leading-relaxed">
                    {GALLERY_INFO.address.street}
                    <br />
                    {GALLERY_INFO.name}
                    <br />
                    우편번호: {GALLERY_INFO.address.postalCode}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-light tracking-wide mb-4">
                    연락처
                  </h3>
                  <div className="space-y-2 text-gray-700 font-light">
                    <p>전화: {GALLERY_INFO.contact.phone}</p>
                    {/* <p>팩스: {GALLERY_INFO.contact.fax}</p> */}
                    <p>이메일: {GALLERY_INFO.contact.email}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-light tracking-wide mb-4">
                    운영 시간
                  </h3>
                  <div className="space-y-2 text-gray-700 font-light">
                    <p>{GALLERY_INFO.hours.weekdays}</p>
                    <p>{GALLERY_INFO.hours.closed}</p>
                    <p className="text-sm text-gray-500">
                      {GALLERY_INFO.hours.lastEntry}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-light tracking-wide mb-4">
                    교통
                  </h3>
                  <div className="space-y-2 text-gray-700 font-light">
                    <p>
                      <strong>지하철:</strong>{" "}
                      {GALLERY_INFO.transportation.subway.replace(
                        "지하철: ",
                        ""
                      )}
                    </p>
                    <p>
                      <strong>버스:</strong>{" "}
                      {GALLERY_INFO.transportation.bus.replace("버스: ", "")}
                    </p>
                    <p>
                      <strong>주차:</strong>{" "}
                      {GALLERY_INFO.transportation.parking.replace(
                        "주차: ",
                        ""
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-light tracking-wide mb-4">
                    소셜 미디어
                  </h3>
                  <div className="flex space-x-4">
                    <Link
                      href={GALLERY_INFO.socialMedia.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </Link>
                    {/* <Link
                      href={GALLERY_INFO.socialMedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </Link> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl md:text-4xl font-light tracking-wider mb-8">
                문의하기
              </h2>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <svg
                    className="w-12 h-12 text-green-600 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <h3 className="text-lg font-light text-green-800 mb-2">
                    문의가 접수되었습니다
                  </h3>
                  <p className="text-green-600 font-light">
                    빠른 시일 내에 답변드리겠습니다.
                  </p>
                </div>
              ) : (
                <div>
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-red-600 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-red-600 font-light text-sm">
                          {error}
                        </p>
                      </div>
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-light text-gray-700 mb-2"
                        >
                          이름 *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors font-light"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-light text-gray-700 mb-2"
                        >
                          이메일 *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors font-light"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-light text-gray-700 mb-2"
                        >
                          연락처
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="010-1234-5678"
                          className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors font-light"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="type"
                          className="block text-sm font-light text-gray-700 mb-2"
                        >
                          문의 유형 *
                        </label>
                        <select
                          id="type"
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors font-light"
                        >
                          <option value="rental">대관 문의</option>
                          <option value="exhibition">전시 관련</option>
                          <option value="collaboration">협업 제안</option>
                          <option value="workshop">워크숍 문의</option>
                          <option value="general">일반 문의</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-light text-gray-700 mb-2"
                      >
                        제목 *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors font-light"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-light text-gray-700 mb-2"
                      >
                        메시지 *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        required
                        className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors font-light resize-vertical"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gray-900 text-white py-4 hover:bg-gray-800 transition-colors duration-300 font-light tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "전송 중..." : "문의 보내기"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light tracking-wider mb-4">
              찾아오시는 길
            </h2>
            <p className="text-gray-600 font-light">
              {GALLERY_INFO.name}은 {GALLERY_INFO.address.oneWord}에 위치하고
              있습니다
            </p>
          </div>

          {/* Map Section */}
          <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="text-center z-10">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-lg">
                <svg
                  className="w-12 h-12 text-gray-600 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <h3 className="text-lg font-light text-gray-900 mb-2">
                  {GALLERY_INFO.name}
                </h3>
                <p className="text-gray-600 font-light mb-4 text-sm">
                  {GALLERY_INFO.address.street}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="https://naver.me/5GpL93wN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors duration-300 text-sm font-light rounded"
                  >
                    네이버 지도
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </Link>
                  <Link
                    href="https://place.map.kakao.com/509706690"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-300 text-sm font-light rounded"
                  >
                    카카오맵
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </Link>
                  <Link
                    href="https://maps.app.goo.gl/CKf7JmkhhyNqhALV9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 transition-colors duration-300 text-sm font-light rounded"
                  >
                    구글 지도
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="h-full w-full bg-gradient-to-br from-blue-50 to-gray-100"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
