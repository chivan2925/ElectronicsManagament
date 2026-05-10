import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Maximize2,
  X,
} from "lucide-react";
import { cn } from "../../utils/classNames";
import OptimizedImage from "../common/OptimizedImage";
import SkeletonBlock from "../skeletons/SkeletonBlock";
import Badge from "../ui/Badge";
import IconButton from "../ui/IconButton";

const MotionButton = motion.button;
const MotionDiv = motion.div;
const MotionImg = motion.img;

function normalizeIndex(index, length) {
  if (!length) {
    return 0;
  }

  return (index + length) % length;
}

function ProductGallery({ images = [], productName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageOrigin, setImageOrigin] = useState("50% 50%");
  const [isMainLoaded, setIsMainLoaded] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false);
  const activeImage = images[activeIndex] || images[0];
  const previewImage = images[previewIndex] || activeImage;
  const hasManyImages = images.length > 1;

  useEffect(() => {
    if (!isPreviewOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isPreviewOpen]);

  useEffect(() => {
    if (!isPreviewOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsPreviewOpen(false);
        return;
      }

      if (event.key === "ArrowRight" && hasManyImages) {
        setIsPreviewLoaded(false);
        setPreviewIndex((currentIndex) => normalizeIndex(currentIndex + 1, images.length));
      }

      if (event.key === "ArrowLeft" && hasManyImages) {
        setIsPreviewLoaded(false);
        setPreviewIndex((currentIndex) => normalizeIndex(currentIndex - 1, images.length));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasManyImages, images.length, isPreviewOpen]);

  if (!activeImage) {
    return null;
  }

  const handleMouseMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setImageOrigin(`${x}% ${y}%`);
  };

  const handleMouseLeave = () => {
    setImageOrigin("50% 50%");
  };

  const selectImage = (index) => {
    if (index === activeIndex) {
      return;
    }

    setActiveIndex(index);
    setImageOrigin("50% 50%");
    setIsMainLoaded(false);
  };

  const openPreview = (index = activeIndex) => {
    setPreviewIndex(index);
    setIsPreviewLoaded(false);
    setIsPreviewOpen(true);
  };

  const showPreviewImage = (index) => {
    setPreviewIndex(normalizeIndex(index, images.length));
    setIsPreviewLoaded(false);
  };

  return (
    <>
      <section className="store-glass-soft overflow-hidden rounded-3xl p-3 sm:p-4">
        <div
          className="group relative flex aspect-square min-h-[320px] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(0,91,255,0.34),rgba(15,23,42,0.78)_45%,rgba(2,6,23,0.96)_100%)] p-5 shadow-inner shadow-white/[0.04]"
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),transparent_28%,rgba(0,91,255,0.16))]" />
          <div className="pointer-events-none absolute inset-x-14 bottom-10 h-20 rounded-full bg-blue-500/24 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />

          <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
            <Badge className="gap-2" variant="primary">
              <ImageIcon size={13} />
              Ảnh chi tiết
            </Badge>
            <Badge className="hidden gap-2 sm:inline-flex" variant="soft">
              <Maximize2 size={13} />
              Xem lớn
            </Badge>
          </div>

          <IconButton
            aria-label="Mở xem ảnh toàn màn hình"
            className="absolute right-4 top-4 z-20 border-white/10 bg-slate-950/60 text-white hover:border-blue-300/70 hover:bg-blue-500/15"
            onClick={() => openPreview(activeIndex)}
            variant="outline"
          >
            <Maximize2 size={18} />
          </IconButton>

          {!isMainLoaded && <SkeletonBlock className="absolute inset-5 z-10 rounded-3xl" />}

          <AnimatePresence mode="wait">
            <OptimizedImage
              as={MotionImg}
              key={activeImage.id}
              alt={`${productName} - ${activeImage.label}`}
              animate={{ opacity: isMainLoaded ? 1 : 0, scale: 1, x: 0 }}
              className="premium-transition relative z-10 h-full max-h-[520px] w-full cursor-zoom-in object-contain drop-shadow-[0_28px_70px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_34px_80px_rgba(0,91,255,0.3)]"
              exit={{ opacity: 0, scale: 0.98, x: -18 }}
              initial={{ opacity: 0, scale: 0.96, x: 18 }}
              onClick={() => openPreview(activeIndex)}
              onLoad={() => setIsMainLoaded(true)}
              priority
              sizes="(max-width: 1024px) 92vw, 620px"
              src={activeImage.image}
              style={{ transformOrigin: imageOrigin }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.16 }}
            />
          </AnimatePresence>

          {hasManyImages && (
            <>
              <IconButton
                aria-label="Ảnh trước"
                className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 border-white/10 bg-slate-950/60 text-white hover:border-blue-300/70 hover:bg-blue-500/15 md:inline-flex"
                onClick={() => selectImage(normalizeIndex(activeIndex - 1, images.length))}
                variant="outline"
              >
                <ChevronLeft size={20} />
              </IconButton>
              <IconButton
                aria-label="Ảnh tiếp theo"
                className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 border-white/10 bg-slate-950/60 text-white hover:border-blue-300/70 hover:bg-blue-500/15 md:inline-flex"
                onClick={() => selectImage(normalizeIndex(activeIndex + 1, images.length))}
                variant="outline"
              >
                <ChevronRight size={20} />
              </IconButton>
            </>
          )}
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:gap-3 sm:overflow-visible sm:pb-0">
          {images.map((image, index) => {
            const isActive = activeIndex === index;

            return (
              <MotionButton
                aria-label={`Xem ảnh ${image.label}`}
                aria-pressed={isActive}
                className={cn(
                  "transition-default group relative flex aspect-square min-w-[82px] items-center justify-center overflow-hidden rounded-2xl border bg-slate-950/42 p-2 outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:min-w-0",
                  isActive
                    ? "border-blue-300/80 shadow-[0_0_28px_rgba(0,91,255,0.32)]"
                    : "border-white/10 hover:border-blue-300/50 hover:bg-blue-500/10",
                )}
                key={image.id}
                onClick={() => selectImage(index)}
                type="button"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <span
                  className={cn(
                    "absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/70 to-transparent transition-opacity",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-80",
                  )}
                />
                <MotionDiv
                  className={cn(
                    "absolute left-2 top-2 z-10 rounded-full bg-slate-950/70 p-1 text-blue-100 transition-opacity",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                  )}
                >
                  <ImageIcon size={12} />
                </MotionDiv>
                <OptimizedImage
                  alt={image.label}
                  className="premium-transition h-full w-full object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.34)] group-hover:scale-105"
                  sizes="120px"
                  src={image.image}
                />
              </MotionButton>
            );
          })}
        </div>
      </section>

      <AnimatePresence>
        {isPreviewOpen && previewImage && (
          <MotionDiv
            animate={{ opacity: 1 }}
            aria-modal="true"
            className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/88 p-3 backdrop-blur-2xl sm:p-6"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            role="dialog"
          >
            <button
              aria-label="Đóng xem ảnh toàn màn hình"
              className="absolute inset-0 cursor-default"
              onClick={() => setIsPreviewOpen(false)}
              type="button"
            />

            <MotionDiv
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative z-10 flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-blue-200/20 bg-[#07111F]/96 shadow-[0_30px_100px_rgba(0,0,0,0.55),0_0_52px_rgba(0,91,255,0.2)]"
              exit={{ opacity: 0, scale: 0.98, y: 12 }}
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div>
                  <p className="text-sm font-black text-white">{productName}</p>
                  <p className="text-caption mt-1 text-slate-400">{previewImage.label}</p>
                </div>
                <IconButton
                  aria-label="Đóng xem ảnh"
                  className="border-white/10 bg-white/[0.05]"
                  onClick={() => setIsPreviewOpen(false)}
                  variant="outline"
                >
                  <X size={19} />
                </IconButton>
              </div>

              <div className="relative flex min-h-[420px] flex-1 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_18%,rgba(0,91,255,0.24),rgba(15,23,42,0.72)_45%,rgba(2,6,23,0.96)_100%)] p-4 sm:min-h-[560px] sm:p-8">
                <div className="pointer-events-none absolute inset-x-20 bottom-10 h-24 rounded-full bg-blue-500/24 blur-3xl" />

                {!isPreviewLoaded && <SkeletonBlock className="absolute inset-6 rounded-3xl" />}

                <AnimatePresence mode="wait">
                  <OptimizedImage
                    as={MotionImg}
                    key={previewImage.id}
                    alt={`${productName} - ${previewImage.label}`}
                    animate={{ opacity: isPreviewLoaded ? 1 : 0, scale: 1 }}
                    className="relative z-10 max-h-[68vh] w-full object-contain drop-shadow-[0_36px_90px_rgba(0,0,0,0.56)]"
                    exit={{ opacity: 0, scale: 0.98 }}
                    initial={{ opacity: 0, scale: 0.96 }}
                    onLoad={() => setIsPreviewLoaded(true)}
                    sizes="(max-width: 1024px) 92vw, 960px"
                    src={previewImage.image}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  />
                </AnimatePresence>

                {hasManyImages && (
                  <>
                    <IconButton
                      aria-label="Ảnh trước"
                      className="absolute left-3 top-1/2 z-20 -translate-y-1/2 border-white/10 bg-slate-950/70 text-white hover:border-blue-300/70 hover:bg-blue-500/15 sm:left-5"
                      onClick={() => showPreviewImage(previewIndex - 1)}
                      variant="outline"
                    >
                      <ChevronLeft size={22} />
                    </IconButton>
                    <IconButton
                      aria-label="Ảnh tiếp theo"
                      className="absolute right-3 top-1/2 z-20 -translate-y-1/2 border-white/10 bg-slate-950/70 text-white hover:border-blue-300/70 hover:bg-blue-500/15 sm:right-5"
                      onClick={() => showPreviewImage(previewIndex + 1)}
                      variant="outline"
                    >
                      <ChevronRight size={22} />
                    </IconButton>
                  </>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto border-t border-white/10 p-3">
                {images.map((image, index) => (
                  <button
                    aria-label={`Xem ảnh ${image.label} trong modal`}
                    aria-pressed={previewIndex === index}
                    className={cn(
                      "transition-default flex h-16 w-20 shrink-0 items-center justify-center rounded-2xl border bg-slate-950/50 p-2 outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                      previewIndex === index
                        ? "border-blue-300/80 shadow-[0_0_24px_rgba(0,91,255,0.28)]"
                        : "border-white/10 hover:border-blue-300/50 hover:bg-blue-500/10",
                    )}
                    key={`preview-${image.id}`}
                    onClick={() => showPreviewImage(index)}
                    type="button"
                  >
                    <OptimizedImage alt={image.label} className="h-full w-full object-contain" sizes="80px" src={image.image} />
                  </button>
                ))}
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
}

export default ProductGallery;
