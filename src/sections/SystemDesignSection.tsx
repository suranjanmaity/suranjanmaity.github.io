import React from 'react';
import DeepDiveBlock from '../components/DeepDiveBlock';

const SystemDesignSection: React.FC = () => {
  return (
    <section id="system-design">
      <div className="container">
        <div className="arch-number">01</div>
        <span className="section-label font-display">System Design</span>
        <h2>Architecture Proof Blocks</h2>
        
        <div style={{ marginTop: '48px' }}>
          <DeepDiveBlock 
            id="sql-managed"
            title="1. Self-Managed vs Cloud SQL Databases"
            annotation="Control vs Convenience"
            problem={<>Scaling a relational database layer when I/O operations become the primary bottleneck.</>}
            fix={<>Deciding between <strong>Self-Managed (VM/On-Prem)</strong> for absolute control vs <strong>Fully Managed (RDS/Azure SQL)</strong> for automated HA and backups.</>}
            impact={<>Managed services eliminate patch management overhead but introduce vendor lock-in and potential cost spikes under high compute load.</>}
            rootCause={[
              "Self-Managed gives you full control over connection pooling, tempdb configurations, and OS-level optimizations.",
              "Managed services automate point-in-time recovery and Multi-AZ failovers, which are notoriously difficult to script flawlessly on bare metal."
            ]}
            tradeOffs={[
              "Self-Managed Trade-off: You own the pager. If the cluster goes down at 3 AM due to a failed OS patch, your team must rebuild it.",
              "Cloud Managed Trade-off: Loss of deep sysadmin control; you cannot install custom SQL extensions or tune hardware-level IOPS beyond the provider's tiers."
            ]}
          />

          <DeepDiveBlock 
            id="api-gateway"
            title="2. Request Flow & API Gateways"
            annotation="The Entry Point"
            problem={<>Client applications directly polling multiple microservices, causing excessive round-trips and tight coupling.</>}
            fix={<>Implementing an <strong>API Gateway</strong> as the single entry point to handle auth, rate limiting, and routing before traffic hits the Model Serving Clusters.</>}
            impact={<>Abstracts backend complexity. Clients make a single request, and the Gateway fans out or aggregates data from supporting services.</>}
            rootCause={[
              "Without a gateway, every microservice must independently implement JWT validation, CORS policies, and rate-limiting logic.",
              "A gateway centralizes cross-cutting concerns. It can also act as a Load Balancer, distributing traffic to healthy nodes."
            ]}
            tradeOffs={[
              "Trade-off: The API Gateway becomes a Single Point of Failure (SPOF) and a potential latency bottleneck if not scaled horizontally.",
              "Trade-off: Adds an extra network hop (Client -> Gateway -> Service), slightly increasing base latency."
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default SystemDesignSection;
