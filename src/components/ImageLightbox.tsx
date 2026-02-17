import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export default function ImageLightbox({ images, currentIndex, open, onClose, onIndexChange }: ImageLightboxProps) {
  const hasMultiple = images.length > 1;

  const goPrev = useCallback(() => {
    onIndexChange((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onIndexChange]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, goPrev, goNext]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Counter */}
          {hasMultiple && (
            <div className="absolute left-4 top-4 z-10 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Previous */}
          {hasMultiple && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Next */}
          {hasMultiple && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Image with swipe */}
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0, x: 0, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            drag={hasMultiple ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={(_: any, info: PanInfo) => {
              const swipeThreshold = 50;
              if (info.offset.x < -swipeThreshold) goNext();
              else if (info.offset.x > swipeThreshold) goPrev();
            }}
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] cursor-grab rounded-lg object-contain active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Dots */}
          {hasMultiple && (
            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); onIndexChange(i); }}
                  className={`h-2 rounded-full transition-all ${i === currentIndex ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
