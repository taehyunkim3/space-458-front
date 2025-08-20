import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET() {
  try {
    const exhibitions = await prisma.exhibition.findMany({
      orderBy: { startDate: 'desc' },
      select: {
        id: true,
        title: true,
        artist: true,
        startDate: true,
        endDate: true,
        poster: true,
        images: true,
        description: true,
        curator: true
      }
    });

    return NextResponse.json(exhibitions);
  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';