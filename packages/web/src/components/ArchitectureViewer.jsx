import React, { useEffect, useRef, useState } from 'react';
import { Cpu, Server, ShieldCheck, Database, Layers } from 'lucide-react';
import mermaid from 'mermaid';

export function ArchitectureViewer() {
  const [activeDiagram, setActiveDiagram] = useState('gcp');
  const diagramRef = useRef(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose'
    });
  }, []);

  const diagrams = {
    gcp: `
    graph TB
      subgraph GCP_Edge ["1. Google Cloud CDN & Armor"]
        CDN["Cloud CDN (Firebase Hosting)"]
        Armor["Cloud Armor (WAF & DDoS)"]
      end

      subgraph GCP_Run ["2. Multi-Agent Cloud Run Services"]
        Sup["Supervisor Agent (Cloud Run)"]
        Transit["Transit Search Agents (Cloud Run)"]
        Pay["Payment Agent (Cloud Run)"]
        Notif["Notification Agent (Cloud Run)"]
      end

      subgraph GCP_AI ["3. Vertex AI Engine"]
        Gemini["Vertex AI: Gemini 1.5 Flash"]
        AgentBuilder["Vertex AI Agent Builder (RAG)"]
      end

      subgraph GCP_Event ["4. Pub/Sub & Memorystore"]
        PubSub["Cloud Pub/Sub Event Bus"]
        Redis["Memorystore for Redis (Transit Cache)"]
      end

      subgraph GCP_Data ["5. Cloud Firestore"]
        Firestore[("Cloud Firestore (Bookings & Sessions)")]
      end

      CDN --> Armor
      Armor --> Sup
      Sup <--> Gemini
      Sup <--> AgentBuilder
      Sup <--> PubSub
      Transit <--> PubSub
      Transit <--> Redis
      Pay <--> PubSub
      Pay <--> Firestore
      Notif <--> PubSub
    `,
    mas: `
    graph TD
      User([User Client]) --> Supervisor[Supervisor Agent]

      subgraph Exploration ["Exploration Agent Domain"]
        Supervisor <--> DestAgent["Destination Agent"]
      end

      subgraph Transit ["Transit Search Domain"]
        Supervisor <--> Router["Transit Router Agent"]
        Router <--> Flight["Flight Agent ✈️"]
        Router <--> Train["Train Agent 🚆"]
        Router <--> Bus["Bus Agent 🚌"]
      end

      subgraph Payment ["Payment Domain"]
        Supervisor <--> Booking["Booking Agent"]
        Booking <--> PayAgent["Payment Agent"]
        PayAgent <--> Card["Credit Card 3DS"]
        PayAgent <--> UPI["UPI VPA / Dynamic QR"]
      end

      subgraph Notification ["Notification Domain"]
        Booking --> NotifAgent["Notification Agent"]
        NotifAgent --> SMS["SMS Gateway"]
        NotifAgent --> WA["WhatsApp Business API"]
        NotifAgent --> Email["Email SMTP"]
      end
    `
  };

  useEffect(() => {
    if (diagramRef.current) {
      diagramRef.current.innerHTML = '';
      const id = `mermaid-${Date.now()}`;
      mermaid.render(id, diagrams[activeDiagram]).then(({ svg }) => {
        if (diagramRef.current) {
          diagramRef.current.innerHTML = svg;
        }
      }).catch(err => {
        console.error("Mermaid render error:", err);
      });
    }
  }, [activeDiagram]);

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div className="yatra-card" style={{ padding: '1.5rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              Interactive GCP & MAS Architecture Viewer
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Live Mermaid visual diagrams rendering Google Cloud Services & Multi-Agent interaction logic
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveDiagram('gcp')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: activeDiagram === 'gcp' ? 'var(--brand-red)' : 'var(--bg-surface)',
                color: activeDiagram === 'gcp' ? '#fff' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Server size={16} /> GCP Cloud Architecture
            </button>

            <button
              onClick={() => setActiveDiagram('mas')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: activeDiagram === 'mas' ? 'var(--brand-red)' : 'var(--bg-surface)',
                color: activeDiagram === 'mas' ? '#fff' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Layers size={16} /> Multi-Agent Interaction Diagram
            </button>
          </div>
        </div>

        {/* Diagram Render Container */}
        <div
          ref={diagramRef}
          style={{
            background: 'var(--bg-surface)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'center',
            overflowX: 'auto'
          }}
        />

      </div>
    </div>
  );
}
