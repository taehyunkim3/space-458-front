import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { date: 'desc' },
      select: {
        id: true,
        title: true,
        type: true,
        date: true,
        content: true,
        image: true,
        link: true,
        featured: true
      }
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';