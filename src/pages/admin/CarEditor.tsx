import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { uploadImageToStorage, deleteImageFromStorage } from '../../lib/imageUpload';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Car, CarCategory } from '../../../types';
import { ImageIcon, X, Plus, Trash2 } from 'lucide-react';

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
    setUploadingMain(true);
    try {
      const url = await uploadImageToStorage(file, 'car-rental-cars');
      setImage(url);
    } catch (error: any) {
      console.error('Upload failed', error);
      alert(error.message || 'Image upload failed');
    } finally {
      setUploadingMain(false);
      e.target.value = '';
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingGallery(true);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const url = await uploadImageToStorage(file, 'car-rental-cars');
        uploaded.push(url);
      }
      setGallery((prev) => [...prev, ...uploaded]);
    } catch (error: any) {
      console.error('Upload failed', error);
      alert(error.message || 'Gallery upload failed');
    } finally {
      setUploadingGallery(false);
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

        {/* Main Image */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Main Image *</label>
          <label className="cursor-pointer bg-gray-200 px-4 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-gray-300 transition-colors">
            <ImageIcon size={18} /> Upload
            <input type="file" className="hidden" accept="image/*" onChange={handleMainImageUpload} />
          </label>
          {uploadingMain && <p className="text-sm text-blue-500 mt-1">Converting to WebP & uploading...</p>}
          {image && <img src={image} alt="Preview" className="mt-2 h-32 w-auto object-cover rounded" />}
        </div>

        {/* Gallery */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gallery Photos (interior, seats, etc.)</label>
          <label className="cursor-pointer bg-gray-200 px-4 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-gray-300 transition-colors">
            <ImageIcon size={18} /> Upload Photos
            <input type="file" multiple className="hidden" accept="image/*" onChange={handleGalleryUpload} />
          </label>
          {uploadingGallery && <p className="text-sm text-blue-500 mt-1">Converting to WebP & uploading...</p>}
          {gallery.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {gallery.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img} alt={`Gallery ${idx}`} className="h-24 w-24 object-cover rounded-lg" />
                  <button
                    onClick={() => removeGalleryImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
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
