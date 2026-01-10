import React from 'react';

// Skeleton component for loading states
export const Skeleton = ({ className = '', variant = 'rect' }) => {
  const baseClass = 'animate-pulse bg-[#E5E5E5]';
  const variantClass = variant === 'circle' ? 'rounded-full' : 'rounded-lg';
  
  return <div className={`${baseClass} ${variantClass} ${className}`} />;
};

// Product card skeleton
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden border border-[#E5E5E5]">
    <Skeleton className="aspect-[4/3] w-full" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

// Art card skeleton
export const ArtCardSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden border border-[#E5E5E5]">
    <Skeleton className="h-72 w-full" />
    <div className="p-5 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-3 w-24" />
    </div>
  </div>
);

// Category card skeleton
export const CategoryCardSkeleton = () => (
  <Skeleton className="aspect-[3/4] w-full rounded-lg" />
);

// Grid of skeletons
export const ProductGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const ArtGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <ArtCardSkeleton key={i} />
    ))}
  </div>
);

export const CategoryGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <CategoryCardSkeleton key={i} />
    ))}
  </div>
);

// Detail page skeleton
export const ProductDetailSkeleton = () => (
  <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div className="space-y-4">
        <Skeleton className="aspect-[4/3] w-full rounded-xl" />
        <div className="flex gap-3">
          <Skeleton className="w-20 h-20 rounded-lg" />
          <Skeleton className="w-20 h-20 rounded-lg" />
          <Skeleton className="w-20 h-20 rounded-lg" />
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-8 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="flex gap-3">
          <Skeleton className="h-14 flex-1 rounded-lg" />
          <Skeleton className="h-14 flex-1 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

// Image with loading state
export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  wrapperClassName = '',
  ...props 
}) => {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {!loaded && !error && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          setError(true);
          e.currentTarget.src = 'https://placehold.co/800x600/F0F0F0/999?text=Image+Not+Found';
        }}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default Skeleton;
