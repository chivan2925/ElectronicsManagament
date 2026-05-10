import { useEffect, useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import mediaService from "../../api/mediaService";
import { fadeIn, fadeUp, hoverLift, imageZoom, tapSoft } from "../../styles/animations";
import OptimizedImage from "../common/OptimizedImage";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import { cn } from "../../utils/classNames";

const MotionDiv = motion.div;
const MotionImg = motion.img;
const MotionSection = motion.section;

const SLIDE_DURATION = 5000;

function HeroSlideshow({ defaultPromotion }) {
  const [mediaItems, setMediaItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const response = await mediaService.getAll({ pageSize: 12 });
        setMediaItems(response.items || []);
      } catch (error) {
        console.error("Failed to fetch media for slideshow:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMedia();
  }, []);

  const slides = useMemo(() => {
    if (mediaItems.length === 0) {
      return [
        {
          id: "default-1",
          title: "Gaming Excellence",
          image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
          badge: "FEATURED"
        },
        {
          id: "default-2",
          title: "Pro Performance",
          image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
          badge: "NEW ARRIVAL"
        },
        {
          id: "default-3",
          title: "Ultimate Setup",
          image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1957&auto=format&fit=crop",
          badge: "HOT DEAL"
        }
      ];
    }
    return mediaItems.map((item) => ({
      id: item.id,
      title: item.productName || "Gaming Gear",
      image: item.imageUrl,
      badge: item.attachmentType === "product" ? "PRODUCT" : "MEDIA",
      link: item.productId ? `/products/${item.productId}` : "/products"
    }));
  }, [mediaItems]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [nextSlide, slides.length]);

  if (isLoading) return <div className="h-[400px] w-full animate-pulse rounded-3xl bg-white/5" />;

  return (
    <section className="relative w-full overflow-hidden py-4">
      {/* Decorative Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_50%_50%,rgba(0,91,255,0.12),transparent_70%)] blur-3xl" />

      <div className="relative flex items-center justify-center">
        <div className="flex h-[320px] w-full items-center justify-center gap-4 px-4 sm:h-[400px] md:h-[460px] lg:gap-6">
          <AnimatePresence initial={false} mode="popLayout">
            {[-1, 0, 1].map((offset) => {
              const index = (currentIndex + offset + slides.length) % slides.length;
              const slide = slides[index];
              const isCenter = offset === 0;

              return (
                <motion.div
                  key={`${slide.id}-${offset}`}
                  initial={{ opacity: 0, scale: 0.8, x: offset * 100 }}
                  animate={{
                    opacity: isCenter ? 1 : 0.4,
                    scale: isCenter ? 1 : 0.85,
                    x: 0,
                    zIndex: isCenter ? 20 : 10,
                  }}
                  exit={{ opacity: 0, scale: 0.8, x: -offset * 100 }}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  className={cn(
                    "relative aspect-video h-full flex-shrink-0 overflow-hidden rounded-[2.5rem] border transition-all duration-500",
                    isCenter
                      ? "w-[85%] border-blue-400/40 shadow-[0_0_50px_rgba(0,91,255,0.3)] ring-1 ring-white/10"
                      : "hidden w-[15%] border-white/5 grayscale-[0.5] sm:block"
                  )}
                >
                  <OptimizedImage
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-full object-cover"
                    fallbackKind="media"
                  />

                  {/* Slide Overlay Content */}
                  {isCenter && (
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent p-6 flex flex-col justify-end sm:p-10 lg:p-14">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Badge className="mb-4 bg-blue-500/20 border-blue-400/30 backdrop-blur-md">
                          {slide.badge}
                        </Badge>
                        <h2 className="text-3xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
                          {slide.title}
                        </h2>
                        <div className="mt-6 flex items-center gap-4">
                          <Button as={Link} to={slide.link || "/products"} size="lg" className="rounded-2xl shadow-xl shadow-blue-500/20">
                            Khám phá ngay
                          </Button>
                          <IconButton className="bg-white/10 backdrop-blur-xl border-white/10 text-white rounded-2xl h-12 w-12">
                            <ArrowRight size={20} />
                          </IconButton>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Glassmorphism Border Highlight */}
                  <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-x-4 top-1/2 z-30 flex -translate-y-1/2 justify-between pointer-events-none md:inset-x-8 lg:inset-x-12">
          <IconButton
            onClick={prevSlide}
            className="pointer-events-auto h-12 w-12 rounded-2xl border-white/5 bg-black/40 text-white backdrop-blur-xl hover:bg-white/10 sm:h-14 sm:w-14"
          >
            <ChevronLeft size={24} />
          </IconButton>
          <IconButton
            onClick={nextSlide}
            className="pointer-events-auto h-12 w-12 rounded-2xl border-white/5 bg-black/40 text-white backdrop-blur-xl hover:bg-white/10 sm:h-14 sm:w-14"
          >
            <ChevronRight size={24} />
          </IconButton>
        </div>
      </div>

      {/* Modern Progress Indicators */}
      <div className="mt-8 flex items-center justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="group relative p-2"
          >
            <div className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              index === currentIndex
                ? "w-12 bg-blue-500 shadow-[0_0_15px_rgba(0,91,255,0.7)]"
                : "w-3 bg-white/10 group-hover:bg-white/30"
            )} />
          </button>
        ))}
      </div>
    </section>
  );
}

export default HeroSlideshow;
