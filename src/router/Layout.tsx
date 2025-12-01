import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import bgImage from '../assets/anhbackground.jpg?url';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image Layer */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#0f172a'
        }}
      >
        {/* Single overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90 dark:from-slate-950/85 dark:via-slate-950/75 dark:to-slate-950/90"></div>
      </div>
      
      {/* Content */}
      <Header onSearch={handleSearch} />
      <main className="w-full relative">{children}</main>
    </div>
  );
}

export default Layout;