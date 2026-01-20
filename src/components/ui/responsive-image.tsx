import { cn } from "@/lib/utils";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  variant?: "cover" | "contain";
  scale?: number; // Scale factor (e.g., 0.5 for 50%, 0.2 for 20%)
}

/**
 * A reusable responsive image component for banknote images.
 * Maintains aspect ratio and scales proportionally across all screen sizes.
 * 
 * - Mobile: Full width, height ~30vw
 * - Tablet/Desktop: Max width 600px, centered, proportional cropping
 */
export const ResponsiveImage = ({
  src,
  alt,
  className,
  containerClassName,
  scale,
}: ResponsiveImageProps) => {
  const scaleStyle = scale ? { maxWidth: `${scale * 100}%`, height: 'auto' } : {};
  
  return (
    <div
      className={cn(
        // Container centers the image
        "flex justify-center",
        containerClassName
      )}
    >
      <img
        src={src}
        alt={alt}
        style={scaleStyle}
        className={cn(
          // Natural size, no constraints
          "w-auto h-auto",
          // Keep rounded corners
          "rounded-xl",
          // Smooth loading transition
          "transition-opacity duration-300",
          className
        )}
        loading="lazy"
      />
    </div>
  );
};

/**
 * A variant specifically for captured/scanned banknote images (preview mode).
 * Uses contain to show the full image without cropping.
 */
export const BanknotePreviewImage = ({
  src,
  alt,
  className,
  containerClassName,
}: Omit<ResponsiveImageProps, "variant">) => {
  return (
    <div
      className={cn(
        // Container centers the image
        "flex items-center justify-center",
        "p-2 sm:p-4",
        containerClassName
      )}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          // Natural size
          "w-auto h-auto",
          // Visual polish with rounded corners
          "rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl",
          // Smooth loading
          "transition-all duration-300",
          className
        )}
        loading="lazy"
      />
    </div>
  );
};
