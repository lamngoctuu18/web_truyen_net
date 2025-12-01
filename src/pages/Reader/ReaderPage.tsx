import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Home, List, Settings, ChevronsLeft, ChevronsRight, X, BookOpen, Check } from 'lucide-react';
import { Loading } from '../../components/common/Loading';
import { useReadingHistory } from '../../hooks/useReadingHistory';

interface ChapterImage {
  image_page: number;
  image_file: string;
}

interface ChapterItem {
  _id: string;
  comic_name: string;
  chapter_name: string;
  chapter_title: string;
  chapter_path: string;
  chapter_image: ChapterImage[];
}

interface ChapterData {
  domain_cdn: string;
  item: ChapterItem;
}

export function ReaderPage() {
  const { slug, chapter } = useParams<{ slug: string; chapter: string }>();
  const navigate = useNavigate();
  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [showChapterList, setShowChapterList] = useState(false);
  const [showChapterDropup, setShowChapterDropup] = useState(false);
  const [comicData, setComicData] = useState<any>(null);
  const { history, addToHistory } = useReadingHistory();
  const dropupRef = useRef<HTMLDivElement>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showHeader, setShowHeader] = useState(true);

  // First, fetch comic detail to get chapter API URL
  useEffect(() => {
    const fetchComicDetail = async () => {
      try {
        const response = await fetch(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`);
        const data = await response.json();
        
        console.log('Comic detail response:', data);
        
        if (data.status === 'success' && data.data?.item) {
          setComicData(data.data.item);
          console.log('Comic data loaded:', data.data.item);
        }
      } catch (err) {
        console.error('Error fetching comic detail:', err);
      }
    };

    if (slug) {
      fetchComicDetail();
    }
  }, [slug]);

  useEffect(() => {
    const fetchChapter = async () => {
      if (!comicData || !comicData.chapters) {
        console.log('Waiting for comic data...', { comicData });
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Get chapter list from server_data
        const chapterList = comicData.chapters[0]?.server_data || [];
        const chapterIndex = parseInt(chapter || '1') - 1;
        const chapterInfo = chapterList[chapterIndex];
        
        console.log('Chapter info:', { 
          chapterIndex, 
          chapterInfo, 
          totalChapters: chapterList.length,
          slug,
          chapter,
          comicDataStructure: {
            hasChapters: !!comicData.chapters,
            chaptersLength: comicData.chapters?.length,
            hasServerData: !!comicData.chapters?.[0]?.server_data,
            serverDataLength: comicData.chapters?.[0]?.server_data?.length
          }
        });
        
        if (!chapterInfo || !chapterInfo.chapter_api_data) {
          console.error('Missing chapter info:', { chapterInfo, chapterList, chapterIndex });
          setError('Không tìm thấy chương này');
          setLoading(false);
          return;
        }

        console.log('Fetching chapter from:', chapterInfo.chapter_api_data);
        const response = await fetch(chapterInfo.chapter_api_data);
        const data = await response.json();
        
        console.log('Chapter data response:', data);
        
        if (data.status === 'success' && data.data) {
          setChapterData(data.data);
          
          // Add to reading history
          if (comicData && slug) {
            addToHistory({
              comicSlug: slug,
              comicName: comicData.name,
              chapterNumber: parseInt(chapter || '1'),
              chapterName: `Chapter ${chapter}`,
              readAt: new Date().toISOString(),
              thumbUrl: comicData.thumb_url
            });
          }
          
          console.log('Chapter loaded successfully:', {
            name: data.data.item.comic_name,
            chapter: data.data.item.chapter_name,
            images: data.data.item.chapter_image?.length,
            domain: data.data.domain_cdn
          });
        } else {
          console.error('Invalid chapter response:', data);
          setError('Dữ liệu chương không hợp lệ');
        }
      } catch (err) {
        console.error('Chapter fetch error:', {
          error: err,
          slug,
          chapter
        });
        setError(`Lỗi khi tải chương: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    if (comicData && chapter) {
      fetchChapter();
      window.scrollTo(0, 0);
    }
  }, [comicData, chapter]);

  // Close dropup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropupRef.current && !dropupRef.current.contains(event.target as Node)) {
        setShowChapterDropup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll to show/hide header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
      }
      
      // Always show header at the top
      if (currentScrollY < 100) {
        setShowHeader(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handlePrevChapter = () => {
    const chapterNum = parseInt(chapter || '1');
    if (chapterNum > 1) {
      navigate(`/comic/${slug}/chapter/${chapterNum - 1}`);
    }
  };

  const handleNextChapter = () => {
    const chapterNum = parseInt(chapter || '1');
    const chapterList = comicData?.chapters?.[0]?.server_data || [];
    const totalChapters = chapterList.length;
    if (chapterNum < totalChapters) {
      navigate(`/comic/${slug}/chapter/${chapterNum + 1}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loading size="lg" text="Đang tải chương..." />
      </div>
    );
  }

  if (error || !chapterData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="bg-red-900/20 border border-red-500 rounded-xl p-8 max-w-md text-center">
          <h3 className="text-xl font-bold text-red-400 mb-4">Không thể tải chương</h3>
          <p className="text-red-300 mb-6">{error}</p>
          <Link
            to={`/comic/${slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            Quay lại trang truyện
          </Link>
        </div>
      </div>
    );
  }

  const domain = chapterData.domain_cdn || 'https://sv1.otruyencdn.com';
  const totalPages = chapterData.item.chapter_image?.length || 0;
  const chapterNum = parseInt(chapter || '1');
  const chapterList = comicData?.chapters?.[0]?.server_data || [];
  const totalChapters = chapterList.length;

  return (
    <div className="min-h-screen bg-black">
      {/* Header Controls */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm transition-all duration-300 ${
          showHeader && showControls ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to={`/comic/${slug}`}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                title="Quay lại"
              >
                <ChevronLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {chapterData.item.comic_name}
                </h1>
                <p className="text-gray-300 text-lg">
                  Chapter {chapterData.item.chapter_name}
                  {chapterData.item.chapter_title && ` - ${chapterData.item.chapter_title}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                title="Trang chủ"
              >
                <Home className="w-6 h-6" />
              </Link>
              <button
                onClick={() => setShowChapterList(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                title="Danh sách chương"
              >
                <List className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Images */}
      <div className="relative">
        <div className="max-w-4xl mx-auto">
          {chapterData.item.chapter_image && chapterData.item.chapter_image.length > 0 ? (
            chapterData.item.chapter_image.map((image: ChapterImage, index: number) => {
              const imageUrl = `${domain}/${chapterData.item.chapter_path}/${image.image_file}`;
              return (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Trang ${image.image_page}`}
                  className="w-full h-auto block"
                  loading={index < 3 ? 'eager' : 'lazy'}
                />
              );
            })
          ) : (
            <div className="text-center text-white py-20">
              Không có hình ảnh
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/90 to-transparent backdrop-blur-sm transition-all duration-300 ${
          showControls ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4 py-6">
          {/* Page Info */}
          <div className="text-center mb-4">
            <p className="text-white text-sm">
              <span className="font-semibold">{totalPages}</span> trang
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handlePrevChapter}
              disabled={parseInt(chapter || '1') <= 1}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
              title="Chương trước"
            >
              <ChevronsLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Chương trước</span>
            </button>

            {/* Chapter Selector Dropup */}
            <div className="relative" ref={dropupRef}>
              <button
                onClick={() => setShowChapterDropup(!showChapterDropup)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all min-w-[140px]"
                title="Chọn chương"
              >
                <span>Chapter {chapter}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${showChapterDropup ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropup Menu */}
              {showChapterDropup && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 max-h-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl overflow-hidden z-[60]">
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Chọn chương</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{chapterData?.item.comic_name}</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    {chapterList.map((chapterItem: any, index: number) => {
                      const chapterNum = index + 1;
                      const isCurrentChapter = chapterNum === parseInt(chapter || '1');
                      const isRead = history.some(
                        (h: any) => h.comicSlug === slug && h.chapterNumber >= chapterNum
                      );

                      return (
                        <button
                          key={`dropup-${chapterItem.filename}-${index}`}
                          onClick={() => {
                            navigate(`/comic/${slug}/chapter/${chapterNum}`);
                            setShowChapterDropup(false);
                          }}
                          className={`w-full px-4 py-3 text-left transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                            isCurrentChapter
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                              : isRead
                              ? 'opacity-60 text-gray-500 dark:text-gray-400'
                              : 'text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>Chapter {chapterItem.chapter_name}</span>
                            <div className="flex items-center gap-2">
                              {isCurrentChapter && (
                                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                                  Hiện tại
                                </span>
                              )}
                              {isRead && !isCurrentChapter && (
                                <Check className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                          </div>
                          {chapterItem.chapter_title && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                              {chapterItem.chapter_title}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleNextChapter}
              disabled={chapterNum >= totalChapters}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
              title="Chương tiếp"
            >
              <span className="hidden sm:inline">Chương tiếp</span>
              <ChevronsRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Controls Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full transition-all"
        title={showControls ? 'Ẩn điều khiển' : 'Hiện điều khiển'}
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Chapter List Modal */}
      {showChapterList && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Danh sách chương
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {chapterData?.item.comic_name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowChapterList(false)}
                className="p-2 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Chapter List */}
            <div className="overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {chapterList.map((chapterItem: any, index: number) => {
                  const chapterNum = index + 1;
                  const isCurrentChapter = chapterNum === parseInt(chapter || '1');
                  const isRead = history.some(
                    (h: any) => h.comicSlug === slug && h.chapterNumber >= chapterNum
                  );

                  return (
                    <button
                      key={`${chapterItem.filename}-${index}`}
                      onClick={() => {
                        navigate(`/comic/${slug}/chapter/${chapterNum}`);
                        setShowChapterList(false);
                      }}
                      className={`w-full p-4 text-left transition-all group ${
                        isCurrentChapter
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-l-4 border-blue-500'
                          : isRead
                          ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50 opacity-60'
                          : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/10 dark:hover:to-purple-900/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className={`flex-shrink-0 w-10 h-10 flex items-center justify-center font-bold rounded-lg transition-all ${
                            isCurrentChapter
                              ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white scale-110'
                              : isRead
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                              : 'bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-105'
                          }`}>
                            {chapterNum}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold transition-colors truncate ${
                              isCurrentChapter
                                ? 'text-blue-600 dark:text-blue-400'
                                : isRead
                                ? 'text-gray-500 dark:text-gray-400'
                                : 'text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
                            }`}>
                              Chapter {chapterItem.chapter_name}
                            </h4>
                            {chapterItem.chapter_title && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-0.5">
                                {chapterItem.chapter_title}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isCurrentChapter && (
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold rounded-full">
                              Đang đọc
                            </span>
                          )}
                          {isRead && !isCurrentChapter && (
                            <Check className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReaderPage;
