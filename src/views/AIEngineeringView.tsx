import React from 'react';
import './SystemDesignView.css';
import './AIEngineeringView.css';
import { BrainCircuit, Database, Cpu, ArrowRight, Server, MessageSquare } from 'lucide-react';

const AIEngineeringView: React.FC = () => {
  const metrics = [
    'BLEU', 'ROUGE', 'METEOR', 'QAG Score', 'GPTScore', 'SelfCheckGPT', 
    'GEval', 'Prometheus', 'BERTScore', 'MoverScore', 'Levenshtein Distance', 
    'NLI', 'BLEURT'
  ];

  return (
    <div className="module-view">
      <header className="module-header">
        <h1 className="module-title">The AI Engineering <span className="gradient-text">Shift</span></h1>
        <p className="module-subtitle">From writing code to orchestrating intelligence. Same Engineer. New Superpowers.</p>
      </header>

      <div className="shift-container">
        <div className="glass-panel shift-card">
          <div className="shift-header text-muted">
            <Server size={24} />
            <h2>Traditional .NET Developer</h2>
          </div>
          <ul className="shift-list">
            <li><strong>Focus:</strong> Performance, Scalability, Reliability</li>
            <li><strong>Data:</strong> Relational SQL databases</li>
            <li><strong>Outcome:</strong> Robust software systems</li>
            <li><strong>Mindset:</strong> Writing deterministic code</li>
          </ul>
        </div>
        
        <div className="shift-arrow">
          <ArrowRight size={32} color="var(--accent-purple)" />
        </div>

        <div className="glass-panel shift-card ai-focus">
          <div className="shift-header accent-purple">
            <BrainCircuit size={24} />
            <h2>AI Engineer / Architect</h2>
          </div>
          <ul className="shift-list">
            <li><strong>Focus:</strong> Accuracy, Context, Reasoning</li>
            <li><strong>Data:</strong> Vector DBs, Embeddings, RAG</li>
            <li><strong>Outcome:</strong> Intelligent, AI-powered solutions</li>
            <li><strong>Mindset:</strong> Orchestrating intelligence</li>
          </ul>
        </div>
      </div>

      <div className="llm-generation glass-panel">
        <h3 className="section-title">How Does a Model Generate Responses?</h3>
        <div className="flow-steps">
          <div className="step">
            <div className="step-icon"><MessageSquare size={20} /></div>
            <h4>1. Prompt Received</h4>
            <p>You send a prompt (e.g. "Explain quantum computing").</p>
          </div>
          <div className="step">
            <div className="step-icon"><Cpu size={20} /></div>
            <h4>2. Tokenization</h4>
            <p>Text is broken into small pieces (tokens) the model can understand.</p>
          </div>
          <div className="step">
            <div className="step-icon"><Database size={20} /></div>
            <h4>3. Prediction</h4>
            <p>Model calculates probabilities for possible next tokens and picks the best one.</p>
          </div>
          <div className="step">
            <div className="step-icon"><BrainCircuit size={20} /></div>
            <h4>4. Response Generated</h4>
            <p>Tokens are generated one by one until the answer is complete.</p>
          </div>
        </div>
      </div>

      <div className="metrics-section">
        <h3 className="section-title">Evaluation Metrics</h3>
        <div className="concept-chips">
          {metrics.map(metric => (
            <span key={metric} className="chip">{metric}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIEngineeringView;
