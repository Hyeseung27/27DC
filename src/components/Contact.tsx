import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const InputField: React.FC<{ label: string; type?: string; rows?: number }> = ({ label, type = 'text', rows }) => {
  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {rows ? (
        <textarea placeholder=" " rows={rows} className="contact-input" style={{ resize: 'none' }} />
      ) : (
        <input type={type} placeholder=" " className="contact-input" />
      )}
      
      {/* Animated Underline (Base) */}
      <div className="input-underline" style={{
        position: 'absolute', bottom: 0, left: 0, height: '1px', width: '100%', 
        backgroundColor: 'rgba(255,255,255,0.3)', transformOrigin: 'left', transform: 'scaleX(0)'
      }} />
      
      {/* Focus Underline (White) */}
      <div className="input-underline-focus" style={{
        position: 'absolute', bottom: 0, left: 0, height: '1px', width: '100%', 
        backgroundColor: '#fff', transformOrigin: 'left', transform: 'scaleX(0)', 
        transition: 'transform 0.3s ease'
      }} />

      {/* Scramble Label Placeholder */}
      <div className="input-label scramble-group" style={{
        position: 'absolute', top: '0.5rem', left: 0, pointerEvents: 'none', 
        display: 'flex', color: 'rgba(255,255,255,0.5)', fontWeight: 500,
        transition: 'opacity 0.3s ease'
      }}>
        {label.split('').map((char, i) => (
          <span key={i} className="form-char" style={{ opacity: 0 }}>{char === ' ' ? '\u00A0' : char}</span>
        ))}
      </div>
    </div>
  );
};

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cursorContainerRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isCursorEnabled = useRef(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mouse Tracking Logic for Gooey Cursor
    const handleMouseMove = (e: MouseEvent) => {
      if (!isCursorEnabled.current || !trailsRef.current.length) return;
      
      // Ensure the cursor container is visible when mouse moves inside
      if (cursorContainerRef.current) {
        gsap.to(cursorContainerRef.current, { opacity: 1, duration: 0.3 });
      }

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

    const ctx = gsap.context(() => {
      // 1. Slow fade-in while scrolling down (Scrubbed)
      gsap.fromTo(videoRef.current,
        { opacity: 0 },
        {
          opacity: 0.8,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%', // Starts fading slowly when section enters
            end: 'bottom bottom',
            scrub: 2,
          }
        }
      );

      // 2. Sequential Master Timeline for Shrink & Form Reveal
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 10%', // Triggers reliably right before the section fully hits the top
          toggleActions: 'play none none reverse', // Plays sequentially forward, reverses sequentially backward!
          onLeaveBack: () => {
            // Instantly disable the cursor when we start scrolling back up
            isCursorEnabled.current = false;
            if (sectionRef.current) sectionRef.current.style.cursor = 'auto';
            if (cursorContainerRef.current) {
              gsap.to(cursorContainerRef.current, { opacity: 0, duration: 0.3 });
            }
          }
        },
        onComplete: () => {
          // Enable custom cursor only when the entire forward animation finishes (scroll reaches bottom of pin)
          isCursorEnabled.current = true;
          if (sectionRef.current) sectionRef.current.style.cursor = 'none';
        }
      });

      // A. Automatic shrink to the left side
      masterTl.fromTo(videoRef.current,
        {
          width: '100%',
          height: '100%',
          top: '0%',
          left: '0%',
          borderRadius: '0px'
        },
        {
          width: '50vw', // 좌측 화면 가로 꽉 채움
          height: '45vh',
          top: '15vh', // 거대 텍스트 위
          left: '0vw', // 좌측 딱 붙임
          borderRadius: '0px', // 라운딩 제거
          duration: 1.5,
          ease: 'power3.inOut'
        }
      );

      // B. Form Reveal (Sequenced AFTER the video shrinks)
      masterTl.fromTo('.input-underline', 
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out'
        },
        '>' // Starts exactly after video shrink finishes
      );

      masterTl.fromTo('.submit-btn-bg',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out'
        },
        '<0.2' // Starts 0.2s after the underlines begin
      );

      const textGroups = gsap.utils.toArray('.scramble-group');
      textGroups.forEach((group: any) => {
        const chars = group.querySelectorAll('.form-char');
        masterTl.fromTo(chars,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.05,
            stagger: { amount: 0.4, from: 'random' },
            ease: 'none'
          },
          '<0.15' // Slightly staggered relative to the previous animation
        );
      });
    }, sectionRef);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ctx.revert();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        backgroundColor: '#000',
        color: '#fff',
        overflow: 'hidden',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* SVG Definitions for the Gooey Filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <filter id="goo-contact" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo-contact" />
        </filter>
      </svg>

      {/* Gooey Cursor Trail Layer */}
      <div
        ref={cursorContainerRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 25, // Placed below the footer (30) but above the video (1)
          pointerEvents: 'none',
          opacity: 0, // Starts hidden, fades in on mouse move
          filter: 'url(#goo-contact)' // Applies the sticky liquid merge effect to the blobs
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

      {/* Dreamy Nature Background Video */}
      <video 
        ref={videoRef}
        autoPlay={true}
        muted={true}
        loop={true}
        playsInline={true}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          opacity: 0, // Controlled by GSAP
        }}
      >
        <source src="/bg-warm.mp4" type="video/mp4" />
      </video>

      {/* Content Wrapper */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', pointerEvents: 'none' }}>

        <style>
          {`
            @keyframes marqueeLeftGiant {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .contact-input {
              width: 100%;
              background: transparent;
              border: none;
              color: #fff;
              padding: 0.5rem 0;
              font-size: 1rem;
              font-family: var(--font-sans);
              outline: none;
              cursor: none;
            }
            .contact-input:focus ~ .input-underline-focus {
              transform: scaleX(1) !important;
            }
            .contact-input:focus ~ .input-label,
            .contact-input:not(:placeholder-shown) ~ .input-label {
              opacity: 0 !important;
            }
          `}
        </style>

        {/* Right Side Contact Form */}
        <div 
          ref={formRef}
          style={{
            position: 'absolute',
            top: '20vh', // Slightly lower than video top (15vh) to look balanced
            left: '55vw', // 50vw video + 5vw gap
            width: '35vw', // 35vw width
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '3rem',
            zIndex: 15,
            pointerEvents: 'auto'
          }}
        >
          <h2 className="scramble-group" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#fff', display: 'flex' }}>
            {"CONTACT".split('').map((char, i) => (
              <span key={i} className="form-char" style={{ opacity: 0 }}>{char}</span>
            ))}
          </h2>
          
          <form style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <InputField label="NAME" />
              <InputField label="CALL" />
            </div>
            <InputField label="EMAIL" type="email" />
            <InputField label="MESSAGE" rows={4} />
            
            <button 
               type="button"
               className="submit-btn-bg scramble-group"
               style={{ 
                 alignSelf: 'flex-start', 
                 padding: '1rem 3rem', 
                 backgroundColor: '#fff', 
                 color: '#000', 
                 border: 'none', 
                 borderRadius: '30px', 
                 fontSize: '0.9rem',
                 fontWeight: 800, 
                 letterSpacing: '0.1em',
                 cursor: 'none', // Inherit the gooey cursor!
                 marginTop: '1rem',
                 transition: 'transform 0.3s, backgroundColor 0.3s',
                 opacity: 0, // Controlled by GSAP
                 display: 'flex',
                 justifyContent: 'center'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'scale(1.05)';
                 e.currentTarget.style.backgroundColor = '#e0e0e0';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'scale(1)';
                 e.currentTarget.style.backgroundColor = '#fff';
               }}
            >
              {"SUBMIT".split('').map((char, i) => (
                <span key={i} className="form-char" style={{ opacity: 0 }}>{char}</span>
              ))}
            </button>
          </form>
        </div>

        {/* Giant Cut-off Typography (Animated & Left Half Constrained) */}
        <div style={{
          position: 'absolute',
          bottom: '40px', // Exact height of the footer, so it sits perfectly on top!
          left: 0,
          width: '50vw', // Restrict to the left half of the screen
          height: '18vw', // Restrict height to physically cut off the bottom of the letters
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 101, // Raised above the cursor so it blends!
          mixBlendMode: 'difference', // Inverts the white cursor to black when passing behind it
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-end'
        }}>
          <div style={{
            display: 'inline-flex',
            animation: 'marqueeLeftGiant 90s linear infinite',
            width: 'max-content'
          }}>
            {Array(2).fill("27 DEGREES CELSIUS").map((text, i) => (
              <h1 key={i} style={{
                fontSize: 'clamp(10rem, 25vw, 30rem)',
                fontWeight: 800,
                fontFamily: 'var(--font-sans)',
                letterSpacing: '-0.05em',
                lineHeight: 0.75,
                margin: 0,
                transform: 'translateY(12%)',
                color: '#FFFFFF',
                paddingRight: '10vw' // gap between words
              }}>
                {text}
              </h1>
            ))}
          </div>
        </div>

        {/* Social Buttons */}
        <div style={{
          position: 'absolute',
          bottom: 'calc(40px + 2rem)', // Adjusted slightly so it doesn't collide with the raised text
          right: '3rem',
          display: 'flex',
          gap: '1rem',
          zIndex: 20,
          pointerEvents: 'auto' // Re-enable pointer events for links
        }}>
          {[
            {
              id: 'instagram',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              )
            },
            {
              id: 'youtube',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              )
            },
            {
              id: 'mail',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              )
            }
          ].map((platform) => (
            <a
              key={platform.id}
              href="#"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.4)', // More opaque background
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                textDecoration: 'none',
                transition: 'background-color 0.3s, transform 0.3s',
                cursor: 'none' // Also hide default cursor on buttons
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {platform.icon}
            </a>
          ))}
        </div>

        {/* White Bottom Marquee moving to the left */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '40px', // Fixed height so the giant text can sit directly on top
          backgroundColor: '#FFFFFF',
          color: '#000000',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'auto'
        }}>
          <style>
            {`
              @keyframes marqueeLeft {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
            `}
          </style>
          <div style={{
            display: 'flex',
            width: 'max-content', // Forces container to wrap both children seamlessly
            animation: 'marqueeLeft 60s linear infinite',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            {Array(2).fill(0).map((_, i) => (
              <div key={i} style={{ display: 'flex' }}>
                {Array(4).fill("© COPYRIGHT 2026. 27 DEGREES CELSIUS EXHIBITION BRAND. TERMS & CONDITIONS. PRIVACY POLICY. MADE IN KOREA. ").map((text, j) => (
                  <span key={j} style={{ paddingRight: '2rem' }}>{text}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
