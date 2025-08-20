"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Exhibition {
  id: number;
  title: string;
  artist: string;
  startDate: string;
  endDate: string;
  status: "CURRENT" | "UPCOMING" | "PAST";
  poster: string;
  description: string;
  curator?: string;
}

export default function ExhibitionsPageDB() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [filter, setFilter] = useState<"all" | "CURRENT" | "UPCOMING" | "PAST">(
    "all"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await fetch("/api/exhibitions");
        if (response.ok) {
          const data = await response.json();
          setExhibitions(data);
        }
      } catch (error) {
        console.error("Error fetching exhibitions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  const filteredExhibitions =
    filter === "all"
      ? exhibitions
      : exhibitions.filter((ex) => ex.status === filter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "CURRENT":
        return "현재 전시";
      case "UPCOMING":
        return "예정 전시";
      case "PAST":
        return "지난 전시";
      default:
        return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CURRENT":
        return "bg-green-600";
      case "UPCOMING":
        return "bg-blue-600";
      case "PAST":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  const filterButtons = [
    { key: "all", label: "전체" },
    { key: "CURRENT", label: "현재 전시" },
    { key: "UPCOMING", label: "예정 전시" },
    { key: "PAST", label: "지난 전시" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <section className="relative h-96 overflow-hidden bg-gray-100 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-light text-gray-900 tracking-wider">
            EXHIBITIONS
          </h1>
        </section>
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-light">
              전시 정보를 불러오는 중...
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <Image
          src="/images/out-1.jpg.webp"
          alt="Exhibitions"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-light text-white tracking-wider">
            EXHIBITIONS
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
                    ? "bg-gray-900 text-white"
                    : "border border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900"
                }`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Exhibitions Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredExhibitions.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 font-light">
                해당하는 전시가 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredExhibitions.map((exhibition) => (
                <div key={exhibition.id} className="group">
                  <Link href={`/exhibitions/${exhibition.id}`}>
                    <div className="relative aspect-[3/4] mb-6 overflow-hidden">
                      <Image
                        src={`/api/images/exhibitions/${exhibition.id}?type=poster`}
                        alt={exhibition.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-4 left-4">
                        <span
                          className={`${getStatusColor(
                            exhibition.status
                          )} text-white px-3 py-1 text-xs font-light tracking-wide`}
                        >
                          {getStatusText(exhibition.status)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-light tracking-wide group-hover:text-gray-600 transition-colors">
                        {exhibition.title}
                      </h3>
                      <p className="text-gray-600 font-light">
                        {exhibition.artist}
                      </p>
                      <p className="text-gray-500 text-sm font-light">
                        {formatDate(exhibition.startDate)} -{" "}
                        {formatDate(exhibition.endDate)}
                      </p>
                      {exhibition.curator && (
                        <p className="text-gray-500 text-sm font-light">
                          기획: {exhibition.curator}
                        </p>
                      )}
                      <p className="text-gray-700 text-sm font-light leading-relaxed line-clamp-3">
                        {exhibition.description}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
