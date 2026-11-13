import React from 'react';
import { Compass, BarChart3, Layers, Info, Award, Globe2 } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const navItems = [
    { id: 'landing', label: 'Explore', icon: Globe2 },
    { id: 'clusters', label: 'Topics', icon: Layers },
    { id: 'dashboard', label: 'Audience & Stats', icon: BarChart3 },
    { id: 'about', label: 'Methodology', icon: Info },
    { id: 'evaluation', label: 'Evaluation', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 bg-dark-nav border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Brand mark & title */}
          <button 
            onClick={() => setActivePage('landing')} 
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded bg-dark-card border border-dark-border flex items-center justify-center text-teal-400 group-hover:border-teal-500/50 transition-colors">
              <Compass className="w-4 h-4 stroke-[1.75]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-primary font-semibold text-sm tracking-tight">
                  Polar Outreach Agent
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-dark-card text-teal-400 border border-dark-border">
                  MoES • SIH26063
                </span>
              </div>
              <p className="text-[11px] text-muted font-normal">
                Ministry of Earth Sciences Research Platform
              </p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                      : 'text-secondary hover:text-primary hover:bg-dark-card'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 stroke-[1.75]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Status Badge */}
          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-dark-border">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            <span className="text-[11px] text-secondary font-mono">354 Verified Resources</span>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex overflow-x-auto py-2 px-4 gap-1.5 border-t border-dark-border bg-dark-bg text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded text-xs transition-colors ${
              activePage === item.id 
                ? 'bg-teal-500/10 text-teal-400 font-medium border border-teal-500/30' 
                : 'text-secondary hover:text-primary'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}
