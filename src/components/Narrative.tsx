import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Narrative: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the whole narrative section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=300%', // 3 times the height of the viewport for scrolling duration
        pin: true,
        scrub: 1,
      });

      // Fade texts in and out sequentially
      textRefs.current.forEach((text, i) => {
        if (!text) return;
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top+=${i * 100}% top`,
            end: `top+=${(i + 1) * 100}% top`,
            scrub: 1,
          }
        });

        tl.fromTo(text, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 })
          .to(text, { opacity: 0, y: -30, duration: 0.4 }, "+=0.2");
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const narratives = [
    "Before we speak, we feel.",
    "27 degrees is the temperature of a gentle touch.",
    "A space where boundaries between you and the art melt away."
  ];

  return (
    <section 
      ref={sectionRef} 
      style={{ 
        height: '100vh', 
        width: '100%', 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        backgroundColor: 'transparent'
      }}
    >
      {/* Semi-transparent dark overlay to make text readable over the video */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: -1
      }} />

      {narratives.map((text, idx) => (
        <div 
          key={idx}
          ref={(el) => { textRefs.current[idx] = el; }}
          style={{
            position: 'absolute',
            textAlign: 'center',
            opacity: 0,
            width: '80%',
            maxWidth: '800px'
          }}
        >
          <h2 style={{ 
            fontSize: 'clamp(2rem, 5vw, 4.5rem)', 
            lineHeight: 1.2,
            color: '#ffffff',
            textShadow: '0px 4px 20px rgba(0,0,0,0.5)'
          }}>
            {text}
          </h2>
        </div>
      ))}
    </section>
  );
};

export default Narrative;
