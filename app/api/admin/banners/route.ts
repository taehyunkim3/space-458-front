import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { processImageUpload, parseFormData } from '../../../lib/upload';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await parseFormData(request);
    
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string || null;
    const link = formData.get('link') as string || null;
    const type = formData.get('type') as string || 'image';
    const order = parseInt(formData.get('order') as string) || 0;
    const active = formData.get('active') === 'true';
    const imageFile = formData.get('image') as File;

    if (!title || !imageFile) {
      return NextResponse.json({ error: 'Title and image are required' }, { status: 400 });
    }

    // Process and upload image
    const imagePath = await processImageUpload(imageFile, 'banners', 1920, 85);

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        image: imagePath,
        link,
        type,
        order,
        active
      }
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error: any) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}