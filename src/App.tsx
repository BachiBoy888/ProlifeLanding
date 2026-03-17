import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './sections/HeroSection';
import SpeedSection from './sections/SpeedSection';
import CoverageSection from './sections/CoverageSection';
import TrustSection from './sections/TrustSection';
import SafetySection from './sections/SafetySection';
import HowItWorksSection from './sections/HowItWorksSection';
import ServicesSection from './sections/ServicesSection';
import TestimonialsSection from './sections/TestimonialsSection';
import ContactSection from './sections/ContactSection';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function App() {
  // Slide navigation for pinned sections
  useEffect(() => {
    const SLIDE_DURATION = 0.85;  // секунды — длительность анимированного перехода
    const LOCK_MS = 950;          // чуть дольше SLIDE_DURATION, чтобы не двойной триггер
    const EXIT_BUFFER = 60;       // px ниже maxPinned, где ещё перехватываем wheel

    let isLocked = false;
    let lockTimer: ReturnType<typeof setTimeout> | null = null;
    let currentTween: gsap.core.Tween | null = null;
    let wheelHandler: ((e: WheelEvent) => void) | null = null;
    let keyHandler: ((e: KeyboardEvent) => void) | null = null;

    const lock = () => {
      isLocked = true;
      if (lockTimer) clearTimeout(lockTimer);
      lockTimer = setTimeout(() => { isLocked = false; }, LOCK_MS);
    };

    // Ждём инициализации всех ScrollTrigger
    const initTimer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter((st) => st.vars.pin)
        .sort((a, b) => a.start - b.start);

      if (pinned.length === 0) return;

      // Центр каждого pinned-диапазона = settled-позиция слайда
      const settled: number[] = pinned.map(
        (st) => st.start + (st.end - st.start) * 0.5
      );
      const maxPinned = pinned[pinned.length - 1].end;

      const getCurrentIndex = () => {
        const y = window.scrollY;
        return settled.reduce(
          (best, pos, i) =>
            Math.abs(pos - y) < Math.abs(settled[best] - y) ? i : best,
          0
        );
      };

      const goTo = (index: number) => {
        if (isLocked || index < 0 || index >= settled.length) return;
        lock();
        if (currentTween) currentTween.kill();
        // Плавный анимированный переход — GSAP ScrollToPlugin
        currentTween = gsap.to(window, {
          scrollTo: { y: settled[index], autoKill: false },
          duration: SLIDE_DURATION,
          ease: 'power2.inOut',
        });
      };

      const exitToFlowing = () => {
        lock();
        if (currentTween) currentTween.kill();
        currentTween = gsap.to(window, {
          scrollTo: { y: maxPinned + EXIT_BUFFER + 1, autoKill: false },
          duration: SLIDE_DURATION,
          ease: 'power2.inOut',
        });
      };

      wheelHandler = (e: WheelEvent) => {
        const y = window.scrollY;
        if (y > maxPinned + EXIT_BUFFER) return; // flowing zone — свободный скролл
        if (y <= 0 && e.deltaY < 0) return;      // самый верх страницы

        e.preventDefault();
        if (isLocked) return;

        const i = getCurrentIndex();
        if (e.deltaY > 0) {
          if (i < settled.length - 1) goTo(i + 1);
          else exitToFlowing();
        } else {
          goTo(i - 1);
        }
      };

      keyHandler = (e: KeyboardEvent) => {
        const y = window.scrollY;
        if (y > maxPinned + EXIT_BUFFER) return;

        const i = getCurrentIndex();
        switch (e.key) {
          case 'ArrowDown':
          case 'PageDown':
          case ' ':
            e.preventDefault();
            if (i < settled.length - 1) goTo(i + 1);
            else exitToFlowing();
            break;
          case 'ArrowUp':
          case 'PageUp':
            e.preventDefault();
            goTo(i - 1);
            break;
        }
      };

      window.addEventListener('wheel', wheelHandler, { passive: false });
      window.addEventListener('keydown', keyHandler);
    }, 200);

    return () => {
      clearTimeout(initTimer);
      if (lockTimer) clearTimeout(lockTimer);
      if (currentTween) currentTween.kill();
      if (wheelHandler) window.removeEventListener('wheel', wheelHandler);
      if (keyHandler) window.removeEventListener('keydown', keyHandler);
    };
  }, []);

  // Cleanup all ScrollTriggers on unmount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="relative bg-[#0B0C10] min-h-screen">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="relative">
        {/* Pinned sections with z-index stacking */}
        <HeroSection />
        <SpeedSection />
        <CoverageSection />
        <TrustSection />
        <SafetySection />

        {/* Flowing sections */}
        <HowItWorksSection />
        <ServicesSection />
        <TestimonialsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
