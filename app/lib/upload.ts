import { NextRequest } from "next/server";
import sharp from "sharp";
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "52428800"); // 50MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function processImageUpload(
  file: File,
  folder: string = "general",
  maxWidth: number = 1920,
  quality: number = 80
): Promise<{ imageData: Buffer; mimeType: string }> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`
    );
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
  }

  // Convert file to buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Process image with Sharp - aggressive compression for large files
  const imageProcessor = sharp(buffer);

  // Calculate optimal dimensions based on file type
  let targetWidth = maxWidth;
  let targetQuality = quality;

  if (folder === "banners") {
    targetWidth = 1920;
    targetQuality = 80;
  } else if (folder === "thumbnails") {
    targetWidth = 800;
    targetQuality = 80;
  } else {
    targetWidth = 1920;
    targetQuality = 80;
  }

  // Further reduce quality for very large files
  if (file.size > 5 * 1024 * 1024) {
    // > 5MB
    targetQuality = Math.max(50, targetQuality - 15);
  }

  const processedBuffer = await imageProcessor
    .resize(targetWidth, targetWidth, {
      withoutEnlargement: true,
      fit: "inside",
    })
    .webp({
      quality: targetQuality,
      effort: 6,
      smartSubsample: true,
    })
    .toBuffer();

  return {
    imageData: processedBuffer,
    mimeType: "image/webp"
  };
}

export async function deleteImage(): Promise<void> {
  // Images are now stored in DB, no file deletion needed
  return;
}

export async function parseFormData(request: NextRequest): Promise<FormData> {
  const contentType = request.headers.get("content-type") || "";

  if (!contentType.includes("multipart/form-data")) {
    throw new Error("Invalid content type. Expected multipart/form-data.");
  }

  return await request.formData();
}

export function validateImageFile(file: File): void {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`
    );
  }
}
