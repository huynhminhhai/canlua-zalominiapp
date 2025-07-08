import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {

    const scrollElement = document.querySelector('body');
    if (!scrollElement) return;

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;

      target.scrollTo({ top: 0, behavior: 'auto' });

      scrollElement.removeEventListener('scroll', handleScroll);
    };

    scrollElement.addEventListener('scroll', handleScroll, { once: true });

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;