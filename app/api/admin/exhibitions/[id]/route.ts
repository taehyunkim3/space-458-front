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

    let updateData: {
      title: string;
      artist: string;
      startDate: Date;
      endDate: Date;
      status: 'CURRENT' | 'UPCOMING' | 'PAST';
      description: string;
      curator?: string | null;
      posterData?: Buffer;
      posterMimeType?: string;
      imagesData?: Buffer[];
      imagesMimeTypes?: string[];
    } = {
      title,
      artist,
      startDate,
      endDate,
      status: status as 'CURRENT' | 'UPCOMING' | 'PAST',
      description,
      curator
    };

    // If new poster is uploaded, process it
    if (posterFile && posterFile.size > 0) {
      const { imageData: posterData, mimeType: posterMimeType } = await processImageUpload(posterFile, 'exhibitions', 800, 90);
      updateData.posterData = posterData;
      updateData.posterMimeType = posterMimeType;
    }

    // Process additional images if any
    const imageFiles = formData.getAll('images') as File[];
    if (imageFiles.length > 0 && imageFiles.some(f => f.size > 0)) {
      const imagesData: Buffer[] = [];
      const imagesMimeTypes: string[] = [];
      
      for (const imageFile of imageFiles) {
        if (imageFile.size > 0) {
          const { imageData, mimeType } = await processImageUpload(imageFile, 'exhibitions', 1200, 85);
          imagesData.push(imageData);
          imagesMimeTypes.push(mimeType);
        }
      }
      
      updateData.imagesData = imagesData;
      updateData.imagesMimeTypes = imagesMimeTypes;
    }

    const exhibition = await prisma.exhibition.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return NextResponse.json(exhibition);
  } catch (error: unknown) {
    console.error('Error updating exhibition:', error);
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
    
    // Get exhibition to delete associated images
    const exhibition = await prisma.exhibition.findUnique({
      where: { id: parseInt(id) }
    });

    if (!exhibition) {
      return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 });
    }

    // Delete poster if it's an upload
    if (exhibition.poster && exhibition.poster.startsWith('/uploads/')) {
      await deleteImage();
    }

    // Delete additional images
    for (const imagePath of exhibition.images) {
      if (imagePath.startsWith('/uploads/')) {
        await deleteImage();
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