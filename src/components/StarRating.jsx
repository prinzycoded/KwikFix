import { Star } from 'lucide-react';

export default function StarRating({ rating, size }) {
  const starSize = size || 14;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={starSize}
          className={i < rating ? 'text-yellow-500 fill-current' : 'text-white/20'}
        />
      ))}
    </div>
  );
}
