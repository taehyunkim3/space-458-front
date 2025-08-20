import Image from "next/image";
import Link from "next/link";
import { GALLERY_INFO } from "../constants/galleryInfo";
import GallerySpaces from "../components/GallerySpaces";

export const metadata = {
  title: "About | Space 458",
  description:
    "스페이스458은 2024년 설립된 동시대 예술 플랫폼으로, 예술이 머무는 장소를 넘어서 지속적으로 질문하고 움직이는 살아있는 공간입니다.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <Image
          src="/images/out-1.jpg.webp"
          alt="Space 458 Gallery Exterior"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-light text-white tracking-wider">
            ABOUT SPACE 458
          </h1>
        </div>
      </section>

      {/* Gallery Philosophy */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light tracking-wider mb-8">
              {GALLERY_INFO.name}
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg font-light">
                스페이스458은 2024년 설립된 동시대 예술 플랫폼으로, 예술이
                머무는 장소를 넘어서 지속적으로 질문하고 움직이는 살아있는
                공간입니다.
              </p>
              <p className="font-light">
                우리는 예술이 단순한 감상의 대상이 아닌, 사회와 개인의 변화를
                이끄는 동력이라고 믿습니다. 이러한 철학 아래 장르나 경력의
                경계를 두지 않고, 다양한 감각과 관점을 지닌 창작자들이 자유롭게
                실험하고 교차할 수 있는 열린 공간을 지향합니다.
              </p>
              <p className="font-light">
                전시, 워크숍, 협업 프로젝트, 영상 스크리닝 등 다양한 프로그램을
                통해 동시대 시각문화 속에서 발생하는 시대적 담론과 사회적
                이슈들에 반응하고, 이곳에서 예술 커뮤니티의 활력과 작가들의 성장
                여정은 시각 언어로 완성되며, 각자의 실험이 새로운 가능성으로
                확장됩니다.
              </p>
              <p className="font-light">
                스페이스458은 단순한 갤러리가 아니라, 살아있는 예술 커뮤니티의
                중심이자 그 가능성의 증거입니다. 예술을 통해 새로운 가능성을
                탐구하고 싶은 모든 이들을 스페이스458로 초대합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Spaces - Using Real Images */}
      <GallerySpaces />

      {/* Floor Plan Download */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-light tracking-wider mb-8">
              전시공간 도면
            </h3>
            <p className="text-gray-600 font-light mb-8">
              전시 기획 및 대관을 위한 상세 도면을 다운로드하실 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/downloads/space458-floorplan.pdf"
                download
                className="inline-flex items-center px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300 text-sm tracking-wide font-light"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                도면 다운로드 (PDF)
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors duration-300 text-sm tracking-wide font-light"
              >
                대관 문의하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Info */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-light tracking-wider mb-6">
                운영 정보
              </h3>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h4 className="font-light mb-2">관람 시간</h4>
                  <p className="text-sm font-light">
                    {GALLERY_INFO.hours.weekdays}
                    <br />
                    {GALLERY_INFO.hours.closed}
                  </p>
                </div>

                <div>
                  <h4 className="font-light mb-2">주차</h4>
                  <p className="text-sm font-light">
                    {GALLERY_INFO.transportation.parking}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-light tracking-wider mb-6">위치</h3>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h4 className="font-light mb-2">주소</h4>
                  <p className="text-sm font-light">
                    {GALLERY_INFO.address.street}
                    <br />
                    {GALLERY_INFO.name}
                  </p>
                </div>
                <div>
                  <h4 className="font-light mb-2">교통</h4>
                  <p className="text-sm font-light">
                    {GALLERY_INFO.transportation.subway}
                    <br />
                    {GALLERY_INFO.transportation.bus}
                  </p>
                </div>
                <div>
                  <h4 className="font-light mb-2">연락처</h4>
                  <p className="text-sm font-light">
                    전화: {GALLERY_INFO.contact.phone}
                    <br />
                    이메일: {GALLERY_INFO.contact.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
