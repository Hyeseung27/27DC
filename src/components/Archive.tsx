import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Archive: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in text from bottom when scrolling into view
      gsap.fromTo(
        textRef.current?.children ? Array.from(textRef.current.children) : [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );

      // Reveal image container with clipPath and scale
      gsap.fromTo(
        imageContainerRef.current,
        { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
        {
          clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
          duration: 1.5,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );

      // Parallax scale effect on the image itself
      gsap.fromTo(
        imageRef.current,
        { scale: 1.2 },
        {
          scale: 1,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#050505',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: '10vh 5vw',
        zIndex: 20,
        overflow: 'hidden'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        gap: '5vw',
        alignItems: 'center'
      }}>
        
        {/* Left Side: Typography */}
        <div ref={textRef} style={{ flex: '1 1 400px', zIndex: 2 }}>
          <p style={{ 
            fontFamily: 'var(--font-sans)', 
            fontSize: '0.9rem', 
            letterSpacing: '0.2em', 
            textTransform: 'uppercase', 
            color: '#888',
            marginBottom: '2vh'
          }}>
            Our Flagship Project
          </p>
          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: 'clamp(3rem, 5vw, 6rem)', 
            margin: '0 0 3vh 0',
            lineHeight: 1.1,
            textTransform: 'uppercase',
            color: '#ffffff'
          }}>
            OWNWARD<br />2026
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.2rem',
            lineHeight: 1.6,
            color: '#aaa',
            maxWidth: '500px',
            marginBottom: '5vh'
          }}>
            OWNWARD is an immersive exhibition designed to give weary modern individuals a moment of reflection. Through diverse experiential spaces, it offers a journey of healing and new discoveries.
          </p>
          
          <button style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            color: '#fff',
            padding: '15px 30px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            borderRadius: '4px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.color = '#000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#fff';
          }}
          onClick={() => {
            window.open('https://27dc-exhibition.vercel.app/', '_blank');
          }}
          >
            Go to Exhibition
          </button>
        </div>

        {/* Right Side: Showcase Image */}
        <div style={{ flex: '1 1 500px', position: 'relative', minHeight: '60vh' }}>
          <div 
            ref={imageContainerRef}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '60vh',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <img 
              ref={imageRef}
              src="/ownward.png" 
              alt="Flagship Project Reveal" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
                filter: 'brightness(0.9) contrast(1.1)'
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Archive;
