export interface Exhibition {
  id: number;
  title: string;
  artist: string;
  startDate: string;
  endDate: string;
  status: 'current' | 'upcoming' | 'past';
  poster: string;
  images: string[];
  description: string;
  curator?: string;
}

export const exhibitions: Exhibition[] = [
  {
    id: 1,
    title: '경계의 확장',
    artist: '김예진',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    status: 'current',
    poster: 'https://via.placeholder.com/400x600/f3f4f6/6b7280?text=Exhibition+Poster',
    images: [
      'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=Exhibition+View+1',
      'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=Exhibition+View+2',
      'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=Exhibition+View+3'
    ],
    description: '현대 사회의 경계와 한계를 탐구하는 김예진 작가의 개인전입니다.',
    curator: '이미나'
  },
  {
    id: 2,
    title: '시간의 흔적',
    artist: '박준호',
    startDate: '2025-01-15',
    endDate: '2025-02-15',
    status: 'upcoming',
    poster: 'https://via.placeholder.com/400x600/f3f4f6/6b7280?text=Exhibition+Poster+2',
    images: [
      'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=Exhibition+View+4',
      'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=Exhibition+View+5'
    ],
    description: '시간의 변화와 그 흔적을 조형언어로 표현한 박준호 작가의 신작 전시입니다.'
  },
  {
    id: 3,
    title: '내면의 풍경',
    artist: '정수연',
    startDate: '2024-10-01',
    endDate: '2024-11-30',
    status: 'past',
    poster: 'https://via.placeholder.com/400x600/f3f4f6/6b7280?text=Exhibition+Poster+3',
    images: [
      'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=Exhibition+View+6',
      'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=Exhibition+View+7',
      'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=Exhibition+View+8',
      'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=Exhibition+View+9'
    ],
    description: '내면 세계의 복잡하고 미묘한 감정들을 시각화한 정수연 작가의 회화 작품들을 선보입니다.'
  }
];