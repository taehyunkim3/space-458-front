import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'poster'; // poster or image index
    
    const exhibition = await prisma.exhibition.findUnique({
      where: { id: parseInt(id) },
      select: {
        posterData: true,
        posterMimeType: true,
        imagesData: true,
        imagesMimeTypes: true,
      }
    });

    if (!exhibition) {
      return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 });
    }

    if (type === 'poster') {
      if (!exhibition.posterData) {
        return NextResponse.json({ error: 'Poster not found' }, { status: 404 });
      }
      
      return new NextResponse(Buffer.from(exhibition.posterData), {
        headers: {
          'Content-Type': exhibition.posterMimeType || 'image/webp',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } else {
      // Handle gallery images by index
      const imageIndex = parseInt(type);
      if (isNaN(imageIndex) || !exhibition.imagesData || !exhibition.imagesData[imageIndex]) {
        return NextResponse.json({ error: 'Image not found' }, { status: 404 });
      }
      
      return new NextResponse(Buffer.from(exhibition.imagesData[imageIndex]), {
        headers: {
          'Content-Type': exhibition.imagesMimeTypes?.[imageIndex] || 'image/webp',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  } catch (error) {
    console.error('Error serving exhibition image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}