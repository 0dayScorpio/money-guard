import { cn } from "@/lib/utils";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  variant?: "cover" | "contain";
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
  variant = "cover",
}: ResponsiveImageProps) => {
  return (
    <div
      className={cn(
        // Base container styles
        "relative w-full overflow-hidden rounded-xl bg-muted",
        // Responsive height: ~30vw on mobile, fixed aspect on larger screens
        "h-[30vw] sm:h-[25vw] md:h-auto md:aspect-video",
        // Max width for larger screens, centered
        "mx-auto max-w-full md:max-w-[600px] lg:max-w-[700px]",
        containerClassName
      )}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full",
          variant === "cover" ? "object-cover" : "object-contain",
          "object-center",
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
        // Container that fills available space
        "relative flex items-center justify-center",
        "w-full h-full max-h-[60vh] md:max-h-[70vh]",
        "p-2 sm:p-4",
        containerClassName
      )}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          // Responsive sizing with max constraints
          "max-w-full max-h-full",
          "w-auto h-auto",
          // Maintain aspect ratio, no distortion
          "object-contain object-center",
          // Visual polish
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
