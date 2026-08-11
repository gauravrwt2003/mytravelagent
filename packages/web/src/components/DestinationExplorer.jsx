import React from 'react';
import { MapPin, Sun, Star, ArrowRight, Compass } from 'lucide-react';
import { mockDestinations } from '@mytravelagent/core';

export function DestinationExplorer({ onSelectDestination }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            Explore Top Travel Destinations
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Powered by Destination Discovery Agent with live weather & POI guides
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {mockDestinations.map((dest) => (
          <div key={dest.id} className="yatra-card yatra-card-interactive" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Image Hero */}
            <div style={{ position: 'relative', height: '180px' }}>
              <img
                src={dest.heroImage}
                alt={dest.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(4px)',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <Sun size={14} color="#f59e0b" /> {dest.weather.tempC}°C - {dest.weather.condition}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-red)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  <MapPin size={14} /> {dest.country}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.25rem 0 0.5rem 0' }}>{dest.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.4, marginBottom: '1rem' }}>
                  {dest.tagline}
                </p>

                {/* Top Attraction */}
                {dest.topAttractions[0] && (
                  <div style={{ background: 'var(--bg-surface)', padding: '0.5rem 0.75rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>🏛️ {dest.topAttractions[0].name}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-gold)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Star size={12} fill="var(--brand-gold)" /> {dest.topAttractions[0].rating}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => onSelectDestination(dest.name)}
                className="btn-yatra-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Search Transit to {dest.name} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
