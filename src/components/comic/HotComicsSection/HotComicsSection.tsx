import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Star, TrendingUp, Zap, Eye, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { LazyImage } from '../../common/LazyImage';
import type { Comic } from '../../../types/comic.types';
import { useFavorites } from '../../../hooks/useFavorites';

interface HotComicsSectionProps {
  comics: Comic[];
}

export function HotComicsSection({ comics }: HotComicsSectionProps) {
  const [rotation, setRotation] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Responsive items per slide
  const getItemsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 5; // mobile - show 5 cards for better variety
      if (window.innerWidth < 1024) return 5; // tablet
      return 7; // desktop
    }
    return 7;
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  useEffect(() => {
    const handleResize = () => {
      const newItemsPerSlide = getItemsPerSlide();
      if (newItemsPerSlide !== itemsPerSlide) {
        setItemsPerSlide(newItemsPerSlide);
        // Reset rotation to 0 when changing screen size to avoid card shuffle
        setRotation(0);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerSlide]);

  // Auto rotate every 3 seconds
  useEffect(() => {
    if (!isDragging && hoveredCard === null) {
      const interval = setInterval(() => {
        setRotation((prev) => prev + (360 / itemsPerSlide));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [itemsPerSlide, isDragging, hoveredCard]);

  const handleComicClick = (slug: string) => {
    navigate(`/comic/${slug}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent, comic: Comic) => {
    e.stopPropagation();
    toggleFavorite(comic);
  };

  const nextSlide = () => {
    setRotation((prev) => prev + (360 / itemsPerSlide));
  };

  const prevSlide = () => {
    setRotation((prev) => prev - (360 / itemsPerSlide));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX;
    const diff = newX - currentX;
    setRotation((prev) => prev - diff * 0.3);
    setCurrentX(newX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const newX = e.touches[0].clientX;
    const diff = newX - currentX;
    setRotation((prev) => prev - diff * 0.3);
    setCurrentX(newX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Calculate cylinder radius based on screen size
  const getRadius = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 160; // mobile - smaller radius to fit better
      if (window.innerWidth < 1024) return 300; // tablet
      return 400; // desktop
    }
    return 400;
  };

  const [radius] = useState(getRadius());

  const displayComics = comics.slice(0, itemsPerSlide);

  return (
    <section className="relative py-16 overflow-hidden">

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <Flame className="w-12 h-12 text-orange-500/20" />
      </div>
      <div className="absolute top-40 right-20 animate-float-delayed">
        <Star className="w-10 h-10 text-yellow-500/20" />
      </div>
      <div className="absolute bottom-20 left-1/4 animate-float">
        <Zap className="w-14 h-14 text-red-500/20" />
      </div>

      <div className="w-full px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 backdrop-blur-sm rounded-full border border-orange-500/20 mb-4">
            <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              Đang thịnh hành
            </span>
            <TrendingUp className="w-5 h-5 text-red-500" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              Truyện HOT
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Những bộ truyện đang được yêu thích nhất hiện nay
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 backdrop-blur-sm rounded-full shadow-2xl hover:shadow-orange-500/50 hover:scale-110 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 backdrop-blur-sm rounded-full shadow-2xl hover:shadow-orange-500/50 hover:scale-110 transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* 3D Cylinder Carousel */}
          <div 
            className="relative h-[500px] md:h-[550px] lg:h-[600px] cursor-grab active:cursor-grabbing select-none overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ perspective: '2000px' }}
          >
            <div 
              className="absolute top-1/2 left-1/2 w-full h-full"
              style={{
                transformStyle: 'preserve-3d',
                transform: `translate(-50%, -50%) rotateY(${rotation}deg)`,
                transition: isDragging ? 'none' : 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {displayComics.map((comic, index) => {
                const angle = (360 / itemsPerSlide) * index;
                const cardRotation = rotation + angle;
                const normalizedRotation = ((cardRotation % 360) + 360) % 360;
                
                // Calculate z-index based on rotation (cards at front have higher z-index)
                const zIndex = normalizedRotation > 180 
                  ? Math.floor(normalizedRotation - 180)
                  : Math.floor(180 - normalizedRotation);
                
                // Calculate opacity and scale based on position
                const isFrontFacing = normalizedRotation > 90 && normalizedRotation < 270;
                const opacity = isFrontFacing ? 0.3 : 1;
                const scale = isFrontFacing ? 0.8 : 1;
                
                // Center card (facing front) gets extra highlight
                const isCenterCard = normalizedRotation < 30 || normalizedRotation > 330;

                return (
                  <div
                    key={comic.slug}
                    onClick={() => !isDragging && handleComicClick(comic.slug)}
                    onMouseEnter={() => !isDragging && setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="absolute top-1/2 left-1/2 w-[160px] md:w-[230px] lg:w-[260px]"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `
                        translate(-50%, -50%)
                        rotateY(${angle}deg)
                        translateZ(${radius}px)
                        scale(${hoveredCard === index ? 1.05 : scale})
                      `,
                      transition: isDragging ? 'none' : 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      zIndex: zIndex + (hoveredCard === index ? 1000 : 0),
                      opacity: hoveredCard === index ? 1 : opacity,
                      pointerEvents: isFrontFacing ? 'none' : 'auto',
                    }}
                  >
                    {/* Glow Effect */}
                    {isCenterCard && (
                      <div className="absolute -inset-4 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-3xl opacity-50 blur-2xl animate-pulse"></div>
                    )}
                    
                    {/* Card Container */}
                    <div className={`
                      relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden 
                      shadow-2xl border-2 transition-all duration-500 h-full
                      ${isCenterCard ? 'border-orange-500 shadow-orange-500/50' : 'border-gray-700'}
                      ${hoveredCard === index ? 'shadow-orange-600/60 border-orange-400' : ''}
                    `}>
                      {/* Rank Badge */}
                      <div className="absolute top-3 left-3 z-20">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-full blur-md opacity-75"></div>
                          <div className="relative px-3 py-1.5 bg-gradient-to-r from-orange-600 to-red-600 rounded-full shadow-xl">
                            <span className="text-xl font-black text-white">#{index + 1}</span>
                          </div>
                        </div>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => handleFavoriteClick(e, comic)}
                        className={`
                          absolute top-3 right-3 z-20 p-2 rounded-full shadow-lg
                          transition-all duration-300 hover:scale-110
                          ${isFavorite(comic.slug)
                            ? 'bg-gradient-to-r from-red-500 to-pink-500'
                            : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm'
                          }
                        `}
                      >
                        <Heart
                          className={`w-4 h-4 transition-all ${
                            isFavorite(comic.slug)
                              ? 'text-white fill-current'
                              : 'text-gray-600 dark:text-gray-300'
                          }`}
                        />
                      </button>

                      {/* Image Container */}
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <LazyImage
                          src={comic.thumb_url}
                          alt={comic.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60"></div>
                        
                        {/* Center Card Flame Effect - Bottom Right */}
                        {isCenterCard && (
                          <div className="absolute bottom-3 right-3">
                            <div className="relative">
                              <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
                              <div className="relative p-3 bg-gradient-to-r from-orange-500/40 to-red-500/40 backdrop-blur-md rounded-full border-2 border-orange-500/60">
                                <Flame className="w-8 h-8 text-orange-300 animate-pulse drop-shadow-lg" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Title Overlay on Image */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
                          <h3 className="text-white font-bold text-sm line-clamp-2 mb-1.5 leading-tight drop-shadow-lg">
                            {comic.name}
                          </h3>
                          <div className="flex items-center justify-between text-xs gap-2">
                            {comic.chaptersLatest && comic.chaptersLatest.length > 0 && (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600/90 backdrop-blur-sm rounded-full">
                                <Eye className="w-3 h-3 text-white" />
                                <span className="font-bold text-white">
                                  Ch.{comic.chaptersLatest[0].chapter_name}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-orange-600 to-red-600 backdrop-blur-sm rounded-full">
                              <TrendingUp className="w-3 h-3 text-white" />
                              <span className="font-bold text-white">HOT</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3 space-y-2 bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm">
                        {/* Stats Bar */}
                        <div className="flex items-center justify-between pb-2 border-b border-orange-500/30">
                          <div className="flex items-center gap-1.5 text-orange-400">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm font-bold">{1000 - index * 100}+ lượt đọc</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-bold text-white">{(4.9 - index * 0.1).toFixed(1)}</span>
                          </div>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-wrap gap-1.5">
                        {comic.category && comic.category.length > 0 && (
                          <>
                            {comic.category.slice(0, 2).map((cat: any, catIndex: number) => (
                              <span
                                key={cat._id || cat.id || catIndex}
                                className="px-2 py-0.5 bg-gradient-to-r from-orange-600/40 to-red-600/40 border border-orange-500/50 text-orange-300 text-[10px] font-semibold rounded-md backdrop-blur-sm"
                              >
                                {cat.name}
                              </span>
                            ))}
                            {comic.category.length > 2 && (
                              <span className="px-2.5 py-1 bg-gray-700/60 border border-gray-600 text-gray-300 text-xs font-semibold rounded-lg backdrop-blur-sm">
                                +{comic.category.length - 2}
                              </span>
                            )}
                          </>
                        )}
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-center pt-2">
                          <span className={`px-3 py-1 text-[10px] font-bold rounded-full border ${
                            comic.status === 'completed'
                              ? 'bg-green-600/30 border-green-500 text-green-300'
                              : 'bg-blue-600/30 border-blue-500 text-blue-300'
                          }`}>
                            {comic.status === 'completed' ? '✓ Hoàn thành' : '⚡ Đang cập nhật'}
                          </span>
                        </div>
                      </div>

                      {/* Shine Effect */}
                      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full animate-shine"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instruction Text */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
              <span className="inline-block w-6 h-6 rounded-full bg-gradient-to-r from-orange-600 to-red-600 animate-pulse"></span>
              Kéo để xoay hoặc dùng nút điều hướng
            </p>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 animate-fade-in">
          <button
            onClick={() => navigate('/search?status=hot')}
            className="group relative px-10 py-4 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white font-bold text-lg rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2">
              Xem tất cả truyện HOT
              <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default HotComicsSection;
