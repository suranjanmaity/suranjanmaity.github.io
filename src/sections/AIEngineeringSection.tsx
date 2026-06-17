import React from 'react';

const AIEngineeringSection: React.FC = () => {
  return (
    <section id="ai-shift" style={{ borderTop: '1px dashed var(--border)', borderBottom: '1px dashed var(--border)', backgroundColor: 'var(--bg-surface-alt)' }}>
      <div className="container" style={{ position: 'relative' }}>
        <div className="arch-number">02</div>
        <span className="section-label font-display" style={{ color: '#EF4444' }}>The Shift</span>
        <h2>How LLMs Generate Responses</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', marginBottom: '40px', fontSize: '15px' }}>
          Understanding the deterministic mechanics behind seemingly "magical" generative models. This is the chronological flow of how a prompt becomes a token stream.
        </p>

        <div style={{ maxWidth: '700px', marginTop: '48px' }}>
          
          <div style={{ marginBottom: '32px', paddingLeft: '20px', borderLeft: '2px solid #EF4444', position: 'relative' }}>
            <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)', position: 'absolute', left: '-140px', top: '4px', width: '100px', textAlign: 'right' }}>Step 01</span>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Ingestion & Tokenization</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0' }}>
              The raw text prompt is received at the API gateway and broken down into small, digestible chunks called tokens.
            </p>
          </div>

          <div style={{ marginBottom: '32px', paddingLeft: '20px', borderLeft: '2px solid var(--border-bright)', position: 'relative' }}>
            <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)', position: 'absolute', left: '-140px', top: '4px', width: '100px', textAlign: 'right' }}>Step 02</span>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Context Processing</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0' }}>
              The model processes the tokens through its neural network layers (Transformers) to understand the semantic meaning and context of the sequence.
            </p>
          </div>

          <div style={{ marginBottom: '32px', paddingLeft: '20px', borderLeft: '2px solid var(--accent)', position: 'relative' }}>
            <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)', position: 'absolute', left: '-140px', top: '4px', width: '100px', textAlign: 'right' }}>Step 03</span>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: 'var(--text-primary)' }}>Probability Calculation</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0' }}>
              The model calculates a probability distribution across its entire vocabulary for what the <em>next single token</em> should be.
            </p>
            
            <details style={{ marginTop: '16px' }}>
              <summary>View Output Trace</summary>
              <div className="details-content">
                <div className="annotation font-handwritten" style={{ top: '0', right: '-40px', transform: 'rotate(15deg)', color: 'var(--accent-blue)' }}>Token selection...</div>
                <pre className="code-block" style={{ margin: '0' }}>
<span className="comment">/* ----------------- TRACE ----------------- 
Prompt: "Explain quantum"
Next Token Probabilities:
[
  "computing": 0.82,
  "physics": 0.12,
  "mechanics": 0.04
]
Selected: "computing"
------------------------------------------ */</span>
                </pre>
              </div>
            </details>
          </div>

          <div style={{ paddingLeft: '20px', borderLeft: '2px solid #10B981', position: 'relative' }}>
            <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)', position: 'absolute', left: '-140px', top: '4px', width: '100px', textAlign: 'right' }}>Step 04</span>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: 'var(--text-primary)' }}>Append & Recurse</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0' }}>
              The chosen token is appended to the original sequence, and the entire block is fed back into the model to predict the next token, continuing until an &lt;EOS&gt; (End of Sequence) token is reached.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AIEngineeringSection;
