import React from 'react';
import { NavLink } from 'react-router-dom';
import { Network, Code2, Binary, Cpu, UserCircle, Rocket } from 'lucide-react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/system-design', label: 'System Design', icon: Network },
    { path: '/dotnet-mastery', label: '.NET Architecture', icon: Code2 },
    { path: '/dsa-patterns', label: 'DSA Patterns', icon: Binary },
    { path: '/ai-engineering', label: 'AI Engineering', icon: Cpu },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <Rocket className="logo-icon" size={28} color="var(--accent-blue)" />
        <h1 className="logo-text">SysDev<span className="gradient-text">Guide</span></h1>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="section-title">Playbook</h3>
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} className="nav-icon" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="nav-section mt-auto">
          <h3 className="section-title">Author</h3>
          <NavLink 
            to="/about-me" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <UserCircle size={20} className="nav-icon" />
            <span>About Me</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
