import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const galleryInfo = await prisma.galleryInfo.findFirst();
    return NextResponse.json(galleryInfo);
  } catch (error) {
    console.error('Error fetching gallery info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const { name, description, address, phone, email, hours, instagram } = data;

    if (!name || !description || !address || !phone || !email) {
      return NextResponse.json({ 
        error: 'Name, description, address, phone, and email are required' 
      }, { status: 400 });
    }

    // Get existing gallery info or create new one
    const existingInfo = await prisma.galleryInfo.findFirst();
    
    let galleryInfo;
    if (existingInfo) {
      galleryInfo = await prisma.galleryInfo.update({
        where: { id: existingInfo.id },
        data: { name, description, address, phone, email, hours, instagram }
      });
    } else {
      galleryInfo = await prisma.galleryInfo.create({
        data: { name, description, address, phone, email, hours, instagram }
      });
    }

    return NextResponse.json(galleryInfo);
  } catch (error: unknown) {
    console.error('Error updating gallery info:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}