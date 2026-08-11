import React, { useState } from 'react';
import { Plane, Train, Bus, Clock, Armchair, Shield, Check, Filter } from 'lucide-react';

export function TransitResults({ options, onBookOption, searchParams }) {
  const [sortBy, setSortBy] = useState('price');

  if (!options || options.length === 0) {
    return (
      <div className="yatra-card" style={{ padding: '3rem', textAlign: 'center', marginTop: '1.5rem' }}>
        <Plane size={48} color="var(--brand-red)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No Transit Routes Found</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Try modifying your departure date or selecting 'Any Time' in time preferences.
        </p>
      </div>
    );
  }

  const sortedOptions = [...options].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'duration') return a.duration.localeCompare(b.duration);
    if (sortBy === 'departure') return a.departureTime.localeCompare(b.departureTime);
    return 0;
  });

  return (
    <div style={{ marginTop: '1.5rem' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            {options.length} Transit Routes Available: {searchParams.source} ➔ {searchParams.destination}
          </h3>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Date: {searchParams.departureDate} | Preferred Time: {searchParams.preferredTimeRange.toUpperCase()}
          </span>
        </div>

        {/* Sorting Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--brand-red)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            <option value="price">Price (Lowest First)</option>
            <option value="departure">Departure Time (Earliest First)</option>
            <option value="duration">Travel Duration</option>
          </select>
        </div>
      </div>

      {/* Options Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sortedOptions.map((item) => {
          const isFlight = item.mode === 'flight';
          const isTrain = item.mode === 'train';
          const isBus = item.mode === 'bus';

          return (
            <div key={item.id} className="yatra-card yatra-card-interactive" style={{ padding: '1.25rem', borderLeft: `5px solid ${isFlight ? '#0284c7' : isTrain ? '#10b981' : '#ea2330'}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                
                {/* Provider Logo & Details */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{item.providerLogo}</span>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{item.provider}</h4>
                      <span className="yatra-badge badge-red">{item.code}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Class: {item.classType}</span>
                </div>

                {/* Timing & Duration Route */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{item.departureTime}</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.source}</p>
                  </div>

                  <div style={{ flex: 1, position: 'relative' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                      {item.duration}
                    </span>
                    <div style={{ height: '2px', background: 'var(--border-color)', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-card)', padding: '0 0.3rem' }}>
                        {isFlight ? '✈️' : isTrain ? '🚆' : '🚌'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{item.arrivalTime}</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.destination}</p>
                  </div>
                </div>

                {/* Seats & Amenities */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--brand-green)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    <Armchair size={14} /> {item.availableSeats} Seats Left
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {item.amenities.map((amenity, idx) => (
                      <span key={idx} style={{ fontSize: '0.7rem', background: 'var(--bg-surface)', padding: '0.15rem 0.4rem', borderRadius: '4px', color: 'var(--text-muted)' }}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Book Action (INR ₹) */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Fare</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-red)' }}>₹{item.price.toLocaleString('en-IN')}</h3>
                  </div>

                  <button
                    onClick={() => onBookOption(item)}
                    className="btn-yatra"
                    style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
                  >
                    Book Now
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
