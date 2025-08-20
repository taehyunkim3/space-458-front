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

    const news = await prisma.news.findMany({
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
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
    const type = formData.get('type') as string;
    const date = new Date(formData.get('date') as string);
    const content = formData.get('content') as string;
    const link = formData.get('link') as string || null;
    const featured = formData.get('featured') === 'true';
    const imageFile = formData.get('image') as File;

    if (!title || !type || !content) {
      return NextResponse.json({ 
        error: 'Title, type, and content are required' 
      }, { status: 400 });
    }

    let imagePath = null;
    if (imageFile && imageFile.size > 0) {
      await processImageUpload(imageFile, 'news', 1200, 85);
      // TODO: Update to use DB BLOB storage
      imagePath = '/api/images/news/temp';
    }

    const newsItem = await prisma.news.create({
      data: {
        title,
        type: type as 'NOTICE' | 'PRESS' | 'EVENT' | 'WORKSHOP',
        date,
        content,
        image: imagePath,
        link,
        featured
      }
    });

    return NextResponse.json(newsItem, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}