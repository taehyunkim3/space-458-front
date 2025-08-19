export interface NewsItem {
  id: number;
  title: string;
  type: 'notice' | 'press' | 'event' | 'workshop';
  date: string;
  content: string;
  image?: string;
  link?: string;
  featured?: boolean;
}

export const newsItems: NewsItem[] = [
  {
    id: 1,
    title: '2024 년말 특별 기획전 "경계의 확장" 개막',
    type: 'notice',
    date: '2024-12-01',
    content: '김예진 작가의 개인전 "경계의 확장"이 12월 1일부터 31일까지 스페이스458에서 개최됩니다. 현대 사회의 경계와 한계를 탐구하는 작품들을 만나보세요.',
    image: 'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=News+1',
    featured: true
  },
  {
    id: 2,
    title: '아트 서울 2025 참가 확정',
    type: 'press',
    date: '2024-11-28',
    content: '스페이스458이 2025년 3월 개최되는 아트 서울에 참가합니다. 갤러리 대표 작가들의 엄선된 작품들을 선보일 예정입니다.',
    image: 'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=News+2'
  },
  {
    id: 3,
    title: '작가와의 대화 - 김예진 아티스트 토크',
    type: 'event',
    date: '2024-12-15',
    content: '현재 전시 중인 "경계의 확장"의 작가 김예진과 함께하는 아티스트 토크가 12월 15일 오후 2시에 진행됩니다. 사전 예약 필수입니다.',
    link: '/events/artist-talk-1'
  },
  {
    id: 4,
    title: '청소년 미술 워크숍 "나만의 색깔 찾기"',
    type: 'workshop',
    date: '2024-12-21',
    content: '겨울방학을 맞아 청소년들을 위한 미술 워크숍을 진행합니다. 다양한 매체를 통해 자신만의 예술적 표현을 탐구해보는 시간입니다.',
    image: 'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=News+4'
  },
  {
    id: 5,
    title: '스페이스458, 2024 올해의 신진 갤러리 선정',
    type: 'press',
    date: '2024-11-15',
    content: '한국갤러리협회에서 주관하는 "2024 올해의 신진 갤러리"에 스페이스458이 선정되었습니다. 동시대 예술의 새로운 가능성을 제시한 공로를 인정받았습니다.',
    featured: true
  },
  {
    id: 6,
    title: '2025년 1월 신작 전시 예고',
    type: 'notice',
    date: '2024-11-10',
    content: '2025년 1월 15일부터 박준호 작가의 개인전 "시간의 흔적"이 개최됩니다. 시간의 변화와 그 흔적을 조형언어로 표현한 신작들을 선보입니다.'
  }
];