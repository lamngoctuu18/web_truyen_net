import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image - Demon Slayer */}
      <div className="fixed inset-0 z-0 demon-slayer-bg">
        {/* Subtle overlay for readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Header onSearch={handleSearch} />
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}

export default Layout;