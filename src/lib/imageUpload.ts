/**
 * Client-side image upload pipeline.
 * WebP conversion and resizing are handled server-side by the
 * storage.bijokdev.com service automatically on every upload (see its
 * OpenAPI spec: "Automatically resizes images and converts to WebP
 * format"), so there's no need for a separate client-side conversion step
 * - we just validate and upload the original file.
 */
import { uploadFile, deleteFile, validateImageFile } from './storage';

export { validateImageFile };

export type ImageFolder = 'car-rental-cars' | 'car-rental-gallery';

/**
 * Uploads a file via the bijokdev storage service, which converts it to
 * WebP and resizes it automatically. Returns the resulting URL to store
 * in Firestore. `folder` is currently unused (the service has a single
 * flat bucket) but kept for call-site clarity/future use.
 */
export async function uploadImageToStorage(file: File, folder: ImageFolder): Promise<string> {
  const validation = validateImageFile(file);
  if (!validation.valid) throw new Error(validation.error);

  const response = await uploadFile(file);
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
