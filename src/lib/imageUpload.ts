/**
 * Client-side image pipeline: validate -> convert to WebP -> upload.
 * The browser does the WebP conversion; the actual file is stored via the
 * existing storage.bijokdev.com service (already used by the Article editor,
 * free, no Firebase Blaze plan required) - Firestore only ever stores the
 * resulting URL.
 */
import { uploadFile, deleteFile, validateImageFile as validateImageFileBase } from './storage';

export type ImageFolder = 'car-rental-cars' | 'car-rental-gallery';

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  return validateImageFileBase(file);
}

export async function convertToWebP(file: File, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('WebP conversion failed'))),
      'image/webp',
      quality
    );
  });
}

/**
 * Converts the given file to WebP and uploads it via the bijokdev storage
 * service. Returns the public URL to store in Firestore.
 */
export async function uploadImageToStorage(file: File, folder: ImageFolder): Promise<string> {
  const validation = validateImageFile(file);
  if (!validation.valid) throw new Error(validation.error);

  const webpBlob = await convertToWebP(file);
  const webpFile = new File([webpBlob], `${folder}-${crypto.randomUUID()}.webp`, { type: 'image/webp' });

  const response = await uploadFile(webpFile);
  if (!response.success || !response.url) {
    throw new Error(response.error || 'Upload failed');
  }
  return response.url;
}

/** Best-effort delete - swallows errors (e.g. already deleted). */
export async function deleteImageFromStorage(url: string): Promise<void> {
  try {
    await deleteFile(url);
  } catch (error) {
    console.warn('Failed to delete storage file (ignoring):', url, error);
  }
}
