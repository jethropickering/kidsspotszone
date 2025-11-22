import { useState, useRef } from 'react';
import { FiUpload, FiX, FiImage, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { supabase } from '../../services/supabase';

export default function PhotoUpload({ venueId, existingPhotos = [], onPhotosChange, maxPhotos = 10 }) {
  const [photos, setPhotos] = useState(existingPhotos);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Maximum file size: 5MB
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only JPG, PNG, and WebP images are allowed';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  const compressImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if larger than 1200px
          const MAX_WIDTH = 1200;
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            },
            'image/jpeg',
            0.85 // 85% quality
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const uploadToSupabase = async (file, index) => {
    try {
      // Compress image first
      const compressedFile = await compressImage(file);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = venueId
        ? `venues/${venueId}/${fileName}`
        : `temp/${fileName}`;

      // Update progress
      setUploadProgress(prev => ({ ...prev, [index]: 10 }));

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('venue-photos')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      setUploadProgress(prev => ({ ...prev, [index]: 90 }));

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('venue-photos')
        .getPublicUrl(filePath);

      setUploadProgress(prev => ({ ...prev, [index]: 100 }));

      return {
        url: publicUrl,
        path: filePath,
        caption: '',
        display_order: photos.length + index,
        size: compressedFile.size,
        original_name: file.name
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    // Check total photos limit
    if (photos.length + files.length > maxPhotos) {
      setError(`You can upload a maximum of ${maxPhotos} photos`);
      return;
    }

    setError('');
    setUploading(true);

    const validFiles = [];
    const errors = [];

    // Validate all files
    files.forEach((file, index) => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setError(errors.join(', '));
      setUploading(false);
      return;
    }

    try {
      // Upload all files
      const uploadPromises = validFiles.map((file, index) => uploadToSupabase(file, index));
      const uploadedPhotos = await Promise.all(uploadPromises);

      const newPhotos = [...photos, ...uploadedPhotos];
      setPhotos(newPhotos);
      onPhotosChange?.(newPhotos);

      // Clear progress
      setUploadProgress({});
    } catch (error) {
      setError('Failed to upload photos. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (index) => {
    const photo = photos[index];

    // Delete from Supabase Storage if it has a path
    if (photo.path) {
      try {
        const { error } = await supabase.storage
          .from('venue-photos')
          .remove([photo.path]);

        if (error) {
          console.error('Delete error:', error);
          // Continue anyway to remove from UI
        }
      } catch (error) {
        console.error('Delete error:', error);
      }
    }

    // Remove from state
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    onPhotosChange?.(newPhotos);
  };

  const handleSetFeatured = (index) => {
    // Move selected photo to first position
    const newPhotos = [...photos];
    const [selected] = newPhotos.splice(index, 1);
    newPhotos.unshift(selected);

    // Update display order
    const reordered = newPhotos.map((photo, i) => ({
      ...photo,
      display_order: i,
      is_featured: i === 0
    }));

    setPhotos(reordered);
    onPhotosChange?.(reordered);
  };

  const handleCaptionChange = (index, caption) => {
    const newPhotos = [...photos];
    newPhotos[index] = { ...newPhotos[index], caption };
    setPhotos(newPhotos);
    onPhotosChange?.(newPhotos);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/html'));

    if (dragIndex === dropIndex) return;

    const newPhotos = [...photos];
    const [draggedItem] = newPhotos.splice(dragIndex, 1);
    newPhotos.splice(dropIndex, 0, draggedItem);

    // Update display order
    const reordered = newPhotos.map((photo, i) => ({
      ...photo,
      display_order: i,
      is_featured: i === 0
    }));

    setPhotos(reordered);
    onPhotosChange?.(reordered);
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">
            Venue Photos {photos.length > 0 && `(${photos.length}/${maxPhotos})`}
          </h3>
          <p className="text-xs text-gray-500">
            Upload high-quality photos (JPG, PNG, WebP). Max 5MB per photo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || photos.length >= maxPhotos}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiUpload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Add Photos'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-2">
          <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && Object.keys(uploadProgress).length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiUpload className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-sm text-blue-800 font-medium">Uploading photos...</span>
          </div>
          {Object.entries(uploadProgress).map(([index, progress]) => (
            <div key={index} className="mb-2 last:mb-0">
              <div className="flex justify-between text-xs text-blue-700 mb-1">
                <span>Photo {parseInt(index) + 1}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photos Grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.url || index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className="relative group cursor-move border-2 border-gray-200 rounded-lg overflow-hidden hover:border-primary-400 transition-all"
            >
              {/* Image */}
              <div className="aspect-square bg-gray-100">
                <img
                  src={photo.url}
                  alt={photo.caption || `Venue photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Featured Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                  <FiCheck className="w-3 h-3" />
                  Featured
                </div>
              )}

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetFeatured(index)}
                    className="bg-white text-gray-700 px-3 py-1.5 rounded text-xs font-medium hover:bg-primary-500 hover:text-white transition-colors"
                    title="Set as featured photo"
                  >
                    Set Featured
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                  title="Delete photo"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              {/* Caption Input */}
              <div className="p-2 bg-white">
                <input
                  type="text"
                  placeholder="Add caption (optional)"
                  value={photo.caption || ''}
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-primary-400"
                  maxLength={100}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No photos uploaded yet</p>
          <p className="text-sm text-gray-500 mb-4">
            Click "Add Photos" to upload images of your venue
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-outline inline-flex items-center gap-2"
          >
            <FiUpload className="w-4 h-4" />
            Upload Photos
          </button>
        </div>
      )}

      {/* Helper Text */}
      {photos.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <strong>Tips:</strong> Drag photos to reorder. The first photo will be the featured image.
            Add captions to help parents understand what they're seeing.
          </p>
        </div>
      )}
    </div>
  );
}
