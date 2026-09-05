/**
 * Client-side image pipeline: validate -> convert to WebP -> upload to Firebase Storage.
 * No custom backend involved - the browser does the conversion, Firebase Storage holds
 * the file, and Firestore only ever stores the resulting download URL.
 */
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const VALID_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) return { valid: false, error: 'No file selected' };
  if (!VALID_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only images are allowed (JPEG, PNG, WebP, GIF)' };
  }
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }
  return { valid: true };
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

export type ImageFolder = 'car-rental-cars' | 'car-rental-gallery';

/**
 * Converts the given file to WebP and uploads it to Firebase Storage under `folder`.
 * Returns the public download URL to store in Firestore.
 */
export async function uploadImageToStorage(file: File, folder: ImageFolder): Promise<string> {
  const validation = validateImageFile(file);
  if (!validation.valid) throw new Error(validation.error);

  const webpBlob = await convertToWebP(file);
  const filename = `${folder}/${crypto.randomUUID()}.webp`;
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, webpBlob, { contentType: 'image/webp' });
  return getDownloadURL(storageRef);
}

/** Best-effort delete - swallows errors (e.g. already deleted, or a legacy non-Storage URL). */
export async function deleteImageFromStorage(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    console.warn('Failed to delete storage file (ignoring):', url, error);
  }
}
