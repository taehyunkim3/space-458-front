import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('Space458!@#', 12);
  
  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  });

  // Create gallery info
  await prisma.galleryInfo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Space 458',
      description: `스페이스458은 2024년 설립된 동시대 예술 플랫폼으로, 예술이 머무는 장소를 넘어서 지속적으로 질문하고 움직이는 살아있는 공간입니다.

우리는 예술이 단순한 감상의 대상이 아닌, 사회와 개인의 변화를 이끄는 동력이라고 믿습니다. 이러한 철학 아래 장르나 경력의 경계를 두지 않고, 다양한 감각과 관점을 지닌 창작자들이 자유롭게 실험하고 교차할 수 있는 열린 공간을 지향합니다.

전시, 워크숍, 협업 프로젝트, 영상 스크리닝, 아트페어 등 다양한 프로그램을 통해 동시대 시각문화 속에서 발생하는 시대적 담론과 사회적 이슈들에 반응하고, 이곳에서 예술 커뮤니티의 활력과 작가들의 성장 여정은 시각 언어로 완성되며, 각자의 실험이 새로운 가능성으로 확장됩니다.

스페이스458은 단순한 갤러리가 아니라, 살아있는 예술 커뮤니티의 중심이자 그 가능성의 증거입니다. 예술을 통해 새로운 가능성을 탐구하고 싶은 모든 이들을 스페이스458로 초대합니다.`,
      address: '서울특별시 강남구 청담동 458',
      phone: '02-1234-5678',
      email: 'gallery@space458.com',
      hours: '화요일 - 일요일: 10:00 - 19:00\n월요일 휴관 (공휴일 제외)',
      instagram: 'space458'
    },
  });

  // Create sample banners
  const banners = [
    {
      title: '현재 전시',
      subtitle: '새로운 가능성의 탐구',
      image: 'https://via.placeholder.com/1920x1080/f3f4f6/6b7280?text=Gallery+Exhibition',
      link: '/exhibitions/current',
      type: 'image',
      order: 0,
      active: true
    },
    {
      title: 'SPACE 458',
      subtitle: '동시대 예술 플랫폼',
      image: 'https://via.placeholder.com/1920x1080/f3f4f6/6b7280?text=Space+458',
      link: '/about',
      type: 'image',
      order: 1,
      active: true
    }
  ];

  for (const banner of banners) {
    await prisma.banner.upsert({
      where: { id: banner.order + 1 },
      update: banner,
      create: banner,
    });
  }

  // Create sample exhibitions
  const exhibitions = [
    {
      title: '경계의 확장',
      artist: '김예진',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-31'),
      status: 'CURRENT' as const,
      poster: 'https://via.placeholder.com/400x600/f3f4f6/6b7280?text=Exhibition+Poster',
      images: [
        'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=Exhibition+View+1',
        'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=Exhibition+View+2'
      ],
      description: '현대 사회의 경계와 한계를 탐구하는 김예진 작가의 개인전입니다.',
      curator: '이미나'
    },
    {
      title: '시간의 흔적',
      artist: '박준호',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-02-15'),
      status: 'UPCOMING' as const,
      poster: 'https://via.placeholder.com/400x600/f3f4f6/6b7280?text=Exhibition+Poster+2',
      images: [
        'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=Exhibition+View+3'
      ],
      description: '시간의 변화와 그 흔적을 조형언어로 표현한 박준호 작가의 신작 전시입니다.'
    }
  ];

  for (const exhibition of exhibitions) {
    await prisma.exhibition.upsert({
      where: { id: exhibitions.indexOf(exhibition) + 1 },
      update: exhibition,
      create: exhibition,
    });
  }

  // Create sample news
  const news = [
    {
      title: '2024 년말 특별 기획전 "경계의 확장" 개막',
      type: 'NOTICE' as const,
      date: new Date('2024-12-01'),
      content: '김예진 작가의 개인전 "경계의 확장"이 12월 1일부터 31일까지 스페이스458에서 개최됩니다. 현대 사회의 경계와 한계를 탐구하는 작품들을 만나보세요.',
      image: 'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=News+1',
      featured: true
    },
    {
      title: '스페이스458, 2024 올해의 신진 갤러리 선정',
      type: 'PRESS' as const,
      date: new Date('2024-11-15'),
      content: '한국갤러리협회에서 주관하는 "2024 올해의 신진 갤러리"에 스페이스458이 선정되었습니다.',
      featured: true
    }
  ];

  for (const newsItem of news) {
    await prisma.news.upsert({
      where: { id: news.indexOf(newsItem) + 1 },
      update: newsItem,
      create: newsItem,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });