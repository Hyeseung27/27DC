import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// @ts-ignore
import DomeGallery from './DomeGallery';

gsap.registerPlugin(ScrollTrigger);

const Gallery: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in the Gallery exactly as it slides up over the black background of the Hero section
      gsap.fromTo(containerRef.current, 
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom', // Start fading in when the top edge hits the bottom of the screen
            end: 'top top',      // Fully visible when it reaches the top
            scrub: true
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
        height: '100vh', 
        width: '100%', 
        position: 'relative',
        zIndex: 10, // Must be above the global video background to capture pointer events
        backgroundColor: 'transparent', // Transparent so it doesn't pull up a solid background
        marginTop: '-100vh' // This pulls the section UP to overlap perfectly with the end of the pinned Hero section
      }}
    >
      <DomeGallery overlayBlurColor="#000000" />
    </section>
  );
};

export default Gallery;
