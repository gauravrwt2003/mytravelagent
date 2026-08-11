import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { SearchConsole } from './components/SearchConsole';
import { DestinationExplorer } from './components/DestinationExplorer';
import { TransitResults } from './components/TransitResults';
import { CheckoutModal } from './components/CheckoutModal';
import { NotificationPreviewModal } from './components/NotificationPreviewModal';
import { ArchitectureViewer } from './components/ArchitectureViewer';
import { MyBookings } from './components/MyBookings';
import { AgentLiveFeed } from './components/AgentLiveFeed';
import { agentEngine, agentEventBus } from '@mytravelagent/core';

export function AppContent() {
  const [activeTab, setActiveTab] = useState('search');
  const [transitOptions, setTransitOptions] = useState([]);
  const [searchParams, setSearchParams] = useState({
    source: 'New Delhi',
    destination: 'Goa',
    departureDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    preferredTimeRange: 'any',
    passengers: 1,
    mode: 'all'
  });

  const [selectedTransit, setSelectedTransit] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const [activeBooking, setActiveBooking] = useState(null);
  const [activeNotifications, setActiveNotifications] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const [savedBookings, setSavedBookings] = useState([]);
  const [isAgentDrawerOpen, setIsAgentDrawerOpen] = useState(false);
  const [liveAgentCount, setLiveAgentCount] = useState(7);

  useEffect(() => {
    handleExecuteSearch(searchParams);
  }, []);

  const handleExecuteSearch = async (params) => {
    setSearchParams(params);
    const results = await agentEngine.executeTransitSearch(params);
    setTransitOptions(results);
    setActiveTab('search');
  };

  const handleSelectDestination = (destName) => {
    const updatedParams = { ...searchParams, destination: destName };
    handleExecuteSearch(updatedParams);
  };

  const handleBookOption = (option) => {
    setSelectedTransit(option);
    setShowCheckout(true);
  };

  const handleBookingSuccess = (booking, notifications) => {
    setShowCheckout(false);
    setActiveBooking(booking);
    setActiveNotifications(notifications);
    setSavedBookings(prev => [booking, ...prev]);
    setShowNotificationModal(true);
  };

  const handleResendNotification = (booking) => {
    setActiveBooking(booking);
    setActiveNotifications({
      sms: { status: 'delivered', to: booking.passenger.phone, message: `[RoamingBuddy] PNR: ${booking.pnr} Confirmed!` },
      whatsapp: { status: 'delivered', to: booking.passenger.phone, message: `🎉 Booking Confirmed! PNR: ${booking.pnr}` },
      email: { status: 'sent', to: booking.passenger.email, subject: `E-Ticket Confirmation [PNR: ${booking.pnr}]`, html: `<p>PNR: ${booking.pnr}</p>` }
    });
    setShowNotificationModal(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        liveAgentCount={liveAgentCount}
        toggleAgentDrawer={() => setIsAgentDrawerOpen(prev => !prev)}
      />

      {/* Main Content Area */}
      <main className="app-container" style={{ flex: 1, width: '100%' }}>
        
        {/* Tab 1: Search & Book */}
        {activeTab === 'search' && (
          <>
            <SearchConsole onSearch={handleExecuteSearch} />
            <TransitResults
              options={transitOptions}
              onBookOption={handleBookOption}
              searchParams={searchParams}
            />
          </>
        )}

        {/* Tab 2: Destination Explorer */}
        {activeTab === 'destinations' && (
          <DestinationExplorer onSelectDestination={handleSelectDestination} />
        )}

        {/* Tab 3: GCP Architecture & Diagrams */}
        {activeTab === 'architecture' && (
          <ArchitectureViewer />
        )}

        {/* Tab 4: My Bookings */}
        {activeTab === 'bookings' && (
          <MyBookings
            bookings={savedBookings}
            onResendNotification={handleResendNotification}
          />
        )}

      </main>

      {/* Checkout Modal */}
      {showCheckout && selectedTransit && (
        <CheckoutModal
          transitOption={selectedTransit}
          onClose={() => setShowCheckout(false)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Omnichannel Notification Preview Modal */}
      {showNotificationModal && activeBooking && activeNotifications && (
        <NotificationPreviewModal
          booking={activeBooking}
          notifications={activeNotifications}
          onClose={() => setShowNotificationModal(false)}
        />
      )}

      {/* Agent Live Feed Drawer */}
      <AgentLiveFeed
        isOpen={isAgentDrawerOpen}
        onClose={() => setIsAgentDrawerOpen(false)}
      />

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-muted)',
        fontSize: '0.825rem',
        marginTop: '3rem'
      }}>
        <p>© 2026 roamingbuddy. Powered by Enterprise Google Cloud Platform (GCP) & Multi-Agent Architecture.</p>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
