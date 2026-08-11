import { GoogleGenAI } from '@google/genai';
import { agentEventBus } from './EventBus.js';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
let ai = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export class GeminiAgent {
  constructor() {
    this.modelName = 'gemini-2.5-flash';
  }

  isConfigured() {
    return !!apiKey;
  }

  async generateAiItinerary(destination, days = 3, travelStyle = 'Cultural') {
    agentEventBus.publish('AGENT_ACTIVE', {
      agent: 'Vertex Gemini 2.5 Flash Agent',
      status: `Connecting to Google Vertex AI Gemini 2.5 Flash for ${days}-Day ${travelStyle} itinerary for ${destination}...`
    });

    if (!ai) {
      agentEventBus.publish('AGENT_WARN', {
        agent: 'Vertex Gemini 2.5 Flash Agent',
        status: `GEMINI_API_KEY not set. Using hyper-realistic curated MAS itinerary engine.`
      });
      return null;
    }

    try {
      const prompt = `You are RoamingBuddy's Enterprise AI Travel Concierge powered by Google Cloud Vertex AI (Gemini 2.5 Flash).
Generate an ultra-realistic, detailed ${days}-Day ${travelStyle} trip itinerary for ${destination}. All pricing MUST be in Indian Rupees (₹ INR) with realistic Indian budget estimates.

Return ONLY a valid raw JSON object matching this exact schema (no markdown block wrapper):
{
  "destination": "${destination}",
  "daysCount": ${days},
  "travelStyle": "${travelStyle}",
  "estimatedTotalCost": 9500,
  "currency": "INR",
  "daysPlan": [
    {
      "day": 1,
      "title": "Day 1: Comprehensive Title",
      "morning": "Morning (8:30 AM - 11:30 AM): Exact activities, attractions, breakfast spots...",
      "afternoon": "Afternoon (12:00 PM - 4:00 PM): Sights, historic walks, lunch recommendations...",
      "evening": "Evening (4:30 PM - 10:00 PM): Sunset views, markets, dinner specialties...",
      "recommendedFood": ["Dish 1", "Dish 2", "Local Beverage"],
      "approxCost": 3000
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text);
        agentEventBus.publish('AGENT_COMPLETE', {
          agent: 'Vertex Gemini 2.5 Flash Agent',
          status: `Successfully synthesized Gemini 2.5 Flash AI Itinerary for ${destination}!`
        });
        return parsed;
      }
    } catch (err) {
      console.error("Gemini AI API execution error:", err);
      agentEventBus.publish('AGENT_WARN', {
        agent: 'Vertex Gemini 2.5 Flash Agent',
        status: `Gemini API fallback invoked: ${err.message}`
      });
    }

    return null;
  }

  async askTravelConcierge(userQuery, context = {}) {
    agentEventBus.publish('AGENT_ACTIVE', {
      agent: 'Gemini Travel Concierge',
      status: `Consulting Gemini 2.5 Flash for query: "${userQuery.slice(0, 40)}..."`
    });

    if (!ai) {
      return {
        reply: `Hello! I'm RoamingBuddy's AI Concierge. I can help you search transit options (Flight, Train, Bus), pick seats, organize itineraries for Goa, Paris, Tokyo, and issue multi-channel digital ticket confirmations!`,
        source: 'RoamingBuddy MAS Supervisor'
      };
    }

    try {
      const systemPrompt = `You are RoamingBuddy AI Concierge, an expert travel agent on Google Cloud. You speak politely, informatively, and give concise travel advice with prices in Indian Rupees (₹). Context: ${JSON.stringify(context)}`;
      
      const response = await ai.models.generateContent({
        model: this.modelName,
        contents: `${systemPrompt}\n\nUser Question: ${userQuery}`
      });

      agentEventBus.publish('AGENT_COMPLETE', {
        agent: 'Gemini Travel Concierge',
        status: 'Gemini 2.5 Flash response generated!'
      });

      return {
        reply: response.text,
        source: 'Google Cloud Vertex AI (Gemini 2.5 Flash)'
      };
    } catch (err) {
      return {
        reply: `I'm ready to help you plan trips across India and top global destinations! Search flights, trains, or buses, or pick an itinerary to get started.`,
        source: 'RoamingBuddy MAS Supervisor'
      };
    }
  }
}

export const geminiAgent = new GeminiAgent();
