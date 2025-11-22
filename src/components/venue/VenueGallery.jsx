import { useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function VenueGallery({ venue }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all images (featured image + additional photos)
  const images = [];
  if (venue.featured_image) {
    images.push({ url: venue.featured_image, alt: venue.name });
  }
  if (venue.photos && venue.photos.length > 0) {
    venue.photos.forEach(photo => {
      images.push({ url: photo.url, alt: photo.caption || venue.name });
    });
  }

  // If no images, show category icon fallback
  if (images.length === 0) {
    const categoryIcon = venue.categories?.[0]?.category?.icon || '🏃';
    return (
      <div className="section-container mb-8">
        <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center" style={{ height: '400px' }}>
          <div className="text-9xl">{categoryIcon}</div>
        </div>
      </div>
    );
  }

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  return (
    <>
      <div className="section-container mb-8">
        {images.length === 1 ? (
          // Single image
          <div
            onClick={() => openLightbox(0)}
            className="cursor-pointer overflow-hidden rounded-2xl hover:opacity-95 transition-opacity"
          >
            <img
              src={images[0].url}
              alt={images[0].alt}
              className="w-full object-cover"
              style={{ height: '500px' }}
            />
          </div>
        ) : (
          // Gallery grid
          <div className="grid grid-cols-4 gap-2 h-[500px]">
            {/* Main large image */}
            <div
              onClick={() => openLightbox(0)}
              className="col-span-2 row-span-2 cursor-pointer overflow-hidden rounded-2xl hover:opacity-95 transition-opacity"
            >
              <img
                src={images[0].url}
                alt={images[0].alt}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Smaller images */}
            {images.slice(1, 5).map((image, index) => (
              <div
                key={index + 1}
                onClick={() => openLightbox(index + 1)}
                className="cursor-pointer overflow-hidden rounded-xl hover:opacity-95 transition-opacity relative"
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                {/* Show "+X more" overlay on last image if there are more */}
                {index === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-white font-display font-bold text-xl">
                    +{images.length - 5} more
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {images.length > 1 && (
          <p className="text-center mt-3 text-sm text-gray-600">
            Click any photo to view gallery ({images.length} photos)
          </p>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-10"
            aria-label="Close gallery"
          >
            <FiX className="w-8 h-8" />
          </button>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 text-white hover:text-gray-300 p-2 bg-black bg-opacity-50 rounded-full"
              aria-label="Previous image"
            >
              <FiChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Image */}
          <div
            className="max-w-7xl max-h-[90vh] mx-auto px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentImageIndex].url}
              alt={images[currentImageIndex].alt}
              className="max-w-full max-h-[90vh] object-contain mx-auto"
            />
            <p className="text-white text-center mt-4">
              {currentImageIndex + 1} / {images.length}
            </p>
          </div>

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 text-white hover:text-gray-300 p-2 bg-black bg-opacity-50 rounded-full"
              aria-label="Next image"
            >
              <FiChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? 'border-primary-500 opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-75'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
