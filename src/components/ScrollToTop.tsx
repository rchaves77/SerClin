import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      title="Voltar ao topo"
      className="fixed bottom-6 right-6 z-50 p-3 md:p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-600/30 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center justify-center cursor-pointer"
    >
      <ArrowUp className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}

export default ScrollToTop;
