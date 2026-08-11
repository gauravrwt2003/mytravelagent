import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught React Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#0b0f19',
          color: '#fff',
          fontFamily: 'sans-serif'
        }}>
          <div style={{
            background: '#131b2e',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #ea2330',
            maxWidth: '600px',
            width: '100%',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#ea2330', marginBottom: '1rem' }}>✈️ roamingbuddy Error Recovery</h2>
            <p style={{ marginBottom: '1rem', color: '#94a3b8' }}>
              An unexpected UI error occurred: {this.state.error?.message || 'Unknown Error'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.6rem 1.2rem',
                background: '#ea2330',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
