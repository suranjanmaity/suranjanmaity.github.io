import React, { useState } from 'react';
import './SystemDesignView.css'; // Reusing some base styles
import './DotNetMasteryView.css';
import { Layers, Box, TerminalSquare, CheckCircle2 } from 'lucide-react';

const DotNetMasteryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('di');

  return (
    <div className="module-view">
      <header className="module-header">
        <h1 className="module-title">.NET Architecture <span className="gradient-text">Mastery</span></h1>
        <p className="module-subtitle">Advanced concepts, interview cheat sheets, and architectural patterns in the .NET ecosystem.</p>
      </header>

      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'di' ? 'active' : ''}`} onClick={() => setActiveTab('di')}>
          <Box size={18} /> Dependency Injection
        </button>
        <button className={`tab-btn ${activeTab === 'solid' ? 'active' : ''}`} onClick={() => setActiveTab('solid')}>
          <Layers size={18} /> SOLID & Patterns
        </button>
        <button className={`tab-btn ${activeTab === 'interview' ? 'active' : ''}`} onClick={() => setActiveTab('interview')}>
          <TerminalSquare size={18} /> Interview Prep
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'di' && (
          <div className="di-grid">
            <div className="glass-panel di-card">
              <div className="di-header">
                <h3>Transient</h3>
                <span className="badge">Lower Perf</span>
              </div>
              <p>A new instance is created every time it is requested.</p>
              <ul className="di-details">
                <li><CheckCircle2 size={14}/> Used & disposed after request</li>
                <li><CheckCircle2 size={14}/> Lightweight & stateless</li>
                <li><CheckCircle2 size={14}/> Not thread-safe required</li>
              </ul>
              <code className="code-block">builder.Services.AddTransient&lt;IService, Service&gt;();</code>
            </div>

            <div className="glass-panel di-card">
              <div className="di-header">
                <h3>Scoped</h3>
                <span className="badge accent-blue">Balanced</span>
              </div>
              <p>A new instance is created once per scope (usually per HTTP request).</p>
              <ul className="di-details">
                <li><CheckCircle2 size={14}/> Shared within the same request</li>
                <li><CheckCircle2 size={14}/> Disposed at end of scope</li>
                <li><CheckCircle2 size={14}/> Best for DbContext</li>
              </ul>
              <code className="code-block">builder.Services.AddScoped&lt;IService, Service&gt;();</code>
            </div>

            <div className="glass-panel di-card">
              <div className="di-header">
                <h3>Singleton</h3>
                <span className="badge accent-purple">High Perf</span>
              </div>
              <p>The same instance is shared across the entire application lifetime.</p>
              <ul className="di-details">
                <li><CheckCircle2 size={14}/> Single instance created at startup</li>
                <li><CheckCircle2 size={14}/> Must be thread-safe</li>
                <li><CheckCircle2 size={14}/> Best for Cache, Config</li>
              </ul>
              <code className="code-block">builder.Services.AddSingleton&lt;IService, Service&gt;();</code>
            </div>
          </div>
        )}

        {activeTab === 'solid' && (
          <div className="solid-grid">
            <div className="glass-panel solid-card">
              <h3>SRP <span className="sub">Single Responsibility</span></h3>
              <p>A class should have only one reason to change.</p>
            </div>
            <div className="glass-panel solid-card">
              <h3>OCP <span className="sub">Open/Closed</span></h3>
              <p>Open for extension, but closed for modification.</p>
            </div>
            <div className="glass-panel solid-card">
              <h3>LSP <span className="sub">Liskov Substitution</span></h3>
              <p>Subtypes must be substitutable for their base types.</p>
            </div>
            <div className="glass-panel solid-card">
              <h3>ISP <span className="sub">Interface Segregation</span></h3>
              <p>Clients shouldn't be forced to depend on interfaces they don't use.</p>
            </div>
            <div className="glass-panel solid-card">
              <h3>DIP <span className="sub">Dependency Inversion</span></h3>
              <p>Depend on abstractions, not concretions.</p>
            </div>
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="glass-panel text-content">
            <h3>ASP.NET Core Q&A</h3>
            <div className="qa-item">
              <strong>What is Middleware?</strong>
              <p>Components executed in the HTTP request pipeline (e.g., Auth, Logging).</p>
            </div>
            <div className="qa-item">
              <strong>app.Use vs app.Run?</strong>
              <p><code>Use</code> can call the next middleware. <code>Run</code> is terminal (short-circuits).</p>
            </div>
            <div className="qa-item">
              <strong>IEnumerable vs IQueryable?</strong>
              <p><code>IEnumerable</code> executes queries in memory. <code>IQueryable</code> executes on the database side (deferred execution).</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DotNetMasteryView;
