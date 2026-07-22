import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskLayerRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const scrollTextRef = useRef<HTMLDivElement>(null);
  const brandDescRef = useRef<HTMLDivElement>(null);
  const cursorContainerRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  const introOverlayRef = useRef<HTMLDivElement>(null);
  const introCircleRef = useRef<HTMLDivElement>(null);
  const introLogoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 0. Intro Animation
    const introCtx = gsap.context(() => {
      // Scramble animate the brand description and scroll text first
      const chars = document.querySelectorAll('.char-intro');
      if (chars) {
        gsap.fromTo(chars, 
          { opacity: 0 },
          { 
            opacity: 1, 
            duration: 0.1, 
            stagger: { amount: 1.5, from: "random" },
            ease: "power2.inOut",
            delay: 0.2 // align with Header animation
          }
        );
      }

      const tl = gsap.timeline();
      
      // Initially, the circle is invisible. Wait for text to finish (approx 1.5s), then fade in.
      gsap.set(introCircleRef.current, { opacity: 0 });
      
      tl.to(introCircleRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "+=1.6") // Wait for text scramble
      .to(introCircleRef.current, {
        scale: 4,
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut"
      }, "+=0.5") // Look at the circle for 0.5s
      .to(introLogoRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut"
      }, "<")
      .to(introOverlayRef.current, {
        opacity: 0,
        duration: 0.6, 
        ease: "power2.inOut",
        onComplete: () => {
          if (introOverlayRef.current) introOverlayRef.current.style.pointerEvents = 'none';
        }
      }, "-=0.4");
    }, containerRef);

    // 1. Mouse Tracking Logic for Gooey Cursor
    const handleMouseMove = (e: MouseEvent) => {
      if (!trailsRef.current.length) return;
      
      // Main head blob follows instantly
      gsap.to(trailsRef.current[0], { 
        x: e.clientX, 
        y: e.clientY, 
        duration: 0.05,
        ease: "none"
      });
      
      // Tail blobs follow with a delayed stagger, creating the stretchy liquid effect
      gsap.to(trailsRef.current.slice(1), {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        stagger: 0.04,
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 2. Scroll Animation Logic
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=400%', 
          scrub: 1, 
          pin: true, 
          anticipatePin: 1
        }
      });

      // Fade out the Gooey Cursor immediately when scroll begins
      tl.to(cursorContainerRef.current, {
        opacity: 0,
        duration: 0.1
      }, 0);

      // Scale the Mask Layer massively via GPU transform to fly through
      tl.to(maskLayerRef.current, {
        scale: 400, 
        ease: 'power3.in',
        duration: 0.8
      }, 0);

      // FADE OUT the Mask Layer right at the end to guarantee a clean pass-through
      tl.to(maskLayerRef.current, {
        opacity: 0,
        ease: 'power1.in',
        duration: 0.1
      }, 0.7);

      // Fade out the "Scroll to Enter" and Brand Description text immediately upon scroll
      tl.to([scrollTextRef.current, brandDescRef.current], {
        opacity: 0,
        duration: 0.1
      }, 0);

      // 3D Camera Move into the collage (using scale to prevent Z-depth background clipping)
      tl.fromTo(collageRef.current, {
        scale: 0.8 // Start pushed back
      }, {
        scale: 1.5, // Pull forward into the scene
        ease: 'power2.inOut',
        duration: 0.8
      }, 0);

      // Fade out the entire collage at the very end to transition to Section 2
      tl.to(collageRef.current, {
        opacity: 0,
        ease: 'power2.inOut',
        duration: 0.2
      }, 0.8);

      // Fake 3D Parallax & Outward Spread: Sync with the main zoom!
      gsap.utils.toArray('.collage-img').forEach((img: any) => {
        const xSpread = img.getAttribute('data-x-spread') || '0';
        const ySpread = img.getAttribute('data-y-spread') || '0';
        
        tl.to(img, {
          x: xSpread,
          y: ySpread,
          ease: "power2.inOut", // match the collage scale ease
          duration: 0.8 // match the collage scale duration
        }, 0);
      });

    }, containerRef);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ctx.revert();
      introCtx.revert();
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      style={{ 
        height: '100vh', 
        width: '100%', 
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#000000', 
        cursor: 'none' // Hide default cursor to show only gooey trail
      }}
    >
      {/* SVG Definitions for the Gooey Filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <filter id="goo" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
        </filter>
      </svg>

      {/* Base Layer: Dark Collage & Video */}
      <div
        ref={collageRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Background base image (farthest back, static) */}
        <img
          src="/abstract_background.png" alt="Base Texture"
          style={{
            position: 'absolute',
            width: '100vw', 
            height: '100vh', 
            objectFit: 'cover',
            zIndex: 1,
            opacity: 0.4,
            transform: 'scale(1.1)' 
          }}
        />

        {/* 1. NEW Main Center Image (Revealed as others spread) */}
        <video 
          src="/cinematic_eye.mp4" 
          autoPlay loop muted playsInline
          style={{ 
            position: 'absolute', width: '35vw', height: '50vh', objectFit: 'cover', 
            top: '50%', left: '50%', zIndex: 2, 
            transform: 'translate(-50%, -50%) scale(1.0)', opacity: 1, borderRadius: '8px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.9)'
          }}
        />

        {/* Fake 3D Image Collages - Spreading Outwards */}
        <img 
          className="collage-img" data-x-spread="-60vw" data-y-spread="-60vh"
          src="/floating_rock.png" alt="Floating Rock"
          style={{ 
            position: 'absolute', width: '35vw', height: '40vh', objectFit: 'cover', 
            top: '10%', left: '10%', zIndex: 3, 
            transform: 'scale(0.7)', opacity: 0.8, borderRadius: '8px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
          }}
        />
        <img 
          className="collage-img" data-x-spread="60vw" data-y-spread="60vh"
          src="/motion_blur_figure.png" alt="Motion Blur Figure"
          style={{ 
            position: 'absolute', width: '30vw', height: '45vh', objectFit: 'cover', 
            bottom: '10%', right: '5%', zIndex: 4, 
            transform: 'scale(0.85)', opacity: 0.9, borderRadius: '8px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
          }}
        />
        <video 
          className="collage-img" data-x-spread="60vw" data-y-spread="-60vh"
          src="/side_video.mp4"
          autoPlay loop muted playsInline
          style={{ 
            position: 'absolute', width: '25vw', height: '35vh', objectFit: 'cover', 
            top: '30%', right: '35%', zIndex: 5, 
            transform: 'scale(1.0)', opacity: 0.95, borderRadius: '8px',
            boxShadow: '0 30px 50px rgba(0,0,0,0.9)'
          }}
        />
        <video 
          className="collage-img" data-x-spread="-60vw" data-y-spread="60vh"
          src="/bottom_left_video.mp4"
          autoPlay loop muted playsInline
          style={{ 
            position: 'absolute', width: '40vw', height: '30vh', objectFit: 'cover', 
            bottom: '25%', left: '20%', zIndex: 6, 
            transform: 'scale(1.2)', opacity: 1, borderRadius: '8px',
            boxShadow: '0 40px 60px rgba(0,0,0,1)'
          }}
        />

        {/* Fake Inner Shadow / Vignette Effect directly over the collage */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, transparent 10vw, rgba(0,0,0,0.6) 30vw, rgba(0,0,0,0.95) 50vw)'
          }}
        />
      </div>

      {/* Parent Wrapper for z-index layering and applying the inner glow drop-shadow */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          // The parent applies the filter to the fully rendered mask hole, guaranteeing the glow!
          filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.5))'
        }}
      >
        {/* Mask Layer: Black Wall with Native CSS Mask (INVERTED to cut a hole) */}
        <div 
          ref={maskLayerRef}
          style={{ 
            position: 'absolute', 
            inset: '-20vh -20vw', // Bleed the edges slightly
            backgroundColor: '#000000', // Black wall
            
            WebkitMaskImage: `url('/logo.svg'), linear-gradient(#fff, #fff)`,
            WebkitMaskPosition: 'center, center',
            WebkitMaskRepeat: 'no-repeat, no-repeat',
            WebkitMaskSize: '30vw, 100% 100%',
            WebkitMaskComposite: 'destination-out', // Safari/Chrome
            
            maskImage: `url('/logo.svg'), linear-gradient(#fff, #fff)`,
            maskPosition: 'center, center',
            maskRepeat: 'no-repeat, no-repeat',
            maskSize: '30vw, 100% 100%',
            maskComposite: 'exclude', // Standard Firefox
            
            transformOrigin: 'center center',
            willChange: 'transform, opacity'
          } as React.CSSProperties}
        />
      </div>

      {/* Gooey Cursor Trail Layer */}
      <div
        ref={cursorContainerRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 100, // Topmost layer
          pointerEvents: 'none',
          filter: 'url(#goo)' // Applies the sticky liquid merge effect to the blobs
        }}
      >
        {/* Generate 5 trailing blobs */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            ref={(el) => { trailsRef.current[i] = el; }}
            style={{
              position: 'fixed', // Fixed to viewport so it tracks screen mouse coordinates accurately
              top: 0, left: 0,
              width: i === 0 ? '40px' : `${30 - i * 4}px`, // Head is biggest, tail tapers off
              height: i === 0 ? '40px' : `${30 - i * 4}px`,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF', // White liquid droplets
              transform: 'translate(-50%, -50%)',
              willChange: 'transform'
            }}
          />
        ))}
      </div>



      {/* 0. Intro Overlay Layer (Solid Black, White Circle -> White Logo) */}
      <div 
        ref={introOverlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#000000',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'url(#goo)' // Gooey morph magic
          }}
        >
          {/* The Initial White Circle */}
          <div 
            ref={introCircleRef}
            style={{
              position: 'absolute',
              width: '4vw',
              height: '4vw',
              backgroundColor: '#ffffff',
              borderRadius: '50%',
              willChange: 'transform, opacity'
            }}
          />

          {/* The White Logo Morph Target */}
          <div 
            ref={introLogoRef}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#ffffff',
              WebkitMaskImage: `url('/logo.svg')`,
              WebkitMaskPosition: 'center',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskSize: '30vw',
              maskImage: `url('/logo.svg')`,
              maskPosition: 'center',
              maskRepeat: 'no-repeat',
              maskSize: '30vw',
              opacity: 0,
              transform: 'scale(0.5)',
              willChange: 'transform, opacity'
            }}
          />
        </div>
      </div>

      {/* Instructional Text */}
      <div 
        ref={scrollTextRef}
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '3rem', // Moved to right
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          zIndex: 101, // Raised above overlay
          pointerEvents: 'none',
          mixBlendMode: 'difference' // Added to ensure visibility
        }}
      >
        <span style={{
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: '#FFFFFF', 
          fontFamily: 'var(--font-sans)',
          fontWeight: 500,
          display: 'flex'
        }}>
          {"SCROLL DOWN".split('').map((char, i) => (
            <span key={i} className="char-intro" style={{ opacity: 0 }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </span>
      </div>

      {/* Brand Description (Bottom Left) */}
      <div 
        ref={brandDescRef}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '3rem',
          zIndex: 101, // HIGHER than intro overlay so it is visible immediately
          pointerEvents: 'none',
          color: '#ffffff',
          fontFamily: 'var(--font-sans)',
          fontWeight: 800,
          fontSize: 'clamp(1rem, 1.5vw, 1.8rem)', // Responsive sizing
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          maxWidth: '45vw',
          mixBlendMode: 'difference',
          display: 'flex',
          flexWrap: 'wrap'
        }}
      >
        <span style={{ width: '100%', display: 'flex' }}>
          {"WE OFFER CREATIVE DIRECTION".split('').map((char, i) => (
            <span key={`line1-${i}`} className="char-intro" style={{ opacity: 0 }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </span>
        <span style={{ width: '100%', display: 'flex' }}>
          {"& PRODUCTION FOR EXHIBITIONS.".split('').map((char, i) => (
            <span key={`line2-${i}`} className="char-intro" style={{ opacity: 0 }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </span>
      </div>
    </section>
  );
};

export default Hero;
