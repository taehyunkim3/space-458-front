import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import { processImageUpload, parseFormData, deleteImage } from '../../../../lib/upload';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const news = await prisma.news.findUnique({
      where: { id: parseInt(id) }
    });

    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
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

    // Get existing news
    const existingNews = await prisma.news.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingNews) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    let updateData: {
      title: string;
      type: 'NOTICE' | 'PRESS' | 'EVENT' | 'WORKSHOP';
      date: Date;
      content: string;
      link?: string | null;
      featured: boolean;
      imageData?: Buffer;
      imageMimeType?: string;
    } = {
      title,
      type: type as 'NOTICE' | 'PRESS' | 'EVENT' | 'WORKSHOP',
      date,
      content,
      link,
      featured
    };

    // If new image is uploaded, process it
    if (imageFile && imageFile.size > 0) {
      const { imageData, mimeType } = await processImageUpload(imageFile, 'news', 1200, 85);
      updateData.imageData = imageData;
      updateData.imageMimeType = mimeType;
    }

    const news = await prisma.news.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return NextResponse.json(news);
  } catch (error: unknown) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    // Get news to delete associated image
    const news = await prisma.news.findUnique({
      where: { id: parseInt(id) }
    });

    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    // Delete image if it's an upload
    if (news.image && news.image.startsWith('/uploads/')) {
      await deleteImage();
    }

    // Delete news from database
    await prisma.news.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}