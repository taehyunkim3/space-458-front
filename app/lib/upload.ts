import { NextRequest } from 'next/server';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function processImageUpload(
  file: File,
  folder: string = 'general',
  maxWidth: number = 1920,
  quality: number = 80
): Promise<string> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
  }

  // Create upload directory if it doesn't exist
  const uploadPath = path.join(process.cwd(), 'public', 'uploads', folder);
  await fs.mkdir(uploadPath, { recursive: true });

  // Generate unique filename
  const filename = `${uuidv4()}.webp`;
  const filepath = path.join(uploadPath, filename);

  // Convert file to buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Process image with Sharp
  await sharp(buffer)
    .resize(maxWidth, null, {
      withoutEnlargement: true,
      fit: 'inside'
    })
    .webp({
      quality,
      effort: 6
    })
    .toFile(filepath);

  // Return relative path for database storage
  return `/uploads/${folder}/${filename}`;
}

export async function deleteImage(imagePath: string): Promise<void> {
  if (!imagePath.startsWith('/uploads/')) {
    return; // Don't delete non-upload files
  }

  const fullPath = path.join(process.cwd(), 'public', imagePath);
  
  try {
    await fs.unlink(fullPath);
  } catch (error) {
    console.error('Failed to delete image:', error);
    // Don't throw error if file doesn't exist
  }
}

export async function parseFormData(request: NextRequest): Promise<FormData> {
  const contentType = request.headers.get('content-type') || '';
  
  if (!contentType.includes('multipart/form-data')) {
    throw new Error('Invalid content type. Expected multipart/form-data.');
  }

  return await request.formData();
}

export function validateImageFile(file: File): void {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
  }
}