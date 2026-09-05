import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { uploadImageToStorage, deleteImageFromStorage } from '../../lib/imageUpload';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Car, CarCategory } from '../../../types';
import { ImageIcon, X, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';

interface CarEditorProps {
  onClose: () => void;
  editCar?: Car | null;
}

const CarEditor: React.FC<CarEditorProps> = ({ onClose, editCar }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CarCategory>(CarCategory.SEDAN);
  const [pricePerDay, setPricePerDay] = useState('');
  const [priceTransfer, setPriceTransfer] = useState('');
  const [seats, setSeats] = useState('');
  const [luggage, setLuggage] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [image, setImage] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState<{ current: number; total: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editCar) {
      setName(editCar.name || '');
      setCategory(editCar.category || CarCategory.SEDAN);
      setPricePerDay(String(editCar.pricePerDay ?? ''));
      setPriceTransfer(String(editCar.priceTransfer ?? ''));
      setSeats(String(editCar.seats ?? ''));
      setLuggage(editCar.luggage || '');
      setFeatures(editCar.features || []);
      setImage(editCar.image || '');
      setGallery(editCar.gallery || []);
    }
  }, [editCar]);

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures([...features, trimmed]);
    }
    setFeatureInput('');
  };

  const removeFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploadingMain(true);
    try {
      const url = await uploadImageToStorage(file, 'car-rental-cars');
      setImage(url);
    } catch (error: any) {
      console.error('Upload failed', error);
      setUploadError(error.message || 'Image upload failed. Please try again.');
    } finally {
      setUploadingMain(false);
      e.target.value = '';
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadError(null);
    setUploadingGallery(true);
    setGalleryProgress({ current: 1, total: files.length });
    try {
      for (let i = 0; i < files.length; i++) {
        setGalleryProgress({ current: i + 1, total: files.length });
        const url = await uploadImageToStorage(files[i], 'car-rental-cars');
        setGallery((prev) => [...prev, url]);
      }
    } catch (error: any) {
      console.error('Upload failed', error);
      setUploadError(error.message || 'Gallery upload failed. Some images may not have uploaded.');
    } finally {
      setUploadingGallery(false);
      setGalleryProgress(null);
      e.target.value = '';
    }
  };

  const removeGalleryImage = async (idx: number) => {
    const url = gallery[idx];
    setGallery(gallery.filter((_, i) => i !== idx));
    await deleteImageFromStorage(url);
  };

  const handleSave = async () => {
    if (!name || !pricePerDay || !seats || !image) {
      return alert('Name, Price Per Day, Seats and a Main Image are required');
    }

    setSaving(true);
    try {
      const carData: Partial<Car> = {
        name,
        category,
        pricePerDay: Number(pricePerDay),
        priceTransfer: Number(priceTransfer) || 0,
        seats: Number(seats),
        luggage,
        features,
        image,
        gallery: gallery.length > 0 ? gallery : [image],
        updatedAt: serverTimestamp(),
      };

      if (editCar?.id) {
        await updateDoc(doc(db, 'car-rental-cars', editCar.id), carData);
        alert('Car updated!');
      } else {
        await addDoc(collection(db, 'car-rental-cars'), {
          ...carData,
          createdAt: serverTimestamp(),
        });
        alert('Car added!');
      }
      onClose();
    } catch (error) {
      console.error('Error saving car:', error);
      alert('Failed to save car');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{editCar ? 'Edit Car' : 'Add New Car'}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900"
              placeholder="Toyota Alphard or similar"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CarCategory)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900"
            >
              {Object.values(CarCategory).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price/Day (RM) *</label>
            <input
              type="number"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Transfer Price (RM)</label>
            <input
              type="number"
              value={priceTransfer}
              onChange={(e) => setPriceTransfer(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Seats *</label>
            <input
              type="number"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Luggage</label>
            <input
              type="text"
              value={luggage}
              onChange={(e) => setLuggage(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900"
              placeholder="3 Luggage"
            />
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Features</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900"
              placeholder="e.g. Premium Leather Interior"
            />
            <button
              type="button"
              onClick={addFeature}
              className="bg-gray-200 hover:bg-gray-300 px-4 rounded-lg flex items-center gap-1 text-gray-700"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {features.map((feature, idx) => (
              <span key={idx} className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {feature}
                <button onClick={() => removeFeature(idx)} className="text-brand-400 hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Error notification */}
        {uploadError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start justify-between gap-2 text-xs text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{uploadError}</span>
            </div>
            <button
              type="button"
              onClick={() => setUploadError(null)}
              className="text-red-400 hover:text-red-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Image */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Main Image *</label>
          <div className="flex items-center gap-3">
            <label
              className={`px-4 py-2.5 rounded-xl inline-flex items-center gap-2 font-medium text-sm transition-all shadow-sm ${
                uploadingMain
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 cursor-pointer active:scale-95'
              }`}
            >
              {uploadingMain ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <ImageIcon size={18} className="text-gray-500" />
                  <span>{image ? 'Change Main Image' : 'Upload Main Image'}</span>
                </>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleMainImageUpload}
                disabled={uploadingMain || uploadingGallery}
              />
            </label>
            {image && !uploadingMain && (
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                ✓ Image uploaded
              </span>
            )}
          </div>

          {/* Uploading progress indicator for Main Image */}
          {uploadingMain && (
            <div className="mt-2.5 p-3 rounded-xl bg-brand-50/80 border border-brand-200/70 max-w-sm">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-brand-900 mb-1.5">
                <Loader2 className="w-4 h-4 animate-spin text-brand-600 shrink-0" />
                <span>Converting to WebP &amp; uploading to storage...</span>
              </div>
              <div className="w-full bg-brand-200/60 rounded-full h-1.5 overflow-hidden">
                <div className="bg-brand-600 h-1.5 rounded-full w-full animate-pulse" />
              </div>
            </div>
          )}

          {/* Main Image Preview / Skeleton */}
          <div className="mt-3">
            {uploadingMain ? (
              <div className="h-36 w-56 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/50 flex flex-col items-center justify-center text-center p-3 animate-pulse shadow-sm">
                <Loader2 className="w-7 h-7 animate-spin text-brand-600 mb-2" />
                <span className="text-xs font-bold text-brand-900">Processing Image</span>
                <span className="text-[11px] text-brand-600 mt-0.5">Converting to WebP format...</span>
              </div>
            ) : image ? (
              <div className="relative group inline-block">
                <img
                  src={image}
                  alt="Main Preview"
                  className="h-36 w-56 object-cover rounded-xl border border-gray-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setImage('')}
                  title="Remove main image"
                  className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md transition-transform hover:scale-110"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Gallery */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase">
              Gallery Photos (interior, seats, etc.)
            </label>
            {gallery.length > 0 && (
              <span className="text-xs text-gray-400 font-medium">
                {gallery.length} photo{gallery.length !== 1 ? 's' : ''} uploaded
              </span>
            )}
          </div>

          <label
            className={`px-4 py-2.5 rounded-xl inline-flex items-center gap-2 font-medium text-sm transition-all shadow-sm ${
              uploadingGallery
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 cursor-pointer active:scale-95'
            }`}
          >
            {uploadingGallery ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                <span>
                  Uploading {galleryProgress ? `(${galleryProgress.current}/${galleryProgress.total})` : '...'}
                </span>
              </>
            ) : (
              <>
                <ImageIcon size={18} className="text-gray-500" />
                <span>Upload Photos</span>
              </>
            )}
            <input
              type="file"
              multiple
              className="hidden"
              accept="image/*"
              onChange={handleGalleryUpload}
              disabled={uploadingGallery || uploadingMain}
            />
          </label>

          {/* Gallery Uploading Progress Banner */}
          {uploadingGallery && galleryProgress && (
            <div className="mt-2.5 p-3.5 rounded-xl bg-brand-50/90 border border-brand-200/70 max-w-md shadow-sm">
              <div className="flex items-center justify-between text-xs font-semibold text-brand-900 mb-1.5">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-600 shrink-0" />
                  Converting to WebP &amp; uploading photo {galleryProgress.current} of {galleryProgress.total}...
                </span>
                <span className="text-brand-600 font-bold">
                  {Math.round(((galleryProgress.current - 1) / galleryProgress.total) * 100)}%
                </span>
              </div>
              <div className="w-full bg-brand-200/60 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-brand-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.max(12, Math.round(((galleryProgress.current - 1) / galleryProgress.total) * 100))}%` }}
                />
              </div>
            </div>
          )}

          {/* Gallery Thumbnails Grid & Pending Skeletons */}
          {(gallery.length > 0 || uploadingGallery) && (
            <div className="flex flex-wrap gap-3 mt-3">
              {gallery.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img}
                    alt={`Gallery ${idx}`}
                    className="h-24 w-24 object-cover rounded-xl border border-gray-200 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    title="Delete photo"
                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md transition-transform hover:scale-110"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* In-place Skeleton for currently uploading item */}
              {uploadingGallery && (
                <div className="h-24 w-24 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/60 flex flex-col items-center justify-center text-center p-2 animate-pulse shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-brand-600 mb-1" />
                  <span className="text-[10px] font-bold text-brand-900 leading-tight">Uploading</span>
                  {galleryProgress && (
                    <span className="text-[9px] text-brand-600 font-medium mt-0.5">
                      {galleryProgress.current}/{galleryProgress.total}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || uploadingMain || uploadingGallery}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : (editCar ? 'Update Car' : 'Save Car')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarEditor;
