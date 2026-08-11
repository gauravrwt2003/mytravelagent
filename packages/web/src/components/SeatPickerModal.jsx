import React, { useState } from 'react';
import { Armchair, Check, X, Shield, Info } from 'lucide-react';

export function SeatPickerModal({ transitOption, onConfirmSeats, onClose }) {
  const isFlight = transitOption.mode === 'flight';
  const isTrain = transitOption.mode === 'train';
  const isBus = transitOption.mode === 'bus';

  const [selectedSeat, setSelectedSeat] = useState(null);

  // Generate seat options based on mode
  const flightSeats = [
    { id: '1A', label: '1A (Window - Extra Legroom)', type: 'window', price: 300, reserved: false },
    { id: '1B', label: '1B (Middle)', type: 'middle', price: 150, reserved: true },
    { id: '1C', label: '1C (Aisle)', type: 'aisle', price: 200, reserved: false },
    { id: '2A', label: '2A (Window)', type: 'window', price: 250, reserved: false },
    { id: '2B', label: '2B (Middle)', type: 'middle', price: 100, reserved: false },
    { id: '2C', label: '2C (Aisle)', type: 'aisle', price: 200, reserved: true },
    { id: '3A', label: '3A (Window)', type: 'window', price: 250, reserved: false },
    { id: '3B', label: '3B (Middle)', type: 'middle', price: 100, reserved: false },
    { id: '3C', label: '3C (Aisle)', type: 'aisle', price: 200, reserved: false }
  ];

  const trainSeats = [
    { id: 'LB-01', label: 'LB-01 (Lower Berth)', type: 'lower', price: 100, reserved: false },
    { id: 'MB-02', label: 'MB-02 (Middle Berth)', type: 'middle', price: 50, reserved: false },
    { id: 'UB-03', label: 'UB-03 (Upper Berth)', type: 'upper', price: 50, reserved: true },
    { id: 'SL-04', label: 'SL-04 (Side Lower)', type: 'lower', price: 100, reserved: false },
    { id: 'SU-05', label: 'SU-05 (Side Upper)', type: 'upper', price: 50, reserved: false },
    { id: 'LB-06', label: 'LB-06 (Lower Berth)', type: 'lower', price: 100, reserved: false }
  ];

  const busSeats = [
    { id: 'L-01', label: 'L-01 (Lower Sleeper Window)', type: 'sleeper', price: 150, reserved: false },
    { id: 'L-02', label: 'L-02 (Lower Sleeper Aisle)', type: 'sleeper', price: 100, reserved: false },
    { id: 'U-03', label: 'U-03 (Upper Sleeper Window)', type: 'sleeper', price: 120, reserved: true },
    { id: 'U-04', label: 'U-04 (Upper Sleeper Aisle)', type: 'sleeper', price: 90, reserved: false },
    { id: 'S-05', label: 'S-05 (Single Recliner)', type: 'seater', price: 200, reserved: false }
  ];

  const seatsList = isFlight ? flightSeats : isTrain ? trainSeats : busSeats;

  const handleSelect = (seat) => {
    if (seat.reserved) return;
    setSelectedSeat(seat);
  };

  const handleConfirm = () => {
    if (!selectedSeat) return;
    onConfirmSeats(selectedSeat);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '560px' }}>
        
        {/* Header */}
        <div style={{
          padding: '1.25rem',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Armchair size={24} color="var(--brand-red)" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Select Your Seat</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {transitOption.provider} ({transitOption.code}) - {transitOption.source} ➔ {transitOption.destination}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Legend */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}></div>
              Available
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'var(--brand-red)' }}></div>
              Selected
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'var(--text-dim)', opacity: 0.4 }}></div>
              Occupied / Reserved
            </div>
          </div>

          {/* Seat Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px' }}>
            {seatsList.map((seat) => {
              const isSelected = selectedSeat?.id === seat.id;
              return (
                <button
                  key={seat.id}
                  disabled={seat.reserved}
                  onClick={() => handleSelect(seat)}
                  style={{
                    padding: '0.85rem 0.5rem',
                    borderRadius: '8px',
                    border: '1px solid ' + (isSelected ? 'var(--brand-red)' : 'var(--border-color)'),
                    background: isSelected ? 'var(--brand-red)' : seat.reserved ? 'var(--bg-main)' : 'var(--bg-card)',
                    color: isSelected ? '#ffffff' : seat.reserved ? 'var(--text-dim)' : 'var(--text-main)',
                    opacity: seat.reserved ? 0.4 : 1,
                    cursor: seat.reserved ? 'not-allowed' : 'pointer',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Armchair size={18} />
                  <span>{seat.id}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.8 }}>
                    {seat.reserved ? 'Taken' : `+₹${seat.price}`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Seat Selection Summary */}
          {selectedSeat && (
            <div style={{ background: 'rgba(234, 35, 48, 0.1)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--brand-red)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Selected Seat:</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--brand-red)' }}>{selectedSeat.label}</h4>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Seat Fee:</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>+₹{selectedSeat.price}</h4>
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <button
            disabled={!selectedSeat}
            onClick={handleConfirm}
            className="btn-yatra"
            style={{ width: '100%', justifyContent: 'center', opacity: selectedSeat ? 1 : 0.5 }}
          >
            Confirm Seat & Proceed to Payment
          </button>

        </div>

      </div>
    </div>
  );
}
