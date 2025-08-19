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

    const exhibitions = await prisma.exhibition.findMany({
      orderBy: { startDate: 'desc' }
    });

    return NextResponse.json(exhibitions);
  } catch (error) {
    console.error('Error fetching exhibitions:', error);
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
    const artist = formData.get('artist') as string;
    const startDate = new Date(formData.get('startDate') as string);
    const endDate = new Date(formData.get('endDate') as string);
    const status = formData.get('status') as string;
    const description = formData.get('description') as string;
    const curator = formData.get('curator') as string || null;
    const posterFile = formData.get('poster') as File;

    if (!title || !artist || !posterFile || !description) {
      return NextResponse.json({ 
        error: 'Title, artist, poster, and description are required' 
      }, { status: 400 });
    }

    // Process poster image
    const posterPath = await processImageUpload(posterFile, 'exhibitions', 800, 90);

    // Process additional images if any
    const images: string[] = [];
    const imageFiles = formData.getAll('images') as File[];
    
    for (const imageFile of imageFiles) {
      if (imageFile.size > 0) {
        const imagePath = await processImageUpload(imageFile, 'exhibitions', 1200, 85);
        images.push(imagePath);
      }
    }

    const exhibition = await prisma.exhibition.create({
      data: {
        title,
        artist,
        startDate,
        endDate,
        status: status as any,
        poster: posterPath,
        images,
        description,
        curator
      }
    });

    return NextResponse.json(exhibition, { status: 201 });
  } catch (error: any) {
    console.error('Error creating exhibition:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}