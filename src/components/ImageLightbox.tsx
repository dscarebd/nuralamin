import { useEffect, useCallback, useState, useRef } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

const ZOOM_LEVELS = [1, 1.5, 2, 3];

export default function ImageLightbox({ images, currentIndex, open, onClose, onIndexChange }: ImageLightboxProps) {
  const hasMultiple = images.length > 1;
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef(0);

  const isZoomed = zoom > 1;

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((prev) => {
      const next = ZOOM_LEVELS.find((z) => z > prev);
      return next ?? prev;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => {
      const next = [...ZOOM_LEVELS].reverse().find((z) => z < prev);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next ?? prev;
    });
  }, []);

  const goPrev = useCallback(() => {
    resetZoom();
    onIndexChange((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onIndexChange, resetZoom]);

  const goNext = useCallback(() => {
    resetZoom();
    onIndexChange((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onIndexChange, resetZoom]);

  // Reset zoom on image change
  useEffect(() => {
    resetZoom();
  }, [currentIndex, resetZoom]);

  // Keyboard
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { if (isZoomed) resetZoom(); else onClose(); }
      if (e.key === "ArrowLeft" && !isZoomed) goPrev();
      if (e.key === "ArrowRight" && !isZoomed) goNext();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") resetZoom();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, goPrev, goNext, isZoomed, zoomIn, zoomOut, resetZoom]);

  // Mouse wheel zoom
  useEffect(() => {
    if (!open) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    };
    const el = containerRef.current;
    el?.addEventListener("wheel", handler, { passive: false });
    return () => el?.removeEventListener("wheel", handler);
  }, [open, zoomIn, zoomOut]);

  // Prevent body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  // Double-tap / double-click to toggle zoom
  const handleImageClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (isZoomed) resetZoom();
      else setZoom(2);
    }
    lastTapRef.current = now;
  }, [isZoomed, resetZoom]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => { if (!isZoomed) onClose(); }}
        >
          {/* Close button */}
          <button
            onClick={(e) => { e.stopPropagation(); if (isZoomed) resetZoom(); onClose(); }}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Zoom controls */}
          <div className="absolute right-4 top-16 z-10 flex flex-col gap-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); zoomIn(); }}
              disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); zoomOut(); }}
              disabled={zoom <= 1}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            {isZoomed && (
              <button
                onClick={(e) => { e.stopPropagation(); resetZoom(); }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Counter + zoom level */}
          <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
            {hasMultiple && (
              <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white">
                {currentIndex + 1} / {images.length}
              </div>
            )}
            {isZoomed && (
              <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white">
                {Math.round(zoom * 100)}%
              </div>
            )}
          </div>

          {/* Previous */}
          {hasMultiple && !isZoomed && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Next */}
          {hasMultiple && !isZoomed && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Image with swipe + zoom + pan */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              className={`max-h-[90vh] max-w-[90vw] rounded-lg object-contain select-none ${isZoomed ? "cursor-move" : "cursor-grab active:cursor-grabbing"}`}
              style={{ scale: zoom, x: pan.x, y: pan.y }}
              animate={{ scale: zoom, x: pan.x, y: pan.y }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag={isZoomed ? true : hasMultiple ? "x" : false}
              dragConstraints={isZoomed ? undefined : { left: 0, right: 0 }}
              dragElastic={isZoomed ? 0.1 : 0.3}
              onDragEnd={(_: any, info: PanInfo) => {
                if (isZoomed) {
                  setPan((prev) => ({
                    x: prev.x + info.offset.x,
                    y: prev.y + info.offset.y,
                  }));
                } else {
                  const swipeThreshold = 50;
                  if (info.offset.x < -swipeThreshold) goNext();
                  else if (info.offset.x > swipeThreshold) goPrev();
                }
              }}
              onClick={handleImageClick}
              draggable={false}
            />
          </motion.div>

          {/* Dots */}
          {hasMultiple && !isZoomed && (
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
