import React from 'react';
import DeepDiveBlock from '../components/DeepDiveBlock';

const DotNetSection: React.FC = () => {
  return (
    <section id="dotnet">
      <div className="container">
        <div className="arch-number">03</div>
        <span className="section-label font-display">.NET Mastery</span>
        <h2>Architectural Patterns</h2>
        
        <div style={{ marginTop: '48px' }}>
          <DeepDiveBlock 
            id="di-lifecycles"
            title="Dependency Injection Lifecycles"
            annotation="Memory vs State"
            problem={<>Managing object instantiation and memory across millions of concurrent HTTP requests.</>}
            fix={<>Utilizing the built-in IoC container to enforce <strong>Transient</strong>, <strong>Scoped</strong>, or <strong>Singleton</strong> lifetimes depending on the service's state requirements.</>}
            impact={<>Prevents memory leaks, ensures thread safety for shared caches, and isolates Entity Framework DbContexts per request.</>}
            rootCause={[
              "Transient: A new instance is created every single time it is requested. Best for lightweight, stateless services.",
              "Scoped: A new instance is created once per HTTP request. Essential for DbContext to avoid cross-request data corruption.",
              "Singleton: One instance shared across the entire app lifecycle. Must be strictly thread-safe."
            ]}
            tradeOffs={[
              "Transient Trade-off: High garbage collection pressure if the object is complex.",
              "Singleton Trade-off: High risk of thread-safety bugs if mutable state is introduced."
            ]}
          />

          <div className="system-card" style={{ padding: '40px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '24px' }}>SOLID Principles in Practice</h3>
            <div style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
              A theoretical understanding of SOLID is useless without production application. 
            </div>
            
            <details>
              <summary>View Code: Dependency Inversion (DIP)</summary>
              <div className="details-content">
                <p style={{ marginBottom: '16px' }}>High-level modules should not depend on low-level modules. Both should depend on abstractions.</p>
                
                <pre className="code-block" style={{ margin: '0' }}>
<span className="comment">// BAD: Tight coupling to a specific implementation</span>
<span className="keyword">class</span> OrderService {"{"}
    <span className="keyword">private readonly</span> SqlDatabase _db = <span className="keyword">new</span> SqlDatabase();
{"}"}

<span className="comment">// GOOD: Depending on an abstraction injected via DI</span>
<span className="keyword">class</span> OrderService {"{"}
    <span className="keyword">private readonly</span> IOrderRepository _repository;
    
    <span className="keyword">public</span> OrderService(IOrderRepository repository) {"{"}
        _repository = repository;
    {"}"}
{"}"}
                </pre>
              </div>
            </details>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DotNetSection;
