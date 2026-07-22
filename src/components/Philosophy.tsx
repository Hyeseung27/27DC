import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Philosophy: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const line1 = "We don't just design spaces.";
  const line2 = "We curate emotions.";

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return;

    let ctx = gsap.context(() => {
      const chars = textRef.current?.querySelectorAll('.char');
      if (!chars) return;

      // Set initial state
      gsap.set(chars, { opacity: 0, filter: 'blur(8px)', scale: 0.8 });
      gsap.set(textRef.current, { textShadow: "0 0 0px rgba(255,255,255,0)" });

      // Create a function to play the enter animation
      const playEnter = () => {
        // 1. Reveal characters randomly
        gsap.to(chars, {
          opacity: 1,
          filter: 'blur(0px)',
          scale: 1,
          duration: 0.5,
          stagger: { amount: 1.5, from: "random" },
          ease: 'power2.out',
          overwrite: true
        });

        // 2. Neon Glow Burst (happens after characters finish revealing)
        gsap.to(textRef.current, {
          textShadow: "0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.6), 0 0 80px rgba(255,255,255,0.4)",
          duration: 0.2,
          delay: 1.5, // wait for stagger
          ease: 'power3.out',
          overwrite: true,
          onComplete: () => {
            gsap.to(textRef.current, {
              textShadow: "0 0 0px rgba(255,255,255,0)",
              duration: 2,
              ease: 'power2.out',
              overwrite: true
            });
          }
        });
      };

      // Create a function to play the leave animation
      const playLeave = () => {
        // Kill glow
        gsap.to(textRef.current, { textShadow: "0 0 0px rgba(255,255,255,0)", duration: 0.3, overwrite: true });
        
        // Random disappear
        gsap.to(chars, {
          opacity: 0,
          filter: 'blur(8px)',
          scale: 0.8,
          duration: 0.3,
          stagger: { amount: 0.8, from: "random" },
          ease: 'power2.in',
          overwrite: true
        });
      };

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        end: 'bottom 25%',
        onEnter: playEnter,
        onLeave: playLeave,
        onEnterBack: playEnter,
        onLeaveBack: playLeave
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20vh 5vw',
        position: 'relative',
        zIndex: 20
      }}
    >
      <div 
        ref={textRef}
        style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          fontSize: 'clamp(1.5rem, 3.5vw, 4rem)',
          lineHeight: 1.1,
          textAlign: 'center',
          color: '#fff',
          maxWidth: '1200px',
        }}
      >
        {/* Render Line 1 */}
        <div style={{ marginBottom: '2rem', wordBreak: 'keep-all' }}>
          {line1.split(' ').map((word, wIdx) => (
            <span key={'w1-'+wIdx} style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: '0.4em' }}>
              {word.split('').map((char, cIdx) => (
                <span key={'c1-'+cIdx} className="char" style={{ display: 'inline-block' }}>
                  {char}
                </span>
              ))}
            </span>
          ))}
        </div>
        
        {/* Render Line 2 */}
        <div style={{ wordBreak: 'keep-all' }}>
          {line2.split(' ').map((word, wIdx) => (
            <span key={'w2-'+wIdx} style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: '0.4em' }}>
              {word.split('').map((char, cIdx) => (
                <span 
                  key={'c2-'+cIdx} 
                  className="char" 
                  style={{ 
                    display: 'inline-block', 
                    color: word === 'curate' ? 'var(--color-accent)' : 'inherit' 
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
