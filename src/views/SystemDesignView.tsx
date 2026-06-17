import React, { useState } from 'react';
import './SystemDesignView.css';
import { Database, Zap, ShieldAlert, Webhook, Activity } from 'lucide-react';

const SystemDesignView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'scalability',
      title: 'Scalability & Performance',
      icon: <Zap className="category-icon" />,
      concepts: ['Latency', 'Throughput', 'Load Balancing', 'Caching', 'Cache Invalidation']
    },
    {
      id: 'database',
      title: 'Database Architecture',
      icon: <Database className="category-icon" />,
      concepts: ['SQL vs NoSQL', 'Sharding', 'Indexing', 'Denormalization', 'ACID', 'BASE']
    },
    {
      id: 'reliability',
      title: 'Reliability & Fault Tolerance',
      icon: <ShieldAlert className="category-icon" />,
      concepts: ['High Availability', 'CAP Theorem', 'Consistency Models', 'Replication', 'Bulkhead', 'Retry Logic']
    },
    {
      id: 'api',
      title: 'API Design',
      icon: <Webhook className="category-icon" />,
      concepts: ['REST', 'GraphQL', 'gRPC', 'Authentication', 'API Gateway', 'Service Discovery']
    },
    {
      id: 'event-driven',
      title: 'Event-Driven Architecture',
      icon: <Activity className="category-icon" />,
      concepts: ['Message Queue', 'Pub/Sub', 'Sync vs Async', 'Idempotency']
    }
  ];

  return (
    <div className="module-view">
      <header className="module-header">
        <h1 className="module-title">System Design <span className="gradient-text">Master Tree</span></h1>
        <p className="module-subtitle">A structured guide to modern architecture patterns, trade-offs, and scalability bottlenecks.</p>
      </header>

      <div className="system-grid">
        {categories.map(category => (
          <div 
            key={category.id} 
            className={`glass-panel category-card ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
          >
            <div className="category-header">
              <div className="icon-wrapper">{category.icon}</div>
              <h2>{category.title}</h2>
            </div>
            
            <div className="concept-chips">
              {category.concepts.map(concept => (
                <span key={concept} className="chip">{concept}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemDesignView;
