import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Calculator from '../components/Calculator';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Load animation (auto-play on mount)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Image fade in
      tl.fromTo(
        imageRef.current,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 0.9 },
        0
      );

      // Headline lines stagger
      const headlineLines = headlineRef.current?.querySelectorAll('.headline-line');
      if (headlineLines) {
        tl.fromTo(
          headlineLines,
          { y: 60, opacity: 0, rotateX: 18 },
          { y: 0, opacity: 1, rotateX: 0, duration: 0.7, stagger: 0.08 },
          0.15
        );
      }

      // Subheadline
      tl.fromTo(
        subheadlineRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.4
      );

      // Calculator panel
      tl.fromTo(
        calculatorRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.5
      );

      // CTA
      tl.fromTo(
        ctaRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        0.6
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven exit animation
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset all elements to visible when scrolling back to top
            gsap.set([headlineRef.current, imageRef.current, calculatorRef.current, subheadlineRef.current, ctaRef.current], {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            });
          },
        },
      });

      // ENTRANCE (0-30%): Hold - elements already visible from load animation
      // Just subtle parallax on image
      scrollTl.fromTo(
        imageRef.current,
        { y: -10 },
        { y: 0, ease: 'none' },
        0
      );

      // SETTLE (30-70%): Static

      // EXIT (70-100%): Elements exit
      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-40vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        imageRef.current,
        { x: 0, scale: 1, opacity: 1 },
        { x: '18vw', scale: 1.08, opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        calculatorRef.current,
        { y: 0, opacity: 1 },
        { y: '18vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        [subheadlineRef.current, ctaRef.current],
        { y: 0, opacity: 1 },
        { y: '12vh', opacity: 0, ease: 'power2.in' },
        0.75
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="pinned-section bg-[#0B0C10] z-10"
    >
      {/* Background vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_50%,rgba(0,0,0,0.4)_100%)]" />

      {/* Hero Image (right side) */}
      <div
        ref={imageRef}
        className="absolute hidden lg:block rounded-md overflow-hidden"
        style={{
          left: '52vw',
          top: '10vh',
          width: '42vw',
          height: '80vh',
          backgroundImage: 'url(/hero-prolife.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Mobile background image */}
      <div className="absolute inset-0 lg:hidden overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/hero-prolife.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/80 to-transparent" />
      </div>

      {/* Content (left side) */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-[7vw]">
        {/* Headline */}
        <div
          ref={headlineRef}
          className="mb-6 lg:mb-8 lg:max-w-[44vw]"
        >
          <div className="hero-headline text-[#F4F6F8] leading-[0.88]" style={{ fontSize: 'clamp(40px, 7vw, 108px)' }}>
            <div className="headline-line">ДОСТАВКА</div>
            <div className="headline-line">ИЗ КИТАЯ</div>
            <div className="headline-line text-[#4A90A4]">ЗА 12 ДНЕЙ</div>
          </div>
        </div>

        {/* Subheadline */}
        <div
          ref={subheadlineRef}
          className="mb-6 lg:mb-8 lg:max-w-[44vw]"
        >
          <p className="mono-label text-[#A9B1BA]">
            В БИШКЕК · ТАМОЖНЯ ВКЛЮЧЕНА · ЛИЧНЫЙ МЕНЕДЖЕР 24/7
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
            <span className="font-mono text-xs text-[#A9B1BA]">Ближайшая отправка — 24 марта</span>
          </div>
        </div>

        {/* Calculator Panel */}
        <div
          ref={calculatorRef}
          className="w-full lg:w-[44vw] mb-6"
        >
          <Calculator />
        </div>

        {/* Spacer ref for GSAP exit animation */}
        <div ref={ctaRef} />
      </div>
    </section>
  );
};

export default HeroSection;
