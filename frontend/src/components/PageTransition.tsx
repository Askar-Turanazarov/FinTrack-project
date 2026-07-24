import { useLocation } from 'react-router-dom';
import { useEffect, useState, type ReactNode } from 'react';

/**
 * Обёртка для анимации переходов между страницами.
 * При смене маршрута применяет fade-in + slide-up эффект.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('entered');

  useEffect(() => {
    // При смене маршрута: сначала скрыть, потом показать новую страницу
    setTransitionStage('exiting');

    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setTransitionStage('entering');

      const enterTimer = setTimeout(() => {
        setTransitionStage('entered');
      }, 50);

      return () => clearTimeout(enterTimer);
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Обновляем children при их изменении (без смены маршрута)
  useEffect(() => {
    setDisplayChildren(children);
  }, [children]);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        transitionStage === 'exiting'
          ? 'opacity-0 translate-y-3'
          : transitionStage === 'entering'
          ? 'opacity-0 translate-y-3'
          : 'opacity-100 translate-y-0'
      }`}
    >
      {displayChildren}
    </div>
  );
}
