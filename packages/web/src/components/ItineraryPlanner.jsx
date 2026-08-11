import React, { useState } from 'react';
import { Sparkles, Calendar, Compass, MapPin, Utensils, IndianRupee, Clock, ArrowRight } from 'lucide-react';
import { itineraryAgent, mockDestinations } from '@mytravelagent/core';

export function ItineraryPlanner({ onSelectDestination }) {
  const [destination, setDestination] = useState('Goa');
  const [days, setDays] = useState(3);
  const [travelStyle, setTravelStyle] = useState('Cultural & Relaxed');
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await itineraryAgent.generateItinerary(destination, days, travelStyle);
    setItinerary(result);
    setLoading(false);
  };

  return (
    <div style={{ marginTop: '1.5rem' }}>
      
      {/* Search Bar */}
      <div className="yatra-card" style={{ padding: '1.5rem', borderTop: '4px solid var(--brand-red)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Sparkles size={24} color="var(--brand-red)" />
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              AI Day-by-Day Trip Itinerary Planner
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Powered by Vertex AI Gemini Agent - Creates personalized day plans, food guides & cost estimates in INR (₹)
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Destination
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontWeight: 600, marginTop: '0.35rem' }}
            >
              {mockDestinations.map(d => <option key={d.id} value={d.name}>{d.name}, {d.country}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Trip Duration
            </label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontWeight: 600, marginTop: '0.35rem' }}
            >
              <option value={3}>3 Days</option>
              <option value={5}>5 Days</option>
              <option value={7}>7 Days</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Travel Vibe
            </label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontWeight: 600, marginTop: '0.35rem' }}
            >
              <option value="Cultural & Relaxed">Cultural & Relaxed</option>
              <option value="Adventure & Sightseeing">Adventure & Sightseeing</option>
              <option value="Luxury & Fine Dining">Luxury & Fine Dining</option>
              <option value="Backpacker & Budget">Budget Explorer</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-yatra">
            {loading ? 'AI Agent Thinking...' : 'Generate AI Plan'}
          </button>
        </form>
      </div>

      {/* Itinerary Results */}
      {itinerary && (
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="yatra-card" style={{ padding: '1.25rem', background: 'var(--bg-surface)', borderLeft: '5px solid var(--brand-red)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="yatra-badge badge-red">{itinerary.daysCount}-Day Plan ({itinerary.travelStyle})</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.25rem' }}>AI Itinerary for {itinerary.destination}</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Total Expense</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-green)' }}>₹{itinerary.estimatedTotalCost.toLocaleString('en-IN')}</h3>
            </div>
          </div>

          {/* Days Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {itinerary.daysPlan.map((dayItem) => (
              <div key={dayItem.day} className="yatra-card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-red)', marginBottom: '0.75rem' }}>
                  {dayItem.title}
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '0.875rem', lineHeight: 1.5 }}>
                  <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: '8px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--brand-gold)', display: 'block', marginBottom: '0.35rem' }}>🌅 Morning</span>
                    <p style={{ color: 'var(--text-muted)' }}>{dayItem.morning}</p>
                  </div>

                  <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: '8px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--brand-cyan)', display: 'block', marginBottom: '0.35rem' }}>☀️ Afternoon</span>
                    <p style={{ color: 'var(--text-muted)' }}>{dayItem.afternoon}</p>
                  </div>

                  <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: '8px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--brand-red)', display: 'block', marginBottom: '0.35rem' }}>🌙 Evening</span>
                    <p style={{ color: 'var(--text-muted)' }}>{dayItem.evening}</p>
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                  <span>🍴 Food Picks: {dayItem.recommendedFood.join(', ')}</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Approx Day Cost: ₹{dayItem.approxCost}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
