import React from 'react';

interface DeepDiveBlockProps {
  id: string;
  title: string;
  annotation: string;
  problem: React.ReactNode;
  fix: React.ReactNode;
  impact: React.ReactNode;
  rootCause: string[];
  tradeOffs: string[];
}

const DeepDiveBlock: React.FC<DeepDiveBlockProps> = ({
  id,
  title,
  annotation,
  problem,
  fix,
  impact,
  rootCause,
  tradeOffs
}) => {
  return (
    <div id={id} className="system-card" style={{ padding: '40px', position: 'relative', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '40px' }}>
      <div className="annotation font-handwritten" style={{ top: '-10px', right: '20px', transform: 'rotate(5deg)' }}>
        {annotation}
      </div>
      
      <h3 style={{ marginBottom: '24px', fontSize: '24px' }}>{title}</h3>
      
      <div style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        <strong style={{ color: 'var(--text-primary)' }}>Concept:</strong> {problem}<br />
        <strong style={{ color: 'var(--text-primary)' }}>Architecture:</strong> {fix}<br />
        <strong style={{ color: '#10B981' }}>Core Metric:</strong> {impact}
      </div>

      <details>
        <summary>View Architecture & Trade-offs</summary>
        <div className="details-content">
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '16px', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Deep Dive:</strong>
            <div>
              <ul style={{ marginLeft: '16px' }}>
                {rootCause.map((cause, idx) => <li key={idx}>{cause}</li>)}
              </ul>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '16px' }}>
            <strong style={{ color: '#F59E0B' }}>Trade-off:</strong>
            <div>
              <ul style={{ marginLeft: '16px' }}>
                {tradeOffs.map((tradeoff, idx) => <li key={idx}>{tradeoff}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
};

export default DeepDiveBlock;
