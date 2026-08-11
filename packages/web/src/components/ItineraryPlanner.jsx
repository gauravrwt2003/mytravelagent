import React, { useState } from 'react';
import { Sparkles, Calendar, Compass, MapPin, Utensils, IndianRupee, Clock, ArrowRight, Search, CheckCircle2 } from 'lucide-react';
import { itineraryAgent, mockDestinations } from '@mytravelagent/core';

export function ItineraryPlanner({ onSelectDestination }) {
  const [destination, setDestination] = useState('Goa');
  const [customDestination, setCustomDestination] = useState('');
  const [days, setDays] = useState(3);
  const [travelStyle, setTravelStyle] = useState('Cultural & Relaxed');
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    const targetDest = customDestination.trim() || destination;
    setLoading(true);

    const result = await itineraryAgent.generateItinerary(targetDest, days, travelStyle);
    setItinerary(result);
    setLoading(false);
  };

  return (
    <div style={{ marginTop: '1.5rem' }}>
      
      {/* Search Header Console */}
      <div className="yatra-card" style={{ padding: '1.5rem', borderTop: '4px solid var(--brand-red)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Sparkles size={26} color="var(--brand-red)" />
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              Real-World AI Trip Itinerary Planner
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Generates authentic itineraries with real attractions, iconic local restaurants, morning/afternoon/evening schedules & INR (₹) estimates
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1.2fr auto', gap: '0.85rem', alignItems: 'end' }}>
          
          {/* Select Popular Destination */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Select Destination
            </label>
            <select
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setCustomDestination('');
              }}
              style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontWeight: 600, marginTop: '0.35rem' }}
            >
              {mockDestinations.map(d => <option key={d.id} value={d.name}>{d.name}, {d.country}</option>)}
            </select>
          </div>

          {/* Custom Location Input */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              OR Type Custom City / Place
            </label>
            <input
              type="text"
              placeholder="e.g. Jaipur, Manali, Kyoto, Rome"
              value={customDestination}
              onChange={(e) => setCustomDestination(e.target.value)}
              style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontWeight: 600, marginTop: '0.35rem' }}
            />
          </div>

          {/* Trip Duration */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Duration
            </label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontWeight: 600, marginTop: '0.35rem' }}
            >
              <option value={1}>1 Day Quick Tour</option>
              <option value={2}>2 Days Weekend</option>
              <option value={3}>3 Days Ultimate Trip</option>
            </select>
          </div>

          {/* Travel Vibe */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Travel Vibe
            </label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontWeight: 600, marginTop: '0.35rem' }}
            >
              <option value="Cultural & Heritage">Cultural & Heritage</option>
              <option value="Beach & Relaxed">Beach & Coastal</option>
              <option value="Adventure & Sightseeing">Adventure & Hikes</option>
              <option value="Foodie & Nightlife">Foodie & Nightlife</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-yatra" style={{ padding: '0.75rem 1.25rem' }}>
            <Search size={18} /> {loading ? 'Fetching Web Data...' : 'Generate Itinerary'}
          </button>
        </form>
      </div>

      {/* Itinerary Results Container */}
      {itinerary && (
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Summary Card */}
          <div className="yatra-card" style={{ padding: '1.25rem', background: 'var(--bg-surface)', borderLeft: '5px solid var(--brand-red)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="yatra-badge badge-red">{itinerary.daysCount}-Day Authentic Guide</span>
                <span className="yatra-badge badge-green">Vibe: {itinerary.travelStyle}</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                Real-World Itinerary for {itinerary.destination}
              </h3>
            </div>

            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estimated Total Cost</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-green)' }}>
                  ₹{itinerary.estimatedTotalCost.toLocaleString('en-IN')}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => onSelectDestination(itinerary.destination)}
                className="btn-yatra"
                style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}
              >
                Find Transit to {itinerary.destination} <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Days Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {itinerary.daysPlan.map((dayItem) => (
              <div key={dayItem.day} className="yatra-card" style={{ padding: '1.35rem' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-red)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} /> {dayItem.title}
                  </h4>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-green)', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                    Approx Cost: ₹{dayItem.approxCost.toLocaleString('en-IN')}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  
                  {/* Morning Slot */}
                  <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '10px', borderLeft: '3px solid var(--brand-gold)' }}>
                    <span style={{ fontWeight: 800, color: 'var(--brand-gold)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                      🌅 Morning Schedule
                    </span>
                    <p style={{ color: 'var(--text-main)', fontSize: '0.875rem' }}>{dayItem.morning}</p>
                  </div>

                  {/* Afternoon Slot */}
                  <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '10px', borderLeft: '3px solid var(--brand-cyan)' }}>
                    <span style={{ fontWeight: 800, color: 'var(--brand-cyan)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                      ☀️ Afternoon Schedule
                    </span>
                    <p style={{ color: 'var(--text-main)', fontSize: '0.875rem' }}>{dayItem.afternoon}</p>
                  </div>

                  {/* Evening Slot */}
                  <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '10px', borderLeft: '3px solid var(--brand-red)' }}>
                    <span style={{ fontWeight: 800, color: 'var(--brand-red)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                      🌙 Evening & Dinner
                    </span>
                    <p style={{ color: 'var(--text-main)', fontSize: '0.875rem' }}>{dayItem.evening}</p>
                  </div>

                </div>

                {/* Local Food Highlights */}
                <div style={{ marginTop: '1rem', background: 'rgba(245, 158, 11, 0.08)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--brand-gold)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Utensils size={16} /> Authentic Local Food Spots & Must-Try Dishes:
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {dayItem.recommendedFood.map((food, idx) => (
                      <span key={idx} style={{ fontSize: '0.75rem', fontWeight: 700, background: 'var(--bg-card)', color: 'var(--text-main)', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        {food}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
