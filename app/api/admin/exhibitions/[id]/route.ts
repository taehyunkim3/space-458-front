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
    const exhibition = await prisma.exhibition.findUnique({
      where: { id: parseInt(id) }
    });

    if (!exhibition) {
      return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 });
    }

    return NextResponse.json(exhibition);
  } catch (error) {
    console.error('Error fetching exhibition:', error);
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
    const artist = formData.get('artist') as string;
    const startDate = new Date(formData.get('startDate') as string);
    const endDate = new Date(formData.get('endDate') as string);
    const status = formData.get('status') as string;
    const description = formData.get('description') as string;
    const curator = formData.get('curator') as string || null;
    const posterFile = formData.get('poster') as File;

    if (!title || !artist || !description) {
      return NextResponse.json({ 
        error: 'Title, artist, and description are required' 
      }, { status: 400 });
    }

    // Get existing exhibition
    const existingExhibition = await prisma.exhibition.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingExhibition) {
      return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 });
    }

    let posterPath = existingExhibition.poster;

    // If new poster is uploaded, process it and delete old one
    if (posterFile && posterFile.size > 0) {
      posterPath = await processImageUpload(posterFile, 'exhibitions', 800, 90);
      
      // Delete old poster
      if (existingExhibition.poster.startsWith('/uploads/')) {
        await deleteImage(existingExhibition.poster);
      }
    }

    // Process additional images if any
    const images: string[] = [...existingExhibition.images];
    const imageFiles = formData.getAll('images') as File[];
    
    for (const imageFile of imageFiles) {
      if (imageFile.size > 0) {
        const imagePath = await processImageUpload(imageFile, 'exhibitions', 1200, 85);
        images.push(imagePath);
      }
    }

    const exhibition = await prisma.exhibition.update({
      where: { id: parseInt(id) },
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

    return NextResponse.json(exhibition);
  } catch (error: any) {
    console.error('Error updating exhibition:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
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
    
    // Get exhibition to delete associated images
    const exhibition = await prisma.exhibition.findUnique({
      where: { id: parseInt(id) }
    });

    if (!exhibition) {
      return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 });
    }

    // Delete poster if it's an upload
    if (exhibition.poster.startsWith('/uploads/')) {
      await deleteImage(exhibition.poster);
    }

    // Delete additional images
    for (const imagePath of exhibition.images) {
      if (imagePath.startsWith('/uploads/')) {
        await deleteImage(imagePath);
      }
    }

    // Delete exhibition from database
    await prisma.exhibition.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Exhibition deleted successfully' });
  } catch (error) {
    console.error('Error deleting exhibition:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}