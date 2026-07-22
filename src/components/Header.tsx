import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Header: React.FC = () => {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;
    const chars = headerRef.current.querySelectorAll('.char');
    gsap.fromTo(chars, 
      { opacity: 0 },
      { 
        opacity: 1, 
        duration: 0.1, 
        stagger: { amount: 1.5, from: "random" },
        ease: "power2.inOut",
        delay: 0.2 // slight delay after page load
      }
    );
  }, []);

  return (
    <header 
      ref={headerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: '2rem 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        color: '#fff',
        mixBlendMode: 'difference', // Ensures the header is visible against any background
        pointerEvents: 'none' // The wrapper shouldn't block clicks
      }}
    >
      {/* Left: Logo and Brand Name */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          pointerEvents: 'auto',
          cursor: 'pointer'
        }}
      >
        <img 
          src="/logo.svg" 
          alt="27 Degrees Celsius Logo" 
          style={{ 
            width: '32px', 
            height: '32px', 
            filter: 'brightness(0) invert(1)' // Forces the logo to be white
          }} 
        />
        <span 
          style={{ 
            fontFamily: 'var(--font-sans)', 
            fontWeight: 800, // Extra Bold
            fontSize: '1.2rem', // Slightly smaller since the text is much longer now
            letterSpacing: '0.05em', // Added a bit of letter spacing for readability
            textTransform: 'uppercase',
            display: 'flex'
          }}
        >
          {"27 DEGREES CELSIUS".split('').map((char, i) => (
            <span key={i} className="char" style={{ opacity: 0 }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </span>
      </div>

      {/* Right: Navigation Links */}
      <nav 
        style={{ 
          display: 'flex', 
          gap: '2.5rem',
          pointerEvents: 'auto'
        }}
      >
        {['HOME', 'GALLERY', 'WORK', 'ABOUT', 'CONTACT'].map((item) => (
          <a 
            key={item} 
            href={`#${item.toLowerCase()}`}
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'opacity 0.3s ease',
              display: 'flex'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            {item.split('').map((char, i) => (
              <span key={i} className={`char char-${item}`} style={{ opacity: 0 }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Header;
