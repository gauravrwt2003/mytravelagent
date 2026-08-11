// Multi-Agent System Event Bus

class EventBus {
  constructor() {
    this.listeners = {};
    this.logs = [];
  }

  subscribe(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  publish(event, data) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = { id: Date.now() + Math.random(), event, data, timestamp };
    this.logs.unshift(logEntry);
    if (this.logs.length > 50) this.logs.pop();

    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data, logEntry));
    }
    if (this.listeners['*']) {
      this.listeners['*'].forEach(callback => callback({ event, data, logEntry }));
    }
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const agentEventBus = new EventBus();
