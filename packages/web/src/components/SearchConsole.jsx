import React, { useState } from 'react';
import { Plane, Train, Bus, Calendar, Clock, MapPin, ArrowRightLeft, Users, Search, Sparkles } from 'lucide-react';

export function SearchConsole({ onSearch }) {
  const [mode, setMode] = useState('all');
  const [source, setSource] = useState('New Delhi');
  const [destination, setDestination] = useState('Goa');
  const [departureDate, setDepartureDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return today.toISOString().split('T')[0];
  });
  const [preferredTimeRange, setPreferredTimeRange] = useState('any');
  const [passengers, setPassengers] = useState(1);

  const handleSwap = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      source,
      destination,
      departureDate,
      preferredTimeRange,
      passengers,
      mode
    });
  };

  return (
    <div className="yatra-card" style={{ padding: '1.5rem', marginTop: '1.5rem', borderTop: '4px solid var(--brand-red)' }}>
      
      {/* 1. Mode Tabs - Yatra Style */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        {[
          { id: 'all', label: 'All Transit Modes', icon: Sparkles },
          { id: 'flight', label: 'Flights', icon: Plane },
          { id: 'train', label: 'Trains', icon: Train },
          { id: 'bus', label: 'Buses', icon: Bus }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = mode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'var(--brand-red)' : 'var(--bg-surface)',
                color: isActive ? '#ffffff' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={18} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* 2. Main Search Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr 1fr 1fr', gap: '0.75rem', alignItems: 'end' }}>
          
          {/* Source Input */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <MapPin size={14} color="var(--brand-red)" /> From (Source)
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
              placeholder="e.g. New Delhi, Paris, Tokyo"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                fontWeight: 600,
                outline: 'none'
              }}
            />
          </div>

          {/* Swap Button */}
          <button
            type="button"
            onClick={handleSwap}
            title="Swap Source & Destination"
            style={{
              padding: '0.75rem',
              borderRadius: '50%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--brand-red)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.2rem'
            }}
          >
            <ArrowRightLeft size={16} />
          </button>

          {/* Destination Input */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <MapPin size={14} color="var(--brand-red)" /> To (Destination)
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              placeholder="e.g. Goa, Paris, Swiss Alps"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                fontWeight: 600,
                outline: 'none'
              }}
            />
          </div>

          {/* Departure Date Calendar */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={14} color="var(--brand-red)" /> Departure Date
            </label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                fontWeight: 600,
                outline: 'none'
              }}
            />
          </div>

          {/* Preferred Time Window Selector */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={14} color="var(--brand-red)" /> Time Preference
            </label>
            <select
              value={preferredTimeRange}
              onChange={(e) => setPreferredTimeRange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                fontWeight: 600,
                outline: 'none'
              }}
            >
              <option value="any">Any Time (All Day)</option>
              <option value="morning">Morning (06:00 - 12:00)</option>
              <option value="afternoon">Afternoon (12:00 - 17:00)</option>
              <option value="evening">Evening (17:00 - 22:00)</option>
              <option value="night">Night (22:00 - 06:00)</option>
            </select>
          </div>

        </div>

        {/* Submit Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Users size={16} /> Passengers:
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.3rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}
            >
              {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>)}
            </select>
          </div>

          <button type="submit" className="btn-yatra">
            <Search size={18} /> Search Transit Options
          </button>
        </div>
      </form>

    </div>
  );
}
