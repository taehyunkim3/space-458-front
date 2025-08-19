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
    const banner = await prisma.banner.findUnique({
      where: { id: parseInt(id) }
    });

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error('Error fetching banner:', error);
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
    const subtitle = formData.get('subtitle') as string || null;
    const link = formData.get('link') as string || null;
    const type = formData.get('type') as string || 'image';
    const order = parseInt(formData.get('order') as string) || 0;
    const active = formData.get('active') === 'true';
    const imageFile = formData.get('image') as File;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Get existing banner
    const existingBanner = await prisma.banner.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingBanner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    let imagePath = existingBanner.image;

    // If new image is uploaded, process it and delete old one
    if (imageFile && imageFile.size > 0) {
      imagePath = await processImageUpload(imageFile, 'banners', 1920, 85);
      
      // Delete old image
      if (existingBanner.image.startsWith('/uploads/')) {
        await deleteImage(existingBanner.image);
      }
    }

    const banner = await prisma.banner.update({
      where: { id: parseInt(id) },
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

    return NextResponse.json(banner);
  } catch (error: unknown) {
    console.error('Error updating banner:', error);
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
    
    // Get banner to delete associated image
    const banner = await prisma.banner.findUnique({
      where: { id: parseInt(id) }
    });

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    // Delete image if it's an upload
    if (banner.image.startsWith('/uploads/')) {
      await deleteImage(banner.image);
    }

    // Delete banner from database
    await prisma.banner.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}