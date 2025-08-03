import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Space 458 갤러리 홈페이지 입니다.</h1>
      <p>홈페이지 공사중입니다</p>
      <p>그동안 새로운 소식은 아래 링크를 통해 확인해주세요</p>
      <Link
        className="underline text-lg"
        href={"https://www.instagram.com/space458seoul/"}
      >
        instagram 링크
      </Link>
      <Link className="underline text-lg" href={"https://naver.me/5GpL93wN"}>
        네이버 지도 링크
      </Link>
    </div>
  );
}
