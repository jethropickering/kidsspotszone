import { FiStar } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

export default function StarRating({ rating, size = 'md', showNumber = true, interactive = false, onChange }) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        // Full star
        stars.push(
          <FaStar
            key={i}
            className={`${sizeClasses[size]} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            style={{ color: '#f5ab38' }}
            onClick={() => interactive && onChange && onChange(i)}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        // Half star
        stars.push(
          <FaStarHalfAlt
            key={i}
            className={`${sizeClasses[size]} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            style={{ color: '#f5ab38' }}
            onClick={() => interactive && onChange && onChange(i)}
          />
        );
      } else {
        // Empty star
        stars.push(
          <FiStar
            key={i}
            className={`${sizeClasses[size]} text-gray-300 ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onChange && onChange(i)}
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {renderStars()}
      </div>
      {showNumber && (
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
