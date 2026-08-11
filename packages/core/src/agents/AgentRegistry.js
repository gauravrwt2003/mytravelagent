import { agentEventBus } from './EventBus.js';
import { mockDestinations } from '../services/mockDestinations.js';
import { searchTransitOptions } from '../services/mockTransitInventory.js';
import { processCreditCardPayment, processUPIPayment } from '../services/paymentGateway.js';
import { dispatchBookingNotifications } from '../services/notificationService.js';

export class AgentRegistry {
  async exploreDestination(destName) {
    agentEventBus.publish('AGENT_ACTIVE', { agent: 'Destination Agent', status: 'Searching destination archives & weather...' });
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockDestinations.find(
          d => d.name.toLowerCase() === destName.toLowerCase() || d.country.toLowerCase() === destName.toLowerCase()
        ) || mockDestinations[0];

        agentEventBus.publish('AGENT_COMPLETE', {
          agent: 'Destination Agent',
          status: `Retrieved profile & weather for ${result.name}, ${result.country}.`
        });
        resolve(result);
      }, 400);
    });
  }

  async executeTransitSearch(params) {
    agentEventBus.publish('AGENT_ACTIVE', { agent: 'Supervisor Agent', status: 'Routing transit request to sub-agents...' });
    
    setTimeout(() => agentEventBus.publish('AGENT_ACTIVE', { agent: 'Flight Search Agent', status: `Querying airlines for ${params.source} ✈️ ${params.destination}` }), 100);
    setTimeout(() => agentEventBus.publish('AGENT_ACTIVE', { agent: 'Train Search Agent', status: `Querying rail schedules for ${params.source} 🚆 ${params.destination}` }), 200);
    setTimeout(() => agentEventBus.publish('AGENT_ACTIVE', { agent: 'Bus Search Agent', status: `Querying bus operators for ${params.source} 🚌 ${params.destination}` }), 300);

    return new Promise((resolve) => {
      setTimeout(() => {
        const results = searchTransitOptions(params);

        agentEventBus.publish('AGENT_COMPLETE', {
          agent: 'Transit Router Agent',
          status: `Found ${results.length} transit options matching date (${params.departureDate}) & time (${params.preferredTimeRange}).`
        });

        resolve(results);
      }, 800);
    });
  }

  async processPayment(paymentDetails) {
    agentEventBus.publish('AGENT_ACTIVE', { agent: 'Payment Gateway Agent', status: `Authorizing payment via ${paymentDetails.method.toUpperCase()}...` });

    if (paymentDetails.method === 'credit_card') {
      const cardRes = await processCreditCardPayment(paymentDetails);
      agentEventBus.publish('AGENT_COMPLETE', {
        agent: 'Payment Gateway Agent',
        status: `Credit Card Authorized! TxnID: ${cardRes.transactionId}`
      });
      return cardRes;
    } else {
      const upiRes = await processUPIPayment(paymentDetails);
      agentEventBus.publish('AGENT_COMPLETE', {
        agent: 'Payment Gateway Agent',
        status: `UPI Payment Verified! TxnID: ${upiRes.transactionId}`
      });
      return upiRes;
    }
  }

  async triggerFulfillment(booking) {
    agentEventBus.publish('AGENT_ACTIVE', { agent: 'Notification Agent', status: 'Dispatching digital ticket to SMS, WhatsApp, Email...' });

    const notifications = await dispatchBookingNotifications(booking);

    agentEventBus.publish('AGENT_COMPLETE', {
      agent: 'Notification Agent',
      status: `Omnichannel Confirmation Sent to SMS (${notifications.sms.to}), WhatsApp & Email!`
    });

    return notifications;
  }
}

export const agentEngine = new AgentRegistry();
