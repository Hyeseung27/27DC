import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Details: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.detail-item', 
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.2, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%'
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      style={{ 
        padding: '20vh 10vw 10vh 10vw',
        position: 'relative',
        zIndex: 2,
        backgroundColor: 'var(--color-bg)',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '4rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div className="detail-item">
          <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Location</p>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 300, color: 'var(--color-text)' }}>
            The Grand Archive<br/>
            Seoul, South Korea
          </h3>
        </div>
        
        <div className="detail-item">
          <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Dates</p>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 300, color: 'var(--color-text)' }}>
            Nov 12 - Dec 31<br/>
            10:00 AM - 8:00 PM
          </h3>
        </div>

        <div className="detail-item">
          <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Admission</p>
          <div style={{ marginTop: '2rem' }}>
            <a 
              href="#" 
              style={{
                display: 'inline-block',
                padding: '1rem 2.5rem',
                backgroundColor: 'var(--color-text)',
                color: 'var(--color-bg)',
                borderRadius: '50px',
                fontSize: '0.9rem',
                fontWeight: 400,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Reserve Experience
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Details;
