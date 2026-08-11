import { agentEventBus } from './EventBus';

export class ItineraryAgent {
  async generateItinerary(destination, days = 3, travelStyle = 'Balanced') {
    agentEventBus.publish('AGENT_ACTIVE', {
      agent: 'AI Itinerary Agent',
      status: `Generating ${days}-Day ${travelStyle} AI Itinerary for ${destination}...`
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        const itinerary = {
          destination,
          daysCount: days,
          travelStyle,
          estimatedTotalCost: days * 2500,
          currency: 'INR',
          daysPlan: Array.from({ length: days }, (_, i) => {
            const dayNum = i + 1;
            return {
              day: dayNum,
              title: `Day ${dayNum}: Exploration & Local Delights in ${destination}`,
              morning: `Morning: Breakfast at local cafe & visit top attraction (Day ${dayNum} Highlight).`,
              afternoon: `Afternoon: Guided cultural walk & regional lunch tasting.`,
              evening: `Evening: Sunset point views & night market / beach side dining.`,
              recommendedFood: [`Regional Specialty ${dayNum}`, `Local Refreshment`],
              approxCost: 2500
            };
          })
        };

        agentEventBus.publish('AGENT_COMPLETE', {
          agent: 'AI Itinerary Agent',
          status: `Generated custom ${days}-Day ${travelStyle} itinerary for ${destination}!`
        });

        resolve(itinerary);
      }, 700);
    });
  }
}

export const itineraryAgent = new ItineraryAgent();
