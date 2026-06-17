import React, { useState } from 'react';
import './SystemDesignView.css';
import './DSAView.css';
import { Search, ChevronDown, ChevronUp, Code } from 'lucide-react';

const patterns = [
  {
    id: 1,
    name: 'Two Pointers / Sliding Window',
    whenToUse: 'Sorted array / linked list, subarray / substring problems, pair problems.',
    keyIdea: 'Use two pointers to traverse and maintain a window / pair.',
    structures: 'Arrays, Strings, Linked List',
    examples: ['Two Sum II', '3Sum', 'Longest Substring Without Repeating Characters']
  },
  {
    id: 2,
    name: 'Hashing',
    whenToUse: 'Counting frequency, finding duplicates, checking existence, grouping.',
    keyIdea: 'Store and retrieve data in O(1) average time.',
    structures: 'HashMap, HashSet, Array',
    examples: ['Two Sum', 'Group Anagrams', 'Subarray Sum Equals K']
  },
  {
    id: 3,
    name: 'Prefix Sum',
    whenToUse: 'Range sum queries, subarray problems, optimization.',
    keyIdea: 'Precompute prefix to answer queries fast.',
    structures: 'Arrays, Prefix Sum Array',
    examples: ['Range Sum Query', 'Subarray Sum Equals K', 'Product of Array Except Self']
  },
  {
    id: 4,
    name: 'Tree / DFS / BFS',
    whenToUse: 'Tree traversals, graph problems, connected components.',
    keyIdea: 'Traverse all nodes systematically.',
    structures: 'Trees, Graphs, Stack (DFS), Queue (BFS)',
    examples: ['Binary Tree Inorder Traversal', 'Number of Islands', 'Course Schedule']
  },
  {
    id: 5,
    name: 'Dynamic Programming',
    whenToUse: 'Optimization, counting, overlapping subproblems, decision making.',
    keyIdea: 'Break into subproblems, store results, build solution.',
    structures: 'Arrays / 2D Arrays / HashMap',
    examples: ['Fibonacci Number', 'Longest Common Subsequence', '0/1 Knapsack']
  }
];

const DSAView: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatterns = patterns.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.whenToUse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="module-view">
      <header className="module-header">
        <h1 className="module-title">DSA Pattern <span className="gradient-text">Recognition</span></h1>
        <p className="module-subtitle">Don't memorize solutions. Recognize patterns. Apply and adapt.</p>
      </header>

      <div className="search-bar glass-panel">
        <Search size={20} className="text-secondary" />
        <input 
          type="text" 
          placeholder="Search patterns or keywords (e.g. 'subarray', 'tree')..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="patterns-list">
        {filteredPatterns.map(pattern => (
          <div key={pattern.id} className={`glass-panel pattern-card ${expandedId === pattern.id ? 'expanded' : ''}`}>
            <div 
              className="pattern-header"
              onClick={() => setExpandedId(expandedId === pattern.id ? null : pattern.id)}
            >
              <h3>{pattern.name}</h3>
              {expandedId === pattern.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            
            {expandedId === pattern.id && (
              <div className="pattern-body">
                <div className="pattern-section">
                  <h4>When to Use?</h4>
                  <p>{pattern.whenToUse}</p>
                </div>
                <div className="pattern-section">
                  <h4>Key Idea</h4>
                  <p>{pattern.keyIdea}</p>
                </div>
                <div className="pattern-section">
                  <h4>Data Structures</h4>
                  <span className="chip">{pattern.structures}</span>
                </div>
                <div className="pattern-examples">
                  <h4>Example Problems</h4>
                  <ul>
                    {pattern.examples.map((ex, idx) => (
                      <li key={idx}><Code size={14} className="accent-blue" /> {ex}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DSAView;
