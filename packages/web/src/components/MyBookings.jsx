import React from 'react';
import { BookmarkCheck, Plane, Train, Bus, Send, Share2, Mail, MessageSquare } from 'lucide-react';

export function MyBookings({ bookings, onResendNotification }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="yatra-card" style={{ padding: '3rem', textAlign: 'center', marginTop: '1.5rem' }}>
        <BookmarkCheck size={48} color="var(--brand-red)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No Active Bookings Found</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          When you book flights, trains, or buses on RoamingBuddy, your digital tickets and PNR records will appear here.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
        My Active Bookings & E-Tickets ({bookings.length})
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {bookings.map((item) => (
          <div key={item.bookingId} className="yatra-card" style={{ padding: '1.25rem', borderLeft: '5px solid var(--brand-red)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr', gap: '1rem', alignItems: 'center' }}>
              
              <div>
                <span className="yatra-badge badge-red">PNR: {item.pnr}</span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.35rem 0' }}>
                  {item.transitOption.provider} ({item.transitOption.code})
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Passenger: {item.passenger.fullName}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date: {item.createdAt}</p>
              </div>

              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  Route: {item.transitOption.source} ➔ {item.transitOption.destination}
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Departure: {item.transitOption.departureTime} | Class: {item.transitOption.classType}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--brand-green)', fontWeight: 600 }}>
                  Paid: ₹{item.amountPaid.toLocaleString('en-IN')} via {item.paymentMethod.toUpperCase()} (Txn: {item.transactionId})
                </p>
              </div>

              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => onResendNotification(item)}
                  className="btn-yatra-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                >
                  <Send size={14} /> View Ticket Receipts
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
