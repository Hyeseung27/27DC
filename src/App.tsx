import React from 'react';
import SmoothScroll from './components/SmoothScroll';
import Header from './components/Header';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import Archive from './components/Archive';
import Philosophy from './components/Philosophy';
import Contact from './components/Contact';

const App: React.FC = () => {
  return (
    <SmoothScroll>
      <div style={{ position: 'relative', width: '100vw', overflow: 'hidden', backgroundColor: '#000000' }}>
        <Header />
        
        {/* Global Fixed Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            objectFit: 'cover',
            zIndex: 0
          }}
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" 
        />

        {/* 1. 히어로섹션 (로고가 보이는 첫화면) */}
        <div id="home">
          <Hero />
        </div>
        
        {/* 2. 갤러리섹션 (DomeGallery) */}
        <div id="gallery">
          <Gallery />
        </div>

        <div id="work">
          <Archive />
        </div>
        
        <div id="about">
          <Philosophy />
        </div>
        
        <div id="contact">
          <Contact />
        </div>
        
      </div>
    </SmoothScroll>
  );
};

export default App;
