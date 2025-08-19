export const GALLERY_INFO = {
  name: "스페이스 458",
  description:
    "동시대 예술 플랫폼으로, 예술이 머무는 장소를 넘어서 지속적으로 질문하고 움직이는 살아있는 공간입니다.",
  address: {
    oneWord: "마포구 서교동",
    street: "서울특별시 마포구 동교로17길 37",
    postalCode: "04002",
  },
  contact: {
    phone: "010-9724-4580",
    // fax: '02-1234-5679',
    email: "space458seoul@gmail.com",
  },
  hours: {
    weekdays: "화요일 - 일요일: 10:00 - 19:00",
    closed: "월요일 휴관 (공휴일 제외)",
    lastEntry: "입장 마감: 18:30",
  },
  transportation: {
    subway: "지하철: 6호선 망원역 도보 8분, 홍대입구역 도보 10분",
    bus: "버스: 마포15번, 마포8번 희성교회 하차",
    parking: "주차: 갤러리 전용 주차장 이용 가능",
  },
  socialMedia: {
    instagramUrl: "https://www.instagram.com/space458seoul",
    instagramId: "@space458seoul",
  },
} as const;

export type GalleryInfo = typeof GALLERY_INFO;
