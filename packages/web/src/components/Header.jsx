import React from 'react';
import { Plane, Compass, FileText, BookmarkCheck, Sun, Moon, Activity, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function Header({ activeTab, setActiveTab, liveAgentCount, toggleAgentDrawer }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.85rem 1rem'
    }}>
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 0 }}>
        
        {/* Brand Logo - RoamingBuddy */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }} onClick={() => setActiveTab('search')}>
          <div style={{
            background: 'var(--brand-red)',
            color: '#fff',
            padding: '0.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px var(--brand-red-glow)'
          }}>
            <Plane size={24} style={{ transform: 'rotate(-45deg)' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>
              roaming<span style={{ color: 'var(--brand-red)' }}>buddy</span>
            </h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              GCP Multi-Agent Travel Engine
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-surface)', padding: '0.25rem', borderRadius: '9999px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('search')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem',
              borderRadius: '9999px',
              border: 'none',
              background: activeTab === 'search' ? 'var(--brand-red)' : 'transparent',
              color: activeTab === 'search' ? '#fff' : 'var(--text-main)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Compass size={16} /> Search & Book
          </button>

          <button
            onClick={() => setActiveTab('destinations')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem',
              borderRadius: '9999px',
              border: 'none',
              background: activeTab === 'destinations' ? 'var(--brand-red)' : 'transparent',
              color: activeTab === 'destinations' ? '#fff' : 'var(--text-main)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={16} /> Destinations
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem',
              borderRadius: '9999px',
              border: 'none',
              background: activeTab === 'architecture' ? 'var(--brand-red)' : 'transparent',
              color: activeTab === 'architecture' ? '#fff' : 'var(--text-main)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <FileText size={16} /> GCP Diagrams
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem',
              borderRadius: '9999px',
              border: 'none',
              background: activeTab === 'bookings' ? 'var(--brand-red)' : 'transparent',
              color: activeTab === 'bookings' ? '#fff' : 'var(--text-main)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <BookmarkCheck size={16} /> My Bookings
          </button>
        </nav>

        {/* Right Controls: Agent Drawer Trigger & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={toggleAgentDrawer}
            title="Toggle Live Agent Feed"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.8rem',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: 'var(--brand-green)',
              fontWeight: 600,
              fontSize: '0.825rem',
              cursor: 'pointer'
            }}
          >
            <Activity size={16} /> Live MAS ({liveAgentCount})
          </button>

          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              padding: '0.5rem',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>
        </div>

      </div>
    </header>
  );
}
