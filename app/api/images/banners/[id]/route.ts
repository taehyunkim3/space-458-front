import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const banner = await prisma.banner.findUnique({
      where: { id: parseInt(id) },
      select: {
        imageData: true,
        imageMimeType: true,
      }
    });

    if (!banner || !banner.imageData) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return new NextResponse(Buffer.from(banner.imageData), {
      headers: {
        'Content-Type': banner.imageMimeType || 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving banner image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}