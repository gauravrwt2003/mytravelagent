import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Send, CheckCircle2, X, Download, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function NotificationPreviewModal({ booking, notifications, onClose }) {
  const [activeChannel, setActiveChannel] = useState('whatsapp');

  useEffect(() => {
    // Trigger confetti celebration!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '640px' }}>
        
        {/* Header */}
        <div style={{
          padding: '1.25rem',
          background: 'linear-gradient(135deg, #ea2330 0%, #b91c1c 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CheckCircle2 size={28} />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Booking Confirmed!</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>PNR: {booking.pnr} | Txn: {booking.transactionId}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Channel Selection Tabs */}
        <div style={{ background: 'var(--bg-surface)', padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveChannel('whatsapp')}
            style={{
              flex: 1,
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: 'none',
              background: activeChannel === 'whatsapp' ? '#25D366' : 'transparent',
              color: activeChannel === 'whatsapp' ? '#ffffff' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            💬 WhatsApp View
          </button>

          <button
            onClick={() => setActiveChannel('sms')}
            style={{
              flex: 1,
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: 'none',
              background: activeChannel === 'sms' ? '#0284c7' : 'transparent',
              color: activeChannel === 'sms' ? '#ffffff' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            📱 SMS View
          </button>

          <button
            onClick={() => setActiveChannel('email')}
            style={{
              flex: 1,
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: 'none',
              background: activeChannel === 'email' ? '#6366f1' : 'transparent',
              color: activeChannel === 'email' ? '#ffffff' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            📧 Email Voucher
          </button>
        </div>

        {/* Content Preview */}
        <div style={{ padding: '1.5rem' }}>
          
          {/* WhatsApp View */}
          {activeChannel === 'whatsapp' && (
            <div style={{ background: '#075E54', borderRadius: '12px', padding: '1rem', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>Y</div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Yatra Travel Agent ✓</h4>
                  <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>WhatsApp Business Verified Account</span>
                </div>
              </div>

              <div style={{ background: '#054D44', padding: '0.85rem', borderRadius: '8px', fontSize: '0.85rem', whiteSpace: 'pre-wrap', lineHeight: 1.5, borderLeft: '4px solid #25D366' }}>
                {notifications.whatsapp.message}
              </div>
            </div>
          )}

          {/* SMS View */}
          {activeChannel === 'sms' && (
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span style={{ fontWeight: 700, color: 'var(--brand-red)' }}>SMS Carrier Gateway: Delivered</span>
                <span>To: {notifications.sms.to}</span>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.9rem', lineHeight: 1.4, border: '1px solid var(--border-color)' }}>
                {notifications.sms.message}
              </div>
            </div>
          )}

          {/* Email View */}
          {activeChannel === 'email' && (
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                <p><strong>Subject:</strong> {notifications.email.subject}</p>
                <p><strong>To:</strong> {notifications.email.to}</p>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: notifications.email.html }}
                style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px' }}
              />
            </div>
          )}

          {/* Bottom Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button onClick={onClose} className="btn-yatra" style={{ fontSize: '0.85rem' }}>
              Done & Return to Dashboard
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
