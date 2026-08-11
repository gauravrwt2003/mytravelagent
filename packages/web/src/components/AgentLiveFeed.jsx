import React, { useState, useEffect } from 'react';
import { Activity, X, Terminal, CheckCircle2, Cpu } from 'lucide-react';
import { agentEventBus } from '@mytravelagent/core';

export function AgentLiveFeed({ isOpen, onClose }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLogs(agentEventBus.getLogs());

    const unsubscribe = agentEventBus.subscribe('*', () => {
      setLogs([...agentEventBus.getLogs()]);
    });

    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
      width: '380px',
      maxHeight: '480px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border-hover)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'slideUp 0.25s ease'
    }}>
      {/* Header */}
      <div style={{
        padding: '0.75rem 1rem',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu size={18} color="var(--brand-red)" />
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>GCP MAS Live Execution Feed</h4>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      {/* Log Body */}
      <div style={{ padding: '0.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
        {logs.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Terminal size={24} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
            <p>Agent Event Bus Listening...</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} style={{
              background: 'var(--bg-surface)',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              borderLeft: `3px solid ${log.event.includes('COMPLETE') ? 'var(--brand-green)' : 'var(--brand-red)'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--brand-red)' }}>{log.data.agent || log.event}</span>
                <span>{log.timestamp}</span>
              </div>
              <p style={{ color: 'var(--text-main)', lineHeight: 1.3 }}>{log.data.status || JSON.stringify(log.data)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
