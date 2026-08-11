import React, { useState, useEffect } from 'react';
import { CreditCard, QrCode, ShieldCheck, Lock, CheckCircle2, AlertCircle, X, Clock } from 'lucide-react';
import { agentEngine } from '@mytravelagent/core';

export function CheckoutModal({ transitOption, onClose, onBookingSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Passenger details
  const [fullName, setFullName] = useState('Gaurav Rawat');
  const [email, setEmail] = useState('gaurav@example.com');
  const [phone, setPhone] = useState('+919876543210');

  // Credit Card details
  const [cardNumber, setCardNumber] = useState('4532 1198 8762 4310');
  const [cardHolder, setCardHolder] = useState('Gaurav Rawat');
  const [expiryDate, setExpiryDate] = useState('12/28');
  const [cvv, setCvv] = useState('892');
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // UPI details
  const [upiType, setUpiType] = useState('qr'); // 'vpa' or 'qr'
  const [upiId, setUpiId] = useState('gaurav@okicici');
  const [qrTimer, setQrTimer] = useState(180); // 3-minute timer

  useEffect(() => {
    let timer;
    if (paymentMethod === 'upi' && upiType === 'qr' && qrTimer > 0) {
      timer = setInterval(() => setQrTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [paymentMethod, upiType, qrTimer]);

  const handlePay = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (paymentMethod === 'credit_card' && !showOtpDialog) {
      setShowOtpDialog(true);
      return;
    }

    setLoading(true);

    try {
      const paymentRes = await agentEngine.processPayment({
        method: paymentMethod,
        cardNumber,
        cardHolder,
        expiryDate,
        cvv,
        upiId,
        type: upiType,
        amount: transitOption.price
      });

      const bookingData = {
        bookingId: `BK_${Math.floor(100000 + Math.random() * 900000)}`,
        pnr: `RB_${Math.floor(100000 + Math.random() * 900000)}`,
        passenger: { fullName, email, phone },
        transitOption,
        paymentMethod,
        amountPaid: transitOption.price,
        transactionId: paymentRes.transactionId,
        createdAt: new Date().toLocaleString()
      };

      const notifications = await agentEngine.triggerFulfillment(bookingData);

      onBookingSuccess(bookingData, notifications);
    } catch (err) {
      setError(err.error || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={24} color="var(--brand-red)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>RoamingBuddy Secure Checkout</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Summary Box */}
          <div className="yatra-card" style={{ padding: '1rem', background: 'var(--bg-surface)', borderLeft: '4px solid var(--brand-red)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="yatra-badge badge-red">{transitOption.mode.toUpperCase()} - {transitOption.code}</span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.25rem 0' }}>
                  {transitOption.provider} ({transitOption.source} ➔ {transitOption.destination})
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Departure: {transitOption.departureTime} | Duration: {transitOption.duration} | Class: {transitOption.classType}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Amount Payable</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-red)' }}>₹{transitOption.price.toLocaleString('en-IN')}</h3>
              </div>
            </div>
          </div>

          {/* Passenger Information */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              1. Passenger Contact Details
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Email (for E-Ticket)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Mobile # (for SMS & WhatsApp)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                />
              </div>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              2. Select Payment Method
            </h4>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid ' + (paymentMethod === 'credit_card' ? 'var(--brand-red)' : 'var(--border-color)'),
                  background: paymentMethod === 'credit_card' ? 'rgba(234, 35, 48, 0.1)' : 'var(--bg-surface)',
                  color: paymentMethod === 'credit_card' ? 'var(--brand-red)' : 'var(--text-main)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <CreditCard size={18} /> Credit / Debit Card
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid ' + (paymentMethod === 'upi' ? 'var(--brand-red)' : 'var(--border-color)'),
                  background: paymentMethod === 'upi' ? 'rgba(234, 35, 48, 0.1)' : 'var(--bg-surface)',
                  color: paymentMethod === 'upi' ? 'var(--brand-red)' : 'var(--text-main)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <QrCode size={18} /> UPI (GPay / PhonePe / Paytm)
              </button>
            </div>

            {/* Credit Card Details Form */}
            {paymentMethod === 'credit_card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 1198 8762 4310"
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontWeight: 600 }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cardholder Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="12/28"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="892"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* UPI Options */}
            {paymentMethod === 'upi' && (
              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                    <input type="radio" name="upi" checked={upiType === 'qr'} onChange={() => setUpiType('qr')} /> Scan Dynamic QR Code
                  </label>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                    <input type="radio" name="upi" checked={upiType === 'vpa'} onChange={() => setUpiType('vpa')} /> Enter UPI VPA ID
                  </label>
                </div>

                {upiType === 'qr' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ padding: '1rem', background: '#fff', borderRadius: '12px', border: '2px solid var(--brand-red)' }}>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=roamingbuddy_qr@upi&pn=RoamingBuddy&am=${transitOption.price}&cu=INR`}
                        alt="UPI Dynamic QR"
                        style={{ width: '160px', height: '160px' }}
                      />
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--brand-red)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={16} /> QR Expires in {Math.floor(qrTimer / 60)}:{(qrTimer % 60).toString().padStart(2, '0')}
                    </span>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Scan using Google Pay, PhonePe, Paytm, or BHIM UPI app
                    </p>
                  </div>
                ) : (
                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>UPI VPA ID Handle</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="user@upi or name@okicici"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)', marginTop: '0.25rem' }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3D Secure OTP Popup Simulation */}
          {showOtpDialog && (
            <div style={{ background: 'var(--bg-card)', border: '2px dashed var(--brand-red)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--brand-red)' }}>
                <Lock size={18} />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>3D Secure Card Verification</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                An OTP has been sent to your registered mobile number (*3210). Enter OTP <strong>123456</strong> to authorize:
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Enter OTP (123456)"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontWeight: 700 }}
                />
                <button
                  type="button"
                  onClick={() => handlePay()}
                  className="btn-yatra"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Verify & Pay
                </button>
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Action Button */}
          {!showOtpDialog && (
            <button
              onClick={() => handlePay()}
              disabled={loading}
              className="btn-yatra"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              {loading ? 'Payment Gateway Processing...' : `Pay ₹${transitOption.price.toLocaleString('en-IN')} & Confirm Ticket`}
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
