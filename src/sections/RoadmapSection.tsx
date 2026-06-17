import React, { useState } from 'react';
import { Database, Server, Zap, Route, Lock, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const stages = [
  {
    id: 1,
    title: "Stage 1: The Monolith",
    icon: <Server size={24} />,
    description: "Every system starts here. A single web server connected to a single relational database.",
    deepDive: "This architecture is simple, easy to deploy, and transactional (ACID). It works perfectly until your user base grows and the single database cannot handle the read operations.",
    bottleneck: "The Read-Heavy Bottleneck",
    bottleneckDesc: "The database is locking rows for writes, causing 50,000 read requests to queue up and timeout.",
    resolution: "We must intercept reads before they hit the database."
  },
  {
    id: 2,
    title: "Stage 2: The Caching Layer",
    icon: <Zap size={24} />,
    description: "We introduce an In-Memory Cache (like Redis or Memcached) sitting between the Server and Database.",
    deepDive: "Instead of querying the DB, we check Redis first (O(1) lookup). This drops read latency from 200ms to 2ms and saves the primary DB from thread starvation. However, cache invalidation becomes the hardest problem.",
    bottleneck: "The Synchronous Write Bottleneck",
    bottleneckDesc: "Reads are fast, but generating a monthly PDF report takes 10 seconds. The user's HTTP request hangs, tying up web server threads.",
    resolution: "We must process heavy tasks asynchronously."
  },
  {
    id: 3,
    title: "Stage 3: Async Decoupling (Message Queues)",
    icon: <Route size={24} />,
    description: "We introduce a Message Broker (RabbitMQ/Kafka) to decouple producers from consumers.",
    deepDive: "The web server drops a 'GenerateReport' event into the queue and instantly returns a 202 Accepted. Background worker nodes pick up the event and process it at their own pace. We trade immediate consistency for eventual consistency.",
    bottleneck: "The Single Node Limit",
    bottleneckDesc: "The background workers are humming, but our primary database disk is 99% full, and vertical scaling (buying a bigger server) is no longer physically possible.",
    resolution: "We must split the database horizontally."
  },
  {
    id: 4,
    title: "Stage 4: Data Sharding",
    icon: <Database size={24} />,
    description: "We partition the database across multiple physical servers.",
    deepDive: "Using a routing algorithm (like Consistent Hashing based on UserId), we split 10TB of data across 10 separate 1TB database nodes. The system is now infinitely scalable, but complex queries across shards (JOINS) are no longer possible.",
    bottleneck: "System Evolution Complete",
    bottleneckDesc: "You have successfully transitioned from a fragile monolith to a horizontally scaled, asynchronous distributed system.",
    resolution: null
  }
];

const RoadmapSection: React.FC = () => {
  const [unlockedStage, setUnlockedStage] = useState(1);

  const handleAdvance = () => {
    if (unlockedStage < stages.length) {
      setUnlockedStage(prev => prev + 1);
    }
  };

  return (
    <section id="system-design">
      <div className="container">
        <div className="arch-number">01</div>
        <span className="section-label font-display">Master Tree</span>
        <h2 style={{ marginBottom: '8px' }}>Stages of Evolution</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', marginBottom: '48px', fontSize: '16px' }}>
          System design is not a list of patterns to memorize. It is a chronological flow. 
          You build a simple system until it breaks (a bottleneck). The solution to that bottleneck is the next architectural pattern.
        </p>
        
        <div className="roadmap-container" style={{ position: 'relative', paddingLeft: '40px' }}>
          {/* Main vertical tree trunk */}
          <div style={{ position: 'absolute', top: '20px', bottom: '20px', left: '11px', width: '2px', backgroundColor: 'var(--border)' }}></div>

          <AnimatePresence>
            {stages.slice(0, unlockedStage).map((stage, index) => (
              <motion.div 
                key={stage.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ marginBottom: '64px', position: 'relative' }}
              >
                {/* Node Dot */}
                <div style={{ position: 'absolute', left: '-36px', top: '24px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--bg-base)', border: '2px solid var(--accent)', zIndex: 10, boxShadow: '0 0 10px var(--accent-glow)' }}></div>

                {/* Content Card */}
                <div className="system-card" style={{ padding: '40px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface-alt)', borderRadius: '8px', color: 'var(--accent)' }}>
                      {stage.icon}
                    </div>
                    <h3 style={{ margin: 0, fontSize: '24px' }}>{stage.title}</h3>
                  </div>

                  <p style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px', fontWeight: 500 }}>
                    {stage.description}
                  </p>
                  
                  <div className="code-block" style={{ marginTop: '0', marginBottom: '32px' }}>
                    {stage.deepDive}
                  </div>

                  {/* The Bottleneck (Only show on the current last stage if there's a resolution) */}
                  {index === unlockedStage - 1 && stage.resolution && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ delay: 1.5 }}
                      style={{ marginTop: '24px', padding: '24px', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderLeft: '3px solid #EF4444', borderRadius: '0 8px 8px 0' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', marginBottom: '8px', fontWeight: 600 }}>
                        <Lock size={16} /> <span>Bottleneck Hit: {stage.bottleneck}</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                        {stage.bottleneckDesc}
                      </p>
                      
                      <button 
                        onClick={handleAdvance}
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
                      >
                        <ArrowDown size={16} /> {stage.resolution}
                      </button>
                    </motion.div>
                  )}

                  {/* Final State */}
                  {index === unlockedStage - 1 && !stage.resolution && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ delay: 0.5 }}
                      style={{ marginTop: '24px', padding: '24px', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderLeft: '3px solid #10B981', borderRadius: '0 8px 8px 0' }}
                    >
                      <div style={{ color: '#10B981', fontWeight: 600 }}>{stage.bottleneck}</div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
                        {stage.bottleneckDesc}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
