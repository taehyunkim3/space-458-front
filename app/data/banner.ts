export interface BannerSlide {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  type: 'image' | 'video';
}

export const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    title: '현재 전시',
    subtitle: '새로운 가능성의 탐구',
    image: 'https://via.placeholder.com/1920x1080/f3f4f6/6b7280?text=Gallery+Exhibition',
    link: '/exhibitions/current',
    type: 'image'
  },
  {
    id: 2,
    title: 'SPACE 458',
    subtitle: '동시대 예술 플랫폼',
    image: 'https://via.placeholder.com/1920x1080/f3f4f6/6b7280?text=Space+458',
    link: '/about',
    type: 'image'
  },
  {
    id: 3,
    title: '작가와의 만남',
    subtitle: '창작의 여정을 나누다',
    image: 'https://via.placeholder.com/1920x1080/f3f4f6/6b7280?text=Artist+Talk',
    link: '/news',
    type: 'image'
  }
];