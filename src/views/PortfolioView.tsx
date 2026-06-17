import React from 'react';
import './SystemDesignView.css';
import './PortfolioView.css';
import { Mail, Terminal, MapPin } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const PortfolioView: React.FC = () => {
  return (
    <div className="module-view">
      <header className="module-header">
        <h1 className="module-title">About <span className="gradient-text">Me</span></h1>
        <p className="module-subtitle">The engineer behind the playbook.</p>
      </header>

      <div className="portfolio-grid">
        <div className="glass-panel profile-card">
          <div className="avatar-placeholder">
            <Terminal size={40} color="var(--bg-base)" />
          </div>
          <h2>Suranjan Maity</h2>
          <h3 className="role-title">.NET & AI Engineer</h3>
          
          <div className="location">
            <MapPin size={16} /> India
          </div>

          <p className="bio">
            I build robust, scalable software systems and bridge the gap between traditional engineering and the new AI-driven landscape. 
            This playbook is a living document of my continuous learning journey.
          </p>

          <div className="social-links">
            <a href="https://github.com/suranjanmaity" target="_blank" rel="noopener noreferrer" className="social-btn">
              <FaGithub size={20} />
            </a>
            <a href="#" className="social-btn">
              <FaLinkedin size={20} />
            </a>
            <a href="#" className="social-btn">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="experience-section">
          <div className="glass-panel experience-card">
            <h3>The Journey</h3>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>AI Engineering Focus</h4>
                  <p className="text-secondary">Building RAG systems, integrating LLMs, and architecting intelligent workflows.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Senior .NET Developer</h4>
                  <p className="text-secondary">Architecting microservices, optimizing APIs, and establishing cloud-native patterns.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Foundation</h4>
                  <p className="text-secondary">Mastering C#, ASP.NET Core, and relational databases.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioView;
