import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div style={{ maxWidth: '850px', position: 'relative', zIndex: 10 }}>
          <h1 style={{ letterSpacing: '-0.04em' }}>The Engineering <br/>Playbook</h1>
          <p style={{ fontSize: '22px', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '24px' }}>
            System Design, AI, & .NET Architecture
          </p>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '650px', lineHeight: 1.8 }}>
            A curated, deep-dive exploration of how to build reliable, scalable systems. 
            Authored by an engineer bridging the gap between traditional production rigor and the new AI landscape.
          </p>

          <div style={{ marginTop: '48px', display: 'flex', gap: '16px' }}>
            <a href="#system-design" className="btn btn-primary">Explore Deep Dives</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
